var quesPairData = {};
$(document).ready(function(){
  document.getElementById("defaultOpen").click();
  quesPairData.quesPair = null;
  quesPairData.groupedQuesPair = null;
  quesPairData.quesPair = $("#quesPair").DataTable({
    "lengthMenu": [  [10, 25, 50, -1], [10, 25, 50, "All"] ]
  });
  quesPairData.groupedQuesPair = $("#groupedPair").DataTable({
    "lengthMenu": [  [10, 25, 50, -1], [10, 25, 50, "All"] ]
  });
  $(".quesPairLength").text("Number of Question Ideas: " + quesPairData.quesPair.rows().count());
  $(".span:button").click(function(){
    if($(this).text() === "Edit question"){
      $(this).parent().find(".ques").attr("readonly",false);
      $(this).parent().find(".origQuestion").css("visibility",'visible');
      // $(this).parent().find(".saveBtn").css("visibility",'visible');
      // // alert("hello");
    }
  });
})
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}
function view(event){
  var btn = event.target;
  var origSentence = $(btn).parent().parent().data('val').tagged_sentence;
  var taggedSentence = origSentence.replace(/\uffe8O_ANS/gi, '');
  taggedSentence = taggedSentence.replace(/([\\\\!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9]+)(\uffe8B_ANS|\uffe8I_ANS)/gi, '<span style="color:white;background-color:green">$1</span>');
  $(btn).parent().parent().find(".modal-body").html(taggedSentence);
}
function viewAnsLog(event){
  var btn = event.target;
  var questionPair = $(btn).parent().parent().parent().parent().find("span").data('val');
  var html = "";
  html = html + "<div>Original Answer : " + questionPair.answer + "</div><br>"
  if(questionPair.editedAns){
    html = html+`
      <table width="100%" style="table-layout:fixed;">
        <tr>
          <th width="50%">Edited Answer</th>
          <th width="50%">Timestamp</th>
        </tr>
    `;
    for(var i = 0; i < questionPair.editedAns.length; i++)
    {
      html = html + "<tr><td width=\"50%\" style=\"word-wrap:break-word;\">" + questionPair.editedAns[i].editedAns + "</td><td width=\"50%\" style=\"word-wrap:break-word;\">" + questionPair.editedAns[i].timestamp + "</td></tr>";
    }
    html = html + "</table>";
  }
  else {
    html = html + "<h6>No changes made to answer</h6>";
  }
  var id = "#ansLog" + questionPair.index.toString();
  $(id).find(".modal-body").html(html);
}
function handleEditBtn(event){
  var btn = event.target;
  $(btn).parent().parent().parent().find(".answerPair").attr("readonly",false);
  $(btn).parent().parent().find(".span.saveBtn").css("visibility",'visible');
}

function handleSaveBtn(event){
  var btn = event.target;
  $(btn).parent().parent().find(".span.saveBtn").css("visibility",'hidden');
  $(btn).parent().parent().parent().find(".answerPair").attr("readonly",true);
  // var questionPair = $(btn).parent().parent().find("span").data('val');
  var questionPair = $(btn).parent().parent().parent().data('val');
  var editedAns = $(btn).parent().parent().parent().find(".answerPair").val();
  if(questionPair.editedAns)
  {
    if(editedAns != questionPair.answer){
      questionPair.editedAns.push({timestamp:new Date(),editedAns:editedAns});
    }

  }
  else{
    if(editedAns != questionPair.answer){
      questionPair.editedAns = [];
      questionPair.editedAns.push({timestamp:new Date(),editedAns:editedAns});
    }
  }
  var id = "#span" + questionPair.index.toString();
  $(id).data('val',questionPair);
}

function handleDeleteBtn(event){
  var btn = event.target;
  quesPairData.quesPair.row($(btn).parents('tr'))
      .remove()
      .draw();
  $(".quesPairLength").text("Number of Question Ideas: " + quesPairData.quesPair.rows().count());
}

function handleEditQuesBtn(event){
  var btn = event.target;
  $(btn).parent().parent().parent().find(".ques").attr("contentEditable",true);
  $(btn).parent().parent().parent().find(".ques").addClass("questionSelect");
  $(btn).parent().parent().find(".span.saveQuesBtn").css("visibility",'visible');
}

function handleSaveQuesBtn(event){
  var btn = event.target;
  $(btn).parent().parent().find(".span.saveQuesBtn").css("visibility",'hidden');
  $(btn).parent().parent().parent().find(".ques.questionSelect").attr("contentEditable",false);
  $(btn).parent().parent().parent().find(".ques.questionSelect").removeClass("questionSelect");

  var questionPair = $(btn).parents("span").data('val');
  var editedQues = $(btn).parent().parent().parent().find(".ques").text();
  if(questionPair.editedQues)
  {
      questionPair.editedQues.push({timestamp:new Date(),editedQues:editedQues});
  }
  else{
      questionPair.editedQues = [];
      questionPair.editedQues.push({timestamp:new Date(),editedQues:editedQues});
  }
  var id = "#span" + questionPair.index.toString();
  $(id).data('val',questionPair);
}


function viewQuesLog(event){
  var btn = event.target;
  var questionPair = $(btn).parents("span").data('val');
  var html = "";
  if(questionPair.editedQues){
    html = html+`
      <table width="100%" style="table-layout:fixed;">
        <tr>
          <th width="50%">Edited Question</th>
          <th width="50%">Timestamp</th>
        </tr>
    `;
    for(var i = 0; i < questionPair.editedQues.length; i++)
    {
      html = html + "<tr><td width=\"50%\" style=\"word-wrap:break-word;\">" + questionPair.editedQues[i].editedQues + "</td><td width=\"50%\" style=\"word-wrap:break-word;\">" + questionPair.editedQues[i].timestamp + "</td></tr>";
    }
    html = html + "</table>";
  }
  else {
    html = html + "<h6>No changes made to question</h6>";
  }
  var id = "#quesLog" + questionPair.index.toString();
  $(id).find(".modal-body").html(html);
}
function exportJSON(event) {
  var btn = event.target;
  var res = [];
  var id = 1;
  quesPairData.quesPair.column(0).nodes().to$().each(function() {
     var questionAnsPair = $(this).find('.spanData').data('val');
     delete questionAnsPair.tagged_sentence;
     questionAnsPair.index = id;
     id = id + 1;
     res.push(questionAnsPair);
 });

  var a = document.createElement("a");
  var file = new Blob([JSON.stringify(res)], {type: 'text/plain'});
  a.href = URL.createObjectURL(file);
  a.download = "question.json";
  a.click();
}

function handleGroupDeleteBtn(event){
  var btn = event.target;
  quesPairData.groupedQuesPair.row($(btn).parents('tr'))
      .remove()
      .draw();
}

function viewGroupedQuestion(event){
  var btn = event.target;
  var questionPair = $(btn).parent().parent().data('val');
  console.log(questionPair);
  var html = "";
    html = html+`
      <table width="100%" style="table-layout:fixed;">
        <tr>
          <th width="80%">Question</th>
          <th width="20%">Confidence</th>
        </tr>
    `;
    for(var i = 0; i < questionPair.question.length; i++)
    {
      html = html + "<tr><td width=\"80%\" style=\"word-wrap:break-word;\">" + questionPair.question[i] + "</td><td width=\"20%\" style=\"word-wrap:break-word;\">" + parseFloat(questionPair.score[i]).toFixed(3) + "</td></tr>";
    }
    html = html + "</table>";
  var id = "#groupQues" + questionPair.index.toString();
  $(id).find(".modal-body").html(html);
}
