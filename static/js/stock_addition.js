$('form input').on('keypress', function(e) {
		return e.which !== 13;
});

// variable declaration =============================

var add = 0;
var row = 0;
var batch_count = 0;
var serial_count = 0;
var serial_save_count = 0;
var remain_qty = 0;
var remain_serial = 0;
var batch_col = [];
var serial_col = [];
var total_serial_count = 0;
var serial_id_count = 0;
var life_count = 0;
var life_col = [];
var price_count = 0;
var price_col = [];
var exist_batch_val = [];

$("#itemselect").on('change', function(){
	var idstr = $(this).val();
	if(idstr!=''){
		modal_trigger('QuantityModal', 'quantity');
		var uom = $('#itemlist'+idstr).attr("data-uom");
		var name = $('#itemlist'+idstr).val();
		$('.item_title').text(name);
		$('#selected_item').val(idstr);
		$('.uomtext').text(uom);
	}
});

// =============================

// ============ quantity enter mechanism =========================

$('#quantity').on('keypress', function(e){
    if(e.which===13){
        var val = $(this).val();
        item_qty_add(val);
    }
});

$('#add_item_quantity').click(function(){
    var val = $('#quantity').val();
    item_qty_add(val);
});

function item_qty_add(val){
	if(val!='' && parseFloat(val)>=0){
		val = parseFloat(val);
		var idstr = $('#selected_item').val();
		if(idstr!=''){
			if($('#item_added'+idstr).length===0){
				$('.no-item-row').hide();
				add = 0;
				// adding items ===
				add_items(idstr, val);
				$('#quantity').val('');
				$('.total_item').each(function(){
					var val = $(this).val();
					$('#rowcount'+val).empty();
					add = add + 1;
					$('#rowcount'+val).append(add);
				});
			}else{
				var exists_qty = $('#quantity'+idstr).val();
				var tot = parseFloat(exists_qty) + val;
				tot = fixDecimal(tot, 2);
				$('#quantity'+idstr).val(tot);
			}
			$('#ItemCollection').removeClass('div_error');
			$('#quantity').removeClass('is-invalid');
			$('#QuantityModal').modal('hide');
			$('#itemselect').val('').trigger('change');
		}else{
			let msg = 'item is not selected to proceed!';
			error_toast(msg, 'none', 'none');
		}
	}else{
		$('#quantity').addClass('is-invalid');
	}
}

function add_items(idstr, val){
	var code = $('#itemlist'+idstr).attr("data-code");
	var name = $('#itemlist'+idstr).val();
	var uom = $('#itemlist'+idstr).attr("data-uom");
	// inner html ====
	// var configure_text = '<span class="btn btn-sm btn-info config_div" data-id="'+idstr+'" data-method="addition">Configure</span>';
	var input_group = '<div class="input-group"><input type="number" value="'+val+'" name="quantity'+idstr+'" step=".01" class="form-control inputs qty" id="quantity'+idstr+'" autocomplete="off"><div class="input-group-append"><span class="input-group-text" class="qtytext">'+uom+'</span></div></div>';
	var rate_group = '<div class="input-group"><div class="input-group-prepend"><span class="input-group-text currency_text">Rs</span></div><input type="number" value="" name="rate'+idstr+'" step=".01" class="form-control inputs rate" id="rate'+idstr+'" autocomplete="off"></div>';
	var amount_group = '<div class="input-group"><div class="input-group-prepend"><span class="input-group-text currency_text">Rs</span></div><input type="number" value="" name="amount'+idstr+'" step=".01" class="form-control inputs" id="amount'+idstr+'" autocomplete="off" readonly></div>';
	var acc_sel = '<select class="select2 form-control inputs" name="acc'+idstr+'" id="acc'+idstr+'" data-select="true"><option></option></select>';
	var action = '<button type="button" class="btn btn-sm  bg-danger-transparent text-danger delete_data" data-id="'+idstr+'"><i class="ri-delete-bin-line"></i></button>'; //<button type="button" class="btn btn-sm  bg-info-transparent text-info view_data" data-id="'+idstr+'"><i class="ri-eye-line"></i></button> for view button in table td as action.

	$(".hidden_inputs").append('<input type="hidden" name="total_item" class="total_item datarecord'+idstr+'" id="item_added'+idstr+'" value="'+idstr+'">');
	$("#ItemTable tbody").append('<tr id="itemrow'+idstr+'" class="datarecord'+idstr+'"><td id="rowcount'+idstr+'"></td><td>'+code+'</td><td>'+name+'</td><td id="qty_data'+idstr+'"></td><td id="rate_data'+idstr+'"></td><td id="amount_data'+idstr+'"></td><td id="itemacc_data'+idstr+'"></td><td id="action_data'+idstr+'"></td></tr>'); //<td id="configure_data'+idstr+'"></td> for configuration button in td.
	$('#qty_data'+idstr).append(input_group);
	$('#rate_data'+idstr).append(rate_group);
	$('#amount_data'+idstr).append(amount_group);
	$('#itemacc_data'+idstr).append(acc_sel);
	// $('#configure_data'+idstr).append(configure_text);
	$('#action_data'+idstr).append(action);

	//account select options field ====
	$('.item_acc_list').each(function(){
		let val = $(this).val();
		let name = $(this).attr("data-name");
		$('#acc'+idstr).append($('<option>', {
			value: val,
			text : name
		}));
	});
	$('#acc'+idstr).select2({
		placeholder: "Choose option",
		allowClear: true,
		dropdownAutoWidth: !0,
		width: "100%"
	});
}

$('#QuantityModal').on('hide.bs.modal', function(){
	$("#QuantityForm")[0].reset();
	$('#itemselect').val('').trigger('change');
});

$(document).on('click', '.delete_data', function(){
	var idstr = $(this).attr("data-id");
	$('.item_data_col'+idstr).remove();
	$('.datarecord'+idstr).remove();
	add = 0;
	if($('.total_item').length==0){
		$('.no-item-row').show();
	}else{
		$('.total_item').each(function(){
			var val = $(this).val();
			$('#rowcount'+val).empty();
			add = add + 1;
			$('#rowcount'+val).append(add);
		});
	}
});

$(document).on('keyup', '.qty', function(){
	let val = $(this).val();
	if(val!='' && val > 0){
		addition_calc();
	} 
});

$(document).on('keyup', '.rate', function(){
	let val = $(this).val();
	if(val!='' && val > 0){
		addition_calc();
	} 
});

function addition_calc(){
	let totalItems = $('.total_item');
	totalItems.each(function(){
		let idstr = $(this).val();
		let qty = $('#quantity'+idstr).val();
		let rate = $('#rate'+idstr).val();
		let tot = 0;
		if(qty!='' && qty>0 && rate!='' && rate>0){
			tot = parseFloat(qty) * parseFloat(rate);
		}
		tot = fixDecimal(tot, 2);
		$('#amount'+idstr).val(tot);
	})
}

function addition_calc_validation(){
	let form_error = 0;
	$('.total_item').each(function(){
		let idstr = $(this).val();
		let qty = $('#quantity'+idstr).val();
		if(qty=='' || qty<1 || qty==null){
			form_error = 1;
			$('#quantity'+idstr).addClass('is-invalid');
		}
		let rate = $('#rate'+idstr).val();
		if(rate=='' || rate<1 || rate==null){
			form_error = 1;
			$('#rate'+idstr).addClass('is-invalid');
		}
		let amt = $('#amount'+idstr).val();
		if(amt=='' || amt<1 || amt==null){
			form_error = 1;
			$('#amount'+idstr).addClass('is-invalid');
		}
		let acc = $('#acc'+idstr).val();
		if(acc=='' || acc===undefined){
			form_error = 1;
			$('#acc'+idstr).data('select2').$selection.addClass('invalid-select');
		}
	});
	return form_error;
}

