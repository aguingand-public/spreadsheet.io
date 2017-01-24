$(function() {
    if(location.pathname=='/') {
        if(location.hash=='' || location.hash=='#')
            $('ul.navigation li').first().addClass('active');
        else
            $("a[href='/"+location.hash+"']").parent('li').addClass('active');
    }
    $('ul.navigation li').click(function() {
        $('ul.navigation li.active').removeClass('active');
        var $this = $(this);
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }
    });

    $('.js-ss-dropdown').click(function() {
      $(this).toggleClass('ss-dropdown--active');
    });
});
