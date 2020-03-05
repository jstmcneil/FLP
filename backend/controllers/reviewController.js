import Review from '../models/reviewModel.js';
import Account from '../models/accountModel.js';
import AccountController from './accountController.js';
import { verifyJWTToken } from '../util/auth.js';

async function convertToUsername(arr) {
    var mutableArr = [];
    for (let i = 0; i < arr.length; i++) {
        mutableArr.push(JSON.parse(JSON.stringify(arr[i])));
        let username;
        await Account.findById(mutableArr[i].accountId, (err, acc) => {
            if (err) {
                console.error(err);
                return;
            }
            username = acc.username;
        });

        mutableArr[i].username = username;
        delete mutableArr[i].accountId;
    }
    return mutableArr;
}

// parameters: regCode, courseId, review
exports.createReview = async (req, res) => {
    //verify token
    const token = req.headers['authorization'];
    if (!token || !verifyJWTToken(token)) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }

    const account = await AccountController.getAccountByToken(token);

    var reviewExist = false;
    await Review.findOne({accountId: account._id, regCode: req.body.regCode, courseId: req.body.courseId}, (err, revs) => {
        if (err) {
            console.error(err);
            return;
        }
        if (revs) {
            reviewExist = true;
        }
    });

    if (reviewExist) {
        res.send({
            msg: "Cannot submit the review twice",
            success: false
        });
        return;
    }

    const review = new Review({
        accountId: account._id,
        regCode: req.body.regCode,
        courseId: req.body.courseId,
        review: req.body.review
    });

    review.save(err => {if (err) console.error(err)});

    res.send({
        review: review,
        msg: null,
        success: true
    });
};

// parameters: regCode, courseId
exports.getReviews = async (req, res) => {
    //verify token
    const token = req.headers['authorization'];
    if (!token || !verifyJWTToken(token)) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }

    const account = await AccountController.getAccountByToken(token);

    var query = {
        regCode: req.query.regCode,
        courseId: req.query.courseId
    }

    if (!account.isInstructor) {
        query.accountId = account._id;
    }

    var reviews = [];

    await Review.find(query, (err, revs) => {
        if (err) {
            console.error(err);
            return;
        }
        reviews = revs;
    });

    if (account.isInstructor) {
        reviews = await convertToUsername(reviews);
    }

    res.send({
        reviews: reviews,
        msg: null,
        success: true
    });
};