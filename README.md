# process-debts-csv

You can run the application using:
```sh
node app.js < file.csv
```
Where `file.csv` is the name of the file you want to summarize.

You can also redirect the output and the errors to separated files.
```sh
node app.js < file.csv 1> result.csv 2> error.log
```
Where `file.csv` is the name of the file you want to summarize, 
`result.csv` is the summarized file and `error.log` is file with the errors.
The process is going to return the code 1 in case of any problem and 0 otherwise.   

In order to run the unit tests you can run
```sh
npm test
```
