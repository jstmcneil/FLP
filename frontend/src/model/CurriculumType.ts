export interface Curriculum {
    regCode: string,
    courses: string[]
};

export interface CurriculumType {
    [key: string]: Curriculum
}