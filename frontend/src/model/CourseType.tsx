import { Video } from "./Video";
import { QuizType } from "./QuizType";

export interface CourseType {
    id: number;
    summaryText: string;
    summaryVideo: Video[];
    quiz: QuizType;
}