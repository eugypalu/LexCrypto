var fs = require("fs");
 console.log("\n *STARTING* \n");
 let data = [];
// Get content from file
 var contents = fs.readFileSync("crypto.json");
// Define to JSON type
//import stringify from 'csv-stringify'; 
var stringify = require('csv-stringify');
var jsonContent = JSON.parse(contents);
 for(let i = 0; i < 3570; i++){
   data.push(jsonContent[i].id);
  //console.log(jsonContent[i].id);
 }

 fs.writeFileSync('file.csv', data);