// item detail showing mechanism =========================================
$(document).on('click', '.view_data', function(){
	var idstr = $(this).attr("data-id");
	var total_qty = $('#quantity'+idstr).val();
	var name = $('#itemlist'+idstr).val();
	var code = $('#itemlist'+idstr).attr("data-code");
	var uom = $('#itemlist'+idstr).attr("data-uom");
	$('.item_title').text(name);
	modal_trigger('DetailModal', 'detail_selected_item');
	$('.view_empty').empty();

	// review data inserted ====
	review_data(idstr, name, code, uom, total_qty);

});

function review_data(idstr, name, code, uom, total_qty){
	var btch_count = 0;
	var hand_qty = total_qty;
	$('#detail_item_title').text(''+name+' ('+code+')');
	$('#detail_item_quantity').text(''+total_qty+' '+uom);
	var AllBatchList = $('.batch_number'+idstr);
	var LifeBatchList = $('.life_batch_number'+idstr);
	var PriceBatchList = $('.price_batch_number'+idstr);
	var SerialNumberList = $('.serial_number'+idstr);
	if(AllBatchList.length>0){
		AllBatchList.each(function(){
			btch_count = btch_count + 1;
			var val = $(this).val();
			var qty = $(this).attr("data-qty");
			hand_qty = parseFloat(hand_qty) - parseFloat(qty);
			$("#DetailBatchTable tbody").append('<tr id="batch_detail_row'+btch_count+'"><td>'+val+'</td><td>'+qty+'</td></tr>');
			if(LifeBatchList.length>0){
				LifeBatchList.each(function(){
					var this_val = $(this).val();
					if(this_val==val){
						var life_id = $(this).attr("data-life-id");
						var manu_date = $('#manufacture_date_added'+life_id).val();
						var exp_date = $('#expiry_date_added'+life_id).val();
						var tlife = $('#total_life_added'+life_id).val();
						var life_p = $('#period_time_added'+life_id).val();
						 $('#batch_detail_row'+btch_count).append('<td>'+manu_date+'</td><td>'+exp_date+'</td><td>'+tlife+' '+life_p+'</td>');
					}
				});
			}else{
				$('#batch_detail_row'+btch_count).append('<td>-</td><td>-</td><td>-</td>');
			}
			if(PriceBatchList.length>0){
				PriceBatchList.each(function(){
					var this_val = $(this).val();
					if(this_val==val){
						var price_id = $(this).attr("data-price-id");
						var cp = $('#cost_price_added'+price_id).val();
						var sp = $('#sale_price_added'+price_id).val();
						var pro_amt = $('#margin_amt_added'+price_id).val();
						var pro_per = $('#margin_per_added'+price_id).val();
						 $('#batch_detail_row'+btch_count).append('<td>'+cp+'</td><td>'+sp+'</td><td>'+pro_amt+' ('+pro_per+'%)</td>');
					}
				});
			}else{
				$('#batch_detail_row'+btch_count).append('<td>-</td><td>-</td><td>-</td>');
			}

			// batchwise serial display==
			$('.serial_collection').append('<div class="col* col-lg-6 col-md-6" id="serialtab'+btch_count+'"></div>');
			var $div = $('#resuable_html').clone().attr('id', null);
			$('#serialtab'+btch_count).html($div);
			$("#serialtab"+btch_count+" .table tbody").append('<tr><th>Batch Number: '+val+'</th></tr>');
			if(SerialNumberList.length>0){
				SerialNumberList.each(function(){
					var this_batch = $(this).attr("data-batch");
					var this_val = $(this).val();
					console.log(val, this_batch);
					if(this_batch==val){
						$("#serialtab"+btch_count+" .table tbody").append('<tr><td>'+this_val+'</td></tr>');
					}
				});
			}
		});
	}

	// quantity left without batch number ====
	if(hand_qty>0){
		btch_count = btch_count + 1;
		$("#DetailNoBatchTable tbody").append('<tr id="no_batch_detail_row'+btch_count+'"><td>'+hand_qty+'</td></tr>');

		// product life without batch display ==
		if(LifeBatchList.length>0){
			LifeBatchList.each(function(){
				var this_val = $(this).val();
				if(this_val=='none'){
					// btch_count = btch_count + 1;
					var life_id = $(this).attr("data-life-id");
					var manu_date = $('#manufacture_date_added'+life_id).val();
					var exp_date = $('#expiry_date_added'+life_id).val();
					var tlife = $('#total_life_added'+life_id).val();
					var life_p = $('#period_time_added'+life_id).val();
					$('#no_batch_detail_row'+btch_count).append('<td>'+manu_date+'</td><td>'+exp_date+'</td><td>'+tlife+' '+life_p+'</td>');
					if(PriceBatchList.length>0){
						PriceBatchList.each(function(){
							var this_val = $(this).val();
							if(this_val=='none'){
								var price_id = $(this).attr("data-price-id");
								var cp = $('#cost_price_added'+price_id).val();
								var sp = $('#sale_price_added'+price_id).val();
								var pro_amt = $('#margin_amt_added'+price_id).val();
								var pro_per = $('#margin_per_added'+price_id).val();
								$('#no_batch_detail_row'+btch_count).append('<td>'+cp+'</td><td>'+sp+'</td><td>'+pro_amt+' ('+pro_per+'%)</td>');
							}
						});
					}
				}
			});
		}else{
			$('#no_batch_detail_row'+btch_count).append('<td>-</td><td>-</td><td>-</td>');
			// product pricing without batch===
			if(PriceBatchList.length>0){
				PriceBatchList.each(function(){
					var this_val = $(this).val();
					if(this_val=='none'){
						// btch_count = btch_count + 1;
						var price_id = $(this).attr("data-price-id");
						var cp = $('#cost_price_added'+price_id).val();
						var sp = $('#sale_price_added'+price_id).val();
						var pro_amt = $('#margin_amt_added'+price_id).val();
						var pro_per = $('#margin_per_added'+price_id).val();
						$('#no_batch_detail_row'+btch_count).append('<td>'+cp+'</td><td>'+sp+'</td><td>'+pro_amt+' ('+pro_per+'%)</td>');
					}
				});
			}else{
				$('#no_batch_detail_row'+btch_count).append('<td>-</td><td>-</td><td>-</td>');
			}
		}

		// serial number display
		if(SerialNumberList.length>0){
			SerialNumberList.each(function(){
				var this_batch = $(this).attr("data-batch");
				if(this_batch=='none'){
					$('.serial_collection').append('<div class="col* col-lg-6 col-md-6" id="none_serialtab'+btch_count+'"></div>');
					var $div = $('#resuable_html').clone().attr('id', null);
					$('#none_serialtab'+btch_count).html($div);
					$("#none_serialtab"+btch_count+" .table tbody").append('<tr><th>Batch Number: '+this_batch+'</th></tr>');
					return false;
				}
			});
			SerialNumberList.each(function(){
				var this_batch = $(this).attr("data-batch");
				var this_val = $(this).val();
				if(this_batch=='none'){
					$("#none_serialtab"+btch_count+" .table tbody").append('<tr><td>'+this_val+'</td></tr>');
				}
			});
		}
	}
}

// ==================================================

// configuration mechanism ================

