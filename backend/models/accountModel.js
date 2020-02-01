import mongoose, {Schema} from 'mongoose';

/**
 * Create database schema for account
 */
const AccountSchema = new Schema({
    // Can we force user to register with gt email? 
    // That way we don't need $registerCode and $active and we can identify students using their email.
    username: String,
    password: String,
    registerCode: String,
    active: Boolean
});

export default mongoose.model('Account', AccountSchema);