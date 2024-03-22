$(window).on('load', function(){
	if($('.msgon').length>0){
		var msgg = $('.msgon').first();
		var msg = msgg.val();
		if(msg=='add'){
			toastr.success("Record added successfully!");
		}else if(msg=='exists'){
			toastr.warning("Record with given detail already exists!");
		}else if(msg=='delete'){
			toastr.success("Record deleted successfully!");
		}else if(msg=='delete_all'){
			toastr.success("All records deleted successfully!");
		}else if(msg=='update'){
			toastr.success("Record updated successfully!");
		}else if(msg=='delete_error'){
			toastr.error("Cannot delete. Record used in some transaction or not found!");
		}else if(msg=='invalid'){
			toastr.error("Cannot proceed invalid request!");
		}else if(msg=='doc_delete_error'){
			toastr.error("Processing file. Cannot delete! Please try again later.");
		}else{
			toastr.error(msg);
		}
	}
});

//module redirection ====================
$('.master_module_btn').click(function(){
	if($(this).attr("data-api")!==undefined){
		let url = $(this).attr("data-url");
		$('#module_pass_api_url').val(url);
		document.GrantAccessAPI.submit();
	}else{
		let url = $(this).attr("data-url");
		$('#module_pass_url').val(url);
		document.GrantAccess.submit();
	}
});

$('.dashboard__box').click(function(){
	let url = $(this).attr("data-url");
	$('#module_pass_url').val(url);
	document.GrantAccess.submit();
});


if($('.nepali_date').length>0){
	$( ".nepali_date" ).nepaliDatePicker({
		dateFormat: 'YYYY-MM-DD',
		disableDaysAfter: 0,
		readOnlyInput: true,
	});
}

if($('.nepali_date_free').length>0){
	$( ".nepali_date_free" ).nepaliDatePicker({
		dateFormat: 'YYYY-MM-DD',
		readOnlyInput: true,
	});
}

if($('.nepali_date_future').length>0){
	$( ".nepali_date_future" ).nepaliDatePicker({
		dateFormat: 'YYYY-MM-DD',
		disableDaysBefore: 0,
		readOnlyInput: true,
	});
}

// disable scroll on type=number=========================

$(document).on("wheel", "input[type=number]", function (e) {
    $(this).blur();
});

//=========================================================

// fixed to decimal points=======================================

function fixDecimal(num, val){
	var res = parseFloat(num).toFixed(val);
	return res;
}

//=============================================================



// modal trigger on item select ====================

function modal_trigger(modalid, inputid){
	$('#'+modalid).modal('show');
	$("#"+modalid).on('shown.bs.modal', function () {
		$("#"+modalid+" input#"+inputid).focus();
	});
}

$(".inputs").on('focus', function(){
	$(this).removeClass('is-invalid');
});
$(".inputs").on('click', function(){
	$(this).removeClass('is-invalid');
});
$(document).on('click', '.inputs', function(){
	$(this).removeClass('is-invalid');
});
$(document).on('focus', '.inputs', function(){
	$(this).removeClass('is-invalid');
});
$(".input_div").on('click', function(){
	$(this).removeClass('div_error');
});
$(".select2").on('change', function(){
	if($(this).attr("data-select")!==undefined){
		var data = $(this).attr("data-select");
		var idstr = $(this).attr("id");
		if(data=='true'){
			$('#'+idstr).data('select2').$selection.removeClass('invalid-select');
		}
	}
});
$(".nice__select").on('change', function(){
	$(this).removeClass('is-invalid');
	$(this).niceSelect('update');
});

if($('.form__title').length>0){
	let astric = ' <span class="astric">*</span>';
	$('.form__title').each(function(){
		if($(this).attr("data-require") !== undefined){
			if($(this).attr("data-require") == 'required'){
				$(this).append(astric);
			}
		}
	});
}

// add form atrribute to form elements ============================

if($("form").length>0){
	$("form").each(function(){
		var thisattr = $(this).attr("data-form");
		var idstr = $(this).attr("id");
		$('#'+idstr).find("input[type!=hidden], textarea, select").attr("data-form", thisattr);
	});
	$(".select2").attr("data-select", "true");
}

//===========================================================

// table row link trigger ========================
var actionMaster = $('.action_master_banner');
var moduleMaster = $('.module_switch');
if($('.master_inputs').length>0){
	$('.master_inputs').each(function(){
		let val = $(this).val();
		let idstr = $(this).attr("data-id");
		$('#'+idstr).val(val);
	});
}
$(document).on('click', '.trow', function(e){
	if($(e.target).is("span, label, input")){
		return;
	}else{
		var link = $(this).attr("data-href");
    	window.location = link;
	}
});
$('.allRowCheck').on('click', function(){
	let idstr = $(this).attr("data-id");
	let t_type = $(this).attr("data-type");
	if($(this).prop("checked") == true){
		$('.'+idstr+'List').prop("checked", true);
		moduleMaster.hide();
		actionMaster.show();
		$('.master_same_btn').hide();
		if(t_type=='transaction'){
			if($(this).attr("data-cancel")!==undefined){
				$('#master_cancel').hide();
			}else{
				$('#master_cancel').show();
			}
		}else{
			if($(this).attr("data-inactive")!==undefined){
				$('#master_active').show();
			}else{
				$('#master_inactive').show();
			}
		}
		master_check_count();
		master_values_assign(idstr);
	}else{
		$('.'+idstr+'List').prop("checked", false);
		master_values_decline(idstr);
		master_check_count();
		actionMaster.hide();
		moduleMaster.show();
	}
});
$('.allRowCheckList').click(function(){
	let t_type = $(this).attr("data-type");
	let recid = $(this).attr("data-id");
	if($(this).prop("checked") == true){
		moduleMaster.hide();
		actionMaster.show();
		$('.master_same_btn').hide();
		if(t_type=='transaction'){
			if($(this).attr("data-cancel")!==undefined){
				$('#master_cancel').hide();
			}else{
				$('#master_cancel').show();
			}
		}else{
			if($(this).attr("data-inactive")!==undefined){
				$('#master_active').show();
			}else{
				$('#master_inactive').show();
			}
		}
		master_check_count();
		$('.master_hiddens').append('<input type="hidden" class="record_ids" name="record_ids" id="recid'+recid+'" value="'+recid+'">');
	}else{
		$('.allRowCheck').prop('checked', false);
		$('#recid'+recid).remove();
		master_check_count();
		master_check_count_hide();
	}
});
$('#clear_master_selection').click(function(){
	$('.allRowCheckList').prop("checked", false);
	$('.allRowCheck').prop("checked", false);
	actionMaster.hide();
	moduleMaster.show();
});
function master_check_count(){
	let rowCheckList = $('.allRowCheckList');
	let count = rowCheckList.filter(':checked').length;
	$('#master_count_batch').text(count);
}
function master_check_count_hide(){
	let rowCheckList = $('.allRowCheckList');
	let count = rowCheckList.filter(':checked').length;
	if(count == 0){
		actionMaster.hide();
		moduleMaster.show();
	}
}
function master_values_assign(checkclass){
	$('.'+checkclass+'List').each(function(){
		if($(this).prop("checked") == true){
			let recid = $(this).attr("data-id");
			$('.master_hiddens').append('<input type="hidden" class="record_ids" name="record_ids" id="recid'+recid+'" value="'+recid+'">');
		}
	})
}
function master_values_decline(checkclass){
	$('.master_inputs').each(function(){
		let idstr = $(this).attr("data-id");
		$('#'+idstr).val('');
	});
	$('.'+checkclass+'List').each(function(){
		if($(this).prop("checked") == false){
			let recid = $(this).attr("data-id");
			$('#recid'+recid).remove();
		}
	})
}

