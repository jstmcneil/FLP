import nodemailer from 'nodemailer';
import Account from '../models/accountModel.js';

const emailSubject = 'FLP Email Response';

exports.sendEMail = async (regCode, emailBody) => {
    var instructorEmail;

    await Account.find({regCode: regCode, isInstructor: true}, (err, acc) => {
        if (err) {
            console.error(err);
            return;
        }
        if (acc.length == 0) {
            return;
        }
        instructorEmail = acc[0].username;
    });

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
        subject: emailSubject,
        html: emailBody
    };

    var sucess = true;
    transporter.sendMail(option, (err, info) => {
        if (err) {
            console.error(err);
            sucess = false;
        }
    });

    return sucess;
};
