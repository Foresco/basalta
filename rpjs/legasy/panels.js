// Построение формы создания объекта
_fillPropertyGridItemCreateForm = function() {
        // Загрузка и парсинг схемы
        json_schema = localStorage.getItem('schema_object');
        schema = JSON.parse(json_schema);
        // Получение параметров сущности
        var entity_properties = [];
        _getEntityProperties(params.entity);
        // Функция получения свойств текущей сущности
        function _getEntityProperties(current_entity) {
            // Какой-то маппинг
            schema.map(function (entity) {
                // Что проверяется ??
                if (entity.entity.type == current_entity) {
                    // Запоминание родительской сущности для возможного обращения к ней
                    var parent_entity = entity.entity.parent;
                    // Перебор всех свойств сущности
                    entity.properties.forEach(function(item, i, arr) {
                        // Проверка существования свойства
                        var property_is_exist = false;
                        entity_properties.filter(function (obj) {	
                            if(obj.property_name == item.name) {
                                property_is_exist = true;
                            }
                        });
                        // Обработка ситуации, когда свойства не существует
                        if(!property_is_exist) {
                            if(item.required == true) {
                                var grid_column = {};
                                grid_column["name"] = item.title;
                                grid_column["property_name"] = item.name;
                                grid_column["required"] = item.required;
                                // Формирование полей для разных типов
                                if(item.type == 'link') { // Если тип Ссылка на другой объект
                                    grid_column["classificator"] = {__type: item.target};
    
                                    var entity_data_responce = JSONRPC_PROMISE_SYNC(method_class+".List", {entity: item.target}, Cookies.get('uid'));
                                    var editor_data = [];
                                    entity_data_responce.success(function(data) {
                                        data.result.items.forEach(function(arrayItem){
                                            editor_data.push({value: arrayItem.__id, text: arrayItem.__info});
                                        });
    
                                        var combobox_editor = {
                                            "type":"combobox",
                                            "options": {
                                                valueField: 'value',
                                                textField: 'text',
                                                panelHeight: 'auto',
                                                data: editor_data,
                                                onChange:function(value){
                                                    var index = $(this).closest('tr.datagrid-row').attr('datagrid-row-index');
                                                    var row = $('#property-grid-item-create-form').propertygrid('getRows')[index];
                                                    row['tmpname'] = value;
                                                    row['tmpvalue'] = value;
                                                    var data = $(this).combobox('getData');
                                                    for(var i=0; i<data.length; i++){
                                                        var d = data[i];
                                                        if (d['value'] == value){
                                                            row['tmpname'] = d['text'];
                                                            return;
                                                        }
                                                    }
                                                }
                                            }
                                        };
    
                                        grid_column["editor"] = combobox_editor;
                                    });
    
                                } else {
                                    if(item.class == 'boolean') {
                                        //checkbox
                                        var switch_button_editor = {
                                            "type": "checkbox",
                                            "options": {
                                                "on": true,
                                                "off": false
                                            }
                                        }
                                        grid_column["value"] = '<input type="checkbox">';
                                        grid_column["editor"] = switch_button_editor;
    
                                    } else {
                                        //text input
                                        grid_column["editor"] = "text";
                                    }
                                }
    
                                entity_properties.push(grid_column);
                            }
                        }
    
                    });
    
                    _getEntityProperties(parent_entity);
                }
            });
    
        }
        // Обратная сортировка свойств ??
        entity_properties.reverse();

        var entity_prepeared_data = {};
        entity_prepeared_data.rows = entity_properties;
        // Заполнение грида на форме создания
        $('#property-grid-item-create-form').propertygrid({
            data: entity_prepeared_data,
            showGroup: false,
            scrollbarSize: 0,
            columns: [[
                {field:'name', title:'Параметр', width:30, resizable:false},
                {field:'value', title:'Значение', width:70, resizable:false},
            ]],
            footer:'#property-grid-footer',
            onAfterEdit:function(index,row){
                // Обработка для отображения чекбоксов для булеан-полей
                if(row.value == 'true') {
                    $(this).propertygrid('updateRow',{
                        index:index,
                        row:{value:'<input type="checkbox" checked>'}
                    });
                } else if (row.value == 'false') {
                    $(this).propertygrid('updateRow',{
                        index:index,
                        row:{value:'<input type="checkbox">'}
                    });
                } else {
                    $(this).propertygrid('updateRow',{
                        index:index,
                        row:{value:row.tmpname}
                    });
                }
            },
        });
    
        // Назначение события для нажатия кнопки "Создать"
        $('#btn-create-new-object').bind('click', function(){
    
            var entity_rows = $('#property-grid-item-create-form').propertygrid('getData');
            var create_params = {};
            create_params["__type"] = params.entity;
            create_params["state"] = {__id: create_object_params.state, __type: "State"};
            create_params["source"] = {__id: create_object_params.source, __type: "Source"};
            create_params["preference"] = {__id: create_object_params.preference};
            
    
            entity_rows.rows.forEach(function(arrayItem){
                if(typeof arrayItem.property_name != 'undefined') {
                    if(typeof arrayItem.tmpvalue != 'undefined') {
                        if(typeof arrayItem["classificator"] != 'undefined') {
                            arrayItem["classificator"].__id = arrayItem.tmpvalue;
                            create_params[arrayItem.property_name] = arrayItem["classificator"]; //{"value": arrayItem.tmpvalue};
                        }
                    } else {
                        if(arrayItem.value == '<input type="checkbox">') {
                            create_params[arrayItem.property_name] = false;
                        } else if(arrayItem.value == '<input type="checkbox" checked>') {
                            create_params[arrayItem.property_name] = true;
                        } else {
                            create_params[arrayItem.property_name] = arrayItem.value;
                        }	
                    }
                }
            });
            //console.log(create_params);
            
            var entity_item_update = JSONRPC_PROMISE(method_class+".Create", create_params, Cookies.get('uid'));
            entity_item_update.success(function(data) {
                if(isObject(data.result)) {
                    
                    $.messager.show({
                        title:'Подтверждение',
                        msg:'Объект создан.',
                        timeout:3000,
                        showType:'slide'
                    });
                    $('#central-grid').datagrid('reload');
    
                    if($("#open_for_update").is(":checked")) {
                        var win = window.open(update_url+data.result.__id, '_blank');
                        if (win) {
                            //Browser has allowed it to be opened
                            win.focus();
                        } else {
                            //Browser has blocked it
                            alert('Разрешите всплывающие окна в настройках браузера');
                        }
                    }
    
                } else if(typeof data.error != 'undefined') {
                    $.messager.alert('Ошибка', data.error.message);
                }
            });
            return false;
        });
    }

