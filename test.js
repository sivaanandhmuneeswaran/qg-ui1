var execSync = require('exec-sync');
 
var user = execSync('echo $USER');
console.log(user);
