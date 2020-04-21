# Financial Learning Curriculum
> Release Notes
  - #### What’s New
    * This is version 1.0.0 for Georgia Tech Financial Learning Curriculum online quiz platform. The goal of this platform is to provide students with review materials for the course and closer to real-life practice experience when they encounter financial related issues. 

    - Features:
        * Kahoot code style registration codes in order to link a student with an instructor and the instructors courses. 
        * Students can:
            * View course materials
            * Take a quiz for each course, which includes:
                * A multiple choice questionnaire
                * An open ended question that is recorded and sent to professors in a daily digest
            * Provide reviews and feedback for the course after finishing a quiz
            * Review multiple choice answers and course materials on quizzes
        * Instructors can:
            * Assign courses to registration codes
            * View quiz grades and open ended responses of students enrolled in a registration code they own
            * Export grades as CSV files
            * View student reviews by course


  - #### Recent Bug Fixes
    * Clean up unnecessary fields in curriculum.json file 
    * Fixed getAllGrades api to handle multiple student grade loads
    * Check null and undefined cases for gradeByRegCodeByCourse object 
    * Limit scope for regCode query in review selection in backend
    * Show review button only after students have completed a course

  - #### Known Bugs
    * Initial login occasionally fails even with correct credentials (should only happen the first time you ever login with the introduction of the account cache)
    * The student username in grades table sometimes show blank
    * Does not work on Firefox (only works on Chrome and Safari)
    * Email feature is not guaranteed on free server (if server shuts down due to inactivity)
    * No HTTPS support


> Install Guide

- #### Prerequisites
    * To view our currently deployed application, please go to http://flp-gt.herokuapp.com/
    * To build the application from source code, you need: 
    * Node.js: https://nodejs.org/en/download/ to run the application
    * MongoDB: https://docs.mongodb.com/manual/administration/install-community/ for backend database setup
    * Git: https://git-scm.com/downloads to download and make pull requests to this repository

- #### Dependent libraries that must be installed
    * We have package.json files in our repository that has all the dependencies listed.
    * Once you have downloaded the source code repository, run `npm install` in both frontend and backend folder to install * dependencies

- #### Download instructions
    * Click on “Clone or Download” button on this page to copy git link
    * Run `git clone + link` to download this repository to your local environment

- #### Build instructions
    * No additional build needed

- #### Installation of actual application
    * After you have source code downloaded to your local environment. `cd` into both frontend folder and backend folder to run `npm install` to install all dependencies needed for the application

- #### Run instructions
    1. Open a new command line window and go to the backend folder (`cd FLP/backend`)
    2. In backend folder, start mongoDB by running `brew services start mongodb-community` if installed through Homebrew. Otherwise, start mongoDB by consulting the specific installation guide used in the "Prerequisites" step
    3. Then in the backend folder, run `npm start` to start the backend. (You should see “Listening on port 8000” on console)
    4. Open a new command line window and go to the frontend folder (`cd FLP/frontend`)
    5. In frontend folder run `npm start`
    6. Open chrome (or browser of your choice) go to “http://localhost:3000” to view application

- #### Troubleshooting
    * If there is something wrong with your database and you installed via Homebrew, Run `brew services restart mongodb-community` to restart the database before you start the backend.
    * You can install Chrome extension Redux Devtools to troubleshoot the react state.(https://chrome.google.com/webstore/detail/redux-devtools)
    * You can monitor the React DOM with the installation of Chrome React Developer Tools (https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
    * You can use Robo 3T or equivalent interfaces to keep track of database states for development. (https://robomongo.org) 
    * Editing the curriculum.json in the backend to have real courses, as communicated with our client. We currently have an example, working configuration of the curriculum.json as an example.
        * The curriculum JSON is just a top level object that holds one attribute: `courses`. This `courses` attribute holds an array of course JSONs, representing all of the courses possible in the application.
        * A course JSON takes the structure of (indicating types within the parentheses):
            * `id` : A unique identifier for the course (`string`)
            * `courseName`: Name of the course (`string`)
            * `summaryText`: Body of text providing the course information (`string`)
            * `summaryVideo`: An array of video objects to render (`Array[object]`), that look like:
                * `type`: The source of the video. Right now, the only supported value is `"youtube"`
                (`string`)
                * `videoId`: The unique video identifier. For youtube videos, that is what comes in the url after v= when viewing a video. For example, for this youtube video https://www.youtube.com/watch?v=jNQXAC9IVRw, the videoId is jNQXAC9IVRw
                (`string`)
            * `quiz`: the quiz (`object`)for this course, containing: 
                *  `mcQuestions`: An array of multiple choice questions (`Array[object]`). Each item looks like:
                    * `questionId`: ID of question. Each question ID in this array must be different from every other question ID in this array (`number`) 
                    * `questionContent`: The question text to ask (`string`),
                    * `answerChoices`: An array of strings, where each string represents a possible answer (`Array[string]`)
                    * `correctAnswerIndex`: the correct answer's zero indexed index within `answerChoices` (`number`)
                * `emailQuestions`: This is stored as an array, but it must be an array of length 1 at most, since we built this to only handle one email question. This is unfortunately a product of a pivot to only handle one email question, as we discussed with our client. (`Array[object]` but only length 1!)
                    * `questionContent`: The question text to ask (`string`),
                    * `videoId`: Part 1/2 of showing a video embedded within an email question. This is to be filled out using the same rules that are used for the `summaryVideo`'s `videoId`, as it is a unique video identifier. It is optional, but if specified, the `videoType` must be specified. Only YouTube IDs are currently supported (`string`)
                    * `videoType`:  Part 2/2 of showing a video embedded within an email question. This is to be filled out using the same rules that are used for the `summaryVideo`'s `videoType`, as it specifies the source of the video. It is optional, but if specified, the `videoId` must be specified. Only the type `"youtube"` is currently supported(`string`)
        * An example course JSON looks like: ![image info](./frontend/public/json.png)
    * Add student names as part of student account information
    * Integration to Canvas
    * Support instructor MP4 video uploads and LinkedIn Learning videos for courses
    * Request Gatech OIT server for official deployment
    * Migrate to HTTPS




