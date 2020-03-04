import Review from '../models/reviewModel.js';
import Account from '../models/accountModel.js';
import { verifyJWTToken } from '../util/auth.js';

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

// parameters: accoundId, courseId, review
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

    const review = new Review({
        accountId: req.body.accountId,
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

// parameters: accountId, courseId
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

    var isInstructor = false;

    await Account.findById(req.query.accountId, (err, acc) => {
        if (err) {
            console.error(err);
            return;
        }
        isInstructor = acc.isInstructor;
    });

    var query = {
        courseId: req.query.courseId
    }

    if (!isInstructor) {
        query.accountId = req.query.accountId;
    }

    var reviews = [];

    await Review.find(query, (err, revs) => {
        if (err) {
            console.error(err);
            return;
        }
        reviews = revs;
    });

    if (isInstructor) {
        reviews = await convertToUsername(reviews);
    }

    res.send({
        reviews: reviews,
        msg: null,
        success: true
    });
};