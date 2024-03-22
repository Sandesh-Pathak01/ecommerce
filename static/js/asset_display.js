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

// value refill part =====================================
$(window).on('load', function(){
	if($('.default').length>0){
		var sc = $('#asset_category_id').val();
		subcategory_assign(sc);
    	refill();
	}
});
