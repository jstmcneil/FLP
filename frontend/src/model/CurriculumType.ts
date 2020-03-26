export interface Curriculum {
    regCode: string,
    courses: number[]
};

export interface CurriculumType {
    [key: string]: Curriculum
}