$('#StockEditForm input').on('keypress', function(e) {
    return e.which !== 13;
});

// value refill part =====================================
$(window).on('load', function(){
	if($('.default').length>0){
		var sc = $('#stock_category_id').val();
		subcategory_assign(sc);
		refill();
	}
});

//======================================================

$('#serialnum').click(function(){
	if($('#serial_statuscheck').prop("checked") == true){
		$('#serial_status').val('yes');
	}else{
		$('#serial_status').val('no');
	}
});

$('#batchnum').click(function(){
	if($('#batch_statuscheck').prop("checked") == true){
		$('#batch_status').val('yes');
	}else{
		$('#batch_status').val('no');
	}
});


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

// =========================================================

// delete single record ===========================================

$('.delete_btn').click(function(){
	var idstr = $(this).attr("data-id");
	$('#delete_id').val(idstr);
});

//========================================

$('#StockEditForm').on('submit', function(e){
	$('#spinner2').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");
	
	var error = validate(formid, dataid);
	let opening = $('#opening').val();
	let cost_price = $('#cost_price').val();
	let selling_price = $('#selling_price').val();
	let reorder = $('#reorder_quantity').val();
	let item_code = $('#item_code').val();
	let item_name = $('#item_name').val();
	let item_alias = $('#alias').val();
	let item_sku = $('#sku').val();
	if(opening<0){
		error = 1;
		$('#opening').addClass('is-invalid');
	}
	if(cost_price<0){
		error = 1;
		$('#cost_price').addClass('is-invalid');
	}
	if(selling_price<0){
		error = 1;
		$('#selling_price').addClass('is-invalid');
	}
	if(reorder<0){
		error = 1;
		$('#reorder').addClass('is-invalid');
	}
	if(item_code != ''){
		if(!has_valid_length('item_code', item_code, 20)){
			error = 1;
		}
	}
	if(item_alias != ''){
		if(!has_valid_length('alias', item_alias, 20)){
			error = 1;
		}
	}
	if(item_sku != ''){
		if(!has_valid_length('sku', item_sku, 30)){
			error = 1;
		}
	}
	if(!has_valid_length('item_name', item_name, 50)){
		error = 1;
	}

	if(error==0){
		document.StockForm.submit();
	}else{
		$('#spinner2').removeClass('show_spin');
	}
	e.preventDefault();
});

//==================================================================