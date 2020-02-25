import Review from '../models/reviewModel.js';

// parameters: accoundId, title, notes
exports.createReview = async (req, res) => {
    
    const review = new Review({
        accountId: req.query.accountId,
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

// parameters: accountId
exports.getReviews = async (req, res) => {
    await Review.find({accountId: req.query.accountId}, (err, reviews) => {
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