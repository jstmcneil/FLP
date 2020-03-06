import Curriculum from '../models/curriculumModel';
import { verifyJWTToken } from '../util/auth.js';

// parameters: regCode, courses: [courseId]
exports.setCurriculum = async(req, res) => {
    //verify token
    const token = req.headers['authorization'];
    if (!token || !verifyJWTToken(token)) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }
    await Curriculum.updateOne({regCode: req.body.regCode}, {
        $set: {
            courses: req.body.courses
        }
    });

    res.send({
        msg: null,
        success: true
    });
}

// parameters: regCode
exports.getCurriculum = async(req, res) => {
    //verify token
    const token = req.headers['authorization'];
    if (!token || !verifyJWTToken(token)) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }

    await Curriculum.findOne({regCode: req.query.regCode}, (err, cur) => {
        if (err) {
            console.error(err);
            res.send({
                msg: 'Error getting curriculum',
                curriculum: null,
                success: false
            });
        } else {
            res.send({
                msg: null,
                curriculum: cur,
                success: true
            });
        }
    });
}