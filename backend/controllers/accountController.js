import Account from '../models/accountModel.js';
import Curriculum from '../models/curriculumModel.js';
import { generateJWTToken, verifyJWTToken } from '../util/auth.js';

async function isRegistered(username) {
    if (!username) {
        return true;
    }
    var userExist = false;
    await Account.find({'username': username}, (err, acc) => {
        if (acc.length != 0) {
            userExist = true;
        }
    }).catch((err) => console.error(err));
    return userExist;
}

async function regCodeExist(regCode) {
    var codeExist = false;
    await Account.find({'regCode': regCode, 'isInstructor': true}, (err, acc) => {
        if (acc.length != 0) {
            codeExist = true;
        }
    }).catch((err) => console.err(err));
    return codeExist;
}

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
        const jwtToken = generateJWTToken(accountId);
        await Account.update({_id: accountId}, {
            $set: {
                jwtToken: jwtToken
            }
        });
        res.send({
            msg: null,
            success: true,
            regCode: regCode,
            isInstructor: isInstructor,
            accountId: accountId,
            token: jwtToken
        });
    } else {
        res.send({
            msg: "Login Failed",
            success: false
        });
    }
};

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
        regCode: req.body.regCode,
        isInstructor: false
    });

    acc.save(err => {if (err) console.error(err)});

    res.send({
        msg: "Register Success",
        success: true,
        regCode: req.body.regCode,
        isInstructor: false,
        accountId: acc._id
    });
};

exports.instructorRegister = async (req, res) => {
    console.log(req.body);
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
        regCode: req.body.regCode,
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
        accountId: acc._id
    });
}

exports.getAccountByToken = async (req, res) => {
    //verify token
    const token = req.headers['authorization'];
    const decoded = verifyJWTToken(token);
    console.log(decoded);
    if (!token || !decoded) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }

    await Account.findOne({_id: decoded.accountId}, (err, acc) => {
        if (err) {
            console.log(err);
            return;
        }
        if (!acc) {
            res.send({
                msg: "Account not found",
                success: false
            })
            return;
        }

        res.send({
            msg: null,
            account: {
                username: acc.username,
                regCode: acc.regCode,
                isInstructor: acc.isInstructor,
                accountId: acc._id
            },
            success: true
        });
    });

}