// master form submittion ===============
$('.master_same_btn').on('click', function(){
	let idstr = $(this).attr("data-id");
	$('#master_method').val(idstr);
	if($('#master_sub_url').val()!=''){
		master_form();
	}else{
		error_toast('Cannot proceed! Please try again later', 'none', 'none');
	}
});

function master_form(){
	let merror = 0;
	$('#master_spin').addClass('show_spin');
	let sub_url = $('#master_sub_url').val();
	$('#MasterForm').attr("action", sub_url);
	if($('.record_ids').length==0){
		merror = 1;
		error_toast('No item selected!', 'none', 'none');
	}
	if($('#master_method').val()==''){
		merror = 1;
		error_toast('Cannot proceed. Please try agian later!', 'none', 'none');
	}
	if(merror==0){
		document.MasterForm.submit();
	}else{
		$('#master_spin').removeClass('show_spin');
	}
}

//======================

// modal trigger event==========================

$(".modal").on('hide.bs.modal', function () {
	// $("form").find("input[type!=hidden], textarea, select").filter(':visible:first').focus();
	$('.spin').removeClass('show_spin');
});

//=================================

function name_url(data){
    var mat_url = data.toLowerCase();
    var result = mat_url.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '');
    return result;
  }

function validate(formid, dataid){
	var error = 0;
	var selectfield = [];
	var required = [];
	var non_required = [];
	$("#"+formid+" .inputs").each(function(){
		var formdata = $(this).attr("data-form");
		if(formdata==dataid){
			var idstr = $(this).attr("id");
			var require = '';
			var val = '';
			if($(this).attr("data-require")!==undefined){
				require = $(this).attr("data-require");
			}else{
				non_required.push(idstr);
			}
			if($(this).attr("data-select")!==undefined){
				if($(this).attr("data-select")=='true'){
					selectfield.push(idstr);
				}
			}
			if(require=='required'){
				required.push(idstr);
			}
			if($.inArray(idstr, required)>=0){
				if($.inArray(idstr, selectfield)>=0){
					val = $('#'+idstr+' option:selected').val();
					if(val!==undefined && val!='' && val!=null){
						val = val.replace(/ /g, '');
					}
					if(val==''){
						error = 1;
						$('#'+idstr).data('select2').$selection.addClass('invalid-select');
					}
				}else{
					val = $('#'+idstr).val();
					if(val!==undefined && val!='' && val!=null){
						val = val.replace(/ /g, '');
					}
					if(val==''){
						error = 1;
						$('#'+idstr).addClass("is-invalid");
					}else{
						let data = val;
						let length = 100;
						if(idstr=='narration'){
							length = 500;
						}
						let title = $(this).closest('.form-group').find('label').text();
						title = title.replace('*', '').toUpperCase();
						if(!has_valid_length(idstr, data, length, title)){
							error = 1;
						}
					}
				}
			}else if($.inArray(idstr, non_required)>=0){
				if(!$.inArray(idstr, selectfield)>=0){
					val = $('#'+idstr).val();
					if(val!==undefined && val!='' && val!=null){
						val = val.replace(/ /g, '');
					}
					if(val!=''){
						let data = val;
						let length = 100;
						if(idstr=='narration'){
							length = 500;
						}
						let title = $(this).closest('.form-group').find('label').text();
						title = title.replace('*', '').toUpperCase();
						if(!has_valid_length(idstr, data, length, title)){
							error = 1;
						}
					}
				}
			}
		}
	});

	return error;
}

//===================================================

//=== form refill function =====================================

function refill(){
	$('.default').each(function(){
		var idstr = $(this).attr("data-id");
		var val = $(this).val();
		if(val!='' && val!=null){
			if($('#'+idstr).attr("data-select")!==undefined){
				if($('#'+idstr).attr("data-nice-select")!==undefined){
					$('#'+idstr).val(val);
					$('#'+idstr).niceSelect('update');
				}else{
					$('#'+idstr).val(val).trigger('change');
				}
			}else if($('#'+idstr).attr("data-check")!==undefined){
				var checkid = $('#'+idstr).attr("data-check");
				if(val=='1' || val=='True'){
					$('#'+checkid).prop("checked", true);
				}else{
					$('#'+checkid).prop("checked", false);
				}
				$('#'+idstr).val(val);
			}else{
				if($('#'+idstr).attr("type")!='file'){
					$('#'+idstr).val(val);
				}
			}
		}
	});
}

//====================================================

// ===conditional statement function=====================================

function between(x, min, max) {
	return x >= min && x <= max;
}

//==============end================================================================


// batch/serial config accordion show/hide ====

function accordion_hide(method){
	if(method == 'batch'){
		$('#batch_accordion_container').hide();
	}
	if(method == 'serial'){
		$('#serial_accordion_container').hide();
	}
	if(method == 'life'){
		$('#life_accordion_container').hide();
	}
	if(method == 'price'){
		$('#price_accordion_container').hide();
	}
}

function accordion_show(method){
	if(method == 'batch'){
		$('#batch_accordion_container').show();
	}
	if(method == 'serial'){
		$('#serial_accordion_container').show();
	}
	if(method == 'life'){
		$('#life_accordion_container').show();
	}
	if(method == 'price'){
		$('#price_accordion_container').show();
	}
}

// error toaster ===================

function error_toast(msg, div, cls){
	toastr.error(msg);
	if(div!='none'){
		$(div).addClass(cls);
	}
}

// ajax call for base modal addition functionality ============
function modal_hide_trigger(modalid, formid){
	$("#"+formid)[0].reset();
	$("#"+formid+" select").val('').trigger('change');
    $('#'+modalid).modal('hide');
}

$('#baseStockSubCatBtn').click(function(){
	let cat = $('#stock_category_id').val();
	if(cat==''){
		$('#base_cat_name_id').val('').trigger('change');
		$('#stock_category_id').data('select2').$selection.addClass('invalid-select');
	}else{
		$('#base_cat_name_id').val(cat).trigger('change');
	}
});
// base supplier addition ====
$('#BaseSupplierForm').on('submit', function(e){
	$('#basespinner1').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");
	var name = $('#base_sup_name').val();
	var url = name_url(name);
	$('#base_sup_url').val(url);

	var error = validate(formid, dataid);
	
	if($('#base_register_check').prop("checked") == true){
		$('#base_register_vat').val(1);
	}
	if(error==0){
		let spin = $('#basespinner1');
		ajax_supplier_cal(spin);
	}else{
		$('#basespinner1').removeClass('show_spin');
	}
	e.preventDefault();
});

$('#BaseCustomerForm').on('submit', function(e){
	$('#basespinner6').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");

	var error = validate(formid, dataid);
	
	if(error==0){
		let spin = $('#basespinner6');
		ajax_customer_cal(spin);
	}else{
		$('#basespinner6').removeClass('show_spin');
	}
	e.preventDefault();
});

$('#BaseStockCatgoryForm').on('submit', function(e){
	$('#basespinner2').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");
	var name = $('#base_item_cat_name').val();
	var url = name_url(name);
	$('#base_item_cat_url').val(url);

	var error = validate(formid, dataid);

	if(error==0){
		let spin = $('#basespinner2');
		ajax_stock_category_cal(spin);
	}else{
		$('#basespinner2').removeClass('show_spin');
	}
	e.preventDefault();
});

