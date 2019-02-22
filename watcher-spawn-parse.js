'use strict'
const fs = require('fs');

const filename = process.argv[2];
const work_directory = __dirname;
const spawn = require("child_process").spawn;
const child_process_command = process.argv[3];

const options = process.argv.slice(3-(process.argv.length-1));

console.log(child_process_command);
console.log(options);


if (!filename){
  throw Error("A file to watch must be specified.");
}


fs.access(work_directory + "/" + filename,fs.constants.R_OK,(err) => {

  if (err){
    throw err;
  }

  fs.watch(work_directory + "/" + filename,() => {
    const ls = spawn("ls",["-l","-h",filename]);
    let output = "";

    ls.stdout.on("data",chunk => output+=chunk);

    ls.on("close", () => {
      const parts = output.split(/\s+/); // split on one or more whitespaces
      console.log([parts[0],parts[4],parts[8]]);// prints access rights, size and name of changed file
    });
  });
});


console.log(`Now watching ${filename}.`)
