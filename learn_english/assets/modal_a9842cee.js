var mv = mv || {};
mv.modal = {
    iframeId: 0,
    iframe: null,
    load: function() {
        jQuery(window).on('resize', mv.modal.windowResize);
    },
    abrir: function(url, callback, params) {
        if (mv.modal.iframe) {
            mv.modal.carregarIframe(url, null, params);
        } else {
            mv.modal.criarElementos(url, callback, params);
        }

        if (/(iPod|iPhone)/.test(navigator.userAgent)) {
            jQuery('#td-outer-wrap').addClass('mv-modal-open');
        }
    },
    fechar: function(callback) {
        mv.modal.iframe = null;

        jQuery('#mv-modal-overlay-wrapper').fadeOut(200, function() {
            jQuery(this).remove();
        });

        jQuery('#mv-modal-content').fadeOut(200, function() {
            jQuery(this).remove();
            callback && setTimeout(callback, 200);
        });

        if (/(iPod|iPhone)/.test(navigator.userAgent)) {
            jQuery('#td-outer-wrap').removeClass('mv-modal-open');
        }
    },
    exibir: function(novo, params) {
        jQuery('#mv-modal-content').attr('style', '').css({
            'position': 'fixed',
            'top': '50%',
            'left': '50%',
            'opacity': '1',
            'display': 'none'
        });

        jQuery('#mv-modal-overlay-wrapper').attr('style', '').css({
            'position': 'absolute',
            'top': '0',
            'bottom': '0',
            'left': '0',
            'right': '0',
            'display': novo ? 'none' : ''
        });

        jQuery('#mv-modal-overlay').attr('style', '').css({
            'position': 'fixed',
            'top': '0',
            'bottom': '0',
            'left': '0',
            'right': '0',
            'opacity': '0.3',
            'width': '100%',
            'height': '100%',
            'background-color': 'black'
        });

        jQuery('#mv-modal-box').attr('style', '');

        if (params) {
            jQuery('#mv-modal-box').data({
                'max-width': params.maxWidth || 0
            });
        }

        jQuery('#' + mv.modal.obterIdIframe()).attr('style', '');

        if (novo) {
            jQuery('#mv-modal-overlay-wrapper').fadeIn(200);
        }

        jQuery('#mv-modal-content').fadeIn(300);
    },
    obterIdIframe: function() {
        return 'mv-modal-iframe' + '-' + mv.modal.iframeId;
    },
    novoIdIframe: function() {
        mv.modal.iframeId++;
        return mv.modal.obterIdIframe();
    },
    windowResize: function() {
        setTimeout(function() {
            if (!mv.modal.resizingModal) {
                mv.modal.resizingModal = true
                mv.modal.redimencionar();
                mv.modal.resizingModal = false;
            }
        });
    },
    criarElementos: function(url, callback, params) {
        var oculto = 'position:fixed; height: 1px; left:-1; opacity:0; width:1px';
        jQuery('body').append(jQuery('<div>', {
            'id': 'mv-modal-content',
            'style': oculto
        })).append(jQuery('<div>', {
            'id': 'mv-modal-overlay-wrapper',
            'style': oculto
        }));

        jQuery('#mv-modal-content').append(jQuery('<div>', {
            'id': 'mv-modal-box',
            'class': 'mv-modal login',
            'style': oculto
        })).append(jQuery('<img>', {
            'src':  mv.downloadMateriais.images.close,
            'alt': 'X',
            'class': 'fechar'
        }).click(function() {
            mv.modal.fechar(callback);
        }));

        jQuery('#mv-modal-overlay-wrapper').append(jQuery('<div>', {
            'id': 'mv-modal-overlay',
            'style': oculto
        })).click(mv.modal.fechar);

        mv.modal.carregarIframe(url, callback, params);

        jQuery(window).keyup(function(e) {
            if (e.keyCode == 27) {
                mv.modal.fechar();
            }
        });
    },
    carregarIframe: function(url, callback, params) {
        var iframe = mv.modal.iframe;
        var abrir = function() {
            mv.modal.exibir(iframe == null, params);
            mv.modal.redimencionar();
            callback && setTimeout(callback, 300);
        };

        jQuery('#mv-modal-box').append(jQuery('<iframe>', {
            'id': mv.modal.novoIdIframe(),
            'src': url,
            'class': 'mv-modal',
            'style': 'heigth: 0; opacity: 0; width: 0;'
        }).one('load', function() {
            if (iframe) {
                iframe.fadeOut(300, function(){
                    jQuery(this).remove();
                    setTimeout(abrir);
                });
            } else {
                setTimeout(abrir);
            }
        }));

        mv.modal.iframe = jQuery('#' + mv.modal.obterIdIframe());
    },
    redimencionar: function() {
        var modal = jQuery('#mv-modal-box');

        if (modal.length) {
            var win = jQuery(window);
            var iframe = jQuery('#' + mv.modal.obterIdIframe());
            var fixed = jQuery('#mv-modal-content');

            if (win.width() <= 675) {
                var width = win.width() - 30;
                modal.width(width);
                fixed.css('margin-left', -width / 2);
            } else {
                var width = parseInt(modal.data('max-width')) || 650;
                modal.width(width);
                fixed.css('margin-left', -width / 2);
            }

            var height = iframe[0].contentWindow.document.body.offsetHeight;
            var maxHeight = (typeof window.outerHeight != 'undefined')
                ? Math.max(window.outerHeight, win.height()) - 30
                : win.height() - 30;
            if (height > maxHeight) {
                height = maxHeight;
            }

            fixed.css('margin-top', -height / 2);
            modal.height(height);

            if (/(iPod|iPhone)/.test(navigator.userAgent)) {
                jQuery('#mv-modal-content .fechar').css({right: '10px', top: '10px'});
                modal.attr('style', '').css({width: '100%',  position: 'relative'});
                fixed.attr('style', '').css({opacity: 1, padding: '15px', position: 'relative'});
            }
        }
    }
};

jQuery(mv.modal.load);