$(document).on('click', '.config_div', function(){
	var idstr = $(this).attr("data-id");
	var method = $(this).attr("data-method");
	var total_qty = $('#quantity'+idstr).val();
	var name = $('#itemlist'+idstr).val();
	var code = $('#itemlist'+idstr).attr("data-code");
	var uom = $('#itemlist'+idstr).attr("data-uom");
	var batch_status = $('#itemlist'+idstr).attr("data-batch");
	var serial_status = $('#itemlist'+idstr).attr("data-serial");
	$('.item_title').text(name);
	modal_trigger('ConfigureModal', 'config_selected_item');
	$('#config_selected_item').val(idstr);
	if(method=='deduction'){
        accordion_hide('life');
        accordion_hide('price');
    }

	if(batch_status == 'True'){
		$('.batch_none').hide();
		$('#BatchForm').show();
	}
	if(batch_status == 'False'){
		$('#BatchForm').hide();
		$('.batch_none').show();
	}
	if(serial_status == 'True'){
		$('.serial_none').hide();
		$('#SerialForm').show();
	}
	if(serial_status == 'False'){
		$('#SerialForm').hide();
		$('.serial_none').show();
	}

	// batch refill ==
	$('#BatchTable tbody').empty();
	remain_qty = total_qty;
	batch_refill(idstr);

	//serial refill =====
	$('#SerialTable tbody').empty();
	total_serial_count = 0;
	serial_refill(idstr);


	if(method=='addition'){
		// product life refill =====
		$('#LifeTable tbody').empty();
		life_col = [];
		life_refill(idstr);

		// pricing refill ======
		$('#PriceTable tbody').empty();
		price_col = [];
		cost_refill(idstr);
	}
});

$('#ConfigureModal').on('hide.bs.modal', function(){
	var method = $(this).attr("data-method");
	// batch hide ======
	$("#BatchForm")[0].reset();
	$("#BatchForm .inputs").removeClass('is-invalid');
	if(method=='addition'){
        $('#exist_batch_select_div').hide();
        $('#new_batch_entry_div').show();
    }

	//serial hide =====
	$("#SerialForm")[0].reset();
	$("#SerialForm .inputs").removeClass('is-invalid');
	$('#batch_select_group').hide();

	if(method=='addition'){
		// product life hide ======
		$('#LifeForm')[0].reset();
		$('#life_batch_select_list').val('');
		$('#life_batch_select_group').hide();
		$('#period').val('days');
		$('#period').niceSelect('update');
		$('.nep_dateinput').hide();
		$('.eng_dateinput').show();
		$('.datefield').hide();

		// pricing hide ====
		$('#PriceForm')[0].reset();
		$('#price_batch_select_list').val('');
		$('#price_batch_select_group').hide();
	}
});

function batch_refill(idstr){
	var batchlist = $('.batch_number'+idstr);
	if(batchlist.length > 0){
		batchlist.each(function(){
			var batch_id = $(this).attr("data-batch-id");
			var action = '<button class="btn btn-sm  bg-danger-transparent text-danger batch_delete_data" data-id="'+batch_id+'"><i class="ri-delete-bin-line"></i></button>';
			var batch_num = $('#batch_added'+batch_id).val();
			var batch_qty = $('#batch_qty_added'+batch_id).val();
			$("#BatchTable tbody").append('<tr id="batchrow'+batch_id+'"><td>'+batch_num+'</td><td>'+batch_qty+'</td><td id="batch_action_data'+batch_id+'"></td></tr>');
			$('#batch_action_data'+batch_id).append(action);
			remain_qty = parseFloat(remain_qty) - parseFloat(batch_qty);
		});
	}
}

function serial_refill(idstr){
	var seriallist = $('.serial_number'+idstr);
	if(seriallist.length > 0){
		seriallist.each(function(){
			var serial_num = $(this).val();
			var batch_val = $(this).attr("data-batch");
			var serial_id = $(this).attr("data-serial-id");
			var action = '<button class="btn btn-sm  bg-danger-transparent text-danger serial_delete_data" data-id="'+serial_id+'"><i class="ri-delete-bin-line"></i></button>';
			$("#SerialTable tbody").append('<tr id="serialrow'+serial_id+'"><td>'+serial_num+'</td><td>'+batch_val+'</td><td id="serial_action_data'+serial_id+'"></td></tr>');
			$('#serial_action_data'+serial_id).append(action);
			total_serial_count = total_serial_count + 1;
		});
	}
}

function life_refill(idstr){
	var lifelist = $('.total_life'+idstr);
	if(lifelist.length > 0){
		lifelist.each(function(){
			var life_id = $(this).attr("data-life-id");
			var action = '<button class="btn btn-sm  bg-danger-transparent text-danger life_delete_data" data-id="'+life_id+'"><i class="ri-delete-bin-line"></i></button>';
			var batch_val = $('#life_batch_added'+life_id).val();
			var manuf = $('#manufacture_date_added'+life_id).val();
			var exp = $('#expiry_date_added'+life_id).val();
			var total_life = $('#total_life_added'+life_id).val();
			var period = $('#period_time_added'+life_id).val();
			$("#LifeTable tbody").append('<tr id="liferow'+life_id+'"><td>'+batch_val+'</td><td>'+manuf+'</td><td>'+exp+'</td><td>'+total_life+' '+period+'</td><td id="life_action_data'+life_id+'"></td></tr>');
			$('#life_action_data'+life_id).append(action);
			life_col.push(batch_val);
		});
	}
}

function cost_refill(idstr){
	var costlist = $('.cost_price'+idstr);
	if(costlist.length > 0){
		costlist.each(function(){
			var price_id = $(this).attr("data-price-id");
			var action = '<button class="btn btn-sm  bg-danger-transparent text-danger price_delete_data" data-id="'+price_id+'"><i class="ri-delete-bin-line"></i></button>';
			var batch_val = $('#price_batch_added'+price_id).val();
			var cost = $('#cost_price_added'+price_id).val();
			var sale = $('#sale_price_added'+price_id).val();
			var profit_amt = $('#margin_amt_added'+price_id).val();
			var profit_per = $('#margin_per_added'+price_id).val();
			$("#PriceTable tbody").append('<tr id="pricerow'+price_id+'"><td>'+batch_val+'</td><td>'+cost+'</td><td>'+sale+'</td><td>'+profit_amt+' ('+profit_per+'%)</td><td id="price_action_data'+price_id+'"></td></tr>');
			$('#price_action_data'+price_id).append(action);
			price_col.push(batch_val);
		});
	}
}
// =======================================

// batch configuration mechanism ============================

//exists batch config==
$('#exist_batchcheck').click(function(){
	var idstr = $('#config_selected_item').val();
	if($(this).prop("checked") == true){
		$('#exist_batch_select_list').empty();
		$('#exist_batch_select_list').niceSelect('update');
		$('.batch_list_instance'+idstr).remove();
		batch_instance_load(idstr);
	}else{
		$('#exist_batch_select_list').empty();
		$('#exist_batch_select_div').hide();
		$('#new_batch_entry_div').show();
	}
});

function batch_instance_load(idstr){
	var formData = {
		'sid': idstr,
		'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
	}
	$.ajax({
		type: 'POST',
		url: '/stock-adjustment/batch-instance/',
		data: formData,
		encode: true
	})
	.done(function(response) {
		$('#new_batch_entry_div').hide();
		$('#exist_batch_select_div').show();
		$('#exist_batch_select_list').append($('<option>', {
			value: '',
			text : '-- Choose option --'
		}));
		$('#exist_batch_select_list').niceSelect("update");
		let batch_instance_id = '';
		let batch_instance_qty = '';
		let batch_instance_number = '';
		$.each(response["batch_list"], function(key, value) {
			$.each(value, function(key, value) {
				if(key=='id'){
					batch_instance_id = value;
				}
				if(key=='quantity'){
					batch_instance_qty = value;
				}
				if(key=='batch_number'){
					batch_instance_number = value;
				}
			});
			console.log(batch_instance_id, batch_instance_qty, batch_instance_number);
			$('#exist_batch_select_list').append($('<option>', {
				value: batch_instance_id,
				text : batch_instance_number
			}));
			$('#exist_batch_select_list').niceSelect("update");
			exist_batch_val.push(batch_instance_number);
			$('.hidden_inputs').append('<input type="hidden" class="batch_list_instance'+idstr+'" id="batch_instance'+batch_instance_id+'" value="'+batch_instance_number+'" data-instance-id="'+batch_instance_id+'" data-qty="'+batch_instance_qty+'">');
		});
	});
}

