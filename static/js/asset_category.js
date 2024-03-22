
$('#parent_check').click(function(){
	if($(this).prop("checked") == true){
		$('.parent_category').show();
		$('#cat_name_id').attr("data-require", "required");
	}else{
		$('.parent_category').hide();
		$('#cat_name_id').removeAttr("data-require");
		$('#cat_name_id').data('select2').$selection.removeClass('invalid-select');
	}
});

$('#AssetCatgoryForm').on('submit', function(e){
	$('#spinner1').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");

	var error = validate(formid, dataid);

	if(error==0){
		document.AssetCatgoryForm.submit();
	}else{
		$('#spinner1').removeClass('show_spin');
	}
	e.preventDefault();
});

$('#CreateModal').on('hide.bs.modal', function(){
	$('#AssetCatgoryForm')[0].reset();
	$('#cat_name_id').val('').trigger('change');
	$('.parent_category').hide();
});
