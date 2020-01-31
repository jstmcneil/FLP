
import { Answer } from './Answer';
export interface MultipleChoice {
    questionId: number;
    questionContent: string;
    answerChoices: Array<Answer>;
    correctAnswer: number;
    score: number;
}