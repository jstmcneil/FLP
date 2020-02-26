import nodemailer from 'nodemailer';

// parameters: emailTo, emailSubject, emailBody, isBodyHtml
exports.sendEMail = async (req, res) => {
    var success = true;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'flpemail.noreply@gmail.com',
            pass: 'TbTCfQu5SY1X'
        }
    });

    var option = {
        from: 'flpemail.noreply@gmail.com',
        to: req.query.emailTo,
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
