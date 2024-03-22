$('#EditForm input').on('keypress', function(e) {
    return e.which !== 13;
});

$('#EditForm').on('submit', function(e){
	e.preventDefault();
	$('#spinner1').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");
	
	let error = validate(formid, dataid);
	
	if(error==0){
		document.EditForm.submit();
	}else{
		$('#spinner1').removeClass('show_spin');
	}
});

