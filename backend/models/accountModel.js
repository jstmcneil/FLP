import mongoose, {Schema} from 'mongoose';

/**
 * Create database schema for account
 */
const AccountSchema = new Schema({
    username: String,
    password: String,
    regCode: String,
    isInstructor: Boolean
});

export default mongoose.model('Account', AccountSchema);