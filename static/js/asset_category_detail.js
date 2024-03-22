// value refill part =====================================
$(window).on('load', function(){
	if($('.default').length>0){
		refill();
	}
});

$('#AssetCategoryEditForm').on('submit', function(e){
	$('#spinner1').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");
	
	var error = validate(formid, dataid);

	if(error==0){
		document.AssetCategoryEditForm.submit();
	}else{
		$('#spinner1').removeClass('show_spin');
	}
	e.preventDefault();
});



