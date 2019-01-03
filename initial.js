const config = require('./config');
const { lstatSync, readdirSync, writeFile } = require('fs');
const { join } = require('path');

const isDirectory = source => lstatSync(source).isDirectory();

const getDirectories = (d) => lstatSync(d).isDirectory() ? readdirSync(d).map(f => getDirectories(join(d, f))) : d;

let directories = [];
let paths =[];
let isDirectoryFlag = true;

for(i=0;i<config.basePaths.length;i++){
  if(!isDirectory(config.basePaths[i])){
    isDirectoryFlag = false;
    break;
  }
}
console.log("isDirectoryFlag", isDirectoryFlag);
//JS
if(isDirectoryFlag){
  for(i=0;i< config.basePaths.length; i++){
    paths = paths.concat(getDirectories(config.basePaths[i]));
  }

  for(let i=0;i< paths.length; i++){
    directories.push(`\t'${(paths[i])}',`);
  }
}else{
  console.log('Please provide a directory');
}
console.log(paths);
directories.unshift("export const componentPaths=[");
directories.push("];");

//CSS
let csspaths =[];
for(let i=0;i< config.cssPaths.length; i++){
  const isFile = source => lstatSync(source).isFile();
  if(isFile){
    if(config.cssPaths[i].includes('./')){
      csspaths.push(`\t'${(config.cssPaths[i].split('./')[1])}',`);
    }else{
      csspaths.push(`\t'${(config.cssPaths[i])}',`);
    }
  }
}
csspaths.unshift("\nexport const cssPaths=[");
csspaths.push("];");

final = directories.join("\n")+csspaths.join("\n");

//For Writing into output File
writeFile(config.outputPath,final, function(err) {
  if(err) {
      return console.log(err);
  }
  console.log("The file was saved!");
});

