import mongoose, {Schema} from 'mongoose';

/**
 * Create database schema for account
 * PK: _id
 * FK: _id -> Account
 */
const SMTPEmailSchema = new Schema({
    host: String,
    username: String,
    password: String
});

export default mongoose.model('SMTPEmail', SMTPEmailSchema);