$('#add_batch').click(function(){
	// new batch addition =============
	add_batch();
});

// batch number deletion ====
$(document).on('click', '.batch_delete_data', function(){
	var idstr = $(this).attr("data-id");
	var qty = $('#batch_qty_added'+idstr).val();
	var btch = $('#batch_added'+idstr).val();
	$('.batch_thisrow'+idstr).remove();
	$('#batchrow'+idstr).remove();
	remain_qty = parseFloat(remain_qty) + parseFloat(qty);
	batch_col = jQuery.grep(batch_col, function(value) {
		return value != btch;
	});
	// batch_count = batch_count - 1;
});
//==

function add_batch(){
	var idstr = $('#config_selected_item').val();
	var batch_num = $('#batch_input').val();
	var batch_num_id = '';
	var batch_qty = $('#batch_qty').val();
	var total_qty = $('#quantity'+idstr).val();
	var check_batch_exist = 'no';
	if($('#exist_batchcheck').prop("checked") == true){
		batch_num_id = $('#exist_batch_select_list').val();
		batch_num = $('#batch_instance'+batch_num_id).val();
		console.log(batch_num_id, batch_num);
		check_batch_exist = 'yes';
	}
	if(batch_num!='' && batch_qty > 0){
		if(parseFloat(remain_qty) - parseFloat(batch_qty) >= 0){
			if($.inArray(batch_num, batch_col)<0){
				batch_count = batch_count + 1;
				var batch_id = 'batch_'+idstr+''+batch_count;
				var action = '<button class="btn btn-sm  bg-danger-transparent text-danger batch_delete_data" data-id="'+batch_id+'"><i class="ri-delete-bin-line"></i></button>';
				$(".hidden_inputs").append('<input type="hidden" name="batch_count'+idstr+'" class="item_data_col'+idstr+' batch_thisrow'+batch_id+' batch_count'+idstr+'" id="batch_count_added'+batch_id+'" value="'+batch_id+'">');
				if(check_batch_exist=='yes'){
					$(".hidden_inputs").append('<input type="hidden" name="batch_exist'+batch_id+'" class="item_data_col'+idstr+' batch_thisrow'+batch_id+' batch_exists'+idstr+'" id="batch_exist_added'+batch_id+'" value="'+batch_num_id+'" data-id="'+idstr+'">');
				}
				$(".hidden_inputs").append('<input type="hidden" name="batch_number'+batch_id+'" class="item_data_col'+idstr+' batch_thisrow'+batch_id+' batch_number'+idstr+'" id="batch_added'+batch_id+'" value="'+batch_num+'" data-id="'+idstr+'" data-qty="'+batch_qty+'" data-count="'+batch_count+'" data-batch-id="'+batch_id+'">');
				$(".hidden_inputs").append('<input type="hidden" name="batch_quantity'+batch_id+'" class="item_data_col'+idstr+' batch_thisrow'+batch_id+' batch_quantity'+idstr+'" id="batch_qty_added'+batch_id+'" value="'+batch_qty+'" data-id="'+idstr+'">');
				$("#BatchTable tbody").append('<tr id="batchrow'+batch_id+'"><td>'+batch_num+'</td><td>'+batch_qty+'</td><td id="batch_action_data'+batch_id+'"></td></tr>');
				$('#batch_action_data'+batch_id).append(action);
				$('#BatchForm')[0].reset();
				$("#BatchForm input#batch_input").focus();
				batch_col.push(batch_num);
				remain_qty = parseFloat(remain_qty) - parseFloat(batch_qty);
				$('#batch_input').removeClass('is-invalid');
				$('#batch_qty').removeClass('is-invalid');
			}else{
				$('#batch_input').addClass('is-invalid');
			}
		}else{
			$('#batch_qty').addClass('is-invalid');
		}
	}else{
		$('#batch_input').addClass('is-invalid');
		$('#batch_qty').addClass('is-invalid');
	}
}

// ==================================================

// serial number mechanism =====================================

$('#use_batch').click(function(){
	var idstr = $('#config_selected_item').val();
	var batchlist = $('.batch_number'+idstr);
	if($('#use_batchcheck').prop("checked") == true){
		$('#batch_select_group').show();
		$('#batch_select_list').empty();
		$('#batch_select_list').append($('<option>', {
			value: '',
			text : '-- Choose option --'
		}));
		$('#batch_select_list').niceSelect('update');
		if(batchlist.length > 0){
			batchlist.each(function(){
				var thisval = $(this).val();
				$('#batch_select_list').append($('<option>', {
					value: thisval,
					text : thisval
				}));
			});
			$('#batch_select_list').niceSelect('update');
		}
	}else{
		$('#batch_select_list').empty();
		$('#batch_select_list').niceSelect('update');
		$('#batch_select_group').hide();

		// resetting serial_count on unchecking batch number checkbox;
		serial_count = 0;
		reset_serial_count(idstr, 'none', 'serial');
	}
});

$('#batch_select_list').on('change', function(){
	var val = $(this).val();
	var idstr = $('#config_selected_item').val();
	serial_count = 0;
	if(val!=''){
		// resetting serial_count for changed batchnumber;
		reset_serial_count(idstr, val, 'batch');
	}
});

$('#add_serial').click(function(){
	// adding serial number ====
	add_serial_number();
});

// serial number deletion ====
$(document).on('click', '.serial_delete_data', function(){
	var idstr = $(this).attr("data-id");
	var ser = $('#serial_number_added'+idstr).val();
	$('.serial_thisrow'+idstr).remove();
	$('#serialrow'+idstr).remove();
	serial_col = jQuery.grep(serial_col, function(value) {
		return value != ser;
	});
	total_serial_count = total_serial_count - 1;
});
//===

