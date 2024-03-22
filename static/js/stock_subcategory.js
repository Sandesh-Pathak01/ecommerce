// Vertical Scroll
$(function(){
	$('#scrollVertical').DataTable({
	  "scrollY": "400px",
	  "scrollCollapse": true,
	  "paging": false,
	  "bInfo" : false,
	});
  });
  
$('#StockSubCatgoryForm').on('submit', function(e){
	$('#spinner1').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");
	var name = $('#name').val();
	var url = name_url(name);
	$('#url').val(url);

    var error = validate(formid, dataid);

	if(error==0){
		document.StockSubCatgoryForm.submit();
	}else{
		$('#spinner1').removeClass('show_spin');
	}
	e.preventDefault();
});

$('.close_create').click(function(){
	$('#StockSubCatgoryForm')[0].reset();
	$('#cat_name_id').val('').trigger('change');
});

$('.edit_btn').click(function(){
	var idstr = $(this).attr("data-id");
	var name = $('#name'+idstr).val();
	var url = $('#url'+idstr).val();
    var catid = $('#cat_id'+idstr).val();
	$('#edit_id').val(idstr);
	$('#default_name').val(name);
	$('#default_url').val(url);
    $('#default_cat_id').val(catid);
	$('#edit_name').val(name);
	$('#edit_url').val(url);
    $('#edit_cat_name_id').val(catid).trigger('change');
});
$('.close_edit').click(function(){
	$('#edit_id').val('');
	$('#default_name').val('');
	$('#default_url').val('');
    $('#default_cat_id').val('');
	$('#edit_name').val('');
	$('#edit_url').val('');
	$('#EditStockSubCatgoryForm')[0].reset();
});

$('.delete_btn').click(function(){
	var idstr = $(this).attr("data-id");
	$('#delete_id').val(idstr);
});
$('.close_delete').on('click', function(){
	$('#delete_id').val('');
});

$('#EditStockSubCatgoryForm').on('submit', function(e){
	$('#spinner2').addClass('show_spin');
	var dataid = $(this).attr("data-form");
	var formid = $(this).attr("id");
	var name = $('#edit_name').val();
	var url = name_url(name);
	$('#edit_url').val(url);

    var error = validate(formid, dataid);
	
	if(error==0){
		document.EditStockSubCatgoryForm.submit();
	}else{
		$('#spinner2').removeClass('show_spin');
	}
	e.preventDefault();
});