import mongoose, {Schema} from 'mongoose';

/**
 * Create database schema for account
 * PK: _id
 * FK: accountId -> Account
 */
const SMTPEmailSchema = new Schema({
    accountId: String,
    host: String,
    username: String,
    password: String
});

export default mongoose.model('SMTPEmail', SMTPEmailSchema);