$('form input').on('keypress', function(e) {
    return e.which !== 13;
});

calculateTotalAmount();

$('#itemselect').on('change', function(){
    let idstr = $(this).val();
    if(idstr != '' && idstr != null){
        let name = $("#itemselect option:selected").text();
        let uom = $('#itemlist'+idstr).attr("data-uom");
        let existRecord = $('#itemrecord'+idstr);
        if(existRecord.length == 0){
            modal_trigger('QuantityModal', 'quantity');
            $('.item_title').text(name);
            $('.uomtext').text(uom);
            $('#selected_item').val(idstr);     
        }else{
            error_toast('Item already available in item table!', 'none', 'none');
            $(this).val('').trigger('change');
        }
    }
});

$('#add_item_quantity').click(function(){
    let val = $('#quantity').val();
    if(val != '' && val != null && val > 0){
        let idstr = $('#selected_item').val();
        // adding items in table ==
        if(idstr!='' && idstr!=null){
            $('.no-item-row').hide();
            add_items(idstr, val);
            calculateTotalAmount();
            tableSymbolNumber();
            

        }else{
            error_toast('Product item not selected!', 'none', 'none');
        }


        //Changing modal, quantity and select fields states to default ===

        $('#quantity').val('');
        $('#QuantityModal').modal('hide');
        $('#itemselect').val('').trigger('change');

    }else{
        $('#quantity').addClass('is-invalid');
    }
});

function add_items(idstr, val){
    let name = $('#itemlist'+idstr).val();
    let uom = $('#itemlist'+idstr).attr("data-uom");
    let qty_input = `<div class="input-group"><input type="number" class="form-control inputs qty" name="quantity[]" step=".01" id="quantity${idstr}" value="${val}"><div class="input-group-append"><span class="input-group-text">${uom}</span></div></div>`;
    let rate_input = `<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Rs</span></div><input type="number" class="form-control inputs rate" name="rate[]" step=".01" id="rate${idstr}" value=""></div>`;
    let amount_input = `<div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Rs</span>
                            </div>
                            <input type="number" class="form-control inputs amount" name="amount[]" step=".01" id="amount${idstr}" value="" readonly>
                        </div>`;
    let action_input = `<button type="button" class="btn btn-sm bg-danger-transparent text-danger delete_data" data-id="${idstr}"><i class="ri-delete-bin-line"></i></button>`;
    let itemrecord = `<input type="hidden" class="itemrecord datarecord${idstr}" name="itemrecord[]" id="itemrecord${idstr}" value="${idstr}">`;
    $('.hidden_inputs').append(itemrecord);

    let tableRow = `
        <tr class="tablerow datarecord${idstr}" id="itemrow${idstr}">
            <td class="snColumn"></td>
            <td>${name}</td>
            <td>${qty_input}</td>
            <td>${rate_input}</td>
            <td>${amount_input}</td>
            <td>${action_input}</td>
        </tr>
    `
    $("#ItemTable tbody").append(tableRow);

}

function tableSymbolNumber(){
    $('#ItemTable tbody .tablerow').each(function (index) {
        $(this).find('.snColumn').text(index+1);
    });
}


$(document).on("click", ".delete_data", function(){
    let idstr = $(this).attr("data-id");
    $('.datarecord'+idstr).remove();
    let existTableRow = $('.tablerow');
    if(existTableRow.length > 0){
        tableSymbolNumber();
    }else{
        $('.no-item-row').show();
    }
    calculate();
});

function calculateTotalAmount() {
    $("#ItemTable tbody .inputs").on('input', function() {
        calculate();
    });
}

function calculate(){
    let totalAmount = 0;
    $('#ItemTable tbody tr').each(function() {
        let quantity = parseFloat($(this).find('.qty').val()) || 0;
        let rate = parseFloat($(this).find('.rate').val()) || 0;
        let amount = quantity * rate;
        totalAmount = totalAmount +  amount;
        
        $(this).find('.amount').val(amount);
    });
    $('#total_amount').val(totalAmount);
}

function caluationValidation(){
    let error = 0;
    let existsRow = $(".tablerow");
    if(existsRow.length > 0){
        calculate();
        $('#total_amount').removeClass('is-invalid');
        existsRow.each(function() {
            $(this).find('.amount').removeClass('is-invalid');
            let quantity = $(this).find('.qty').val();
            let rate = $(this).find('.rate').val();
            let amount = $(this).find('.amount').val();

            if(quantity == '' || quantity == null || quantity <= 0){
                error = 1;
                $(this).find('.qty').addClass('is-invalid');
            }
            if(rate == '' || rate == null || rate <= 0){
                error = 1;
                $(this).find('.rate').addClass('is-invalid');
            }
            if(amount == '' || amount == null || amount <= 0){
                error = 1;
                $(this).find('.amount').addClass('is-invalid');
            }
        });
        let total_amount = $('#total_amount').val();
        if(total_amount == '' || total_amount == null || total_amount <= 0){
            error = 1;
            $('#total_amount').addClass('is-invalid');
        }

    }else{
        error = 1;
        error_toast('No items added!', 'none', 'none');
    }

    return error;
}

$('#CreateForm').on('submit', function(e){
    e.preventDefault();
    $('#spinner1').addClass('show_spin');
    let formid = $(this).attr("id");
    let dataid = $(this).attr("data-form");
    let error = validate(formid, dataid);
    let error2 = caluationValidation();

    if(error == 0 && error2 == 0){
        document.CreateForm.submit();
    }else{
        $('#spinner1').removeClass('show_spin');
    }
});

