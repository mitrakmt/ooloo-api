const raygun = require('raygun');
const raygunClient = new raygun.Client().init({ apiKey: process.env.RAYGUN_KEY });

let sendError = (functionName, error, body, fileName) => {
    raygunClient.send(new Error(functionName), {error}, functionName, {body}, [fileName]);
}

module.exports = sendError

