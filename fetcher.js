// Must npm init
// Then npm install request 
// Otherwise request undefined

const website = process.argv[2];
const path = process.argv[3];
const request = require('request');
const fs = require('fs');
const stdin = process.stdin;
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
// don't worry about these next two lines of setup work.
stdin.setRawMode(true);
stdin.setEncoding('utf8');


fs.access(path, fs.constants.F_OK, (err) => {
  if (!err) {
    return overwrite();
  } else {
    return requester();
  }
});

const requester = () => {
  request(website, (error, response, body) => {
    if (response.statusCode !== 200) {
      console.log(`There has been an error 'statusCode:', ${response} && ${response.statusCode}`)
    }
    if (error) {
      console.log(('error:', error));
    }
    fs.writeFile(path, body, (error) => {
      if (error) {
        console.log("The path does not exist.");
        // Exits out of program
        process.exit();
      }
      const bytes = fs.statSync(path).size;
      console.log(`Downloaded and saved  ${bytes} bytes to ${path}`);
      return;
    });
  });
};

const overwrite = () => {
  rl.question("File already exists. Do you want to overwrite? Y/N ", answer => {
    if (answer.toUpperCase() === "Y") {
      requester();
      return rl.close();
    } else if (answer.toUpperCase() === "N") {
      rl.close();
      return;
    }
  });
};