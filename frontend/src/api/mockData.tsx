import { MultipleChoice } from '../model/MultipleChoice';

export const exampleQuestions: MultipleChoice[] = [
    {
        questionId: 0,
        questionContent: "What franchise would you rather play a game from?",
        answerChoices: [{
            type: "A",
            text: "Halo",
        }, {
            type: "B",
            text: "Pokemon",
        }, {
            type: "C",
            text: "Uncharted",
        }],
        correctAnswer: "Halo",
        score: 10,
    },
    {
        questionId: 1,
        questionContent: "Which console would you prefer to play with friends?",
        answerChoices: [{
            type: "A",
            text: "X-Box",
        }, {
            type: "B",
            text: "Nintendo 64",
        }, {
            type: "C",
            text: "Playstation 1",
        }],
        correctAnswer: "X-Box",
        score: 10,
    },
    {
        questionId: 2,
        questionContent: "Which of these racing franchises would you prefer to play a game from?",
        answerChoices: [{
            type: "A",
            text: "Forza",
        }, {
            type: "B",
            text: "Mario Kart",
        }, {
            type: "C",
            text: "Gran Turismo",
        }],
        correctAnswer: "Mario Kart",
        score: 10,
    }
];