function add_serial_number(){
	var idstr = $('#config_selected_item').val();
	var batch_val = '';
	var batch_sel_id = '';
	var batch_chk = 0;
	var total_qty = 0;
	var go = 'yes';
	serial_count = 0;
	var available_qty = $('#quantity'+idstr).val();
	if($('#use_batchcheck').prop("checked") == true){
		batch_val = $('#batch_select_list option:selected').val();
		if(batch_val==''){
			batch_chk = 1;
		}else{
			// setting total_qty of selected batch number
			$('.batch_number'+idstr).each(function(){
				var val = $(this).val();
				if(val==batch_val){
					total_qty = $(this).attr("data-qty");
					batch_sel_id = $(this).attr("data-batch-id");
				}
			});

			// resetting serial_count for given batchnumber;
			reset_serial_count(idstr, batch_val, 'batch');
		}
	}else{
		// setting total quantity of serial number with no batch
		total_qty = $('#quantity'+idstr).val();
		batch_val = 'none';
		batch_sel_id = '_none_'+idstr;
		var check_go = check_qty_in_batch(idstr);
		if(check_go>0){
			go = 'yes';
			total_qty = check_go;
		}else{
			go = 'no';
		}

		// resetting serial_count without batch number
		reset_serial_count(idstr, 'none', 'serial');
	}
	var serial_num = $('#serial_input').val();
	if(go=='yes'){
		if(batch_chk==0 && serial_num != ''){
			if(total_serial_count < available_qty){
				if(parseFloat(total_qty) - parseFloat(serial_count) > 0){
					if($.inArray(serial_num, serial_col)<0){
						serial_count = serial_count + 1;
						serial_save_count = serial_save_count + 1;
						serial_id_count = serial_id_count + 1;
						var serial_id = '';
						if(batch_val!='none'){
							serial_id = 'serial_batch_'+idstr+''+serial_id_count;
						}else{
							serial_id = 'serial_'+idstr+''+serial_id_count;
						}
						var action = '<button class="btn btn-sm  bg-danger-transparent text-danger serial_delete_data" data-id="'+serial_id+'"><i class="ri-delete-bin-line"></i></button>';
						$(".hidden_inputs").append('<input type="hidden" name="serial_save_number'+batch_sel_id+'" class="item_data_col'+idstr+' serial_thisrow'+serial_id+' serial_save_number'+idstr+'" id="serial_save_added'+serial_id+'" value="'+serial_save_count+'" data-id="'+idstr+'">');
						$(".hidden_inputs").append('<input type="hidden" name="serial_batch_number'+batch_sel_id+'_'+serial_save_count+'" class="item_data_col'+idstr+' serial_thisrow'+serial_id+' serial_batch_number'+idstr+'" id="serial_batch_added'+serial_id+'" value="'+batch_val+'" data-id="'+idstr+'">');
						$(".hidden_inputs").append('<input type="hidden" name="serial_number'+batch_sel_id+'_'+serial_save_count+'" class="item_data_col'+idstr+' serial_thisrow'+serial_id+' serial_number'+idstr+'" id="serial_number_added'+serial_id+'" value="'+serial_num+'" data-id="'+idstr+'" data-batch="'+batch_val+'" data-count="'+serial_id_count+'" data-serial-id="'+serial_id+'">');
						$("#SerialTable tbody").append('<tr id="serialrow'+serial_id+'"><td>'+serial_num+'</td><td>'+batch_val+'</td><td id="serial_action_data'+serial_id+'"></td></tr>');
						$('#serial_action_data'+serial_id).append(action);
						$("#SerialForm input#serial_input").val('');
						$("#SerialForm input#serial_input").focus();
						serial_col.push(serial_num);
						total_serial_count = total_serial_count + 1;

						$('#serial_input').removeClass('is-invalid');
						$('#batch_select_list').removeClass('is-invalid');
						$('#batch_select_list').niceSelect('update');
					}else{
						$('#serial_input').addClass('is-invalid');
					}
				}else{
					$('#serial_input').addClass('is-invalid');
					$('#batch_select_list').addClass('is-invalid');
				}
			}else{
				$('#serial_input').addClass('is-invalid');
			}
		}else{
			$('#serial_input').addClass('is-invalid');
			$('#batch_select_list').addClass('is-invalid');
			$('#batch_select_list').niceSelect('update');
		}
	}else{
		$('#batch_div').addClass('div_error');
	}
}

function reset_serial_count(idstr, val, method){
	if(method=='batch'){
		var serialBatchList = $('.serial_batch_number'+idstr);
		if(serialBatchList.length>0){
			serialBatchList.each(function(){
				var bval = $(this).val();
				if(bval==val){
					serial_count = serial_count + 1;
				}
			});
		}
	}

	if(method=='serial'){
		var serialList = $('.serial_number'+idstr);
		if(serialList.length>0){
			serialList.each(function(){
				var bval = $(this).attr('data-batch');
				if(bval=='none'){
					serial_count = serial_count + 1;
				}
			})
		}
	}
}

//============================================================

// date mechanism============================================

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

function date_format(date){
	var format = date.toISOString().substr(0,10);
	return format;
}

if($('.nep_dateinput').length>0){
	$( ".nep_dateinput" ).nepaliDatePicker({
		dateFormat: 'YYYY-MM-DD',
		onChange: function(){
			total_life('nepali', 'date');
		}
	});
}

if($('.eng_dateinput').length>0){
	$( ".eng_dateinput" ).datepicker({
		dateFormat: 'yy-mm-dd',
		onSelect: function(){
			total_life('english', 'date');
		}
	});
}

$('#manufdate').click(function(){
	if($('#manufdatecheck').prop("checked") == true){
		$('.datefield').show();
	}else{
		$('#lifenum').val('');
		$('#period').val('days');
		$('.dateinput').val('');
		$('.datefield').hide();
	}
});

$('#nepalidate_checkbox').click(function(){
	var date = $('.dateinput');
	date.val('');
	date.hide();
	$('#lifenum').val('');
	$('#period').val('days');
	if($(this).prop("checked") == true){
		$('.nep_dateinput').show();
	}else{
		$('.eng_dateinput').show();
	}
});
$('.nep_dateinput').on('blur', function(){
	total_life('nepali', 'date');
});
$('.eng_dateinput').on('blur', function(){
	total_life('english', 'date');
});

$('#lifenum').on('keyup', function(){
	var life = $(this).val();
	$(this).removeClass('is-invalid');
	if(life!='' && life>0){
		if($('#manufdatecheck').prop("checked") == true){
			var manudiv;
			var manuf = '';
			if($('#nepalidate_checkbox').prop("checked") == true){
				manudiv = $('#nep_manuf_date');
				manuf = manudiv.val();
				total_life('nepali', 'life');
			}else{
				manudiv = $('#eng_manuf_date');
				manuf = manudiv.val();
				total_life('english', 'life');
			}
		}
	}else{
		$(this).addClass('is-invalid');
	}
});

$('#period').on('change', function(){
	var period = $(this).val();
	$(this).removeClass('is-invalid');
	if(period!=''){
		if($('#manufdatecheck').prop("checked") == true){
			if($('#nepalidate_checkbox').prop("checked") == true){
				total_life('nepali', 'period');
			}else{
				total_life('english', 'period');
			}
		}
	}else{
		$(this).addClass('is-invalid');
	}
});

function total_life(dtype, invoke){
	var mdate = '';
	var exdate = '';
	var manudiv;
	var exdiv;
	$('.dateinput').removeClass('is-invalid');
	$('#lifenum').removeClass('is-invalid');
	$('#period').removeClass('is-invalid');
	if(invoke=='date' || invoke=='period'){
		$('#lifenum').val('');
	}
	if(dtype=='english'){
		mdate = $('#eng_manuf_date').val();
		exdate = $('#eng_expire_date').val();
		manudiv = $('#eng_manuf_date');
		exdiv = $('#eng_expire_date');
	}
	if(dtype=='nepali'){
		mdate = $('#nep_manuf_date').val();
		exdate = $('#nep_expire_date').val();
		manudiv = $('#nep_manuf_date');
		exdiv = $('#nep_expire_date');
	}
	var life = $('#lifenum').val();
	var period = $('#period option:selected').val();
	if(life!='' && mdate!=''){
		var exp;
		var tdt = new Date(mdate);
		if(period=='days'){
			exp = tdt.addDays(life);
			exp = date_format(tdt);
		}
		if(period=='month'){
			exp = tdt.setMonth(life);
			exp = date_format(tdt);
		}
		if(period=='year'){
			var year = tdt.getFullYear();
			var mth = tdt.getMonth();
			var dy = tdt.getDate();
			exp = new Date(parseInt(year) + parseInt(life), mth, dy);
			exp = exp.toISOString().split('T')[0];
		}
		exdiv.val(exp);
	}else{
		if(mdate!='' && exdate!=''){
			var dt = new Date(Date.parse(exdate) - Date.parse(mdate));
			dt = dt/86400000;
			if(dt>0){
				if(period=='days'){
					$('#lifenum').val(dt);
				}
				if(period=='month'){
					dt = dt/30;
					dt = fixDecimal(dt, 1);
					$('#lifenum').val(dt);
				}
				if(period=='year'){
					dt = dt/365;
					dt = fixDecimal(dt, 1);
					$('#lifenum').val(dt);
				}
			}else{
				manudiv.addClass('is-invalid');
				exdiv.addClass('is-invalid');
			}
		}
	}
}

// end date mechnism==============================================

// product life mechanism ===========================

