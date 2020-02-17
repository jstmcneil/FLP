import SMTPEmail from '../models/emailModel.js';
import { Email } from './smtp.js';

// parameters: accountId
async function getEMail(req, res) {
    var emailExist = true,
        email;

    await SMTPEmail.find({"accountId": req.query.accountId}, (err, emails) => {
        if (emails.length == 0) {
            emailExist = false;
        }
        email = emails[0];
    });
    
    if (!emailExist) {
        res.send({
            msg: "Email does not exist",
            success: false
        });
    }

    res.send({
        msg: null,
        success: true,
        email: email
    });
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


    const email = new SMTPEmail({
        accountId: req.query.accountId, 
        host: 'smtp.office365.com', 
        emailUsername: req.query.emailUsername, 
        emailPassword: req.query.emailPassword
    });

    email.save(err => {if (err) console.error(err)});

    res.send({
        msg: null,
        success: true
    });
};

// parameters: accountId, emailTo, emailSubject, emailBody
exports.sendEMail = async (req, res) => {
    await SMTPEmail.find({"accountId": req.query.accountId}, (err, smtpEmail) => {
        if (err) {
            console.error(err);
            return;
        }
        if (smtpEmail.length == 0) {
            res.send({
                msg: "Email does not exist",
                success: false
            });
            return;
        }
        
        Email.send({
            Host : smtpEmail.host,
            Username : smtpEmail.username,
            Password : smtpEmail.password,
            To : req.query.emailTo,
            From : smtpEmail.username,
            Subject : req.query.emailSubject,
            Body : req.query.emailBody
        }).then(
        message => alert(message)
        );
    });

    res.send({
        msg: "Email sent",
        success: true
    });
};
