# ooloo-api

## Documentation
### To run the documentation, you can either view the hosted docs at "https://ooloo-api.herokuapp.com/docs/" or you can run them locally:
- Install apidoc globally -- "npm i apidoc -g"
- Make sure you are CD'd into the api directory
- Run "open docs/index.html"

### Updating the docs
- To update the docs based on code changes, please run "apidoc -i routers/ -o docs/"

## Development Process
### Branches
- Always branch off of "dev" branch
- All feature branches should be named "feat/someFeatureName"
### Error Handling
- We are utilizing Raygun (https://raygun.com/docs/languages/node-js) to handle error reporting in the application. When catching a fatal error, or an error that should not arrise normally, please use the template below.
```raygunClient.send(new Error('FunctionName'), {error: "Please give a specific error description here"}, 'FunctionName', {requestBodyThatIsRelevant}, ['fileName']);```