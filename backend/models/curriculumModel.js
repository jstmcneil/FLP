import mongoose, {Schema} from 'mongoose';

/**
 * Create database schema for curriculum
 * PK: _id
 * FK: courses -> Course
 */

const CurriculumSchema = new Schema({
    regCode: String,
    courses: Array
});

export default mongoose.model("Curriculum", CurriculumSchema);