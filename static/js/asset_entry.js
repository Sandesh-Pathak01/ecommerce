$('#AssetForm input').on('keypress', function(e) {
    return e.which !== 13;
});


// stock category mechanism ====================================
function subcategory_assign(scat){
	var stocksubcat = $('.assetsubcatlist'+scat);
	$('#asset_subcategory_id').empty();
	$('#asset_subcategory_id').append('<option></option>');
	if(stocksubcat.length>0){
		stocksubcat.each(function(){
			var thisid = $(this).attr("data-id");
			var thisval = $(this).val();
			$('#asset_subcategory_id').append($('<option>', { 
				value: thisid,
				text : thisval
			}));
		});
	}
	return true;
}

$('#asset_category_id').on("change", function(){
	var scat = $(this).val();
	subcategory_assign(scat);
});

$('#assetForm').on('submit', function(e){
	$('#spinner1').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");
	
	var error = validate(formid, dataid);

	if(error==0){
		document.AssetForm.submit();
	}else{
		$('#spinner1').removeClass('show_spin');
	}
	e.preventDefault();
});

//==================================================================

$('#asset_type_id').on('change', function(){
	let idstr = $(this).val();
	$('.asset_type_feature').hide();
	$('#asset_type_feature'+idstr).show();
});