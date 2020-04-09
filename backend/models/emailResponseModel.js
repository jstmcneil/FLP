import mongoose, {Schema} from 'mongoose';

/**
 * Create database schema for emailResponse
 * PK: _id
 * FK: accountId -> Account, regCode -> Curriculum, courseId -> Course
 */

const EmailResponseSchema = new Schema({
    accountId: String,
    regCode: String,
    courseId: String,
    response: String
});

export default mongoose.model('EmailResponse', EmailResponseSchema);