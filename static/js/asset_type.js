$('#AssetTypeForm').on('submit', function(e){
	$('#spinner1').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");

	var error = validate(formid, dataid);

	if(error==0){
		document.AssetTypeForm.submit();
	}else{
		$('#spinner1').removeClass('show_spin');
	}
	e.preventDefault();
});

$('#CreateModal').on('hide.bs.modal', function(){
	$('#AssetTypeForm')[0].reset();
});
