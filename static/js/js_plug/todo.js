$('.todo__body').on('click', 'li.todo__list', function() {
	$(this).toggleClass('done');
});
