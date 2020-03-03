import Account from '../models/accountModel.js';
import Curriculum from '../models/curriculumModel.js';
import { generateJWTToken } from '../util/auth.js';

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

    await Account.find({'username': req.query.username}, (err, acc) => {
        if (acc.length != 0 && acc[0].password == req.query.password) {
            loginSuccess = true;
            regCode = acc[0].regCode;
            isInstructor = acc[0].isInstructor;
            accountId = acc[0]._id;
        }
    }).catch((err) => console.error(err));

    if (loginSuccess) {
        res.cookie('token', generateJWTToken(accountId));
        res.send({
            msg: null,
            success: true,
            regCode: regCode,
            isInstructor: isInstructor,
            accountId: accountId
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
    if (!req.query.regCode || !await regCodeExist(req.query.regCode)) {
        res.send({
            msg: "This Registration Code is Invalid",
            success: false
        });
        return;
    }

    //check username already exist
    if (await isRegistered(req.query.username)) {
        res.send({
            msg: "This Account is Registered",
            success: false
        });
        return;
    }

    //gt email checking
    const regex = /@gatech.edu/;
    if (!regex.test(req.query.username)) {
        res.send({
            msg: "Please register with a GT email",
            success: false
        });
        return;
    }

    //create and save new account
    const acc = new Account({
        username: req.query.username,
        password: req.query.password,
        regCode: req.query.regCode,
        isInstructor: false
    });

    acc.save(err => {if (err) console.error(err)});

    res.cookie('token', generateJWTToken(acc._id));
    res.send({
        msg: "Register Success",
        success: true,
        regCode: req.query.regCode,
        isInstructor: false,
        accountId: acc._id
    });
};

exports.instructorRegister = async (req, res) => {
    //check code
    if (!req.query.regCode || await regCodeExist(req.query.regCode)) {
        res.send({
            msg: "This Registration Code is Taken",
            success: false
        });
        return;
    }

    //check username already exist
    if (await isRegistered(req.query.username)) {
        res.send({
            msg: "This Account is Registered",
            success: false
        });
        return;
    }

    //gt email checking
    const regex = /@gatech.edu/;
    if (!regex.test(req.query.username)) {
        res.send({
            msg: "Please register with a GT email",
            success: false
        });
        return;
    }

    //create and save new account
    const acc = new Account({
        username: req.query.username,
        password: req.query.password,
        regCode: req.query.regCode,
        isInstructor: true
    });

    acc.save(err => {if (err) console.error(err)});

    //create empty curriculum for the regCode
    const curriculum = new Curriculum({
        regCode: req.query.regCode,
        courses: []
    });

    curriculum.save(err => {if (err) console.error(err)});

    res.cookie('token', generateJWTToken(acc._id));
    res.send({
        msg: "Register Success",
        success: true,
        regCode: req.query.regCode,
        isInstructor: true,
        accountId: acc._id
    });
}