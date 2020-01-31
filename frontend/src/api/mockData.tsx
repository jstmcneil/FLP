import { MultipleChoice } from '../model/MultipleChoice';

export const exampleQuestions: MultipleChoice[] = [
    {
        questionId: 0,
        questionContent: "What is a credit card?",
        answerChoices: [{
            id: 1,
            type: "A",
            text: "A loan that has to be paid off every month",
        }, {
            id: 2,
            type: "B",
            text: "A loan that has to be paid off every month",
        }, {
            id: 3,
            type: "C",
            text: "A money substitute for items you cannot afford",
        },
        {
            id: 4,
            type: "D",
            text: "All of the above",
        }],
        correctAnswer: 4,
        score: 10,
    },
    {
        questionId: 1,
        questionContent: "Which console would you prefer to play with friends?",
        answerChoices: [{
            id: 1,
            type: "A",
            text: "X-Box",
        }, {
            id: 2,
            type: "B",
            text: "Nintendo 64",
        }, {
            id: 3,
            type: "C",
            text: "Playstation 1",
        }],
        correctAnswer: 2,
        score: 10,
    },
    {
        questionId: 2,
        questionContent: "Which of these racing franchises would you prefer to play a game from?",
        answerChoices: [{
            id: 1,
            type: "A",
            text: "Forza",
        }, {
            id: 2,
            type: "B",
            text: "Mario Kart",
        }, {
            id: 3,
            type: "C",
            text: "Gran Turismo",
        }],
        correctAnswer: 3,
        score: 10,
    }
];