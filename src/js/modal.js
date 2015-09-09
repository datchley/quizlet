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
        classes: {
            'info': 'modal-alert-info',
            'error': 'modal-alert-danger',
            'success': 'modal-alert-success'
        },
        show: function() {
            // Append markup element for modal
            var $el = $('body').append($modal),
                $alert = $el.find('.modal-alert');

            this.$alert = $alert;

            // Append mask if not already 
            if (!$('#modal-mask').length) {
                $('body').append($mask);
            }

            $mask.show();
            $modal.show();
    
            $('.modal-close', $modal).on('click', this.hide);
            return $el;
        },

        alert: function(type, message) {
           var self = this;

            if (arguments.length == 1) {
                message = type;
                type = 'info';
            }

            this.$alert
                .removeClass('modal-alert-info modal-alert-success modal-alert-danger')
                .addClass(this.classes[type.toLowerCase()]);

            $('.modal-alert-content', this.$alert).html(message);

            this.$alert.show();
            this.$alert.find('.close').click(function() {
                self.$alert.hide();
            });
        },

        hide: function() {
            $modal.hide().remove();
            $mask.hide();
        }
    };
};

module.exports = modal;
