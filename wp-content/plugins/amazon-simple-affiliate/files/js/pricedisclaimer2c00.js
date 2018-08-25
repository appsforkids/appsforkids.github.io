jqAsa2 = jQuery.noConflict();
jqAsa2(function( $ ) {
    $('.asa2-price-modal').click(function (event) {
        var me = this;
        if ($($(this).attr('href')).length > 0) {
            $($(this).attr('href')).css({
                visibility: 'visible',
                opacity: '1'
            });

        }
        return false;
    });

    $('.asa2-price-modal-close, .asa2-price-modal-overlay').click(function(event) {
        return hide_asa2_price_modal_overlay();
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27) { // escape key maps to keycode `27`
            hide_asa2_price_modal_overlay();
        }
    });

    function hide_asa2_price_modal_overlay() {
        $('.asa2-price-modal-overlay').css({
            visibility: 'hidden',
            opacity: '0'
        });
        return false;
    }
});