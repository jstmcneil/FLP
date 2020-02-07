import { MultipleChoice } from '../model/MultipleChoice';
import { exampleQuestions } from './mockData';

const getQuestions = (): Promise<MultipleChoice[]> => {
    return Promise.resolve(exampleQuestions);
}

export const questionAPI = {
    getQuestions,
};