$(document).on('click', '.life_config', function(){
	var idstr = $(this).attr("data-id");
	var name = $('#itemlist'+idstr).val();
	$('.item_title').text(name);
	modal_trigger('LifeModal', 'life_batch_select_list');
	$('#life_selected_item').val(idstr);
	$('#LifeTable tbody').empty();
	life_col = [];

	// data refill ============
	var lifelist = $('.total_life'+idstr);
	if(lifelist.length > 0){
		lifelist.each(function(){
			var life_id = $(this).attr("data-life-id");
			var action = '<button class="btn btn-sm  bg-danger-transparent text-danger life_delete_data" data-id="'+life_id+'"><i class="ri-delete-bin-line"></i></button>';
			var batch_val = $('#life_batch_added'+life_id).val();
			var manuf = $('#manufacture_date_added'+life_id).val();
			var exp = $('#expiry_date_added'+life_id).val();
			var total_life = $('#total_life_added'+life_id).val();
			var period = $('#period_time_added'+life_id).val();
			$("#LifeTable tbody").append('<tr id="liferow'+life_id+'"><td>'+batch_val+'</td><td>'+manuf+'</td><td>'+exp+'</td><td>'+total_life+' '+period+'</td><td id="life_action_data'+life_id+'"></td></tr>');
			$('#life_action_data'+life_id).append(action);
			life_col.push(batch_val);
		});
	}
});

$('#life_use_batch').click(function(){
	var idstr = $('#config_selected_item').val();
	var batchlist = $('.batch_number'+idstr);
	if($('#life_use_batchcheck').prop("checked") == true){
		$('#life_batch_select_group').show();
		$('#life_batch_select_list').empty();
		$('#life_batch_select_list').append($('<option>', {
			value: '',
			text : '-- Choose option --'
		}));
		$('#life_batch_select_list').niceSelect('update');
		if(batchlist.length > 0){
			batchlist.each(function(){
				var thisval = $(this).val();
				if($.inArray(thisval, exist_batch_val)<0){
					$('#life_batch_select_list').append($('<option>', {
						value: thisval,
						text : thisval
					}));
				}
			});
			$('#life_batch_select_list').niceSelect('update');
		}
	}else{
		$('#life_batch_select_list').empty();
		$('#life_batch_select_list').niceSelect('update');
		$('#life_batch_select_group').hide();
	}
});

$('#add_life').click(function(){
	// adding prodct life ====
	add_life();
});

// product life deletion ====
$(document).on('click', '.life_delete_data', function(){
	var idstr = $(this).attr("data-id");
	var btch = $('#life_batch_added'+idstr).val();
	$('.life_thisrow'+idstr).remove();
	$('#liferow'+idstr).remove();
	life_col = jQuery.grep(life_col, function(value) {
		return value != btch;
	});
});

//===

function add_life(){
	var error = 0;
	var idstr = $('#config_selected_item').val();
	var batch_val = 'none';
	var batch_sel_id = '_none_'+idstr;
	var manuf = 'none';
	var exp = 'none';
	var go = 'yes';
	var total_life = $('#lifenum').val();
	if(total_life==''){
		error = 1;
		$('#lifenum').addClass('is-invalid');
	}
	var period = $('#period option:selected').val();
	if(period==''){
		error = 1;
		$('#period').addClass('is-invalid');
		$('#period').niceSelect('update');
	}
	if($('#life_use_batchcheck').prop("checked") == true){
		batch_val = $('#life_batch_select_list option:selected').val();
		if(batch_val==''){
			error = 1;
			$('#life_batch_select_list').addClass('is-invalid');
			$('#life_batch_select_list').niceSelect('update');
		}else{
			$('.batch_number'+idstr).each(function(){
				var val = $(this).val();
				if(val==batch_val){
					batch_sel_id = $(this).attr("data-batch-id");
				}
			});
		}
	}else{
		var check_go = check_qty_in_batch(idstr);
		if(check_go>0){
			go = 'yes';
		}else{
			go = 'no';
		}
	}
	if($('#manufdatecheck').prop("checked") == true){
		if($('#nepalidate_checkbox').prop("checked") == true){
			manuf = $('#nep_manuf_date').val();
			exp = $('#nep_expire_date').val();
			if(manuf==''){
				error = 1;
				$('#nep_manuf_date').addClass('is-invalid');
			}
			if(exp==''){
				error = 1;
				$('#nep_expire_date').addClass('is-invalid');
			}
		}else{
			manuf = $('#eng_manuf_date').val();
			exp = $('#eng_expire_date').val();
			if(manuf==''){
				error = 1;
				$('#eng_manuf_date').addClass('is-invalid');
			}
			if(exp==''){
				error = 1;
				$('#eng_expire_date').addClass('is-invalid');
			}
		}
	}
	var bch_check = batch_track(idstr, 'life_batch_number', go);
	if(bch_check==1){
		error = 1;
		var msg = 'Product life quota full for all the batches!';
		var div = 'none';
		var cls = 'none';
		error_toast(msg, div, cls);
	}
	if(go=='yes'){
		if(error==0){
			if($.inArray(batch_val, life_col)<0){
				life_count = life_count + 1;
				var life_id = 'life_'+idstr+''+life_count;
				var action = '<button class="btn btn-sm  bg-danger-transparent text-danger life_delete_data" data-id="'+life_id+'"><i class="ri-delete-bin-line"></i></button>';
				$(".hidden_inputs").append('<input type="hidden" name="life_batch_number'+batch_sel_id+'" class="item_data_col'+idstr+' life_thisrow'+life_id+' life_batch_number'+idstr+'" id="life_batch_added'+life_id+'" value="'+batch_val+'" data-id="'+idstr+'" data-life-id="'+life_id+'">');
				$(".hidden_inputs").append('<input type="hidden" name="manufacture_date'+batch_sel_id+'" class="item_data_col'+idstr+' life_thisrow'+life_id+' manufacture_date'+idstr+'" id="manufacture_date_added'+life_id+'" value="'+manuf+'" data-id="'+idstr+'" data-batch="'+batch_val+'">');
				$(".hidden_inputs").append('<input type="hidden" name="expiry_date'+batch_sel_id+'" class="item_data_col'+idstr+' life_thisrow'+life_id+' expiry_date'+idstr+'" id="expiry_date_added'+life_id+'" value="'+exp+'" data-id="'+idstr+'" data-batch="'+batch_val+'">');
				$(".hidden_inputs").append('<input type="hidden" name="total_life'+batch_sel_id+'" class="item_data_col'+idstr+' life_thisrow'+life_id+' total_life'+idstr+'" id="total_life_added'+life_id+'" value="'+total_life+'" data-id="'+idstr+'" data-batch="'+batch_val+'" data-count="'+life_count+'" data-life-id="'+life_id+'" data-manuf="'+manuf+'" data-exp="'+exp+'" data-period="'+period+'">');
				$(".hidden_inputs").append('<input type="hidden" name="period_time'+batch_sel_id+'" class="item_data_col'+idstr+' life_thisrow'+life_id+' period_time'+idstr+'" id="period_time_added'+life_id+'" value="'+period+'" data-id="'+idstr+'" data-batch="'+batch_val+'">');
				$("#LifeTable tbody").append('<tr id="liferow'+life_id+'"><td>'+batch_val+'</td><td>'+manuf+'</td><td>'+exp+'</td><td>'+total_life+' '+period+'</td><td id="life_action_data'+life_id+'"></td></tr>');
				$('#life_action_data'+life_id).append(action);
				$(".eng_dateinput").val('');
				$(".nep_dateinput").val('');
				$("#lifenum").val('');
				$('#period').val('days');
				$('#period').niceSelect('update');
				life_col.push(batch_val);
			}else{
				$('#life_batch_select_list').addClass('is-invalid');
				$('#life_batch_select_list').niceSelect('update');
			}
		}else{
			console.log('here error');
		}
	}else{
		$('#life_batch_div').addClass('div_error');
	}
}

