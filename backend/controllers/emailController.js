import nodemailer from 'nodemailer';
import EmailResponse from '../models/emailResponseModel.js';
import Account from '../models/accountModel.js';
import fs from 'fs';
import path from 'path';

// Digest will be send at 0:00 everyday
const digestSendingTime = 0;
const curriculum = JSON.parse(fs.readFileSync(path.resolve() + '\/curriculum.json'));
const divider = '<br/><hr class="dashed"><br/>';

function generateHtml(username, response) {
    return '<h2>' + username + '</h2>' +
           '<p>' + response + '</p>' +
           '<br/>';
}

function getCourseName(courseId) {
    return curriculum.courses.find((course) => course.id === courseId).courseName;
}

function getCourseQuestion(courseId) {
    return curriculum.courses.find((course) => course.id === courseId).quiz.emailQuestions[0].questionContent;
}

async function sendDigest() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'flpemail.noreply@gmail.com',
            pass: '!TbTCfQu5SY1X'
        }
    });

    // get all responses
    var responses = JSON.parse(JSON.stringify(await EmailResponse.find()));

    // get emails
    for (let i = 0; i < responses.length; i++) {
        responses[i].email = (await Account.findOne({regCode: responses[i].regCode, isInstructor: true}, {username: 1})).username
    }

    // get unique emails
    const digests = [...new Set(responses.map(res => res.email))].map(email => {
        return {
            email: email,
            responses: []
        };
    });

    // categorize response to their associated emails
    for (let i = 0; i < responses.length; i++) {
        responses[i].username = (await Account.findById(responses[i].accountId)).username;
        var digest = digests.find(dig => dig.email === responses[i].email);
        digest.responses.push(responses[i]);
    }

    // sort responses in each digest and send them out
    for (var digest of digests) {
        digest.responses.sort((a, b) => a.courseId > b.courseId ? 1 : -1);

        var emailBody = '';
        var currentCourseId = null;
        for (const res of digest.responses) {
            if (res.courseId !== currentCourseId) {
                currentCourseId = res.courseId;
                emailBody += divider + '<h1><u>' + getCourseName(res.courseId) + '</u></h1><br/>' + '<h3>' + getCourseQuestion(res.courseId) + "</h3><br/>";
            }
            emailBody += generateHtml(res.username, res.response);
        }

        var option = {
            from: 'flpemail.noreply@gmail.com',
            to: digest.email,
            subject: 'FLP Email Response Digest for ' + digest.responses[0].regCode,
            html: emailBody
        };

        transporter.sendMail(option, (err, info) => {
            if (err) {
                console.error(err);
            } else {
                // delete all responses
                for (const res of digest.responses) {
                    EmailResponse.findByIdAndDelete(res._id, (err, info) => {
                        if (err) {
                            console.error(err);
                        }
                    });
                }
            }
        });
    }
    return;
};

exports.saveResponse = async (accountId, regCode, courseId, response) => {
    const emailResponse = new EmailResponse({
        accountId: accountId,
        regCode: regCode,
        courseId: courseId,
        response: response
    });

    var success = true;

    await emailResponse.save(err => {
        if (err) {
            console.error(err);
            success = false;
        }
    });
    return success;
}

exports.scheduleEmailDigest = () => {
    const now = new Date();
    // millis til next time to send emails
    var millis = new Date(now.getFullYear(), now.getMonth(), now.getDate(), digestSendingTime, 0, 0, 0) - now;
    // add 1 day if already passed
    if (millis < 0) {
        millis += 24 * 60 * 60 * 1000;
    }
    console.log('sending next digest email in ' + millis / 1000 / 60 / 60.0 + ' hrs');
    setTimeout(async () => {
        // send emails at that time
        sendDigest();
        // setup interval of 1 day
        setInterval(async () => {
            sendDigest();
        }, 24 * 60 * 60 * 1000);
    }, millis);
}