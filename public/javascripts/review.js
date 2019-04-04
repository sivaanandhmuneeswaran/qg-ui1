
$(document).ready(function (){

  var words_count=$("#textarea1").text().match(/\S+/g).length;
  // alert($("#textarea1").text());
  if (words_count >= 300 && words_count <= 3000)
  {
    $("#WordCount > font").attr("color","blue");
    $("#proceedBtn").removeAttr("disabled");
    $("#proceedBtn").removeAttr("title");
  }
  else {
    $("#WordCount > font").attr("color","red");
    $("#proceedBtn").attr("disabled",true);
    $("#proceedBtn").attr("title","Word count must be between 300-3000 to proceed");
  }
  $("#WordCount > font").text(words_count);
  $("#textarea1").on("keyup",function(){
    var words = $(this).text().match(/\S+/g).length;
    if (words >= 300 && words <= 3000)
    {
      $("#WordCount > font").attr("color","blue");
      $("#proceedBtn").removeAttr("disabled");
      $("#proceedBtn").removeAttr("title");
    }
    else {
      $("#WordCount > font").attr("color","red");
      $("#proceedBtn").attr("disabled",true);
      $("#proceedBtn").attr("title","Word count must be between 300-3000 to proceed");
    }
    $("#WordCount > font").text(words);
  });

  $("#proceedBtn").click(function(){
    var input = $("<input>")
               .attr("type", "hidden")
               .attr("name", "para").val($("#textarea1").text());
   $('#review_form').append(input);
  });


});
