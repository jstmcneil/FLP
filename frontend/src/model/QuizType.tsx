import { MCQuizType } from "./MCQuizType";
import { EmailType } from "./EmailType";

export interface QuizType {
    mcQuestions: MCQuizType[];
    emailQuestions: EmailType[];
}