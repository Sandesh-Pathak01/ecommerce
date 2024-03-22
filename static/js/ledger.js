$('form input').on('keypress', function(e) {
    return e.which !== 13;
});

// value refill part =====================================
$(window).on('load', function(){
	if($('.default').length>0){
		refill();
	}
	if($('#category_boxcheck').prop("checked") == true){
		$('.category_boxdiv').show();
	}
	if($('#item_boxcheck').prop("checked") == true){
		$('.item_boxdiv').show();
	}
});

// date mechanism ====
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

$('.filter_check').click(function(){
	var idstr = $(this).attr("data-id");
	$('.filter_box').hide();
	$('.filter_check_val').val('0');
	if($(this).prop("checked") == true){
		$('.filter_check').prop("checked", false);
		$(this).prop("checked", true);
		$('#'+idstr).val('1');
		$('.'+idstr+'div').show();
	}else{
		$('#'+idstr).val('0');
	}
});

// stock category mechanism ====================================
function subcategory_assign(scat){
	var stocksubcat = $('.stocksubcatlist'+scat);
	$('#subcategory').empty();
	$('#subcategory').append('<option></option>');
	if(stocksubcat.length>0){
		stocksubcat.each(function(){
			var thisid = $(this).attr("data-id");
			var thisval = $(this).val();
			$('#subcategory').append($('<option>', { 
				value: thisid,
				text : thisval
			}));
		});
	}
	return true;
}

$('#category').on("change", function(){
	var scat = $(this).val();
	subcategory_assign(scat);
});

$('#supplier_id').on("change", function(){
	$('#customer_id').val('')
});

$('#customer_id').on("change", function(){
	$('#supplier_id').val('')
});