// ==============================================================

//profit margin calculation==============================

function profit(invoke){
	var cost = $('#cost');
	var costval = cost.val();
	var sale = $('#sale');
	var saleval = sale.val();
	var profitamt = $('#marginamt');
	var profitamtval = profitamt.val();
	var profitper = $('#marginper');
	var profitperval = profitper.val();
	$("#cost, #sale, #marginamt, #marginper").removeClass('is-invalid');
	if(invoke == 'profitamt'){
		if(costval!='' && parseFloat(costval)>=0){
			var perval = (parseFloat(profitamtval)/parseFloat(costval))*100;
			var sval = parseFloat(costval) + parseFloat(profitamtval);
			sval = fixDecimal(sval, 2);
			perval = fixDecimal(perval, 2);
			profitper.val(perval);
			sale.val(sval);
		}else{
			cost.addClass('is-invalid');
		}
	}
	if(invoke == 'profitper'){
		if(costval!='' && parseFloat(costval)>=0){
			var perval = parseFloat(costval)*(parseFloat(profitperval)/100);
			var sval = parseFloat(costval) + parseFloat(perval);
			sval = fixDecimal(sval, 2);
			perval = fixDecimal(perval, 2);
			profitamt.val(perval);
			sale.val(sval);
		}else{
			cost.addClass('is-invalid');
		}
	}
	if(invoke=='cost'){
		if(profitamtval!=''){
			var sval = parseFloat(costval) + parseFloat(profitamtval);
			var perval = (parseFloat(profitamtval)/parseFloat(costval))*100;
			sval = fixDecimal(sval, 2);
			perval = fixDecimal(perval, 2);
			profitper.val(perval);
			sale.val(sval);
		}else if(profitperval!=''){
			var perval = parseFloat(costval)*(parseFloat(profitperval)/100);
			var sval = parseFloat(costval) + (perval);
			sval = fixDecimal(sval, 2);
			perval = fixDecimal(perval, 2);
			profitamt.val(perval);
			sale.val(sval);
		}else if(saleval!='' && parseFloat(saleval)>=0){
			var peramt = parseFloat(saleval)-parseFloat(costval);
			var perval = (parseFloat(peramt)/parseFloat(costval))*100;
			peramt = fixDecimal(peramt, 2);
			perval = fixDecimal(perval, 2);
			profitamt.val(peramt);
			profitper.val(perval);
		}else{
			sale.addClass('is-invalid');
			profitamt.addClass('is-invalid');
			profitper.addClass('is-invalid');
		}
	}

	if(invoke=='sale'){
		if(costval!='' && parseFloat(costval)>=0){
			var peramt = saleval-costval;
			var perval = (peramt/costval)*100;
			peramt = fixDecimal(peramt, 2);
			perval = fixDecimal(perval, 2);
			profitamt.val(peramt);
			profitper.val(perval);
		}
	}
}

$('#cost').on('keyup', function(){
	var val = $('#cost').val();
	if(val!='' && parseFloat(val)>=0){
		profit('cost');
	}else{
		$(this).addClass('is-invalid');
	}
});
$('#sale').on('keyup', function(){
	var val = $('#sale').val();
	if(val!='' && parseFloat(val)>=0){
		profit('sale');
	}else{
		$(this).addClass('is-invalid');
	}
});

$('#marginamt').on('keyup', function(){
	var val = $(this).val();
	if(val!=''){
		profit('profitamt');
	}
});
$('#marginper').on('keyup', function(){
	var val = $(this).val();
	if(val!=''){
		profit('profitper');
	}
});

//=======================================================

// pricing mechanism ===========================

$(document).on('click', '.price_config', function(){
	var idstr = $(this).attr("data-id");
	var name = $('#itemlist'+idstr).val();
	$('.item_title').text(name);
	modal_trigger('PriceModal', 'price_batch_select_list');
	$('#price_selected_item').val(idstr);
	$('#PriceTable tbody').empty();
	price_col = [];

	// data refill ============
	var costlist = $('.cost_price'+idstr);
	if(costlist.length > 0){
		costlist.each(function(){
			var price_id = $(this).attr("data-price-id");
			var action = '<button class="btn btn-sm  bg-danger-transparent text-danger price_delete_data" data-id="'+price_id+'"><i class="ri-delete-bin-line"></i></button>';
			var batch_val = $('#price_batch_added'+price_id).val();
			var cost = $('#cost_price_added'+price_id).val();
			var sale = $('#sale_price_added'+price_id).val();
			var profit_amt = $('#margin_amt_added'+price_id).val();
			var profit_per = $('#margin_per_added'+price_id).val();
			$("#PriceTable tbody").append('<tr id="pricerow'+price_id+'"><td>'+batch_val+'</td><td>'+cost+'</td><td>'+sale+'</td><td>'+profit_amt+' ('+profit_per+'%)</td><td id="price_action_data'+price_id+'"></td></tr>');
			$('#price_action_data'+price_id).append(action);
			price_col.push(batch_val);
		});
	}
});

$('#price_use_batch').click(function(){
	var idstr = $('#config_selected_item').val();
	var batchlist = $('.batch_number'+idstr);
	if($('#price_use_batchcheck').prop("checked") == true){
		$('#price_batch_select_group').show();
		$('#price_batch_select_list').empty();
		$('#price_batch_select_list').append($('<option>', {
			value: '',
			text : '-- Choose option --'
		}));
		$('#price_batch_select_list').niceSelect('update');
		if(batchlist.length > 0){
			batchlist.each(function(){
				var thisval = $(this).val();
				if($.inArray(thisval, exist_batch_val)<0){
					$('#price_batch_select_list').append($('<option>', {
						value: thisval,
						text : thisval
					}));
				}
			});
			$('#price_batch_select_list').niceSelect('update');
		}
	}else{
		$('#price_batch_select_list').empty();
		$('#price_batch_select_list').niceSelect('update');
		$('#price_batch_select_group').hide();
	}
});

$('#add_price').click(function(){
	// adding prodct price ====
	add_price();
});

$(document).on('click', '.price_delete_data', function(){
	var idstr = $(this).attr("data-id");
	var btch = $('#price_batch_added'+idstr).val();
	$('.price_thisrow'+idstr).remove();
	$('#pricerow'+idstr).remove();
	price_col = jQuery.grep(price_col, function(value) {
		return value != btch;
	});
});

