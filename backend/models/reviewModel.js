import mongoose, {Schema} from 'mongoose';

/**
 * Create database schema for review
 * PK: _id
 * FK: accountId -> Account, courseId -> Course
 */
const ReviewSchema = new Schema({
    accountId: String,
    courseId: String,
    title: String,
    notes: String
});

export default mongoose.model('Review', ReviewSchema);