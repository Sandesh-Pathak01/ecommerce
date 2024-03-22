$(window).on('load', function(){
	if($('.msgon').length>0){
		var msg = $('.msgon').first().val();
		if(msg=='done'){
			$('#success_ban').show('slide', {direction: 'right'}, 500);
			setTimeout(function(){
				$('#success_ban').hide('slide', {direction: 'right'}, 500);
			}, 5000);
		}
		if(msg=='error'){
			$('#error_ban').show('slide', {direction: 'right'}, 500);
			setTimeout(function(){
				$('#error_ban').hide('slide', {direction: 'right'}, 500);
			}, 5000);
		}
	}
});
$('.inputs').click(function(){
	$(this).removeClass('errorcolor');
});

var win = $(window).height();
$('.log_main_banner').css({"height": win+"px"});
$('.login_ban2').css({"height": win+"px"});
var divh = $('#loginban1').height();
var midval = (parseFloat(win) - parseFloat(divh)) / 2;
$('#loginban1').css({"margin-top": (midval-30)+"px"});

$('#LoginForm').on('submit', function(){
	var error = 0;
	$('#spinner1').show();
	var user = $('#username').val();
	var password = $('#password').val();
	if(user==''){
		error=1;
		$('#username').addClass('errorcolor');
	}
	if(password==''){
		error=1;
		$('#password').addClass('errorcolor');
	}
	if(error==0){
		document.LoginForm.submit();
	}else{
		$('#spinner1').hide();
	}
	event.preventDefault();
});