// Отображение формы Входит в
_fillDataGridEntityIn = function() {
	$('#data-grid-entity-in').datagrid({
		loadMsg: 'Загрузка',
		emptyMsg: 'Объекты отсутствуют',
		pagination: false,
		singleSelect: true,
		rownumbers: false,
		remoteSort: true,
		fitColumns: true,
		striped: true,
		footer:'#data-grid-entity-in-footer',
		columns:[[
	        {field:'position',title:'Поз.',width:10},
	        {field:'parent',title:'Объект',width:40,
	        	formatter: function(value,row,index){
					return value.caption;
				}
	    	},
	        {field:'quantity',title:'Кол-во',width:20, align:'center',
	        	formatter: function(value,row,index){
					return parseInt(value);
				}
	    	},
	        {field:'description',title:'Примечание',width:30}
	    ]],
		loader: function(param, success, error) {
			if(!jQuery.isEmptyObject(param)) {
				if (typeof param.filter_objects !== 'undefined') {
					
					if (typeof param.toTop !== 'undefined') {
						var toTop = param.toTop;
					} else {
						var toTop = false;
					}

					var entity_item_in_responce = JSONRPC_PROMISE("Link.ListParents", {toTop: toTop, link: 'Part', entity: {__id: param.filter_objects.__id, __type: param.filter_objects.__type}}, Cookies.get('uid'));
					entity_item_in_responce.success(function(data) {
						if(isObject(data.result)) {
							success({"rows": data.result.items, "total":data.result.count});
						} else if(typeof data.error != 'undefined') {
							$.messager.alert('Ошибка', data.error.message);
						}
					});
				}
			}
			
		},
		onDblClickRow: function(index,row) {
			window.open(row.parent.__type.toLowerCase()+'/update/'+row.parent.__id, '_blank');
		}
	});

	//если нажата "до изделий"
	$("#is_entrance_in_to_top").change(function(){
		// alert(item_id);
		var filtersForLoader = Object; 
		filtersForLoader.entity = {"__id": 8, "__type": "Tool"}; // 
		// filtersForLoader.filter_objects = $('#central-grid').treegrid('getSelected');
		// filtersForLoader.filter_objects = item_id;

		if ($(this).is(':checked')) {
			filtersForLoader.toTop = true;
			$('#data-grid-entity-in').datagrid('reload', filtersForLoader);
		} else {
			filtersForLoader.toTop = false;
			$('#data-grid-entity-in').datagrid('reload', filtersForLoader);
		}
	});
}