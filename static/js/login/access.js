var win = $(window).height();
$('.log_main_banner').css({"height": win+"px"});
var divh = $('#deny').height();
var midval = (parseFloat(win) - parseFloat(divh)) / 2;
$('#deny').css({"margin-top": (midval-30)+"px"});