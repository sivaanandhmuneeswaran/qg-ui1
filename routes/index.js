var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require("path");
var spawn = require("child_process").spawnSync;
const session = require('express-session');
/* GET home page. */
npTaggedPara = null
nerTaggedPara = null
router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.post('/', function (req, res, next) {
  var input = req.body.para.toLowerCase();
  var pythonPath = "python ";
  var codePath = __basedir + "/python_code/create_para.py ";
  var generateParaCommand = pythonPath + codePath ;
  input = "\"" + input + "\""
  var result = spawn(generateParaCommand,[input],{shell:true,
   encoding: 'utf-8'});
  var new_input = result.stdout.toString().replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi, '<span class="atsign">$1</span>');
  res.render('review',{input:new_input})
});

router.post('/keywords', function(req,res,next){
  var input = req.body.para.toLowerCase();
  var pythonPath = "python ";
  var codePath = __basedir + "/python_code/create_para.py ";
  var generateParaCommand = pythonPath + codePath ;
  input = "\"" + input + "\""
  var result = spawn(generateParaCommand,[input],{shell:true,
   encoding: 'utf-8'});

  inpParaFile = "\"" + result.stdout.toString() + "\"";
  tagCodePath = __basedir + "/python_code/bio_tag_np.py ";
  generateTaggedParaCommand = pythonPath + tagCodePath;
  var result_np = spawn(generateTaggedParaCommand,[inpParaFile],{shell:true,
   encoding: 'utf-8'});



  // //NER tagging
  tagCodePath = __basedir + "/python_code/ner-v3.py ";
  generateTaggedParaCommand = pythonPath + tagCodePath;
  var result_ner = spawn(generateTaggedParaCommand,[inpParaFile],{shell:true,
   encoding: 'utf-8'});

  npTaggedPara = JSON.parse(result_np.stdout);
  nerTaggedPara = JSON.parse(result_ner.stdout);
  res.render('select_keywords',{np_tagged_para:npTaggedPara,ner_tagged_para:nerTaggedPara});
});

router.post('/questions',function(request, response,next){
  keywordArr = [];
  npKeywordIndex = JSON.parse(request.body.np_data);
  nerKeywordIndex = JSON.parse(request.body.ner_data);

  var index=-1;

  for(var i=0; i<npKeywordIndex.length;i++){
    for(var j=0; j<npTaggedPara.length;j++){
      if(parseInt(npTaggedPara[j].index) === npKeywordIndex[i]){
        keywordArr.push(npTaggedPara[j]);
        break;
      }
    }
  }

  index = -1;
  for(var i=0; i<nerKeywordIndex.length;i++){
    for(var j=0; j<nerTaggedPara.length;j++){
      if(parseInt(nerTaggedPara[j].index) === nerKeywordIndex[i]){
        keywordArr.push(nerTaggedPara[j]);
        break;
      }
    }
  }

  var regex = /{(.*)}/g
  for(var i=0; i <keywordArr.length; i++){
    c1 = "STR=\""+keywordArr[i].tagged_sentence+"\""
    c2 = 'curl -i -X POST -H "Content-Type: application/json" -d "[{\\"src\\":\\"$STR\\", \\"id\\": 1}]"  http://0.0.0.0:5000/translator/translate'
    commands = c1+'\n'+c2
    var res = spawn(commands,{shell:true, encoding:'utf-8'});
    var questionPair = JSON.parse(res.stdout.toString('utf8').match(regex));
    keywordArr[i].question = questionPair.tgt;
    keywordArr[i].score = questionPair.pred_score;
  }
  console.log(keywordArr);

   response.render('questions',{generatedQuestion:keywordArr});
  // response.send("hello");
});

module.exports = router;
