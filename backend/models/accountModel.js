import mongoose, {Schema} from 'mongoose';

/**
 * Create database schema for account
 */
const AccountSchema = new Schema({
    // Can we force users to register with gt email? 
    // That way we don't need $registerCode and $active. We can identify students using their email.

    //registerCode: String,
    //active: Boolean,
    username: String,
    password: String
    
});

export default mongoose.model('Account', AccountSchema);