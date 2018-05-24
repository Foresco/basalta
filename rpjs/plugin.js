// Свой плагин к easyui для отрисовки (и добавления функций ресайза) подвала для datagrid и propertygrid - места, где располагаются кнопки создать, удалить и т.п.
(function($){
    function initCss(){
        if (!$('#panel-footer-style').length){
            $('head').append(
                '<style id="panel-footer-style">' +
                '.panel-footer{overflow:hidden;border-width:1px;border-style:solid;}' +
                '.panel-body-nobottom{border-bottom-width:0}' +
                '</style>'
            );
        }
    }
    function addFooter(target){
        var opts = $.data(target,'panel').options;
        if (opts.footer){
            $(opts.footer).addClass('panel-footer').appendTo($(target).parent());
            $(target).addClass('panel-body-nobottom');
            $(opts.footer).css({
                display:'block',
                borderColor:$(target).css('border-bottom-color')
            })
        } else {
            $(target).removeClass('panel-body-nobottom');
        }
    }
    function setSize(target){
        var state = $.data(target,'panel');
        var opts = $.data(target,'panel').options;
        if (!isNaN(parseInt(opts.height))){
            var panel = state.panel;
            var pbody = panel.children('div.panel-body');
            var footer = panel.children('div.panel-footer');
            pbody._outerHeight(pbody._outerHeight() - footer._outerHeight());
        }
    }

    var plugin = $.fn.panel;
    $.fn.panel = function(options, param){
        initCss();
        if (typeof options != 'string'){
            return this.each(function(){
                plugin.call($(this), options, param);
                addFooter(this);
                setSize(this);
            });
        } else {
            return plugin.call(this, options, param);
        }
    };
    $.fn.panel.methods = plugin.methods;
    $.fn.panel.defaults = plugin.defaults;
    $.fn.panel.parseOptions = plugin.parseOptions;
    var resize = $.fn.panel.methods.resize;
    $.fn.panel.methods.resize = function(jq, param){
        return jq.each(function(){
            resize($(this), param);
            setSize(this);
        });
    }
})(jQuery);