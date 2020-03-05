import mongoose, {Schema} from 'mongoose';

/**
 * Create database schema for review
 * PK: _id
 * FK: accountId -> Account, regCode -> Curriculum, courseId -> Course
 */

const ReviewSchema = new Schema({
    accountId: String,
    regCode: String,
    courseId: String,
    review: String
});

export default mongoose.model('Review', ReviewSchema);