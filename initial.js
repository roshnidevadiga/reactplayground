const config = require('./config');
const { lstatSync, readdirSync, writeFile } = require('fs');
const { join } = require('path');

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name));

let directory = isDirectory(config.basePath);
let directories = [];

if(directory){
  let paths = getDirectories(config.basePath);
  for(let i=0;i< paths.length; i++){
    directories.push(`\t'${paths[i]}',`);
  }
}else{
  console.log('Please provide a directory');
}
directories.unshift("const paths=[");
directories.push("]\n export default paths;");

writeFile(config.outputPath, directories.join("\n"), function(err) {
  if(err) {
      return console.log(err);
  }

  console.log("The file was saved!");
}); 