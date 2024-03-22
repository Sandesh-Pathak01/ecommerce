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

// modal trigger on nselect ====================

function modal_trigger(modalid, inputid){
    $('#'+modalid).modal('show');
    $("#"+modalid).on('shown.bs.modal', function () {
        $("#"+modalid+" input#"+inputid).focus();
    });
}

$("#itemselect").on('change', function(){
    var idstr = $(this).val();
    if(idstr!=''){
        modal_trigger('QuantityModal', 'quantity');
        var uom = $('#itemlist'+idstr).attr("data-uom");
        var name = $('#itemlist'+idstr).val();
        var qty = $('#itemlist'+idstr).attr("data-qty-available");
        $('.item_title').text(name);
        $('#selected_item').val(idstr);
        $('.uomtext').text(uom);
        $('.available_text').text(qty+' '+uom);
        if($('.batch_list_instance'+idstr).length==0 && $('.serial_list_instance'+idstr).length==0){
            ajax_batch_call(idstr);
        }
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
            let available = $('#itemlist'+idstr).attr("data-qty-available");
            if(val<=parseFloat(available)){
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
                let msg = 'Provided quantity is greater than available quantity of item!';
                error_toast(msg, 'none', 'none');
            }
        }else{
            let msg = 'Item is not selected to proceed!';
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
    // var configure_text = '<span class="btn btn-sm btn-info config_div" data-id="'+idstr+'" data-method="deduction">Configure</span>';
    var input_group = '<div class="input-group"><input type="number" value="'+val+'" name="quantity'+idstr+'" step=".01" class="form-control inputs" id="quantity'+idstr+'" autocomplete="off"><div class="input-group-append"><span class="input-group-text" class="qtytext">'+uom+'</span></div></div>';
    var action = '<button type="button" class="btn btn-sm  bg-danger-transparent text-danger delete_data" data-id="'+idstr+'"><i class="ri-delete-bin-line"></i></button>'; //<button type="button" class="btn btn-sm  bg-info-transparent text-info view_data" data-id="'+idstr+'"><i class="ri-eye-line"></i></button> for view button in table td inside action.
    
    $(".hidden_inputs").append('<input type="hidden" name="total_item" class="total_item" id="item_added'+idstr+'" value="'+idstr+'">');
    $("#ItemTable tbody").append('<tr id="itemrow'+idstr+'"><td id="rowcount'+idstr+'"></td><td>'+code+'</td><td>'+name+'</td><td id="qty_data'+idstr+'"></td><td id="action_data'+idstr+'"></td></tr>'); // <td id="configure_data'+idstr+'"></td> for configure button in td.
    $('#qty_data'+idstr).append(input_group);
    // $('#configure_data'+idstr).append(configure_text);
    $('#action_data'+idstr).append(action);
}

$('#QuantityModal').on('hide.bs.modal', function(){
    $("#QuantityForm")[0].reset();
    $('#itemselect').val('').trigger('change');
});

$(document).on('click', '.delete_data', function(){
    var idstr = $(this).attr("data-id");
    $('.item_data_col'+idstr).remove();
    $('#item_added'+idstr).remove();
    $('#itemrow'+idstr).remove();
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
    var SerialNumberList = $('.serial_number'+idstr);
    if(AllBatchList.length>0){
        AllBatchList.each(function(){
            btch_count = btch_count + 1;
            var val = $(this).val();
            var val_text = $(this).attr("data-batch-text");
            var qty = $(this).attr("data-qty");
            hand_qty = parseFloat(hand_qty) - parseFloat(qty);
            $("#DetailBatchTable tbody").append('<tr id="batch_detail_row'+btch_count+'"><td>'+val_text+'</td><td>'+qty+'</td></tr>');
            
            // batchwise serial display==
            $('.serial_collection').append('<div class="col* col-lg-6 col-md-6" id="serialtab'+btch_count+'"></div>');
            var $div = $('#resuable_html').clone().attr('id', null);
            $('#serialtab'+btch_count).html($div);
            $("#serialtab"+btch_count+" .table tbody").append('<tr><th>Batch Number: '+val_text+'</th></tr>');
            if(SerialNumberList.length>0){
                SerialNumberList.each(function(){
                    var this_batch = $(this).attr("data-batch");
                    var this_val = $(this).val();
                    var this_val_text = $(this).attr("data-serial-text");
                    if(this_batch==val){
                        $("#serialtab"+btch_count+" .table tbody").append('<tr><td>'+this_val_text+'</td></tr>');
                    }
                });
            }
        });
    }
    
    // serial number display
    if(SerialNumberList.length>0){
        SerialNumberList.each(function(){
            var this_batch = $(this).attr("data-batch-text");
            if(this_batch=='none'){
                $('.serial_collection').append('<div class="col* col-lg-6 col-md-6" id="none_serialtab'+btch_count+'"></div>');
                var $div = $('#resuable_html').clone().attr('id', null);
                $('#none_serialtab'+btch_count).html($div);
                $("#none_serialtab"+btch_count+" .table tbody").append('<tr><th>Batch Number: '+this_batch+'</th><td></td></tr>');
                return false;
            }
        });
        SerialNumberList.each(function(){
            var this_batch = $(this).attr("data-batch-text");
            var this_val = $(this).attr("data-serial-text");
            if(this_batch=='none'){
                $("#none_serialtab"+btch_count+" .table tbody").append('<tr><td>'+this_val+'</td></tr>');
            }
        });
    }
}

// ==================================================

// configuration mechanism ================

$(document).on('click', '.config_div', function(){
    var idstr = $(this).attr("data-id");
    var total_qty = $('#quantity'+idstr).val();
    var method = $(this).attr("data-method");
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
    if(method=='deduction'){
        $('#serial_input').empty();
        $('#serial_input').append($('<option>', {
            value: '',
            text : '-- Choose option --'
        }));
        $('#serial_input').niceSelect('update');
        var dedseriallist = $('.serial_list_instance'+idstr);
        if(dedseriallist.length > 0){
            dedseriallist.each(function(){
                var thisval = $(this).val();
                var thisid = $(this).attr("data-instance-id");
                $('#serial_input').append($('<option>', {
                    value: thisid,
                    text : thisval
                }));
            });
            $('#serial_input').niceSelect('update');
        }
    }

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
    if(method=='deduction'){
        $('.deduct_batch_select_group').hide();
    }
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
            var batch_num = $('#batch_added'+batch_id).attr("data-batch-text");
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
            var serial_num = $(this).attr("data-serial-text");
            var batch_val = $(this).attr("data-batch-text");
            var serial_id = $(this).attr("data-serial-id");
            var action = '<button class="btn btn-sm  bg-danger-transparent text-danger serial_delete_data" data-id="'+serial_id+'"><i class="ri-delete-bin-line"></i></button>';
            $("#SerialTable tbody").append('<tr id="serialrow'+serial_id+'"><td>'+serial_num+'</td><td>'+batch_val+'</td><td id="serial_action_data'+serial_id+'"></td></tr>');
            $('#serial_action_data'+serial_id).append(action);
            total_serial_count = total_serial_count + 1;
        });
    }
}
// =======================================

// deduction quantity / batch configuration mechanism ============================

$('#deduct_use_batchcheck').click(function(){
    var idstr = $('#config_selected_item').val();
    if($(this).prop("checked") == true){
        $('.deduct_batch_select_group').show();
        batch_deduct_select_fill(idstr, 'deduct_batch_select_list');
    }else{
        $('#deduct_batch_select_list').empty();
        $('.deduct_batch_select_group').hide();
    }
});

$('#deduct_batch_select_list').on('change', function(){
    let idstr = $('#config_selected_item').val();
    let uom = $('#itemlist'+idstr).attr("data-uom");
    let val = $(this).val();
    let b_qty = $('#batch_instance'+val).attr("data-qty");
    $('.batch_available_text').text(b_qty+' '+uom);
});

$('#add_batch').click(function(){
    // quantity / batch deduction =============
    add_batch();
});

// quantity / batch number deletion ====
$(document).on('click', '.batch_delete_data', function(){
    var idstr = $(this).attr("data-id");
    var qty = $('#batch_qty_added'+idstr).val();
    var btch = $('#batch_added'+idstr).val();
    $('#batch_added'+idstr).remove();
    $('.batch_thisrow'+idstr).remove();
    $('#batchrow'+idstr).remove();
    remain_qty = parseFloat(remain_qty) + parseFloat(qty);
    batch_col = jQuery.grep(batch_col, function(value) {
        return value != btch;
    });
});
//==

function add_batch(){
    var idstr = $('#config_selected_item').val();
    var batch_num = 'none';
    var batch_num_text = 'none';
    var batch_qty = $('#batch_qty').val();
    var batch_total_qty = remain_qty;
    if($('#deduct_use_batchcheck').prop("checked") == true){
		batch_num = $('#deduct_batch_select_list').val();
        batch_num_text = $('#batch_instance'+batch_num).val();
        batch_total_qty = $('#batch_instance'+batch_num).attr("data-qty");
	}
    if(batch_num!='none' && batch_qty > 0){
        if(parseFloat(remain_qty) - parseFloat(batch_qty) >= 0){
            if(parseFloat(batch_total_qty) - parseFloat(batch_qty) >= 0){
                if($.inArray(batch_num, batch_col)<0){
                    batch_count = batch_count + 1;
                    var batch_id = 'batch_'+idstr+''+batch_count;
                    var action = '<button class="btn btn-sm  bg-danger-transparent text-danger batch_delete_data" data-id="'+batch_id+'"><i class="ri-delete-bin-line"></i></button>';
                    $(".hidden_inputs").append('<input type="hidden" name="batch_count'+idstr+'" class="item_data_col'+idstr+' batch_thisrow'+batch_id+' batch_count'+idstr+'" id="batch_count_added'+batch_id+'" value="'+batch_id+'">');
                    $(".hidden_inputs").append('<input type="hidden" name="batch_number'+batch_id+'" class="item_data_col'+idstr+' batch_thisrow'+batch_id+' batch_number'+idstr+'" id="batch_added'+batch_id+'" value="'+batch_num+'" data-id="'+idstr+'" data-qty="'+batch_qty+'" data-count="'+batch_count+'" data-batch-id="'+batch_id+'" data-batch-text="'+batch_num_text+'">');
                    $(".hidden_inputs").append('<input type="hidden" name="batch_quantity'+batch_id+'" class="item_data_col'+idstr+' batch_thisrow'+batch_id+' batch_quantity'+idstr+'" id="batch_qty_added'+batch_id+'" value="'+batch_qty+'" data-id="'+idstr+'">');
                    $("#BatchTable tbody").append('<tr id="batchrow'+batch_id+'"><td>'+batch_num_text+'</td><td>'+batch_qty+'</td><td id="batch_action_data'+batch_id+'"></td></tr>');
                    $('#batch_action_data'+batch_id).append(action);
                    $('#batch_qty').val('');
                    batch_col.push(batch_num);
                    remain_qty = parseFloat(remain_qty) - parseFloat(batch_qty);
                    $('#deduct_batch_select_list').removeClass('is-invalid');
                    $('#deduct_batch_select_list').niceSelect('update');
                    $('#batch_qty').removeClass('is-invalid');
                }else{
                    $('#deduct_batch_select_list').addClass('is-invalid');
                    $('#deduct_batch_select_list').niceSelect('update');
                }
            }else{
                $('#batch_qty').addClass('is-invalid');
            }
        }else{
            $('#batch_qty').addClass('is-invalid');
        }
    }else{
        $('#deduct_batch_select_list').addClass('is-invalid');
        $('#deduct_batch_select_list').niceSelect('update');
        $('#batch_qty').addClass('is-invalid');
    }
}

// filling batch number options in select field ==
function batch_deduct_select_fill(idstr, divid){
    var dedbatchlist = $('.batch_list_instance'+idstr);
    $('#'+divid).empty();
    $('#'+divid).append($('<option>', {
        value: '',
        text : '-- Choose option --'
    }));
    $('#'+divid).niceSelect('update');
    if(dedbatchlist.length > 0){
        dedbatchlist.each(function(){
            var thisval = $(this).val();
            var thisid = $(this).attr("data-instance-id");
            $('#'+divid).append($('<option>', {
                value: thisid,
                text : thisval
            }));
        });
        $('#'+divid).niceSelect('update');
    }
}

// ==================================================

// serial number mechanism =====================================

$('#use_batch').click(function(){
    var idstr = $('#config_selected_item').val();
    if($('#use_batchcheck').prop("checked") == true){
        $('#batch_select_group').show();
        batch_deduct_select_fill(idstr, 'batch_select_list');
    }else{
        $('#batch_select_list').empty();
        $('#batch_select_group').hide();

    }
});

$('#batch_select_list').on('change', function(){
    var val = $(this).val();
    var idstr = $('#config_selected_item').val();

    //changing select option of serial number ===
    $('#serial_input').empty();
    $('#serial_input').append($('<option>', {
        value: '',
        text : '-- Choose option --'
    }));
    $('#serial_input').niceSelect('update');
    var dedseriallist = $('.serial_list_instance'+idstr);
    if(dedseriallist.length > 0){
        dedseriallist.each(function(){
            var thisval = $(this).val();
            var thisid = $(this).attr("data-instance-id");
            var thisbatch = $(this).attr("data-batch");
            if(thisbatch==val){
                $('#serial_input').append($('<option>', {
                    value: thisid,
                    text : thisval
                }));
            }  
        });
        $('#serial_input').niceSelect('update');
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
    var batch_val = 'none';
    var batch_val_text = 'none';
    var batch_chk = 0;
    var available_qty = $('#quantity'+idstr).val();
    if($('#use_batchcheck').prop("checked") == true){
        batch_val = $('#batch_select_list option:selected').val();
        if(batch_val==''){
            batch_chk = 1;
        }else{
            batch_val_text = $('#batch_instance'+batch_val).val();
        }
    }
    var serial_num = $('#serial_input').val();
    var serial_num_text = $('#serial_instance'+serial_num).val();
    if(batch_chk==0 && serial_num != ''){
        if(total_serial_count < available_qty){
            if($.inArray(serial_num, serial_col)<0){
                serial_save_count = serial_save_count + 1;
                serial_id_count = serial_id_count + 1;
                var serial_id = 'serial_'+idstr+''+serial_id_count;
                var action = '<button class="btn btn-sm  bg-danger-transparent text-danger serial_delete_data" data-id="'+serial_id+'"><i class="ri-delete-bin-line"></i></button>';
                $(".hidden_inputs").append('<input type="hidden" name="serial_added_count'+idstr+'" class="item_data_col'+idstr+' serial_thisrow'+serial_id+' serial_added_count'+idstr+'" id="serial_added_count'+serial_id+'" value="'+serial_id+'" data-id="'+idstr+'">');
                $(".hidden_inputs").append('<input type="hidden" name="serial_number'+serial_id+'" class="item_data_col'+idstr+' serial_thisrow'+serial_id+' serial_number'+idstr+'" id="serial_number_added'+serial_id+'" value="'+serial_num+'" data-id="'+idstr+'" data-batch="'+batch_val+'" data-batch-text="'+batch_val_text+'" data-count="'+serial_id_count+'" data-serial-id="'+serial_id+'" data-serial-text="'+serial_num_text+'">');
                $("#SerialTable tbody").append('<tr id="serialrow'+serial_id+'"><td>'+serial_num_text+'</td><td>'+batch_val_text+'</td><td id="serial_action_data'+serial_id+'"></td></tr>');
                $('#serial_action_data'+serial_id).append(action);
                $("#SerialForm select#serial_input").val('');
                $("#SerialForm select#serial_input").niceSelect('update');
                serial_col.push(serial_num);
                total_serial_count = total_serial_count + 1;
                
                $('#serial_input').removeClass('is-invalid');
                $('#batch_select_list').removeClass('is-invalid');
                $('#batch_select_list').niceSelect('update');
                $('#serial_input').niceSelect('update');
            }else{
                $('#serial_input').addClass('is-invalid');
                $('#serial_input').niceSelect('update');
            }
            
        }else{
            $('#serial_input').addClass('is-invalid');
            $('#serial_input').niceSelect('update');
        }
    }else{
        $('#serial_input').addClass('is-invalid');
        $('#serial_input').niceSelect('update');
        $('#batch_select_list').addClass('is-invalid');
        $('#batch_select_list').niceSelect('update');
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
    var form_error = 0;
    $('#spinner1').addClass('show_spin');
    var dataid = $(this).attr("data-form");
    var formid = $(this).attr("id");
    form_error = validate(formid, dataid);
    let entry_date = $('#entry_date').val();
	let english_entry_date = BStoADdate(entry_date);
	$('#english_entry_date').val(english_entry_date);
    
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
    
    if(form_error==0){
        document.StockDeductionForm.submit();
    }else{
        $('#spinner1').removeClass('show_spin');
    }
    
    e.preventDefault();
});

function item_validation(ItemCol){
    var err = 0;
    ItemCol.each(function(){
        var idstr = $(this).val();
        var qty = $('#quantity'+idstr).val();
        var temp_qty = 0;
        var col_batch = [];
        var BatchList = $('.batch_number'+idstr);
        var SerialList = $('.serial_number'+idstr);
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
                        var msg = 'Selected batch number for serial number does not exists for deduction. Check configuration!';
                        var div = '#itemrow'+idstr;
                        var cls = 'div_warning';
                        error_toast(msg, div, cls);
                    }
                }
                temp_qty = parseFloat(temp_qty) + 1;
            });
            if(temp_qty>qty){
                err = 1;
                var msg = 'serial number count does not match total quantity of deduction. Check configuration!';
                var div = '#itemrow'+idstr;
                var cls = 'div_warning';
                error_toast(msg, div, cls);
            }else{
                temp_qty = 0;
            }
        }
    });
    return err;
}

// =============================================

// ajax call for item batch detail ============

function ajax_batch_call(idstr){
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
            $('.hidden_inputs').append('<input type="hidden" class="batch_list_instance'+idstr+'" id="batch_instance'+batch_instance_id+'" value="'+batch_instance_number+'" data-instance-id="'+batch_instance_id+'" data-qty="'+batch_instance_qty+'">');
        });

        let serial_instance_id = '';
        let serial_instance_batch = '';
        let serial_instance_number = '';
		$.each(response["serial_list"], function(key, value) {
            $.each(value, function(key, value) {
                if(key=='id'){
                    serial_instance_id = value;
                }
                if(key=='batch'){
                    serial_instance_batch = value;
                }
                if(key=='serial_number'){
                    serial_instance_number = value;
                }
            });
            $('.hidden_inputs').append('<input type="hidden" class="serial_list_instance'+idstr+'" id="serial_instance'+serial_instance_id+'" value="'+serial_instance_number+'" data-instance-id="'+serial_instance_id+'" data-batch="'+serial_instance_batch+'">');
        });
	});
}

