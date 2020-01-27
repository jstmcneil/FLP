import mongoose, {Schema} from 'mongoose';

/**
 * Create database schema for account
 */
const AccountSchema = new Schema({
    username: String,
    password: String,
    registerCode: String,
    active: Boolean
});

export default mongoose.model('Account', AccountSchema);