// if($('.no_batch_serial_check').length>0){
//     $('.no_batch_serial_div').show();
// }

$(window).on('load', function(){
	if($('.default').length>0){
		refill();
	}
});

$('#EditForm').on('submit', function(e){
	e.preventDefault();
	$('#spinner1').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");
	let qty = $('#quantity').val();
	let entry_date = $('#entry_date').val();
	let english_entry_date = BStoADdate(entry_date);
	$('#english_entry_date').val(english_entry_date);

	var error = validate(formid, dataid);

    if(qty<0){
		error = 1;
        $('#quantiy').addClass('is-invalid');
	}

	if(error==0){
		document.EditForm.submit();
	}else{
		$('#spinner1').removeClass('show_spin');
	}
});

