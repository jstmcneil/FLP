import Account from '../models/accountModel.js';
import Curriculum from '../models/curriculumModel.js';
import bcrypt from 'bcrypt';
import {
    generateJWTToken,
    verifyJWTToken
} from '../util/auth.js';

async function isRegistered(username) {
    if (!username) {
        return true;
    }
    var userExist = false;
    await Account.find({
        'username': username
    }, (err, acc) => {
        if (err) {
            console.error(err);
            return false;
        }
        if (acc.length != 0) {
            userExist = true;
        }
    });
    return userExist;
}

async function regCodeExist(regCode) {
    var codeExist = false;
    await Curriculum.find({
        'regCode': regCode
    }, (err, cur) => {
        if (err) {
            console.error(err);
            return false;
        }
        if (cur.length != 0) {
            codeExist = true;
        }
    });
    return codeExist;
}

// parameters: username, password
exports.login = async (req, res) => {
    var loginSuccess = false,
        regCode = null,
        isInstructor = false,
        accountId = null;
    var acc;
    console.log(req);
    try {
        acc = await Account.findOne({
                'username': req.body.username
            }).exec();
    } catch(e) {
        console.err(e);
    }
    
    console.log(acc);
    if (acc && bcrypt.compareSync(req.body.password, acc.password)) {
        loginSuccess = true;
        regCode = acc.regCode;
        isInstructor = acc.isInstructor;
        accountId = acc._id;
    }
    if (loginSuccess) {
        res.send({
            msg: null,
            success: true,
            regCode: regCode,
            isInstructor: isInstructor,
            token: generateJWTToken(accountId)
        });
    } else {
        res.send({
            msg: "Login Failed",
            success: false
        });
    }
};

// parameters: username, password, regCode
exports.studentRegister = async (req, res) => {
    //check code
    if (!req.body.regCode || !await regCodeExist(req.body.regCode)) {
        res.send({
            msg: "This Registration Code is Invalid",
            success: false
        });
        return;
    }

    //check username already exist
    if (await isRegistered(req.body.username)) {
        res.send({
            msg: "This Account is Registered",
            success: false
        });
        return;
    }

    //gt email checking
    const regex = /@gatech.edu/;
    if (!regex.test(req.body.username)) {
        res.send({
            msg: "Please register with a GT email",
            success: false
        });
        return;
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 8)
    //create and save new account
    const acc = new Account({
        username: req.body.username,
        password: hashedPassword,
        regCode: [req.body.regCode],
        isInstructor: false
    });

    acc.save(err => {
        if (err) console.error(err)
    });

    res.send({
        msg: "Register Success",
        success: true,
        regCode: acc.regCode,
        isInstructor: false,
        token: generateJWTToken(acc._id)
    });
};

// parameters: username, password, regCode
exports.instructorRegister = async (req, res) => {
    //check code
    if (!req.body.regCode || await regCodeExist(req.body.regCode)) {
        res.send({
            msg: "This Registration Code is Taken",
            success: false
        });
        return;
    }

    //check username already exist
    if (await isRegistered(req.body.username)) {
        res.send({
            msg: "This Account is Registered",
            success: false
        });
        return;
    }

    //gt email checking
    const regex = /@gatech.edu/;
    if (!regex.test(req.body.username)) {
        res.send({
            msg: "Please register with a GT email",
            success: false
        });
        return;
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 8)

    //create and save new account
    const acc = new Account({
        username: req.body.username,
        password: hashedPassword,
        regCode: [req.body.regCode],
        isInstructor: true
    });

    acc.save(err => {
        if (err) console.error(err)
    });

    //create empty curriculum for the regCode
    const curriculum = new Curriculum({
        regCode: req.body.regCode,
        courses: []
    });

    curriculum.save(err => {
        if (err) console.error(err)
    });

    res.send({
        msg: "Register Success",
        success: true,
        regCode: req.body.regCode,
        isInstructor: true,
        token: generateJWTToken(acc._id)
    });
}

// parameters: none
exports.getAccount = async (req, res) => {
    //verify token
    const decoded = verifyJWTToken(req.headers['authorization']);
    if (!decoded) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }
    const account = await getAccountByToken(decoded);

    res.send({
        msg: null,
        account: {
            regCode: account.regCode,
            isInstructor: account.isInstructor,
            username: account.username
        },
        success: true
    });
}

const map = {};

// parameter: regCode
exports.addRegCode = async (req, res) => {
    //verify token
    const decoded = verifyJWTToken(req.headers['authorization']);
    if (!decoded) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }
    let account = await getAccountByToken(decoded);
    try {
        var acc = await Account.findOne({ regCode: req.body.regCode, isInstructor: true }).exec()
        // check if regCode is attached to another instructor, then can't use it
        if (account.isInstructor && acc) {
            res.send({
                msg: "This registration code is taken by another instructor. Please try again",
                success: false
            });
            return;
        }
        // check if regCode has an instructor if account is student. If it doesn't, cant use it.
        if (!account.isInstructor && !acc) {
            res.send({
                msg: "This registration code has no instructor. Please try again.",
                success: false
            })
            return;
        }
    } catch(e) {
        console.err(e);
        res.send({
            msg: "Error. Could not check if regCode belongs to another instructor",
            success: false
        })
        return;
    }
    
    await Account.updateOne({
        _id: account._id
    }, {
        $set: {
            regCode: [...account.regCode, req.body.regCode]
        }
    });

    if (account.isInstructor) {
        const curriculum = new Curriculum({
            regCode: req.body.regCode,
            courses: []
        });

        curriculum.save(err => {
            if (err) console.error(err)
        });
    }
    //update cache of account
    account.regCode = [...account.regCode, req.body.regCode];
    map[account._id] = account;
    res.send({
        msg: null,
        success: true
    });
}


const getAccountByToken = async (decoded) => {
    var account;
    if (map[decoded.accountId]) {
        return map[decoded.accountId];
    }
    try {
        account = await Account.findOne({ _id: decoded.accountId }).exec();
    } catch (e) {
        console.error(e);
    }
    
    return account;
}

// private
exports.getAccountByToken = getAccountByToken;