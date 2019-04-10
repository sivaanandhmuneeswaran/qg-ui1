$(document).ready(function(){
  document.getElementById("defaultOpen").click();
  $(".origQuestion").click(function(){
    alert($(this).parent().data('val').question);
  });
  $(".origAnswer").click(function(){
    alert($(this).parent().data('val').answer);
  });
  $(".span.editBtn").click(function(){
    $(this).parent().parent().parent().find(".answerPair").attr("readonly",false);
    $(this).parent().parent().find(".span, .saveBtn").css("visibility",'visible');
  });
  $(".span.saveBtn").click(function(){
    $(this).css("visibility",'hidden');
    $(this).parent().parent().parent().find(".answerPair").attr("readonly",true);
    var questionPair = $(this).parent().parent().parent().parent().find("span").data('val');
    console.log(questionPair);
    var editedAns = $(this).parent().parent().parent().find(".answerPair").val();
    if(questionPair.editedAns)
    {
      questionPair.editedAns.push({timestamp:new Date(),editedAns:editedAns});
    }
    else{
      questionPair.editedAns = [];
      questionPair.editedAns.push({timestamp:new Date(),editedAns:editedAns});
    }
    var id = "#span" + questionPair.index.toString();
    console.log(id);
    $(id).data('val',questionPair);
  });

  $(".span:button").click(function(){
    if($(this).text() === "Edit question"){
      $(this).parent().find(".ques").attr("readonly",false);
      $(this).parent().find(".origQuestion").css("visibility",'visible');
      // $(this).parent().find(".saveBtn").css("visibility",'visible');
      // // alert("hello");
    }

    // else if($(this).text() === "Save question"){
    //   $(this).parent().find("textarea").attr("readonly",false);
    // }
  });
  $(".deleteBtn").click(function(){
    $(this).parent().parent().remove();
  });
  $(".btn.btn-primary:button").click(function() {
    var res = [];
    var id = 1;
    $("span").each(function(){
      var original_sentence = $(this).data('val').original_sentence;
      var question = $(this).find(".ques").val();
      var answer = $(this).find(".answer").val();
      res.push({id:id,sentence:original_sentence,answer:answer,question:question});
      id = id+1;
    });
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(res)], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = "question.json";
    a.click();
  });
});
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
  console.log(questionPair)
  var html = "";
  if(questionPair.editedAns){
    html = `
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
