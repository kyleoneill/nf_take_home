# Nerd Fitness Take Home

## Building
The `tsconfig.json` is set to build in an output folder named `Build` after running
```$
$ tsc
```

## Testing
The test runs the script and then fetches the 2016 premier league data from Wikipedia, comparing the scripts output to the league ranking. The test has dev dependencies: axios and jsdom to make/parse the web request, jest to run the test.
```$
$ npm run test
```