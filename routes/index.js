var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require("path");
var spawn = require("child_process").spawnSync;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.post('/', function (req, res, next) {
  var inputFilePath = __basedir + "/qg_para" + "/input.txt";
  fs.writeFileSync(inputFilePath,req.body.para.toLowerCase());
  var pythonPath = "python ";
  var codePath = __basedir + "/python_code/create_para.py ";
  var generateParaCommand = pythonPath + codePath + inputFilePath;

  var result = spawn(generateParaCommand,{shell:true,
   encoding: 'utf-8'});
  inputFilePath = __basedir + "/qg_para/inp_para.txt";
  fs.writeFileSync(inputFilePath,JSON.parse(result.stdout.toString('utf8')));

  tagCodePath = __basedir + "/python_code/bio_tag_np.py ";
  inpParaFilePath = __basedir + "/qg_para/inp_para.txt ";
  generateTaggedParaCommand = pythonPath + tagCodePath + inpParaFilePath;
  var result = spawn(generateTaggedParaCommand,{shell:true,
   encoding: 'utf-8'});
  inputFilePath = __basedir + "/qg_para/np_tagged_para.json";
  // console.log(typeof(JSON.stringify(result.stdout)));
  try {
    fs.writeFileSync(inputFilePath,result.stdout.toString('utf8'));
  } catch (e) {
    console.log(e);
  }

  //NER tagging
  tagCodePath = __basedir + "/python_code/ner-v3.py ";
  inpParaFilePath = __basedir + "/qg_para/inp_para.txt ";
  generateTaggedParaCommand = pythonPath + tagCodePath + inpParaFilePath;
  var result = spawn(generateTaggedParaCommand,{shell:true,
   encoding: 'utf-8'});
  inputFilePath = __basedir + "/qg_para/ner_tagged_para.json";
  // console.log(typeof(JSON.stringify(result.stdout)));
  try {
    fs.writeFileSync(inputFilePath,result.stdout.toString('utf8'));
  } catch (e) {
    console.log(e);
  }

  npTaggedFilePath = __basedir + "/qg_para/np_tagged_para.json";
  nerTaggedFilePath = __basedir + "/qg_para/ner_tagged_para.json";
  var npTaggedPara = JSON.parse(fs.readFileSync(npTaggedFilePath, {encoding:'utf8'}));
  var nerTaggedPara = JSON.parse(fs.readFileSync(nerTaggedFilePath, {encoding:'utf8'}));
  // console.log(tagged_para);
  res.render('select_keywords',{np_tagged_para:npTaggedPara,ner_tagged_para:nerTaggedPara});
  // res.render('test',{});
});


router.post('/questions',function(request, response,next){
  keywordArr = [];
  npKeywordIndex = JSON.parse(request.body.np_data);
  nerKeywordIndex = JSON.parse(request.body.ner_data);
  var npTaggedFilePath = __basedir + "/qg_para/np_tagged_para.json";
  var npTaggedPara = JSON.parse(fs.readFileSync(npTaggedFilePath, 'utf8'));
  var index=-1;

  for(var i=0; i<npKeywordIndex.length;i++){
    for(var j=0; j<npTaggedPara.length;j++){
      if(parseInt(npTaggedPara[j].index) === npKeywordIndex[i]){
        keywordArr.push(npTaggedPara[j]);
        break;
      }
    }
  }
  var nerTaggedFilePath = __basedir + "/qg_para/ner_tagged_para.json";
  var nerTaggedPara = JSON.parse(fs.readFileSync(nerTaggedFilePath, 'utf8'));
  index = -1;
  for(var i=0; i<nerKeywordIndex.length;i++){
    for(var j=0; j<nerTaggedPara.length;j++){
      if(parseInt(nerTaggedPara[j].index) === nerKeywordIndex[i]){
        keywordArr.push(nerTaggedPara[j]);
        break;
      }
    }
  }
  console.log(keywordArr.length);
  var inputFilePath = __basedir + "/qg_para" + "/selected_keywords.json";
  fs.writeFileSync(inputFilePath,JSON.stringify(keywordArr),'utf-8');

  // inputFilePath = __basedir + "/qg_para" + "/test.json";


  inputFilePath = __basedir + "/qg_para" + "/selected_keywords.json";
  var pythonPath = "python ";
  var codePath = __basedir + "/python_code/ques_gen.py ";
  var generateQuesCommand = pythonPath + codePath + inputFilePath;
  var res = spawn(generateQuesCommand,{shell:true,
   encoding: 'utf-8'});
   var generatedQuestion = JSON.parse(res.stdout);
   // console.log(generatedQuestion);


  // taggedFilePath = __basedir + "/qg_para/out.json";
  //  var generatedQuestion = JSON.parse(fs.readFileSync(taggedFilePath, 'utf8'));

   response.render('questions',{generatedQuestion:generatedQuestion});
});

module.exports = router;
