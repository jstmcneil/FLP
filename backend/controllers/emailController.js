import nodemailer from 'nodemailer';
import Account from '../models/accountModel.js';
import { verifyJWTToken } from '../util/auth.js';

// parameters: regCode, emailSubject, emailBody, isBodyHtml
exports.sendEMail = async (req, res) => {
    //verify token
    const decoded = verifyJWTToken(req.headers['authorization']);
    if (!decoded) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }

    var success = true;
    var instructorEmail;

    await Account.find({regCode: req.body.regCode, isInstructor: true}, (err, acc) => {
        if (err) {
            console.error(err);
            return;
        }
        if (acc.length == 0) {
            return;
        }
        instructorEmail = acc[0].username;
    });

    if (!instructorEmail) {
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
        to: instructorEmail,
        subject: req.body.emailSubject,
    };

    if (req.body.isBodyHtml) {
        option.html = req.body.emailBody;
    } else {
        option.text = req.body.emailBody;
    }

    transporter.sendMail(option, (err, info) => {
        if (err) {
            console.error(err);
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
