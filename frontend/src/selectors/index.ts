export const loggedInSelector = (state: any): boolean => state.loggedIn;
export const accountIdSelector = (state: any): string => state.accountId;
export const isInstructorSelector = (state: any): boolean => state.isInstructor;
export const usernameSelector = (state: any): string => state.username;
export const coursesSelector = (state: any): any => state.courses;
export const curriculumSelector = (state: any): any => state.curriculum;
export const regCodesSelector = (state: any): any => state.regCodes;