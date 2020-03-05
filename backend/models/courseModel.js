import mongoose, {Schema} from 'mongoose';

/**
 * Create database schema for curriculum
 * PK: _id
 * FK: accountId -> Account, regCode -> Curriculum, courseId -> Course
 */

const CourseSchema = new Schema({
    accountId: String,
    regCode: String,
    courseId: String,
    mcGrade: Number,
    completedEmailQuestion: Boolean
});

export default mongoose.model("Course", CourseSchema);

