import mongoose, {Schema} from 'mongoose';

/**
 * Create database schema for account
 * PK: _id
 * FK: regCode -> cirriculum
 */

const AccountSchema = new Schema({
    username: String,
    password: String,
    regCode: Array,
    isInstructor: Boolean,
});

export default mongoose.model('Account', AccountSchema);