$('#BaseStockSubCatgoryForm').on('submit', function(e){
	$('#basespinner3').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");
	var name = $('#base_sub_cat_name').val();
	var url = name_url(name);
	$('#base_sub_cat_url').val(url);

	var error = validate(formid, dataid);

	if(error==0){
		let spin = $('#basespinner3');
		ajax_stock_subcategory_cal(spin);
	}else{
		$('#basespinner3').removeClass('show_spin');
	}
	e.preventDefault();
});

$('#BaseUomForm').on('submit', function(e){
	$('#basespinner4').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");

	var error = validate(formid, dataid);

	if(error==0){
		let spin = $('#basespinner4');
		ajax_uom_cal(spin);
	}else{
		$('#basespinner4').removeClass('show_spin');
	}
	e.preventDefault();
});

$('#BaseSupplierCatgoryForm').on('submit', function(e){
	$('#basespinner5').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");
	var name = $('#base_sup_cat_name').val();
	var url = name_url(name);
	$('#base_sup_cat_url').val(url);

	var error = validate(formid, dataid);

	if(error==0){
		let spin = $('#basespinner5');
		ajax_supplier_category_cal(spin);
	}else{
		$('#basespinner5').removeClass('show_spin');
	}
	e.preventDefault();
});

$('#BaseCustomerCatgoryForm').on('submit', function(e){
	$('#basespinner7').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");
	var name = $('#base_cus_cat_name').val();
	var url = name_url(name);
	$('#base_cus_cat_url').val(url);

	var error = validate(formid, dataid);

	if(error==0){
		let spin = $('#basespinner7');
		ajax_customer_category_cal(spin);
	}else{
		$('#basespinner7').removeClass('show_spin');
	}
	e.preventDefault();
});

// fixed asset ============================

$('#baseAssetSubCatBtn').click(function(){
	let cat = $('#asset_category_id').val();
	if(cat==''){
		$('#base_asset_cat_name_id').val('').trigger('change');
		$('#asset_category_id').data('select2').$selection.addClass('invalid-select');
	}else{
		$('#base_asset_cat_name_id').val(cat).trigger('change');
	}
});

$('#BaseAssetCatgoryForm').on('submit', function(e){
	$('#basespinner8').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");

	var error = validate(formid, dataid);

	if(error==0){
		let spin = $('#basespinner8');
		ajax_asset_category_cal(spin);
	}else{
		$('#basespinner8').removeClass('show_spin');
	}
	e.preventDefault();
});

$('#BaseAssetSubCatgoryForm').on('submit', function(e){
	$('#basespinner9').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");

	var error = validate(formid, dataid);

	if(error==0){
		let spin = $('#basespinner9');
		ajax_asset_subcategory_cal(spin);
	}else{
		$('#basespinner9').removeClass('show_spin');
	}
	e.preventDefault();
});

function ajax_asset_category_cal(spin){
    var formData = {
		'name': $('#base_asset_cat_name').val(),
		'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
	}
    $.ajax({
		type: 'POST',
		url: '/base-asset-category-add/',
		data: formData,
		encode: true
	})
	.done(function(response) {
		if(response){
			if(response["record"] == 'error'){
				spin.removeClass('show_spin');
				error_toast('Cannot proceed! Please try again later', 'none', 'none');
			}else{
				let ins_id = '';
				let ins_name = '';
				$.each(response["record"], function(key, value) {
					$.each(value, function(key, value) {
						if(key=='id'){
							ins_id = value;
						}
						if(key=='name'){
							ins_name = value;
						}
					});
					$('#asset_category_id').append($('<option>', {
						value: ins_id,
						text : ins_name
					}));
					$('#asset_category_id').val(ins_id).trigger('change');
					$('#base_asset_cat_name_id').append($('<option>', {
						value: ins_id,
						text : ins_name
					}));
				});
				spin.removeClass('show_spin');
				modal_hide_trigger('BaseAssetCategoryCreateModal', 'BaseAssetCatgoryForm');
			}
		}else{
			spin.removeClass('show_spin');
			error_toast('Cannot proceed! Please try again later', 'none', 'none');
		}
	});
}

function ajax_asset_subcategory_cal(spin){
    var formData = {
		'parent': $('#base_asset_cat_name_id').val(),
		'name': $('#base_asset_sub_cat_name').val(),
		'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
	}
    $.ajax({
		type: 'POST',
		url: '/base-asset-category-add/',
		data: formData,
		encode: true
	})
	.done(function(response) {
		if(response){
			if(response['record'] == 'error'){
				spin.removeClass('show_spin');
				error_toast('Cannot proceed! Please try again later', 'none', 'none');
			}else{
				let ins_id = '';
				let ins_name = '';
				$.each(response["record"], function(key, value) {
					$.each(value, function(key, value) {
						if(key=='id'){
							ins_id = value;
						}
						if(key=='name'){
							ins_name = value;
						}
					});
					$('#asset_subcategory_id').append($('<option>', {
						value: ins_id,
						text : ins_name
					}));
					$('#asset_subcategory_id').val(ins_id).trigger('change');
				});
				spin.removeClass('show_spin');
				modal_hide_trigger('BaseAssetSubCategoryCreateModal', 'BaseAssetSubCatgoryForm');
			}
		}else{
			spin.removeClass('show_spin');
			error_toast('Cannot proceed! Please try again later', 'none', 'none');
		}
	});
}

// ==============================================

var newitem = 100;
$('#base_add_new_item').click(function(){
	let formid = $(this).attr("data-form-id");
	let dataid = $('#'+formid).attr("data-form");

	let item_error = validate(formid, dataid);
	if(item_error == 0){
		newitem = newitem + 1;
		let idstr = 'new_itm'+newitem;
		let qty = 'none';
		let rate = 'none';
		let vat = 'none';
		if ($('#base_new_quantity').length > 0){
		 	qty = $('#base_new_quantity').val();
		}
		if ($('#base_new_rate').length > 0){
			rate = $('#base_new_rate').val();
	   	}
	   	if ($('#base_new_vat').length > 0){
			vat = $('#base_new_vat').val();
   		}
		new_item_qty_add(idstr, qty, rate, vat);
	}
});

