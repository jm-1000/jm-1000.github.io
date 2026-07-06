var mv = mv || {};
mv.common = {
    download: function(url) {
        if (url) {
            if (window.detection.isMS || window.detection.isFirefox || (window.detection.isSafari && window.detection.isMobileOrTablet)) {
                window.location.href = url;
            } else {
                var a = document.createElement('A');
                a.href = url;
                a.click();
            }
        }
    },
    downloadPost: function(id, reload) {
        jQuery.ajax({
            url: mv.downloadMateriais.config.ajaxUrl,
            async: false,
            data: {
                'action': 'mv_download_materiais_download',
                'post-id': id
            },
            success: function(data) {
                mv.common.download(data.url, reload);
            }
        });
    },
    getQueryString: function(name) {
        var regex = new RegExp('[\\?&]'+ name +'=([^&#]*)');
        var results = regex.exec(window.location.href);
        return results && results.length > 1 ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : '';
    },
    validateRequiredField: function(id, msg) {
        return mv.common.validateField(id, msg, function(value) {
            return !!value && !!jQuery.trim(value);
        });
    },
    validateEmailField: function(id, msg) {
        return mv.common.validateField(id, msg, function(value) {
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
        });
    },
    validatePasswordField: function(id, msg) {
        return mv.common.validateField(id, msg, function(value) {
            return /(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}/.test(value);
        });
    },
    validateEquality: function(id1, id2, msg) {
        return mv.common.validateField(id2, msg, function(value) {
            return value === jQuery(id1).val();
        });
    },
    validateField: function(id, msg, validate) {
        var input = jQuery(id);
        var error = input.parent().find('span');
        var isValid = validate(input.val());
        var oculto = error.data('oculto');

        if (!oculto) {
            oculto = error.css('display') == 'none' ? 'D' : 'V';
            error.data('oculto', oculto);
        }

        if (isValid) {
            input.removeClass('erro');

            if (oculto == 'D') {
                error.css('display', 'none');
            } else {
                error.css('visibility', 'hidden');
            }
        } else {
            input.addClass('erro');
            error.html(msg).css('visibility', '').css('display', '');
        }

        return isValid;
    },
    isEmpty: function(id) {
        var value = jQuery(id).val();
        return !value || !jQuery.trim(value);
    },
    exibirCaregando: function(botao, label) {
        label = label || 'CARREGANDO';

        if (botao.data('carregando') != 'true'){
            botao.prop('disabled', true);
            botao.data('carregando', 'true');
            botao.css('width', botao.outerWidth() + 1);

            var span = botao.find('> span');
            span.data('text', span.text());
            span.text(label + ' . . .');
            span.css({
                'display': 'inline-block',
                'width': span.width() + 5,
                'text-align': 'left'
            });

            setTimeout(function() {
                mv.common.ocultarCaregando(botao);
            }, 30000);

            var contador = 1;

            var handler = setInterval(function() {
                span.text(label + Array(contador + 1).join(' .'));
                if (contador++ >= 3) {
                    contador = 0;
                }
            }, 300);

            botao.data('interval', handler);
        }
    },
    ocultarCaregando: function(botao) {
        if (botao.data('carregando') == 'true'){
            botao.prop('disabled', false);
            botao.data('carregando', 'false');
            botao.css('width', '');

            var span = botao.find('> span');
            span.text(span.data('text'));
            span.data('text', '');

            span.css({
                'width': '',
                'text-align': 'center'
            });

            var handler = botao.data('interval');
            if (handler) {
                botao.data('interval', '');
                clearInterval(parseInt(handler));
            }
        }
    },
    formToJson: function(form) {
        var dados = {};

        form.find('input').each(function() {
            var input = jQuery(this);
            dados[input.attr('name')] = input.val();
        });

        return JSON.stringify(dados);
    },
    exibirErros: function(errors, customHandlers) {
        var errorField = jQuery('#mv-errors');
        if (errors && errors.length) {
            var messages = [];

            for (var i in errors) {
                var error = errors[i];

                if (customHandlers && customHandlers[error]) {
                     var msg = customHandlers[error](error);
                     if (msg) {
                         messages.push(msg);
                     }
                } else {
                    switch (error) {
                        case 'invalid_email':
                        case 'incorrect_password':
                        case 'invalid_username':
                            messages.push('E-mail ou senha incorretos.');
                            break;
                        case 'existing_user_login':
                        case 'existing_user_email':
                            messages.push('Endereço de e-mail já cadastrado.');
                            break;
                        default:
                            messages.push(error);
                            break;
                    }
                }
            }

            if (messages.length) {
                errorField.html(messages.join('<br/>')).show();
            } else {
                errorField.html('').hide();
            }
        }
    },
    limparErros: function() {
        jQuery('#mv-errors').hide().html('');
    }
};
