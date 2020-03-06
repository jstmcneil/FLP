export interface MCQuizType {
    questionId: number;
    questionContent: string;
    answerChoices: string[];
    correctAnswerIndex: number;
    videoType: string;
    videoId: string;
}