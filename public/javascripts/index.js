
$(document).ready(function (){
  var words=null;
  $("#textarea1").text("");
  $("#textarea1").on("keyup",function(){
    if(this.value){
      var words = this.value.match(/\S+/g).length;
      if (words >= 100 && words <= 3000)
      {
        $("#WordCount > font").attr("color","blue");
        $("#proceedBtn").removeAttr("disabled");
        $("#proceedBtn").removeAttr("title");
      }
      else {
        $("#WordCount > font").attr("color","red");
        $("#proceedBtn").attr("disabled",true);
        $("#proceedBtn").attr("title","Word count must be between 100-3000 to proceed");
      }
      $("#WordCount > font").text(words);
    }

  });

});