function add_price(){
	var error = 0;
	var go = 'yes';
	var idstr = $('#config_selected_item').val();
	var batch_val = 'none';
	var batch_sel_id = '_none_'+idstr;
	var profit_amt = $('#marginamt').val();
	var profit_per = $('#marginper').val();
	if(profit_amt=='' || profit_amt<0 || profit_per=='' || profit_per<0){
		error = 1;
		$('#marginamt').addClass('is-invalid');
		$('#marginper').addClass('is-invalid');
	}
	var cost = $('#cost').val();
	if(cost=='' || cost<0){
		error = 1;
		$('#cost').addClass('is-invalid');
	}
	var sale = $('#sale').val();
	if(sale=='' || sale<0){
		error = 1;
		$('#sale').addClass('is-invalid');
	}
	if($('#price_use_batchcheck').prop("checked") == true){
		batch_val = $('#price_batch_select_list option:selected').val();
		if(batch_val==''){
			error = 1;
			$('#price_batch_select_list').addClass('is-invalid');
			$('#price_batch_select_list').niceSelect('update');
		}else{
			$('.batch_number'+idstr).each(function(){
				var val = $(this).val();
				if(val==batch_val){
					batch_sel_id = $(this).attr("data-batch-id");
				}
			});
		}
	}else{
		var check_go = check_qty_in_batch(idstr);
		if(check_go>0){
			go = 'yes';
		}else{
			go = 'no';
		}
	}
	var bch_check = batch_track(idstr, 'price_batch_number', go);
	if(bch_check==1){
		error = 1;
		var msg = 'Price quota full for all the batches!';
		var div = 'none';
		var cls = 'none';
		error_toast(msg, div, cls);
	}
	if(go=='yes'){
		if(error==0){
			if($.inArray(batch_val, price_col)<0){
				price_count = price_count + 1;
				var price_id = 'price_'+idstr+''+price_count;
				var action = '<button class="btn btn-sm  bg-danger-transparent text-danger price_delete_data" data-id="'+price_id+'"><i class="ri-delete-bin-line"></i></button>';
				$(".hidden_inputs").append('<input type="hidden" name="price_batch_number'+batch_sel_id+'" class="item_data_col'+idstr+' price_thisrow'+price_id+' price_batch_number'+idstr+'" id="price_batch_added'+price_id+'" value="'+batch_val+'" data-id="'+idstr+'" data-price-id="'+price_id+'">');
				$(".hidden_inputs").append('<input type="hidden" name="sale_price'+batch_sel_id+'" class="item_data_col'+idstr+' price_thisrow'+price_id+' sale_price'+idstr+'" id="sale_price_added'+price_id+'" value="'+sale+'" data-id="'+idstr+'" data-batch="'+batch_val+'">');
				$(".hidden_inputs").append('<input type="hidden" name="cost_price'+batch_sel_id+'" class="item_data_col'+idstr+' price_thisrow'+price_id+' cost_price'+idstr+'" id="cost_price_added'+price_id+'" value="'+cost+'" data-id="'+idstr+'" data-batch="'+batch_val+'" data-count="'+price_count+'" data-price-id="'+price_id+'">');
				$(".hidden_inputs").append('<input type="hidden" name="margin_amt'+batch_sel_id+'" class="item_data_col'+idstr+' price_thisrow'+price_id+' margin_amt'+idstr+'" id="margin_amt_added'+price_id+'" value="'+profit_amt+'" data-id="'+idstr+'" data-batch="'+batch_val+'">');
				$(".hidden_inputs").append('<input type="hidden" name="margin_per'+batch_sel_id+'" class="item_data_col'+idstr+' price_thisrow'+price_id+' margin_per'+idstr+'" id="margin_per_added'+price_id+'" value="'+profit_per+'" data-id="'+idstr+'" data-batch="'+batch_val+'">');
				$("#PriceTable tbody").append('<tr id="pricerow'+price_id+'"><td>'+batch_val+'</td><td>'+cost+'</td><td>'+sale+'</td><td>'+profit_amt+' ('+profit_per+'%)</td><td id="price_action_data'+price_id+'"></td></tr>');
				$('#price_action_data'+price_id).append(action);
				$("#cost").val(0);
				$("#sale").val(0);
				$("#marginamt").val(0);
				$("#marginper").val(0);
				price_col.push(batch_val);
			}else{
				$('#price_batch_select_list').addClass('is-invalid');
				$('#price_batch_select_list').niceSelect('update');
			}
		}
	}else{
		$('#price_batch_div').addClass('div_error');
	}
}

// ==============================================================

// batch tracker for product life and pricing =======================

function batch_track(idstr, cls, go){
	var mainBatchList = $('.batch_number'+idstr);
	var usedBatchList = $('.'+cls+''+idstr);
	var batch_length = mainBatchList.length;
	var used_batch_length = usedBatchList.length;
	var use = 0;
	if(used_batch_length>0){
		usedBatchList.each(function(){
			var val = $(this).val();
			if(val!='none'){
				use = use + 1;
			}
		});
		if(go=='no'){
			if(batch_length==use){
				return 1;
			}else{
				return 0;
			}
		}else{
			return 0;
		}
	}else{
		return 0;
	}

}

// =============================================================

// if batch has occupied all quantities 

function check_qty_in_batch(idstr){
	var AllBatchQtyList = $('.batch_number'+idstr);
	var total_qty = $('#quantity'+idstr).val();
	var hand_qty = total_qty;
	if(AllBatchQtyList.length>0){
		AllBatchQtyList.each(function(){
			var this_val = $(this).val();
			var this_qty = $(this).attr("data-qty");
			hand_qty = parseFloat(hand_qty) - parseFloat(this_qty);
		});
	}
	return hand_qty;
}

// =================================

// form submission validation ================================

$('#StockAdditionForm').on('submit', function(e){
	let form_error = 0;
	$('#spinner1').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");
	form_error = validate(formid, dataid);
	let entry_date = $('#entry_date').val();
	let english_entry_date = BStoADdate(entry_date);
	$('#english_entry_date').val(english_entry_date);

	var error2 = addition_calc_validation();

	var ItemCol = $('.total_item');
	if(ItemCol.length>0){
		var ival = item_validation(ItemCol);
		if(ival==1){
			form_error = 1;
		}
	}else{
		form_error = 1;
		$('#ItemCollection').addClass('div_error');
	}

	if(form_error==0 && error2==0){
		document.StockAdditionForm.submit();
	}else{
		$('#spinner1').removeClass('show_spin');
	}

	e.preventDefault();
});

function item_validation(ItemCol){
	let err = 0;
	ItemCol.each(function(){
		var idstr = $(this).val();
		var qty = $('#quantity'+idstr).val();
		var temp_qty = 0;
		var col_batch = [];
		var BatchList = $('.batch_number'+idstr);
		var SerialList = $('.serial_number'+idstr);
		var LifeList = $('.total_life'+idstr);
		var CostList = $('.cost_price'+idstr);
		if(BatchList.length>0){
			BatchList.each(function(){
				var val = $(this).val();
				var bqty = $(this).attr("data-qty");
				temp_qty = parseFloat(temp_qty) + parseFloat(bqty);
				col_batch.push(val);
			});
			if(temp_qty>qty){
				err = 1;
				var msg = 'Item total quantity does not match batches quantity. Check configuration!';
				var div = '#itemrow'+idstr;
				var cls = 'div_warning';
				error_toast(msg, div, cls);
			}else{
				temp_qty = 0;
			}
		}
		if(SerialList.length>0){
			SerialList.each(function(){
				var ser_batch = $(this).attr("data-batch");
				if(ser_batch!='none'){
					if($.inArray(ser_batch, col_batch)<0){
						err = 1;
						var msg = 'Selected batch number for serial number does not exists. Check configuration!';
						var div = '#itemrow'+idstr;
						var cls = 'div_warning';
						error_toast(msg, div, cls);
					}
				}
				temp_qty = parseFloat(temp_qty) + 1;
			});
			if(temp_qty>qty){
				err = 1;
				var msg = 'serial number count does not match total quantity for addition. Check configuration!';
				var div = '#itemrow'+idstr;
				var cls = 'div_warning';
				error_toast(msg, div, cls);
			}else{
				temp_qty = 0;
			}
		}
		if(LifeList.length>0){
			LifeList.each(function(){
				var lif_batch = $(this).attr("data-batch");
				if(lif_batch!='none'){
					if($.inArray(lif_batch, col_batch)<0){
						err = 1;
						var msg = 'Selected batch number for product life does not exists. Check configuration!';
						var div = '#itemrow'+idstr;
						var cls = 'div_warning';
						error_toast(msg, div, cls);
					}
				}
			});
		}
		if(CostList.length>0){
			CostList.each(function(){
				var cos_batch = $(this).attr("data-batch");
				if(cos_batch!='none'){
					if($.inArray(cos_batch, col_batch)<0){
						err = 1;
						var msg = 'Selected batch number for pricing does not exists. Check configuration!';
						var div = '#itemrow'+idstr;
						var cls = 'div_warning';
						error_toast(msg, div, cls);
					}
				}
			});
		}
	});
	return err;
}

// =============================================
