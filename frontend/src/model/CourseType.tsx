export interface Video {
    type: string;
    id: string
}

export interface QuestionType {
    questionContent: string;
    type: string;
}

export interface MCQuizType extends QuestionType {
    type: "MC"
    questionId: number;
    answerChoices: string[];
    videoId: string;
}

export interface EmailType extends QuestionType {
    type: "Email"
    questionContent: string;
    videoType: string;
    videoId: string;
}

export interface QuizType {
    mcQuestions: MCQuizType[];
    emailQuestions: EmailType[];
}

export interface CourseType {
    id: string;
    courseName: string;
    summaryText: string;
    summaryVideo: Video[];
    quiz: QuizType;
}

export interface AnswerType {
    questionId: number;
    answerIndex: number;
}