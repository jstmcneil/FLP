import mongoose, {Schema} from 'mongoose';

/**
 * Create database schema for account
 * PK: _id
 * FK: none
 */
const AccountSchema = new Schema({
    username: String,
    password: String,
    regCode: String,
    isInstructor: Boolean,
    jwtToken: String
});

export default mongoose.model('Account', AccountSchema);