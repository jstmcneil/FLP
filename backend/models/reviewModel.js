import mongoose, {Schema} from 'mongoose';

/**
 * Create database schema for review
 * PK: _id
 * FK: accountId -> Account
 */
const ReviewSchema = new Schema({
    accountId: String,
    title: String,
    notes: String
});

export default mongoose.model('Review', ReviewSchema);