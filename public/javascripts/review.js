
$(document).ready(function (){
  var words_count=$("#textarea1").text().match(/\S+/g).length;
  var flag;
  if($("#textarea1").text().match(/([^\s!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9])/gi)){
    flag=true;
    $("#proceedBtn").attr("disabled",true);
  }
    if (words_count >= 100 && words_count <= 3000)
    {
      $("#WordCount > font").attr("color","blue");
      if(!flag){
        $("#proceedBtn").removeAttr("disabled");
        $("#proceedBtn").removeAttr("title");
      }

    }
    else {
      $("#WordCount > font").attr("color","red");
      $("#proceedBtn").attr("disabled",true);
      $("#proceedBtn").attr("title","Word count must be between 100-3000 to proceed");
    }

  // alert($("#textarea1").text());

  $("#WordCount > font").text(words_count);
  $("#textarea1").on("keyup",textChange);
  $("#textarea1").on("click",textChange);
  function textChange(){
    // $("#textarea1").text().replace(/([^\\\\\s!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9])/gi, '<span class="atsign">$1</span>');

    var words = $(this).text().match(/\S+/g).length;
    var flag1;
    if($("#textarea1").text().match(/([^\s!@#$%^&*\.\'\-\(\)\/<>;\":\?\{\}\[\]+=,a-zA-Z0-9])/gi)){
      flag1=true;
      $("#proceedBtn").attr("disabled",true);
    }
    else{
      $("#proceedBtn").removeAttr("disabled");
      flag1=false;
    }
    if (words >= 100 && words <= 3000)
    {
      $("#WordCount > font").attr("color","blue");
      if(!flag1){
        $("#proceedBtn").removeAttr("disabled");
        $("#proceedBtn").removeAttr("title");
      }

    }
    else {
      $("#WordCount > font").attr("color","red");
      $("#proceedBtn").attr("disabled",true);
      $("#proceedBtn").attr("title","Word count must be between 100-3000 to proceed");
    }
    $("#WordCount > font").text(words);
  }
  $("#proceedBtn").click(function(){
    var input = $("<input>")
               .attr("type", "hidden")
               .attr("name", "para").val($("#textarea1").text());
   $('#review_form').append(input);
  });

  $(".reviewDeleteBtn").click(function(){
    $(this).parent().remove();
  });

});
