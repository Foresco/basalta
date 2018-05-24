// Функция получения главного меню в хранилище menu_object
function menuGet(){
    jQuery.ajax({
        url: backend_url,
        processData: false,
        type: 'POST',
        crossDomain: true,
        contentType: 'application/json',
        data: JSON.stringify({
            "jsonrpc": "2.0", 
            "method": "Common.menuMainGet", 
            "id": "aaa", // user_uid,
            "params": {}
        }),
        success: function(data, textStatus, jqXHR) {
            localStorage.setItem('menu_object', JSON.stringify(data.result));
        }
    });
}

// Формирование строки верхнего меню
_fillTopMenu = function() {
    menuGet(); // Наполнение состава меню в хранилище
    var container = $("#top-menu");
	var menu_object = localStorage.getItem('menu_object');
    var result = $.parseJSON(menu_object);
    var sorted_data = result.children.sort(dynamicSort('order_num')); // Сортировка пунктов по порядку TODO: убрать?

    $(container).html('');
    $.map(sorted_data, function(menu){

        var b = $('<a href="javascript:void(0)"></a>').appendTo(container);
        if (menu.children && !$.isEmptyObject(menu.children)){
            b.menubutton($.extend({}, menu, {
                menu: createMenu(menu.children.sort(dynamicSort('order_num'))),
                text: menu.caption,
                iconCls: menu.style
            }));
        } else {
            b.linkbutton($.extend({}, menu, {
                plain: true,
                text: menu.caption,
                iconCls: menu.style,
                onClick: function() {
                    _generateUrlAndRedirect(menu.action);
                }
            }));
        }
    });

   	// сортировка "на лету" по свойству
    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
    // формирование html - кода меню
    function createMenu(items){
        var m = $('<div></div>').appendTo('body').menu();
        _create(items);
        return m;

        function _create(items, p){
            $.map(items, function(item){
                m.menu('appendItem', $.extend({}, item, {
                    parent: (p?p.target:null),
                    text: item.caption,
                    iconCls: item.style,
                    onclick: function() {
                        _generateUrlAndRedirect(item.action);
                    }
                }));
                if (item.children && !$.isEmptyObject(item.children)){
                    var p1 = m.menu('findItem', item.caption);

                    _create(item.children, p1);
                }
            });
        }
    }

    // установка ссылки
    function _generateUrlAndRedirect(action_url) {
        if(action_url) {
            location.href=base_path+action_url;
        }
    }
}
