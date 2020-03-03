import Curriculum from '../models/curriculumModel';
import { verifyJWTToken } from '../util/auth.js';

// parameters: regCode, courses: [courseId]
exports.setCurriculum = async(req, res) => {
    //verify token
    const token = req.cookies.token;
    if (!token || !verifyJWTToken(token)) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }
    await Curriculum.updateOne({regCode: req.query.regCode}, {
        $set: {
            courses: req.query.courses
        }
    });

    res.send({
        msg: "",
        success: true
    });
}

// parameters: regCode
exports.getCurriculum = async(req, res) => {
    //verify token
    const token = req.cookies.token;
    if (!token || !verifyJWTToken(token)) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }

    await Curriculum.find({regCode: req.query.regCode}, (err, cur) => {
        if (err) {
            console.log(err);
            res.send({
                msg: 'Error getting curriculum',
                curriculum: null,
                success: false
            });
        } else {
            res.send({
                msg: null,
                curriculum: cur[0],
                success: true
            });
        }
    });
}