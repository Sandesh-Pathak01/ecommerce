
//edit part =====


// variable declarations ============


// due date activation ======


// value refill part =====================================
$(window).on('load', function(){
	if($('.default').length>0){
		refill();
	}
});

//======================================================

// stock on hold functionality =====


// ==================================


// stock category mechanism ====================================


// =========================================================

// delete single record ===========================================

//========================================

$('#CategoryEditForm').on('submit', function(e){
	e.preventDefault();
	$('#spinner1').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");
	
	var error = validate(formid, dataid);

	let name = $('#name').val();
	if(name != ''){
		if(!has_valid_length('name', name, 30)){
			error = 1;
		}
	}

	if(error==0){
		document.CategoryEditForm.submit();
	}else{
		$('#spinner1').removeClass('show_spin');
	}
});

//==================================================================

// ajax call for batch and serial config ====


