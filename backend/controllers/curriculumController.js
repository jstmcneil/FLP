import Curriculum from '../models/curriculumModel';
import AccountController from './accountController.js';
import {
    verifyJWTToken
} from '../util/auth.js';

async function getCurriculumByAccount(account) {
    if (!account) {
        return [];
    }
    var curriculum = [];
    for (const code of account.regCode) {
        const cur = await Curriculum.findOne({
            regCode: code
        }, {
            courses: 1
        });
        if (cur != null) {
            curriculum.push({
                regCode: code,
                courses: cur.courses
            });
        }
    }
    return curriculum;
}

// parameters: regCode, courses: [courseId]
exports.setCurriculum = async (req, res) => {
    //verify token
    const decoded = verifyJWTToken(req.headers['authorization']);
    if (!decoded) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }
    await Curriculum.updateOne({
        regCode: req.body.regCode
    }, {
        $set: {
            courses: req.body.courses
        }
    });

    res.send({
        msg: null,
        success: true
    });
}

// parameters: none
exports.getCurriculum = async (req, res) => {
    //verify token
    const decoded = verifyJWTToken(req.headers['authorization']);
    if (!decoded) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }

    const account = await AccountController.getAccountByToken(decoded);
    if (account != null) {
        const curriculum = await getCurriculumByAccount(account);
        res.send({
            msg: null,
            curriculum: curriculum,
            success: true
        });
    }
}

// private
exports.getCurriculumByAccount = getCurriculumByAccount