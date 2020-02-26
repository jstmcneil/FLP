import Review from '../models/reviewModel.js';
import Account from "../models/accountModel.js";

// parameters: accoundId, courseId, title, notes
exports.createReview = async (req, res) => {
    
    const review = new Review({
        accountId: req.query.accountId,
        courseId: req.query.courseId,
        title: req.query.title,
        notes: req.query.notes
    });

    review.save(err => {if (err) console.error(err)});

    res.send({
        review: review,
        msg: null,
        success: true
    });
};

// parameters: reviewId
exports.deleteReview = async (req, res) => {
    Review.findByIdAndDelete(req.query.reviewId, (err, review) => {
        if (err) {
            console.log(err);
        }
    });

    res.send({
        msg: null,
        success: true
    });
};

// parameters: accountId, courseId
exports.getReviews = async (req, res) => {
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

    await Review.find(query, (err, reviews) => {
        if (err) {
            console.error(err);
            return;
        }

        res.send({
            reviews: reviews,
            msg: null,
            success: true
        })
    });
};