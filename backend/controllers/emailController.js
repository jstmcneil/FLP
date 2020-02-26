import nodemailer from 'nodemailer';
import Account from '../models/accountModel.js';

// parameters: accountId, emailSubject, emailBody, isBodyHtml
exports.sendEMail = async (req, res) => {
    var success = true;

    var instructorUsername;

    await Account.findById(req.query.accountId, async (err, acc) => {
        if (err) {
            console.log(err);
            return;
        }
        await Account.find({regCode: acc.regCode, isInstructor: true}, (err, acc) => {
            if (err) {
                console.log(err);
                return;
            }
            if (acc.length == 0) {
                return;
            }
            instructorUsername = acc[0].username;
        });        
    });

    if (!instructorUsername) {
        res.send({
            msg: "Not registered with a course",
            success: false
        });
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'flpemail.noreply@gmail.com',
            pass: 'TbTCfQu5SY1X'
        }
    });

    var option = {
        from: 'flpemail.noreply@gmail.com',
        to: instructorUsername + '@gatech.edu',
        subject: req.query.emailSubject,
    };

    if (req.query.isBodyHtml) {
        option.html = req.query.emailBody;
    } else {
        option.text = req.query.emailBody;
    }

    transporter.sendMail(option, (err, info) => {
        if (err) {
            console.log(err);
            success = false;
            res.send({
                msg: "failed to send email",
                success: false
            });
        }
    });

    if (success) {
        res.send({
            msg: null,
            success: true
        });
    }
};
