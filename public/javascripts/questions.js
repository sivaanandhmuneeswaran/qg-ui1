$(document).ready(function(){
  $(".origQuestion").click(function(){
    alert($(this).parent().data('val').question);
  });
  $(".origAnswer").click(function(){
    alert($(this).parent().data('val').answer);
  });
  $(".span:button").click(function(){
    if($(this).text() === "View paragraph"){
      var origSentence = $(this).parent().data('val').original_sentence;
      var answer = $(this).parent().data('val').answer;
      var para = origSentence.replace(answer,answer.fontcolor("green"));
      $(this).parent().find(".dialog-1").append("<br>" +para);
      // $(this).parent().find(".dialog-1").find(".closebutton").css("visibility",'visible');
      $(this).parent().find(".dialog-1").dialog("open");

    }
    else if($(this).text() === "Edit question"){
      $(this).parent().find(".ques").attr("readonly",false);
      $(this).parent().find(".origQuestion").css("visibility",'visible');
      // $(this).parent().find(".saveBtn").css("visibility",'visible');
      // // alert("hello");
    }
    else if($(this).text() === "Edit answer"){
      $(this).parent().find(".answer").attr("readonly",false);
      $(this).parent().find(".origAnswer").css("visibility",'visible');
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
    console.log(res);
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(res)], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = "question.json";
    a.click();
  });
});
