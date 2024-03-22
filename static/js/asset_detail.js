$('#AssetEditForm input').on('keypress', function(e) {
    return e.which !== 13;
});


// value refill part =====================================
$(window).on('load', function(){
	if($('.default').length>0){
		var sc = $('#asset_category_id').val();
		subcategory_assign(sc);
		refill();
	}
});

//======================================================

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

let aci = $('#asset_type_id').val();
if(aci!=''){
	$('#asset_type_feature'+aci).show();
}

if($('.attrib_default').length>0){
	$('.attrib_default').each(function(){
		let idstr = $(this).attr("data-id");
		let val = $(this).val();
		$('#'+idstr).val(val);
	})
}

$('#asset_type_id').on('change', function(){
	let idstr = $(this).val();
	$('.asset_type_feature').hide();
	$('#asset_type_feature'+idstr).show();
});

// =========================================================

// delete single record ===========================================

//========================================

$('#AssetEditForm').on('submit', function(e){
	$('#spinner1').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");
	
	var error = validate(formid, dataid);

	if(error==0){
		document.AssetEditForm.submit();
	}else{
		$('#spinner1').removeClass('show_spin');
	}
	e.preventDefault();
});

//==================================================================


