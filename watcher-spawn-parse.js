/** Script that watches specified file in same directory for changes and shows its access rights, size and name **/

'use strict'
const fs = require('fs');

const filename = process.argv[2];
const work_directory = __dirname;

const spawn = require("child_process").spawn;
const child_process_command = process.argv[3] ? process.argv[3] : "ls"; //ls command as default
const options = process.argv.length > 4 ? process.argv.slice(3-(process.argv.length-1)) : ["-lh"]; // -lh option as default if not specified


if (!filename){
  throw Error("A file to watch must be specified.");
}


fs.access(work_directory + "/" + filename,fs.constants.R_OK,(err) => { //Check for read access for the file

  if (err){
    throw err;
  }

  fs.watch(work_directory + "/" + filename,() => {

    options.push(filename);

    const ls = spawn(child_process_command,options);
    let output = "";

    ls.stderr.on("error", (err) => {
      throw err;
    });

    ls.stdout.on("data",chunk => output+=chunk); //append stdout stream data

    ls.on("close", () => {
      const parts = output.split(/\s+/); // split on one or more whitespaces
      console.log([parts[0],parts[4],parts[8]]);// prints access rights, size and name of changed file
    });
  });
});


console.log(`Now watching ${filename}.`)
