import Account from '../models/accountModel.js';

exports.login = async (req, res) => {
    var loginSuccess = false;

    const query = await Account.find({'username': req.query.username}, (err, acc) => {
        console.log(acc);
        if (acc.length != 0 && acc[0].password == req.query.password) {
            loginSuccess = true;
        }
    }).catch((err) => console.error(err));

    if (loginSuccess) {
        res.send("Login Success");
    } else {
        res.send("Login Failed");
    }
};

exports.register = async (req, res) => {
    var isRegistered = false;

    const query = await Account.find({'username': req.query.username}, (err, acc) => {
        if (acc.length != 0) {
            isRegistered = true;
        }
    }).catch((err) => console.error(err));

    if (isRegistered) {
        res.send("This Account is Registered");
        return;
    }

    const acc = new Account({
        username: req.query.username,
        password: req.query.password
    });

    acc.save(err => {if (err) console.error(err)});
    res.send("Register Success");
};