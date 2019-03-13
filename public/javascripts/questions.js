$(document).ready(function(){
  $("button").click(function(){
    if($(this).text() === "View paragraph"){
      alert($(this).parent().data('val').original_sentence);
    }
    else if($(this).text() === "Edit question"){
      $(this).parent().find(".question").attr("readonly",false);
      // $(this).parent().find(".saveBtn").css("visibility",'visible');
      // // alert("hello");
    }
    else if($(this).text() === "Edit answer"){
      $(this).parent().find(".answer").attr("readonly",false);
    }
    // else if($(this).text() === "Save question"){
    //   $(this).parent().find("textarea").attr("readonly",false);
    // }
    else{
      $(this).parent().remove();
    }
  });
});
