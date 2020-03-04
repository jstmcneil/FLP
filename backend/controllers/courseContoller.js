import Account from '../models/accountModel.js';
import Course from '../models/courseModel.js';
import Curriculum from '../models/curriculumModel.js';
import { verifyJWTToken } from '../util/auth.js';
import fs from 'fs';
import path from 'path';
const curriculum = JSON.parse(fs.readFileSync(path.resolve() + '\/curriculum.json'));

async function convertToUsername(arr) {
    var mutableArr = [];
    for (let i = 0; i < arr.length; i++) {
        mutableArr.push(JSON.parse(JSON.stringify(arr[i])));
        let username;
        await Account.findById(mutableArr[i].accountId, (err, acc) => {
            if (err) {
                console.log(err);
                return;
            }
            username = acc.username;
        });

        mutableArr[i].username = username;
        delete mutableArr[i].accountId;
    }
    return mutableArr;
}

// parameters: accountId, courseId, answers: [{questionId: Number, answerIndex: Number}], completedEmailQuestion: Boolean
exports.submitQuiz = async (req, res) => {
    //verify token
    const token = req.headers['authorization'];
    if (!token || !verifyJWTToken(token)) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }

    var quizTaken = false;
    await Course.find({accountId: req.body.accountId, courseId: req.body.courseId}, (err, course) => {
        if (err) {
            console.log(err);
            return;
        }
        quizTaken = course.length > 0;
    });

    if (quizTaken) {
        res.send({
            msg: "Cannot take same quiz twice",
            success: false
        });
        return;
    }

    const answers = [ {"questionId":0,"answerIndex":2},
    {"questionId":1,"answerIndex":2} ];//JSON.parse(req.body.answers);
    await curriculum.courses.filter((course => course.id == req.body.courseId));
    const quiz = curriculum.courses[0].quiz;
    var correctCount = 0.0;

    answers.forEach(ans => {
        if (ans.answerIndex === quiz.mcQuestions[ans.questionId].correctAnswerIndex) {
            correctCount++;
        }
    });

    const course = new Course({
        accountId: req.body.accountId,
        courseId: req.body.courseId,
        mcGrade: correctCount / quiz.mcQuestions.length * 100,
        completedEmailQuestion: req.body.completedEmailQuestion
    });

    course.save(err => {if(err) console.log(err)});

    res.send({
        courseInfo: course,
        msg: null,
        success: true
    });
}

// parameters: regCode
exports.getCourses = async (req, res) => {
    //verify token
    const token = req.headers['authorization'];
    if (!token || !verifyJWTToken(token)) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }

    var courseId = [];
    await Curriculum.find({regCode: req.body.regCode}, (err, cur) => {
        if (err) {
            console.log(err);
            return;
        }
        courseId = cur[0].courses;
    });

    if (courseId.length === 0) {
        res.send({
            courses: null,
            msg: "no courses found for your account",
            success: false
        });
        return;
    }

    await curriculum.courses.filter(course => courseId.includes(course.id));
    const courses = curriculum.courses;
    courses.forEach(cur => {
        cur.quiz.mcQuestions.forEach(question => {
            delete question.correctAnswerIndex;
        });
    });

    res.send({
        courses: courses,
        msg: null,
        success: true
    });
}

// parameters: accountId, regCode
exports.getAllGrades = async (req, res) => {
    //verify token
    const token = req.headers['authorization'];
    if (!token || !verifyJWTToken(token)) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }

    var isInstructor = false;
    var courseId;

    await Account.findById(req.body.accountId, (err, acc) => {
        if (err) {
            console.error(err);
            return;
        }
        isInstructor = acc.isInstructor;
    });

    await Curriculum.find({regCode: req.body.regCode}, (err, cur) => {
        if (err) {
            console.log(err);
            return;
        }
        courseId = cur[0].courses;
    });

    var grades = [];
    var query = {};

    if (!isInstructor) {
        query.accountId = req.body.accountId;
    }

    for (const id of courseId) {
        query.courseId = id;
        await Course.find(query, (err, courseInfo) => {
            if (err) {
                console.log(err);
                return;
            }
            grades.push(courseInfo);
        });
    }

    if (isInstructor) {
        grades = await convertToUsername(grades);
    }

    res.send({
        grades: grades,
        msg: null,
        success: true
    });
}