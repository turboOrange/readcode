const env = process.env;
const OpenAI = require('openai');
const parse_helper = require("../utils/json_parse_helper");

const MODEL = 'gpt-3.5-turbo'
const evaluationCriteria = {
    correctness:40,
    completeness:30,
    clarity:20,
    depth:10
}

async function evaluateAnswer(challenge, answer) {
    const answer_evaluation_prompt = `Requesting evaluation of a student's code explanation to enhance their learning. 
    Feedback should be instructive and personalized, hightlighting strengths and areas for improvement and strengths in understanding.

    [Structured Query]
    Code Snippet Explained By User : ${challenge.enonce}
    Language : ${challenge.langage}
    User's Code Snippet Explanation : ${answer}
    Detected User Explanation Language : [Detected language of the User's Code Snippet Explanation] 
    Evaluation Criteria Weights : Correctness - Completeness - Clarity - Depth
    Provide Overall Percentage Score : Yes
    Feedback Language: [Detected Language]
    Feedback Format :
        - Start with a short intro
        - Score the user out 100 for every critera, be severe.
        - The last section is the overall score given to the user's explanation (a percentage)
        - The section before the last section is an overall feedback of the user's explanation

    It's NOT the code snippet that you must evaluate, but rather the user's explanation of the code snippet.
    You must absolutely format your feedback of the user's code explanation according to [Feedback Format]
    Your feedback is addressed directly to the student, so don't talk in 3rd person.
    Do not write the given code snippet in your feedback.
    Do not answer in English if the user explaination is not in English, I want your feedback written in the Feedback Language: [Detected User Explanation Language].
    Do not answer in English if the user explaination is not in English, I want your feedback written in the Feedback Language: [Detected User Explanation Language].
    Do not evaluate the code snippet, evaluate the user's explanation of the code snipped, be severe.
    Reply in JSON format : 
    {
        introduction : String,
        correctness : {
            score: String,
            feedback: String Array
        },
        completeness : {
            score: String,
            feedback: String Array
        },
        clarity : {
            score: String,
            feedback: String Array
        },
        depth : {
            score: String,
            feedback: String Array
        },
        overall : {
            score: String,
            feedback: String
        }
    }`;

    try {
        console.log(env.openAI_APIKey);
        const openai = new OpenAI({apiKey: env.openAI_APIKey});

        const chatCompletion = await openai.chat.completions.create({
            model: MODEL,
            temperature:0.2,
            messages: [{ role: 'user', content: answer_evaluation_prompt }],
        });

        const feedback = chatCompletion.choices[0].message.content;
        const parsedFeedback = JSON.parse(feedback);

        console.log(`Parsed feedback : ${JSON.stringify(parsedFeedback, 2, null)}`);

        return parsedFeedback;
    } catch (err) {
        throw new Error(`Erreur lors de la requete vers openAI : ${err}`);
    }
}

//still working on it
async function generateSolution(enonce, langage) {
    console.log(env.openAI_APIKey);
    const openai = new OpenAI({apiKey: env.openAI_APIKey});
    const prompt = "Here is a piece of code written in " + 
                   langage +
                   ". Do a short explaination of that code. ```" +
                   enonce +
                   "```";
    const solution =  await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: MODEL,
    });
    return solution.choices[0].message;
}


async function generateNewChallenge(langage, difficulte) {
    console.log(env.openAI_APIKey);
    try {
        const openai = new OpenAI({apiKey: env.openAI_APIKey});
        const prompt1 = `Requesting a code snippet written in ${langage} that has a '${difficulte}' difficulty to read. 
        This is in the context of a problem given to a computer science student.
        Follow the instructions below diligently : 

        Format the code properly, and insert it in the JSON provided.
        If the difficulty is 'hard' : make the problem about something related data structures & algorithms hide the meaning of variable names and function, while still maintaining pretty code formatting (spaces and tab etc.).
        If the difficulty is 'medium' : hide the meaning of variable names and function, and add some loops, while doing something concrete.
        Try your hardest to still provide a result, put all your effort in the code generation.
        I want correct formatting of the code.
        Generate a short explanation of this code.

        Reply in the follow JSON format ONLY : 
        {
            code : String,
            explanation: String,
        }

        Format the code properly, and insert it in the JSON provided.
        Don't indicate what the functions do in the code snippet provided, except the main function, still ident the code properly.
        Don't make any mistake with the JSON formatting, I'm going to use "JSON.parse()" with my JavaScript program on your JSON response.
        Reply only in the JSON format provided.
        In the code snippet, DO NOT GIVE DESCRIPTIVE NAME FOR VARIABLES AND FUNCTIONS.
        In the code snippet, DO NOT GIVE HINTS ABOUT WHAT THE CODE DOES.
        Keep the code pretty and well formatted, no matter the difficulty specified.`;

        const enoncePlusExplanation = await openai.chat.completions.create({
            messages: [{ role: 'user', content: prompt1 }],
            temperature:0.8,
            model: MODEL,
        });

        let jsonUnparsed = enoncePlusExplanation.choices[0].message.content;
        const jsonEscaped = parse_helper.escape(jsonUnparsed);
        const enoncePlusExplanationMessage = JSON.parse(jsonEscaped);

        return {
            langage:langage,
            difficulte:difficulte,
            enonce:enoncePlusExplanationMessage.code,
            solution:enoncePlusExplanationMessage.explanation,
            generated:1,
        }
    } catch (err) {
        throw(err);
    }
}

module.exports = {
    evaluateAnswer,
    generateNewChallenge,
    generateSolution
}
