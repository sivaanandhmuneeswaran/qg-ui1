$(document).ready(function(){
  $("#selectable1").selectable({
    stop: function(){
      $(".ui-selected.np:button").toggleClass("btn-outline-success btn-outline-secondary");
    }
  });
  $("#selectable2").selectable({
    stop: function(){
      $(".ui-selected.ner:button").toggleClass("btn-outline-success btn-outline-secondary");
    }
  });
  document.getElementById("defaultOpen").click();
  $(".keyword_button_np").find(":button").click(function(){
    $(this).toggleClass("btn-outline-success btn-outline-secondary");
    var data = $(this).data('val');
  });
  $(".keyword_button_ner").find(":button").click(function(){
    $(this).toggleClass("btn-outline-success btn-outline-secondary");
    var data = $(this).data('val');
  });
  $("#proceedBtn").click(function(){
    var npKeywordArr=[];
    var nerKeywordArr=[];
    $.each($(".btn.btn-outline-success.np"),function(){
      npKeywordArr.push(parseInt($(this).data('val')));
    });
    $.each($(".btn.btn-outline-success.ner"),function(){
      nerKeywordArr.push(parseInt($(this).data('val')));
    });
    var np_input = $("<input>")
               .attr("type", "hidden")
               .attr("name", "np_data").val(JSON.stringify(npKeywordArr));

    var ner_input = $("<input>")
              .attr("type", "hidden")
              .attr("name", "ner_data").val(JSON.stringify(nerKeywordArr));
   $('#keyword_form').append(np_input);
   $('#keyword_form').append(ner_input);
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
