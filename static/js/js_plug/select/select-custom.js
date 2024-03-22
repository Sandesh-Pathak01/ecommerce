// select 2 //
$(".select2").select2({
  placeholder: "Choose options",
  allowClear: true,
  dropdownAutoWidth: !0,
    width: "100%"
});

 //icon select //
! function(e, t, s) {
  "use strict";
  function i(e) {
    e.element;
    return e.id ? "<i class='" + s(e.element).data("icon") + "'></i>" + e.text : e.text
  } 
  s(".select2-icons").select2({
    dropdownAutoWidth: !0,
    width: "100%",
    minimumResultsForSearch: 1 / 0,
    templateResult: i,
    templateSelection: i,
    escapeMarkup: function(e) {
      return e
    }
  })
}(window, document, jQuery);


