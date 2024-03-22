// stock category mechanism ====================================
function subcategory_assign(scat){
	var stocksubcat = $('.stocksubcatlist'+scat);
	$('#stock_subcategory_id').empty();
	$('#stock_subcategory_id').append('<option></option>');
	if(stocksubcat.length>0){
		stocksubcat.each(function(){
			var thisid = $(this).attr("data-id");
			var thisval = $(this).val();
			$('#stock_subcategory_id').append($('<option>', { 
				value: thisid,
				text : thisval
			}));
		});
	}
	return true;
}

$('#stock_category_id').on("change", function(){
	var scat = $(this).val();
	subcategory_assign(scat);
});

// value refill part =====================================
$(window).on('load', function(){
	if($('.default').length>0){
		var sc = $('#stock_category_id').val();
		subcategory_assign(sc);
    	refill();
	}
});


// payment term -================
let export_val = $('#is_export').val();
if(export_val == 1){
	$('.export_part').show();
}

let credit = $('#credit').val();
if(credit == '1' || credit == 'True'){
	$('.payment_term').show();
}


//payment terms
$('#creditcheck').click(function(){
	if($(this).prop("checked") == true){
		$('#credit').val(1);
		$('.payment_term').show();
		$('#payment_term_id').attr("data-require", "required");
	}else{
		$('#credit').val(0);
		$('#payment_term_id').removeAttr("data-require");
		$('#payment_term_id').val('').trigger('change');
		$('.payment_term').hide();
	}
});
$('#payment_term_id').on('change', function(){
	let idstr = $(this).val();
	if($('#payterms'+idstr).length>0){
		let val = $('#payterms'+idstr).val();
		$('#discount').val(val);
	}
});