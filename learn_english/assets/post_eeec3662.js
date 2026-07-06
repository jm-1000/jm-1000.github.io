var mv = mv || {};
mv.post = {
    resizingModal: false,
    load: function() {
        jQuery('#mv-download-materiais-btn-baixar').click(mv.post.downloadClick);
    },
    downloadClick: function() {
        var botao = jQuery(this);
        mv.common.exibirCaregando(botao);

        jQuery.ajax({
            url: mv.downloadMateriais.config.ajaxUrl,
            data: {
                'action': 'mv_download_materiais_download',
                'post-id': mv.downloadMateriais.config.postId
            },
            success: function(data) {
                mv.common.ocultarCaregando(botao);
                mv.common.download(data.url);
            },
            error: function() {
                var url = mv.downloadMateriais.config.loginUrl + '?post=' + mv.downloadMateriais.config.postId;
                mv.modal.abrir(url, mv.post.callbackModal, { maxWidth: 644 });
            }
        });
    },
    callbackModal: function() {
        var botao = jQuery('#mv-download-materiais-btn-baixar');
        mv.common.ocultarCaregando(botao);
    },
    signupModal: function() {
        var url = mv.downloadMateriais.config.signupUrl + '?post=' + mv.downloadMateriais.config.postId;
        mv.modal.abrir(url, null, { maxWidth: 405 });
    },
    recarregarPagina: function(tag) {
        mv.modal.fechar(function() {
            if (tag) {
                location.href = location.href + '?' + tag;
            } else {
                location.reload();
            }
        });
    }
};

jQuery(mv.post.load);
