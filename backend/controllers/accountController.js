import Account from '../models/accountModel.js';
import Curriculum from '../models/curriculumModel.js';
import { generateJWTToken, verifyJWTToken } from '../util/auth.js';

async function isRegistered(username) {
    if (!username) {
        return true;
    }
    var userExist = false;
    await Account.find({'username': username}, (err, acc) => {
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
    await Curriculum.find({'regCode': regCode}, (err, cur) => {
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

    await Account.find({'username': req.body.username}, (err, acc) => {
        if (acc.length != 0 && acc[0].password == req.body.password) {
            loginSuccess = true;
            regCode = acc[0].regCode;
            isInstructor = acc[0].isInstructor;
            accountId = acc[0]._id;
        }
    }).catch((err) => console.error(err));

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

    //create and save new account
    const acc = new Account({
        username: req.body.username,
        password: req.body.password,
        regCode: [req.body.regCode],
        isInstructor: false
    });

    acc.save(err => {if (err) console.error(err)});

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

    //create and save new account
    const acc = new Account({
        username: req.body.username,
        password: req.body.password,
        regCode: [req.body.regCode],
        isInstructor: true
    });

    acc.save(err => {if (err) console.error(err)});

    //create empty curriculum for the regCode
    const curriculum = new Curriculum({
        regCode: req.body.regCode,
        courses: []
    });

    curriculum.save(err => {if (err) console.error(err)});

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
    const token = req.headers['authorization'];
    if (!token || !verifyJWTToken(token)) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }
    const account = await getAccountByToken(token);

    res.send({
        msg: null,
        account: {
            regCode: account.regCode,
            isInstructor: account.isInstructor
        },
        success: true
    });
}

// parameter: regCode
exports.addRegCode = async (req, res) => {
    //verify token
    const token = req.headers['authorization'];
    if (!token || !verifyJWTToken(token)) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }
    const account = await getAccountByToken(token);
    await Account.updateOne({_id: account._id}, {
        $set: {
            regCode: [...account.regCode, req.body.regCode]
        }
    });

    if (account.isInstructor) {
        const curriculum = new Curriculum({
            regCode: req.body.regCode,
            courses: []
        });

        curriculum.save(err => {if (err) console.error(err)});
    }

    res.send({
        msg: null,
        success: true
    });
}

const getAccountByToken = async (token) => {
    const decoded = verifyJWTToken(token);
    if (!decoded) {
        return null;
    }
    var account;
    await Account.findById(decoded.accountId, (err, acc) => {
        if (err) {
            console.error(err);
            return;
        }
        account = acc;
    });
    return account;
}

// private
exports.getAccountByToken = getAccountByToken;