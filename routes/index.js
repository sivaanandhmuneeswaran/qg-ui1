var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require("path");
var spawn = require("child_process").spawnSync;
const session = require('express-session');

npTaggedPara = null
nerTaggedPara = null


router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.post('/', async function (req, res, next) {
  var input = req.body.para.toLowerCase();
  var pythonPath = "python3.6 ";
  var codePath = __basedir + "/python_code/create_para_v1.py ";
  var generateParaCommand = pythonPath + codePath ;
  input = input.replace(/((\"|\\))/gi,("\\"+'$1'));
  input = "\"" + input + "\""
  var result = spawn(generateParaCommand,[input],{shell:true,
   encoding: 'utf-8'});
  var new_input = await result.stdout.toString().replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w\-_]*)#?(?:[\.\!\/\\\w\-]*))?)/gi, '<span class="atsign">$1<button type="button" title="Delete" class="reviewDeleteBtn"><i class="w3-small fa fa-trash"></i></button></span>');
  new_input = await new_input.replace(/([^\\\\\s!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9])/gi, '<span class="atsign">$1<button type="button" title="Delete" class="reviewDeleteBtn"><i class="w3-small fa fa-trash"></i></button></span>');
  new_input = await new_input.replace(/\n/gi, ' <br>');
  res.render('review',{input:new_input})
});

router.post('/keywords', function(req,res,next){
  var input = req.body.para.toLowerCase();
  var tempInp = input.split(" ");
  input = ""
  for(var k=0; k < tempInp.length; k++){
    if(tempInp[k] && tempInp[k] != '\r\n'){
      input = input + tempInp[k] + " ";
    }
  }
  input = input.replace(/((\"|\\))/gi,("\\"+'$1'));
  var pythonPath = "python3.6 ";
  var codePath = __basedir + "/python_code/create_para_v1.py ";
  var generateParaCommand = pythonPath + codePath ;
  input = "\"" + input + "\""
  var result = spawn(generateParaCommand,[input],{shell:true,
   encoding: 'utf-8'});
   input = result.stdout.replace(/([\"\\])/gi,("\\"+'$1'));
  inpParaFile = "\"" + input + "\"";
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

  for(var i=0; i<npKeywordIndex.length;i++){
    for(var j=0; j<npTaggedPara.length;j++){
      if(parseInt(npTaggedPara[j].index) === npKeywordIndex[i]){
        keywordArr.push(npTaggedPara[j]);
        break;
      }
    }
  }

  for(var i=0; i<nerKeywordIndex.length;i++){
    for(var j=0; j<nerTaggedPara.length;j++){
      if(parseInt(nerTaggedPara[j].index) === nerKeywordIndex[i]){
        keywordArr.push(nerTaggedPara[j]);
        break;
      }
    }
  }
  for(var i = 0; i < keywordArr.length; i++)
  {
    keywordArr[i].index = i + 1;
  }
  var regex = /{(.*)}/g
  for(var i=0; i <keywordArr.length; i++){
    keywordArr[i].tagged_sentence = keywordArr[i].tagged_sentence.replace(/((\"|\\))/gi,("\\\\"+'$1'));
    c1 = "STR=\""+keywordArr[i].tagged_sentence+"\""
    c2 = 'curl -i -X POST -H "Content-Type: application/json" -d "[{\\"src\\":\\"$STR\\", \\"id\\": 1}]"  http://0.0.0.0:5000/translator/translate'
    commands = c1+'\n'+c2
    var res = spawn(commands,{shell:true, encoding:'utf-8'});
    var questionPair = JSON.parse(res.stdout.toString('utf8').match(regex));
    keywordArr[i].question = questionPair.tgt;
    keywordArr[i].score = questionPair.pred_score;
  }
  inputFilePath = __basedir + "/qg_para/generated_questions.json";
  fs.writeFileSync(inputFilePath,JSON.stringify(keywordArr));
  var pythonPath = "python3.6 ";
  var bertPath = __basedir + "/python_code/pytorch-pretrained-BERT/"
  var codePath = bertPath + "predict.py --bert_model bert-base-uncased --model " + bertPath + "output/pytorch_model.bin --do_predict --do_lower_case --predict_file "+ inputFilePath + " --max_seq_length 384 --doc_stride 128 --config_file "+bertPath+"output/config.json --output_dir "+ bertPath+"output1 --version_2_with_negative";
  var filterCommand = pythonPath + codePath;
  var result = spawn(filterCommand,{shell:true,
   encoding: 'utf-8'});

  var inputFilePath = __basedir + "/qg_para/filtered_questions.json"
  var filtered_questions = JSON.parse(fs.readFileSync(inputFilePath));
  var pythonPath = "python3.6 ";
  var codePath = __basedir + "/python_code/v1_group.py ";
  var groupCommand = pythonPath + codePath + inputFilePath;
  var result = spawn(groupCommand,{shell:true,
   encoding: 'utf-8'});
   groupedAnswer = JSON.parse(result.stdout);
   response.render('questions',{generatedQuestion:filtered_questions,groupedAnswer:groupedAnswer});
  // response.send("hello");
});

module.exports = router;