function new_item_qty_add(idstr, qty, rate, vat){
	if(idstr!=''){
		if($('#item_added'+idstr).length===0){
			$('.no-item-row').hide();
			add = 0;
			// adding items ===
			add_new_items(idstr, qty, rate, vat);
			$('#BaseItemCreateForm')[0].reset();
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
		$("#BaseItemCreateForm .inputs").removeClass('is-invalid');
		$('#BaseItemCreateModal').modal('hide');
	}else{
		let msg = 'item is not selected to proceed!';
		error_toast(msg, 'none', 'none');
	}
}

function add_new_items(idstr, qty, rate, vat){
	var new_code = $('#base_new_item_code').val();
	var new_name = $('#base_new_item_name').val();
	var new_uom = $('#uom option:selected').text();
	// inner html ====
	if($('#base_new_calculation').length>0){
		$("#InvoiceTable tbody").append('<tr id="itemrow'+idstr+'"><td id="rowcount'+idstr+'"></td><td>'+new_code+'</td><td>'+new_name+' <span class="badge badge-secondary">new</span></td></tr>');
	}else{
		$("#ItemTable tbody").append('<tr id="itemrow'+idstr+'"><td id="rowcount'+idstr+'"></td><td>'+new_code+'</td><td>'+new_name+' <span class="badge badge-secondary">new</span></td></tr>');
	}
	
	if(qty!='none'){
		let qty_group = '<div class="input-group"><input type="number" value="'+qty+'" name="new_quantity'+idstr+'" step=".01" class="form-control inputs" id="quantity'+idstr+'" autocomplete="off"><div class="input-group-append"><span class="input-group-text" class="qtytext">'+new_uom+'</span></div></div>';
		$('#itemrow'+idstr).append('<td id="qty_data'+idstr+'"></td>');
		$('#qty_data'+idstr).append(qty_group);
	}
	if(rate!='none'){
		let rate_group = '<div class="input-group"><div class="input-group-prepend"><span class="input-group-text" class="currency_text">Rs</span></div><input type="number" value="'+rate+'" name="new_rate'+idstr+'" step=".01" class="form-control inputs" id="rate'+idstr+'" autocomplete="off"></div>';
		$('#itemrow'+idstr).append('<td id="rate_data'+idstr+'"></td>');
		$('#rate_data'+idstr).append(rate_group);
	}
	if(qty!='none' && rate!='none'){
		let amt_group = '<div class="input-group"><div class="input-group-prepend"><span class="input-group-text currency_text">Rs</span></div><input type="number" value="" name="new_amount'+idstr+'" step=".01" class="form-control inputs" id="tot'+idstr+'" autocomplete="off" readonly></div>';
		$('#itemrow'+idstr).append('<td id="amt_data'+idstr+'"></td>');
		$('#amt_data'+idstr).append(amt_group);
	}
	if(vat!='none'){
		let vat_group = '<div class="input-group"><div class="input-group-prepend"><span class="input-group-text currency_text">Rs</span></div><input type="number" value="'+vat+'" name="new_vat'+idstr+'" step=".01" class="form-control inputs" id="vat'+idstr+'" autocomplete="off"></div>';
		$('#itemrow'+idstr).append('<td id="vat_data'+idstr+'"></td>');
		$('#vat_data'+idstr).append(vat_group);
	}
	if($('#base_new_calculation').length>0){
		let total_group = '<div class="input-group"><div class="input-group-prepend"><span class="input-group-text currency_text">Rs</span></div><input type="number" value="" name="new_item_total'+idstr+'" step=".01" class="form-control inputs" id="item_total'+idstr+'" autocomplete="off" readonly></div>';
		$('#itemrow'+idstr).append('<td id="total_data'+idstr+'"></td>');
		$('#total_data'+idstr).append(total_group);
	}
	$('#itemrow'+idstr).append('<td id="action_data'+idstr+'"></td>');
	var action = '<button type="button" class="btn btn-sm  bg-info-transparent text-info view_data" data-id="'+idstr+'"><i class="ri-eye-line"></i></button> <button type="button" class="btn btn-sm  bg-danger-transparent text-danger delete_data" data-id="'+idstr+'"><i class="ri-delete-bin-line"></i></button>';
	$('#action_data'+idstr).append(action);

	$(".hidden_inputs").append('<input type="hidden" name="new_item_name'+idstr+'" class="new_det'+idstr+'" id="new_item_name'+idstr+'" value="'+new_name+'">');
	$(".hidden_inputs").append('<input type="hidden" name="new_item_code'+idstr+'" class="new_det'+idstr+'" id="new_item_code'+idstr+'" value="'+new_code+'">');
	$(".hidden_inputs").append('<input type="hidden" name="new_item_uom'+idstr+'" class="new_det'+idstr+'" id="new_item_uom'+idstr+'" value="'+new_uom+'">');
	$(".hidden_inputs").append('<input type="hidden" name="new_total_item" class="total_item" id="item_added'+idstr+'" value="'+idstr+'">');

	if($('#base_new_calculation').length>0){
		custom_invoice();
	}
}

function ajax_supplier_cal(spin){
	var formData = {
		'name': $('#base_sup_name').val(),
		'country': $('#base_country').val(),
		'address': $('#base_address').val(),
		'contact': $('#base_contact').val(),
		'email': $('#base_email').val(),
		'pan_number': $('#base_pan_number').val(),
		'suppliers_category': $('#base_suppliers_category_id').val(),
		'register_vat': $('#base_register_vat').val(),
		'supplier_type': $('#base_supplier_type').val(),
		'gl_mapping': $('#base_supplier_gl_mapping_id').val(),
		'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
	}
	$.ajax({
		type: 'POST',
		url: '/base-supplier-add/',
		data: formData,
		encode: true,
		success: function(response) {
			if(response){
				if(response.record){
					let record = response.record;
					$.each(record, function(key, value) {

						let ins_id = value.id;
						let ins_name = value.name;

						$('#supplier_name_id').append($('<option>', {
							value: ins_id,
							text : ins_name
						}));
						$('#supplier_name_id').val(ins_id).trigger('change');
					});
					spin.removeClass('show_spin');
					modal_hide_trigger('BaseSupplierCreateModal', 'BaseSupplierForm');	
				}
				else if(response.error){
					spin.removeClass('show_spin');
					error_toast(response.error, 'none', 'none');
				}
				else{
					spin.removeClass('show_spin');
					error_toast('Cannot proceed invalid request!', 'none', 'none');
				}
			}
			else{
				spin.removeClass('show_spin');
				error_toast('Cannot proceed invalid request!', 'none', 'none');
			}
		},
		error: function(response){
			spin.removeClass('show_spin');
			error_toast('Cannot proceed! Server Error', 'none', 'none');
		}
		
	})
}

function ajax_customer_cal(spin){
	var formData = {
		'full_name': $('#base_cus_name').val(),
		'address': $('#base_cus_address').val(),
		'contact': $('#base_cus_contact').val(),
		'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
	}
	$.ajax({
		type: 'POST',
		url: '/base-customer-add/',
		data: formData,
		encode: true,
		success: function(response) {
			if(response){
				if(response.record){
					let record = response.record;
					$.each(record, function(key, value) {

						let ins_id = value.id;
						let ins_name = value.name;

						$('#customer_id').append($('<option>', {
							value: ins_id,
							text : ins_name
						}));
						$('#customer_id').val(ins_id).trigger('change');
					});
					spin.removeClass('show_spin');
					modal_hide_trigger('BaseCustomerCreateModal', 'BaseCustomerForm');	
				}
				else if(response.error){
					spin.removeClass('show_spin');
					error_toast(response.error, 'none', 'none');
				}
				else{
					spin.removeClass('show_spin');
					error_toast('Cannot proceed invalid request!', 'none', 'none');
				}
			}
			else{
				spin.removeClass('show_spin');
				error_toast('Cannot proceed invalid request!', 'none', 'none');
			}
		},
		error: function(response){
			spin.removeClass('show_spin');
			error_toast('Cannot proceed! Server Error', 'none', 'none');
		}
		
	})
}

function ajax_stock_category_cal(spin){
	var formData = {
		'name': $('#base_item_cat_name').val(),
		'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
	}
	$.ajax({
		type: 'POST',
		url: '/base-stock-category-add/',
		data: formData,
		encode: true,
		success: function(response) {
			if(response){
				if(response.record){
					let record = response.record;
					$.each(record, function(key, value) {

						let ins_id = value.id;
						let ins_name = value.name;

						$('#stock_category_id').append($('<option>', {
							value: ins_id,
							text : ins_name
						}));
						$('#stock_category_id').val(ins_id).trigger('change');
						$('#base_cat_name_id').append($('<option>', {
							value: ins_id,
							text : ins_name
						}));
					});
					spin.removeClass('show_spin');
					modal_hide_trigger('BaseStockCategoryCreateModal', 'BaseStockCatgoryForm');	
				}
				else if(response.error){
					spin.removeClass('show_spin');
					error_toast(response.error, 'none', 'none');
				}
				else{
					spin.removeClass('show_spin');
					error_toast('Cannot proceed invalid request!', 'none', 'none');
				}
			}
			else{
				spin.removeClass('show_spin');
				error_toast('Cannot proceed invalid request!', 'none', 'none');
			}
		},
		error: function(response){
			spin.removeClass('show_spin');
			error_toast('Cannot proceed! Server Error', 'none', 'none');
		}
		
	})
}

function ajax_stock_subcategory_cal(spin){
	var formData = {
		'parent': $('#base_cat_name_id').val(),
		'name': $('#base_sub_cat_name').val(),
		'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
	}
	$.ajax({
		type: 'POST',
		url: '/base-stock-category-add/',
		data: formData,
		encode: true,
		success: function(response) {
			if(response){
				if(response.record){
					let record = response.record;
					$.each(record, function(key, value) {

						let ins_id = value.id;
						let ins_name = value.name;

						$('#stock_subcategory_id').append($('<option>', {
							value: ins_id,
							text : ins_name
						}));
						$('#stock_subcategory_id').val(ins_id).trigger('change');
					});
					spin.removeClass('show_spin');
					modal_hide_trigger('BaseStockSubCategoryCreateModal', 'BaseStockSubCatgoryForm');	
				}
				else if(response.error){
					spin.removeClass('show_spin');
					error_toast(response.error, 'none', 'none');
				}
				else{
					spin.removeClass('show_spin');
					error_toast('Cannot proceed invalid request!', 'none', 'none');
				}
			}
			else{
				spin.removeClass('show_spin');
				error_toast('Cannot proceed invalid request!', 'none', 'none');
			}
		},
		error: function(response){
			spin.removeClass('show_spin');
			error_toast('Cannot proceed! Server Error', 'none', 'none');
		}
		
	})
}

function ajax_uom_cal(spin){
	var formData = {
		'uom': $('#base_uom').val(),
		'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
	}
	$.ajax({
		type: 'POST',
		url: '/base-uom-add/',
		data: formData,
		encode: true,
		success: function(response) {
			if(response){
				if(response.record){
					let record = response.record;
					$.each(record, function(key, value) {

						let ins_id = value.id;
						let ins_name = value.name;

						$('#uom').append($('<option>', {
							value: ins_id,
							text : ins_name
						}));
						$('#uom').val(ins_id).trigger('change');
						if($('.base_qtytext').length>0){
							$('.base_qtytext').text(ins_name);
						}
					});
					spin.removeClass('show_spin');
					modal_hide_trigger('BaseUomCreateModal', 'BaseUomForm');	
				}
				else if(response.error){
					spin.removeClass('show_spin');
					error_toast(response.error, 'none', 'none');
				}
				else{
					spin.removeClass('show_spin');
					error_toast('Cannot proceed invalid request!', 'none', 'none');
				}
			}
			else{
				spin.removeClass('show_spin');
				error_toast('Cannot proceed invalid request!', 'none', 'none');
			}
		},
		error: function(response){
			spin.removeClass('show_spin');
			error_toast('Cannot proceed! Server Error', 'none', 'none');
		}
		
	})
}

function ajax_supplier_category_cal(spin){
	var formData = {
		'name': $('#base_sup_cat_name').val(),
		'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
	}
	$.ajax({
		type: 'POST',
		url: '/base-supplier-category-add/',
		data: formData,
		encode: true,
		success: function(response) {
			if(response){
				if(response.record){
					let record = response.record;
					$.each(record, function(key, value) {

						let ins_id = value.id;
						let ins_name = value.name;

						$('#base_suppliers_category_id').append($('<option>', {
							value: ins_id,
							text : ins_name
						}));
						$('#base_suppliers_category_id').val(ins_id).trigger('change');
						if($('#suppliers_category_id').length>0){
							$('#suppliers_category_id').append($('<option>', {
								value: ins_id,
								text : ins_name
							}));
							$('#suppliers_category_id').val(ins_id).trigger('change');
						}
					});
					spin.removeClass('show_spin');
					modal_hide_trigger('BaseSupplierCategoryCreateModal', 'BaseSupplierCatgoryForm');	
				}
				else if(response.error){
					spin.removeClass('show_spin');
					error_toast(response.error, 'none', 'none');
				}
				else{
					spin.removeClass('show_spin');
					error_toast('Cannot proceed invalid request!', 'none', 'none');
				}
			}
			else{
				spin.removeClass('show_spin');
				error_toast('Cannot proceed invalid request!', 'none', 'none');
			}
		},
		error: function(response){
			spin.removeClass('show_spin');
			error_toast('Cannot proceed! Server Error', 'none', 'none');
		}
		
	})
}

function ajax_customer_category_cal(spin){
	var formData = {
		'name': $('#base_cus_cat_name').val(),
		'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
	}
	$.ajax({
		type: 'POST',
		url: '/base-customer-category-add/',
		data: formData,
		encode: true,
		success: function(response) {
			if(response){
				if(response.record){
					let record = response.record;
					$.each(record, function(key, value) {

						let ins_id = value.id;
						let ins_name = value.name;

						$('#base_customer_category_id').append($('<option>', {
							value: ins_id,
							text : ins_name
						}));
						$('#base_customer_category_id').val(ins_id).trigger('change');
						if($('#customer_category_id').length>0){
							$('#customer_category_id').append($('<option>', {
								value: ins_id,
								text : ins_name
							}));
							$('#customer_category_id').val(ins_id).trigger('change');
						}
					});
					spin.removeClass('show_spin');
					modal_hide_trigger('BaseCustomerCategoryCreateModal', 'BaseCustomerCatgoryForm');
				}
				else if(response.error){
					spin.removeClass('show_spin');
					error_toast(response.error, 'none', 'none');
				}
				else{
					spin.removeClass('show_spin');
					error_toast('Cannot proceed invalid request!', 'none', 'none');
				}
			}
			else{
				spin.removeClass('show_spin');
				error_toast('Cannot proceed invalid request!', 'none', 'none');
			}
		},
		error: function(response){
			spin.removeClass('show_spin');
			error_toast('Cannot proceed! Server Error', 'none', 'none');
		}
		
	})
}

// chart _of_account addition =================

$('#base_group_main_account_group_id').on('change', function(){
	let idstr = $(this).val();
	$('#base_group_parent_id').empty();
	$('#base_group_parent_id').append('<option></option>');
	if($('.base_acc_type'+idstr).length>0){
		$('.base_acc_type'+idstr).each(function(){
			let key = $(this).attr("data-key");
			let value = $(this).val();
			$('#base_group_parent_id').append($('<option>', {
				value: value,
				text : key
			}));
		});
	}
});

$('#BaseChartAccountCreateForm').on('submit', function(e){
	e.preventDefault();
	$('#basespinner10').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");

	var error = validate(formid, dataid);

	if(error==0){
		let spin = $('#basespinner10');
		ajax_chart_of_account_cal(spin);
	}else{
		$('#basespinner10').removeClass('show_spin');
	}
});

$('#BaseChartGroupCreateForm').on('submit', function(e){
	e.preventDefault();
	$('#basespinner11').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");

	var error = validate(formid, dataid);

	if(error==0){
		let spin = $('#basespinner11');
		ajax_chart_of_group_cal(spin);
	}else{
		$('#basespinner11').removeClass('show_spin');
	}
});

function ajax_chart_of_account_cal(spin){
	var formData = {
		'name': $('#base_chart_name').val(),
		'parent': $('#base_chart_parent_id').val(),
		// 'opening': $('#base_chart_opening').val(),
		// 'opening_cr_dr': $("#base_opening_cr_dr option:selected").val(),
		'description': $('#base_chart_description').val(),
		'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
	}
	$.ajax({
		type: 'POST',
		url: '/base-coa-add/',
		data: formData,
		encode: true,
		success: function(response) {
			if(response){
				if(response.record){
					let record = response.record;
					$.each(record, function(key, value) {

						let ins_id = value.id;
						let ins_name = value.name;

						if($('#itemselect').length>0){
							$('#itemselect').append($('<option>', {
								value: ins_id,
								text : ins_name
							}));
							// $('#itemselect').val(ins_id).trigger('change');
						}
						if($('#gl_mapping_id').length>0){
							$('#gl_mapping_id').append($('<option>', {
								value: ins_id,
								text : ins_name
							}));
							$('#gl_mapping_id').val(ins_id).trigger('change');
						}
						if($('#purchase_gl_id').length>0){
							$('#purchase_gl_id').append($('<option>', {
								value: ins_id,
								text : ins_name
							}));
							// $('#itemselect').val(ins_id).trigger('change');
						}
						if($('#sales_gl_id').length>0){
							$('#sales_gl_id').append($('<option>', {
								value: ins_id,
								text : ins_name
							}));
							// $('#itemselect').val(ins_id).trigger('change');
						}
						if($('#inventory_gl_id').length>0){
							$('#inventory_gl_id').append($('<option>', {
								value: ins_id,
								text : ins_name
							}));
							// $('#itemselect').val(ins_id).trigger('change');
						}
						if($('#trigger_acc_btn').length>0){
							let trig = $('#trigger_acc_btn').val();
							if(trig=='purchase_gl'){
								$('#purchase_gl_id').val(ins_id).trigger('change');
							}else if(trig=='sales_gl'){
								$('#sales_gl_id').val(ins_id).trigger('change');
							}else if(trig=='inventory_gl'){
								$('#inventory_gl_id').val(ins_id).trigger('change');
							}
						}
					});
					spin.removeClass('show_spin');
					modal_hide_trigger('BaseChartAccountCreateModal', 'BaseChartAccountCreateForm');
				}
				else if(response.error){
					spin.removeClass('show_spin');
					error_toast(response.error, 'none', 'none');
				}
				else{
					spin.removeClass('show_spin');
					error_toast('Cannot proceed invalid request!', 'none', 'none');
				}
			}
			else{
				spin.removeClass('show_spin');
				error_toast('Cannot proceed invalid request!', 'none', 'none');
			}
		},
		error: function(response){
			spin.removeClass('show_spin');
			error_toast('Cannot proceed! Server Error', 'none', 'none');
		}
		
	})
}

function ajax_chart_of_group_cal(spin){
    var formData = {
		'name': $('#base_group_name').val(),
		'main_account_group': $('#base_group_main_account_group_id').val(),
		'parent': $('#base_group_parent_id').val(),
		'description': $('#base_group_description').val(),
		'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
	}
    $.ajax({
		type: 'POST',
		url: '/base-coa-group-add/',
		data: formData,
		encode: true
	})
	.done(function(response) {
		if(response){
			if(response['record'] == 'error'){
				spin.removeClass('show_spin');
				error_toast('Cannot proceed! Please try again later', 'none', 'none');
			}else{
				let ins_id = '';
				let ins_name = '';
				$.each(response["record"], function(key, value) {
					$.each(value, function(key, value) {
						if(key=='id'){
							ins_id = value;
						}
						if(key=='name'){
							ins_name = value;
						}
					});
					if($('#base_chart_parent_id').length>0){
						$('#base_chart_parent_id').append($('<option>', {
							value: ins_id,
							text : ins_name
						}));
						$('#base_chart_parent_id').val(ins_id).trigger('change');
					}
				});
				spin.removeClass('show_spin');
				modal_hide_trigger('BaseChartGroupCreateModal', 'BaseChartGroupCreateForm');
			}
		}else{
			spin.removeClass('show_spin');
			error_toast('Cannot proceed! Please try again later', 'none', 'none');
		}
	});
}

// payment term addition ajax ============================

$('#BasePaymentTermForm').on('submit', function(e){
	e.preventDefault();
	$('#basespinner12').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");

	var error = validate(formid, dataid);
	let p_time = $('#base_payment_time').val();
	if(p_time<1){
		error = 1;
		$('#base_payment_time').addClass('is-invalid');
	}

	if(error==0){
		let spin = $('#basespinner12');
		ajax_payment_term_cal(spin);
	}else{
		$('#basespinner12').removeClass('show_spin');
	}
});

function ajax_payment_term_cal(spin){
	var formData = {
		'name': $('#base_payment_name').val(),
		'time': $('#base_payment_time').val(),
		'period': $('#base_payment_period').val(),
		'description': $('#base_payment_description').val(),
		'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
	}
	$.ajax({
		type: 'POST',
		url: '/base-payment-term-add/',
		data: formData,
		encode: true,
		success: function(response) {
			if(response){
				if(response.record){
					let record = response.record;
					$.each(record, function(key, value) {

						let ins_id = value.id;
						let ins_name = value.name;

						if($('#payment_term_id').length>0){
							$('#payment_term_id').append($('<option>', {
								value: ins_id,
								text : ins_name
							}));
							$('#payment_term_id').val(ins_id).trigger('change');
						}
					});
					spin.removeClass('show_spin');
					modal_hide_trigger('BasePaymentTermCreateModal', 'BasePaymentTermForm');
				}
				else if(response.error){
					spin.removeClass('show_spin');
					error_toast(response.error, 'none', 'none');
				}
				else{
					spin.removeClass('show_spin');
					error_toast('Cannot proceed invalid request!', 'none', 'none');
				}
			}
			else{
				spin.removeClass('show_spin');
				error_toast('Cannot proceed invalid request!', 'none', 'none');
			}
		},
		error: function(response){
			spin.removeClass('show_spin');
			error_toast('Cannot proceed! Server Error', 'none', 'none');
		}
		
	});
}

// employee ajax cal ====================

$('#BaseEmployeeForm').on('submit', function(e){
	e.preventDefault();
	$('#basespinner13').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");

	var error = validate(formid, dataid);

	if(error==0){
		let spin = $('#basespinner13');
		ajax_employee_cal(spin);
	}else{
		$('#basespinner13').removeClass('show_spin');
	}
});

function ajax_employee_cal(spin){
	var formData = {
		'first_name': $('#base_employee_first_name').val(),
		'last_name': $('#base_employee_last_name').val(),
		'gender': $('#base_employee_gender').val(),
		'country': $('#base_employee_country').val(),
		'province': $('#base_employee_province').val(),
		'district': $('#base_employee_district').val(),
		'address': $('#base_employee_address').val(),
		'contact': $('#base_employee_contact').val(),
		'designation': $('#base_employee_designation').val(),
		'email': $('#base_employee_email').val(),
		'join_date': $('#base_employee_join_date').val(),
		'gl_mapping': $('#base_employee_gl_mapping_id').val(),
		'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
	}
	$.ajax({
		type: 'POST',
		url: '/base-employee-add/',
		data: formData,
		encode: true,
		success: function(response) {
			if(response){
				if(response.record){
					let record = response.record;
					$.each(record, function(key, value) {

						let ins_id = value.id;
						let ins_name = value.name;

						if($('#employee_id').length>0){
							$('#employee_id').append($('<option>', {
								value: ins_id,
								text : ins_name
							}));
							$('#employee_id').val(ins_id).trigger('change');
						}
					});
					spin.removeClass('show_spin');
					modal_hide_trigger('BaseEmployeeCreateModal', 'BaseEmployeeForm');
				}
				else if(response.error){
					spin.removeClass('show_spin');
					error_toast(response.error, 'none', 'none');
				}
				else{
					spin.removeClass('show_spin');
					error_toast('Cannot proceed invalid request!', 'none', 'none');
				}
			}
			else{
				spin.removeClass('show_spin');
				error_toast('Cannot proceed invalid request!', 'none', 'none');
			}
		},
		error: function(response){
			spin.removeClass('show_spin');
			error_toast('Cannot proceed! Server Error', 'none', 'none');
		}
		
	});
}

// password change ================

$('#PasswordChangeForm').on('submit', function(e){
	e.preventDefault();
	$('#basespinner14').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");
	var pwd1 = $('#base_password1').val();
	var pwd2 = $('#base_password2').val();

	var error = validate(formid, dataid);
	
	if(pwd1 != pwd2){
		error = 1;
		error_toast('Password does not match!', 'none', 'none');
	}
	if(error==0){
		document.PasswordChangeForm.submit();
	}else{
		$('#basespinner14').removeClass('show_spin');
	}
});


// notification ajax ======================

$('#mark-as-read').click(function(event) {
    $.ajaxSetup({
        headers: {
            'X-CSRFToken': csrftoken
        }
    });
      // AJAX function
	$.ajax({
	url: '/notifications/mark-as-read/',
	type: 'POST',
	success: function(response) {
		// AJAX request was successful
		$(".counter-main").text(response.count);
		$(".counter").text(response.count + ' new Notification');
	}
	});

	// Prevent default link behavior
	event.preventDefault();
});


$('#RateChangeForm').on('submit', function(e){
	$('#basespinner7').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");

	var error = validate(formid, dataid);
	let rate = $('#base_rate').val();
	if(rate=='' || rate < 0){
		error = 1
		$('#rate').addClass('is-invalid');
	}

	if(error==0){
		document.RateChangeForm.submit();
	}else{
		$('#basespinner7').removeClass('show_spin');
	}
	e.preventDefault();
});


// upload file mechanism ================

// variable declarations ============
var upload_extensions = ['jpg', 'jpeg', 'pdf', 'png'];
var file_add = 0;
var file_row = 0;
var file_count = 5;
var file_names = [];
var member = 0;
var max_size = 200000; // this is in kb means 200kb.

$('#basicDrop').ezdz({
	text: '<i class="ri-upload-2-line"></i> Drop item images/files here or click',
});

$('#basicDrop').on('change', function(){
	var file_error = 0;
	if(this.files.length>0 && this.files.length<6){
		if(this.files.length<=file_count){
			$('#fileAddedTable').show();
			file_add = file_add + 1;
			for(var i = 0; i < this.files.length; i++){
				file_row = file_row + 1;
				var filename = this.files[i].name;
				let extension = filename.split('.').pop().toLowerCase();
				if(upload_extensions.indexOf(extension) > -1){
					file_names.push(filename);
					var duplicates = $.grep(file_names, function(element, index){
						return $.inArray(element, file_names) !== index;
					});
					if(duplicates.length === 0){
						if(this.files[i].size<=max_size){
							file_count = file_count - 1;
							$("#fileAddedTable tbody").append('<tr class="filerow" id="filerow'+file_row+'"><td><span class="btn btn-sm btn-info filename">'+filename+'</span></td><td><button type="button" class="btn btn-sm  bg-danger-transparent text-danger delete_file" data-id="'+file_row+'" data-input-id="'+file_add+'" data-file-name="'+filename+'"><i class="ri-delete-bin-line"></i></button></td></tr>');
						}else{
							file_error = 1;
							file_names = jQuery.grep(file_names, function(value) {
								return value != filename;
							});
							let msg = '"'+filename+'" exceeds file size upload limit 200kb!';
							delete_files_on_error(msg);
						}
					}else{
						file_error = 1;
						file_names = file_names.filter(function(element,index,self){
							return index === self.indexOf(element); 
						});
						let msg = 'Duplicate file name not allowed!';
						delete_files_on_error(msg);
					}
				}else{
					file_error = 1;
					error_toast('File format not supported! Only jpg, jpeg, png or pdf is allowed.', 'none', 'none');
				}
			}
			if(file_error==0){
				$('.hidden_files').append('<input type="hidden" class="files_added" name="files_added" id="files_added'+file_add+'" value="'+file_add+'"/>');
				$('.hidden_files').append('<input type="file" class="files_input" id="fileDrop'+file_add+'" name="files'+file_add+'" multiple/>');
				var selid = 'fileDrop'+file_add;
				var addedFileInput = document.getElementById(selid);
				let dt = new DataTransfer();
				for(let j=0; j<this.files.length; j++) {
					let f = this.files[j];
					dt.items.add(
						new File(
							[f.slice(0, f.size, f.type)],
							f.name
						));
				}
				addedFileInput.files = dt.files;
			}
			if($('.filerow').length==0){
				$('#fileAddedTable').hide();
			}
			$('#basicDrop').val('');
		}else{
			$('#basicDrop').val('');
			error_toast('Only 5 files allowed at time!', 'none', 'none');
		}
	}else{
		$('#basicDrop').val('');
		error_toast('Only 5 files allowed at time!', 'none', 'none');
	}
});
function delete_files_on_error(msg){
	$('#basicDrop').val('');
	error_toast(msg, 'none', 'none');
}

$(document).on('click', '.delete_file', function(){
	var idstr = $(this).attr("data-id");
	var file_idstr = $(this).attr("data-input-id");
	var find_name = $(this).attr("data-file-name");
	$('#filerow'+idstr).remove();
	var selid = 'fileDrop'+file_idstr;
	var addedFileInput = document.getElementById(selid);

	// removing files from input ==
	const dt = new DataTransfer()
	for (let i = 0; i < addedFileInput.files.length; i++) {
		const file = addedFileInput.files[i];
		if (find_name!=addedFileInput.files[i].name){
			dt.items.add(file);
		}
	}
	addedFileInput.files = dt.files;

	file_names = jQuery.grep(file_names, function(value) {
		return value != find_name;
	});

	if($('.filerow').length==0){
		$('#fileAddedTable').hide();
	}
	file_count = file_count + 1;
});

// file drop zone =================================================

$('#FileUploadForm').on('submit', function(e){
	$('#spinner2').addClass('show_spin');
	
	var error = 0;
	if($('.files_added').length==0){
		error = 1;
		let msg = 'No file selected!'
		error_toast(msg, 'none', 'none');
	}
	if(error==0){
		document.FileUploadForm.submit();
	}else{
		$('#spinner2').removeClass('show_spin');
	}
	e.preventDefault();
});

$('.doc_edit_save').on('click', function(e){
	let doc_error = 0;
	var idstr = $(this).attr("data-id");
	var name = $('#document_name'+idstr).val();
	$('#small_spin'+idstr).addClass('show_spin');

	if(name==''){
		$('#document_name'+idstr).addClass('is-invalid');
		doc_error = 1;
	}
	if(doc_error==0){
		$('#FileEditForm'+idstr).submit();
	}else{
		$('#small_spin'+idstr).removeClass('show_spin');
	}
	e.preventDefault();
});

// delete single doc ==================
$('.delete_doc').click(function(){
	var idstr = $(this).attr("data-id");
	$('#doc_delete_id').val(idstr);
});

// task  mechanism ======

$('.tskpop_row').click(function(){
	let idstr = $(this).attr("data-id");
	let desc = $(this).attr("data-desc");
	let priority = $(this).attr("data-priority");
	let status = $(this).attr("data-status");
	let due_date = $(this).attr("data-date");
	let title = $(this).attr("data-title");
	$('#task_title').text(title+'#tsk100');
	$('#edit_description').val(desc);
	$('#edit_priority').val(priority);
	$('#edit_status').val(status);
	$('#due_edit_date').val(due_date);
	$('#task_id').val(idstr);
	$('#tsk_id').val(idstr);
	if(priority=='high'){
		$('#highcheck').prop("checked", true);
	}else if(priority=='normal'){
		$('#normalcheck').prop("checked", true);
	}else{
		$('#lowcheck').prop("checked", true);
	}

	if(status=='pending'){
		$('#pendingcheck').prop("checked", true);
	}else if(status=='started'){
		$('#startedcheck').prop("checked", true);
	}else{
		$('#donecheck').prop("checked", true);
	}

	let sellist = [];
	$('.tmember'+idstr).each(function(){
		let mm = $(this).val();
		sellist.push(mm); 
	});
	$('#assign_edit_select').val(sellist).change();

	let media = 0;
	$('#CommentAccordion').empty();
	if($('.tcomment'+idstr).length>0){
		$('.tcomment'+idstr).each(function(){
			let val = $(this).val();
			let cuser = $(this).attr("data-user");
			media = media + 1;
			let mediaid = 'media'+idstr+''+media;
			let $div = $('#resuable_html').clone().attr('id', mediaid);
			$('#CommentAccordion').append($div);
			$("#"+mediaid+" h5").text(cuser);
			$("#"+mediaid+" p").text(val);
		});
	}
	$('#comment_count').text(media);

});

$('.prioritycheck').click(function(){
	let val = $(this).attr("data-value");
	if($(this).prop("checked") == true){
		$('#edit_priority').val(val);
	}
	
});

$('.statuscheck').click(function(){
	let val = $(this).attr("data-value");
	if($(this).prop("checked") == true){
		$('#edit_status').val(val);
	}
	
});

$('#TaskUploadForm').on('submit', function(e){
	$('#spinner3').addClass('show_spin');
	let dataid = $(this).attr("data-form");
	let formid = $(this).attr("id");
	
	let task_error = validate(formid, dataid);
	let mem = $('#assign_select').val();
	if(mem.length === 0){
		$('#assign_select').data('select2').$selection.addClass('invalid-select');
	}
	if(task_error==0){
		document.TaskUploadForm.submit();
	}else{
		$('#spinner3').removeClass('show_spin');
	}
	e.preventDefault();
});

$('#EditTaskForm').on('submit', function(e){
	$('#spinner4').addClass('show_spin');
	let dataid = $(this).attr("data-form");
	let formid = $(this).attr("id");
	
	let task_error = validate(formid, dataid);
	let mem = $('#assign_edit_select').val();
	if(mem.length === 0){
		$('#assign_edit_select').data('select2').$selection.addClass('invalid-select');
	}
	if(task_error==0){
		document.EditTaskForm.submit();
	}else{
		$('#spinner4').removeClass('show_spin');
	}
	e.preventDefault();
});

//comment part ===

$('#CommentForm').on('submit', function(e){
	$('#spinner5').addClass('show_spin');
	let dataid = $(this).attr("data-form");
	let formid = $(this).attr("id");
	
	let com_error = validate(formid, dataid);
	if(com_error==0){
		document.CommentForm.submit();
	}else{
		$('#spinner5').removeClass('show_spin');
	}
	e.preventDefault();
});


// master form submittion ==========

$('.detail_master_action').click(function(){
	let idstr = $(this).attr("data-id");
	let method = $(this).attr("data-method");
	$('.master_hiddens').append('<input type="hidden" class="record_ids" name="record_ids" id="recid'+idstr+'" value="'+idstr+'">');
	$('#master_method').val(method);
	master_form();
})

// ====================

// ===============================================

// ====== disabling form on status cancel or inactive ======
if($('#record_status_detail').length>0){
	let val = $('#record_status_detail').val();
	if(val=='cancelled' || val=='approved' || val=='submitted for approval' || val=='delivered'){
		$("form").find("input[type!=hidden], textarea, select, button:not(.revert_exception)").prop("disabled", true);
	}
}

if($('#record_active_status_detail').length>0){
	let val = $('#record_active_status_detail').val();
	if(val=='inactive'){
		$("form").find("input[type!=hidden], textarea, select, button").prop("disabled", true);
	}
}


// multi tabs mechnism =======================

var tabCheckList = $('.tab_check');
var tabList = $('.tabs');
tabCheckList.each(function(){
    var idstr = $(this).attr("id");
    tabList.each(function(){
        var data = $(this).attr("data-tab");
        if(idstr==data){
            $(this).attr("id", "tab_"+data);
        }
    });
    if($(this).prop("checked") == true){
        $('#tab_'+idstr).addClass('is_shown');
    }
});

$('.tab_check').click(function(){
    var idstr = $(this).attr("id");
    $('.tabs').removeClass('is_shown');
    if($(this).prop("checked")==true){
        $('#tab_'+idstr).addClass('is_shown');
    }
});


// filter form validation ============

// $('#FilterForm').on('submit', function(e){
// 	e.preventDefault();
// 	var dataid = $(this).attr("data-form");
// 	var formid = $(this).attr("id");

// 	var error = validate(formid, dataid);
	
// 	if(error==0){
// 		document.FilterForm.submit();
// 	}
// });

// check length of value in form ===============

function has_valid_length(idstr, data, long, title){
	if(data!==undefined && data!='' && data!=null){
		data_length = data.replace(/ /g, '').length;
		if(data_length > 0 && data_length <= long){
			if (data.indexOf('<script>') !== -1 || data.indexOf('<Script>') !== -1 || data.indexOf('<SCRIPT>') !== -1) {
				error_toast(title+' has invalid data format. Recheck and try again!', '#'+idstr, 'is-invalid');
				return false;
			} else {
				return true;
			}
		}else{
			error_toast(title+' has invalid length! '+title+' length cannot be 0 or greater than '+long, '#'+idstr, 'is-invalid');
			return false;
		}
	}
	return true;
}


// date conversion mechanism ================

function BStoADdate(date){
	var dateArray = date.split("-");
	var dateDictionary = {
		year: parseInt(dateArray[0]),
		month: parseInt(dateArray[1]),
		day: parseInt(dateArray[2])
	};
	eng_date = NepaliFunctions.BS2AD(dateDictionary);
	current_date = eng_date.year.toString()+'-'+eng_date.month.toString()+'-'+eng_date.day.toString();
	return current_date
}

current_nep_date = NepaliFunctions.GetCurrentBsDate('YYYY-MM-DD');
current_date_nepali = current_nep_date.year.toString()+'-'+current_nep_date.month.toString()+'-'+current_nep_date.day.toString();
if($("#current_nepali_date").length>0){
	$("#current_nepali_date").val(current_date_nepali);
}


eng_date = NepaliFunctions.GetCurrentAdDate('YYYY-MM-DD');
current_date_english = eng_date.year.toString()+'-'+eng_date.month.toString()+'-'+eng_date.day.toString();
if($("#current_nepali_date").length>0){
	$("#current_date_english").val(current_date_english);
}


// email validator =====================

function isEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}