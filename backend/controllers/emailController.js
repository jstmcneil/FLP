import SMTPEmail from '../models/emailModel.js';

const nodemailer = require('nodemailer');

async function getEMail(accountId) {
    var emailExist = true,
        returnEmail;

    await SMTPEmail.findById(accountId, (err, email) => {
        if (err) {
            console.error(err);
            return;
        }

        if (!email) {
            emailExist = false;
        }
        returnEmail = email;
    });

    return emailExist ? returnEmail : null;
};

// ONLY GT email allowed
// parameters: accoundId, emailUsername, emailPassword
exports.setEMail = async (req, res) => {
    const regex = /@gatech.edu/;
    if (!regex.test(req.query.emailUsername)) {
        res.send({
            msg: "Not GT Email",
            success: false
        });
        return;
    }

    await SMTPEmail.findById(req.query.accountId, (err, email) => {
        if (err) {
            console.error(err);
            return;
        }

        if (!email) {
            // create new
            const email = new SMTPEmail({
                _id: req.query.accountId,
                host: 'smtp.office365.com',
                username: req.query.emailUsername,
                password: req.query.emailPassword
            });

            email.save(err => {if (err) console.error(err)});
            console.log("create");
        } else {
            // update current
            SMTPEmail.updateOne(
                {
                    _id: req.query.accountId
                },
                {
                    $username: req.query.emailUsername,
                    $password: req.query.emailPassword
                }
            );
            console.log("update");
        }
    });

    res.send({
        msg: null,
        success: true
    });
};

// parameters: accountId, emailTo, emailSubject, emailBody
exports.sendEMail = async (req, res) => {
    await SMTPEmail.findById(req.query.accountId, (err, smtpEmail) => {
        if (err) {
            console.error(err);
            return;
        }

        if (!smtpEmail) {
            res.send({
                msg: "Email does not exist",
                success: false
            });
            return;
        }

        const transporter = nodemailer.createTransport({
            host: smtpEmail.host,
            port: 587,
            secure: false,
            auth: {
              user: smtpEmail.username,
              pass: smtpEmail.password
            }
        });

        transporter.sendMail({
            from: smtpEmail.username,
            to: req.query.emailTo,
            subject: req.query.emailSubject,
            text: req.query.emailBody
        });
    });

    res.send({
        msg: null,
        success: true
    });
};
