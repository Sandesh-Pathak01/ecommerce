$('#CreateForm').on('submit', function(e){
	e.preventDefault();
	$('#spinner1').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");

	var error = validate(formid, dataid);

	if(error==0){
		document.CreateForm.submit();
	}else{
		$('#spinner1').removeClass('show_spin');
	}
});
