import Account from '../models/accountModel.js';

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
    if (!regCode) {
        return true;
    }
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
        isInstructor = false;

    await Account.find({'username': req.query.username}, (err, acc) => {
        if (acc.length != 0 && acc[0].password == req.query.password) {
            loginSuccess = true;
            regCode = acc[0].regCode;
            isInstructor = acc[0].isInstructor;
        }
    }).catch((err) => console.error(err));

    if (loginSuccess) {
        res.send({
            regCode: regCode,
            isInstructor: isInstructor
        });
    } else {
        res.send("Login Failed");
    }
};

exports.studentRegister = async (req, res) => {
    //check code
    if (!await regCodeExist(req.query.regCode)) {
        res.send("This Registration Code is Invalid");
        return;
    }

    //check username already exist
    if (await isRegistered(req.query.username)) {
        res.send("This Account is Registered");
        return;
    }

    //gt username checking
    const regex = /^[a-zA-Z]{1,10}[0-9]{1,5}$/;
    if (!regex.test(req.query.username)) {
        res.send("Not a GT username format, example: \"gburdell3\"");
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

    res.send("Register Success");
};

exports.instructorRegister = async (req, res) => {
    //check code
    if (await regCodeExist(req.query.regCode)) {
        res.send("This Registration Code is Taken");
        return;
    }

    //check username already exist
    if (await isRegistered(req.query.username)) {
        res.send("This Account is Registered");
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

    res.send("Register Success");
}