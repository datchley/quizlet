var template = require('../templates/modal.hbs'),
    $ = require('jquery');

var uniqid = (function() {
    var id = 1000;
    return function() {
        return (id=id+1);
    };
})();

var $mask = $('<div id="modal-mask"></div>');
$mask.css({
    'position': 'fixed',
    'top': 0,
    'left': 0,
    'background': 'rgba(0,0,0,0.6)',
    'z-index': '1000',
    'width': '100%',
    'height': '100%',
    'display': 'none'
});

var modal = function(cfg) {
    var id = 'modal-'+uniqid(),
        $modal;

    cfg.id = id;

    $modal = $(template(cfg));
    $modal.css('z-index', '1999');

    return { 
        initialized: false,
        show: function() {
            // Append markup element for modal
            $('body').append($modal);

            // Append mask if not already 
            if (!$('#modal-mask').length) {
                $('body').append($mask);
            }

            $mask.show();
            $modal.show();
    
            if (!this.initialized) {
                $('.close', $modal).on('click', this.hide);
            }
        },

        hide: function() {
            $modal.hide();
            $mask.hide();
        }
    };
};

module.exports = modal;
