// инициализация приложения
$(document).ready(function(){
    // заполняем верхнее меню
	if($("#top-menu").length) {
		_fillTopMenu();
	}

	// заполняем список в центральной части
	if($("#list-grid").length) {
		_fillListGrid();
	}

	// заполняем панель Классификационные группы
	if($("#classification-tree").length) {
		_fillClassificationTree();
	}
	
	// заполняем панель Свойства полные
	if($("#propertiesfull-grid").length) {
		_fillPropertyGridEntityForm();
	}
	
});

// Служебная функция Кирилла проверки является ли объектом
isObject = function(o) {
    return null != o && 
        typeof o === 'object' && 
        Object.prototype.toString.call(o) === '[object Object]';
}


//построение перечня объектов в центральной части
_fillListGrid = function() {
	$('#list-grid').datagrid({
		loadMsg: 'Обновление',
		pagination: true,
		singleSelect: true,
		rownumbers: true,
		remoteSort: true,
		fitColumns: true,
		striped: true,
		pageSize: list_params.limit, // Приходит из шаблона entity_list.html
		columns: grid_columns, // Приходит из шаблона entity_list.html
		loader: function(param, success, error) { //загрузчик данных
			if(!jQuery.isEmptyObject(param)) { //формирование массива параметров для запроса (на основе фильтрации либо сортировки)

				list_params["filters"] = [];		
				if (typeof param.filter_objects !== 'undefined') {
					
					for(var propertyName in param.filter_objects) {
		            	
		            	if(param.filter_objects[propertyName].value != "") {
		            		if(typeof param.filter_objects[propertyName].func != "undefined") {
		            			var func = param.filter_objects[propertyName].func;
		            		} else {
		            			var func = "like";
		            		}
		            		if(func == 'like') {
		            			var search_value = '%'+param.filter_objects[propertyName].value+'%';
		            		} else {
		            			var search_value = param.filter_objects[propertyName].value;
		            		}
		            		list_params["filters"].push({"attribute": param.filter_objects[propertyName].attribute, "value": search_value, "func": func, "type": "string"});
		            	}
		            }		
					
				}

				if (typeof param.sort !== 'undefined' && typeof param.order !== 'undefined') {
					list_params.sort = {"attribute":param.sort, "dir":param.order};
				}
				// Обработка пагинации в таблице списка ?
				if (typeof param.page !== 'undefined' && typeof param.rows !== 'undefined') {
					list_params.limit = param.rows;
					list_params.offset = param.page;
				}
				// Обработка фильтра по группам из дерева классификационных групп
				if (typeof param.tree_classificator !== 'undefined') {
					list_params["filters"].push({"attribute": "group", "value": param.tree_classificator, "func": "eq"});
				}
			}
			
			var result_items_responce = JSONRPC_PROMISE("Entity.Items", list_params, Cookies.get('uid'));
			
			result_items_responce.success(function(data) {
				if(isObject(data.result)) { // Зачем узнать у Кирилла ??
					success({"rows": data.result.items, "total":data.result.count});
				} else if(typeof data.error != 'undefined') {
					$.messager.alert('Ошибка', data.error.message);
				}
			});

		},
		onClickRow: function(index, row) { // Обработка нажатия на строку таблицы
			var filtersForLoader = {};
			filtersForLoader.filter_objects = row;
			
			$('#data-grid-entity-in').datagrid('reload', filtersForLoader);
			$('#data-grid-entity-in').datagrid('resize');

			var entity_item_responce = JSONRPC_PROMISE(method_class+".Show", {__id: row.__id, __type: row.__type}, Cookies.get('uid'));
			entity_item_responce.success(function(data) {
				if(isObject(data.result)) {
					entity_prepeared_data = _formatDataForPropertyGridEntityView(data.result);

					//заполняем свойства объекта


					if($("#property-grid-entity").length) {
						$('#property-grid-entity').propertygrid({
						    data: entity_prepeared_data,
						    showGroup: false,
						    scrollbarSize: 0,
						    columns: [[
					            {field:'name', title:'Значение', width:100, resizable:false},
					            {field:'value', title:'Параметр', width:100, resizable:false},
					        ]],
						});
					}

				} else if(typeof data.error != 'undefined') {
					$.messager.alert('Ошибка', data.error.message);
				}
			});
		},
		onDblClickRow: function(index,row) {
			// при двойном щелчке открывать новую вкладку для редактирования свойств
			window.open(base_path+row.id, '_blank'); 
		}
	});
}

// Построение дерева классификационных групп
_fillClassificationTree = function() {
	$('#classification-tree').tree({
	    loader: function(param, success, error) {
			params = {}; // Значение по умолчанию
			if (typeof param.id != 'undefined') params.group_id = param.id; // Если передан id (идет запрос из дерева на развертывание)
			else if (group_tree_params != 'undefined') params = group_tree_params;

			var result_items_responce = JSONRPC_PROMISE("Classification.List", params, Cookies.get('uid'));
	
			result_items_responce.success(function(data) {
				if(isObject(data.result)) {
					var formatted_data = [];
					
					data.result.items.forEach( function (arrayItem) {
						formatted_data.push({
							id: arrayItem.id,
							text: arrayItem.code,
							state: "closed",
							_hasGroupChilds: arrayItem.hasGroupChilds,
						});
					});
					success(formatted_data)
				} else if(typeof data.error != 'undefined') {
					$.messager.alert('Ошибка', data.error.message);
				}
			});
	    },
	    onClick: function(node) {
	    	$('#list-grid').datagrid('reload', {tree_classificator: node.id});
	    },
	    loadFilter: function(data, parent){
			function forNodes(data, callback){
				var nodes = [];
				for(var i=0; i<data.length; i++){
					nodes.push(data[i]);
				}
				while(nodes.length){
					var node = nodes.shift();
					if (callback(node) == false){return;}
					if (node.children){
						for(var i=node.children.length-1; i>=0; i--){
							nodes.unshift(node.children[i]);
						}
					}
				}
			}
			forNodes(data, function(node){
				if (node.hasChilds == false){
					node.state = 'open';
					node.iconCls = 'tree-folder';
				}
			});
			return data;
		}
	});
}

// Формирование полной формы со свойствами сущности
_fillPropertyGridEntityForm = function() {
	// Запрос массива со свойствами
	var entity_item_responce = JSONRPC_PROMISE("Item.Show", {id: item_id}, Cookies.get('uid'));
	// Обработка полученного массива со свойствами
	entity_item_responce.success(function(data) {
		if(isObject(data.result)) {
			// построение полей формы			
			entity_prepeared_data = _formatDataForPropertyGridEntityView(data.result); // Форматирование данных для отображения свойств редактирования
			entity_prepeared_data_with_editor = []; // ??
			// Перебор всех полученных строк свойств
			entity_prepeared_data.rows.forEach(function(arrayItem){
				if(typeof arrayItem["classificator"] == 'undefined') {
					// Свойство чекбокс (да/нет)
					if(arrayItem.value == '<input disabled type="checkbox">' || arrayItem.value == '<input disabled checked type="checkbox">') {

						var switch_button_editor = {
							"type": "checkbox",
							"options": {
								"on": true,
								"off": false
							}
						}
						if(arrayItem.value == '<input disabled type="checkbox">') {
							arrayItem.value = '<input type="checkbox">';
						} else {
							arrayItem.value = '<input type="checkbox" checked>';
						}
						
						arrayItem.editor = switch_button_editor;
					} else {
						arrayItem.editor = 'text';
					}
					
				} else {

					var entity_data_responce = JSONRPC_PROMISE("List.List", {entity: arrayItem.classificator.__type}, Cookies.get('uid'));
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
									var row = $('#propertiesfull-grid').propertygrid('getRows')[index];
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

						arrayItem.editor = combobox_editor;
					});
				}

				entity_prepeared_data_with_editor.push(arrayItem);
				
			});
			entity_prepeared_data.rows = entity_prepeared_data_with_editor;
			
			//построение самой формы
			$('#propertiesfull-grid').propertygrid({
			    data: entity_prepeared_data,
			    showGroup: false,
			    scrollbarSize: 0,
			    //checkOnSelect: true,
			    columns: [[
		            {field:'name', title:'Значение', width:30, resizable:false},
		            {field:'value', title:'Параметр', width:70, resizable:false},
		        ]],
		        footer:'#property-grid-footer',
		        onAfterEdit:function(index,row){
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

		} else if(typeof data.error != 'undefined') {
			$.messager.alert('Ошибка', data.error.message);
		}
			
	});
	//функция при нажатии "удалить" объект
	$("#delete-entity").click(function(){
		var delete_params = {};
		delete_params["__id"] = item_id;
		delete_params["__type"] = params.entity;

		$.messager.confirm('Подтверждение','Вы уверены, что хотите удалить данный объект?',function(r){
		    if (r){
		        var entity_item_delete = JSONRPC_PROMISE(method_class+".Delete", delete_params, Cookies.get('uid'));
				entity_item_delete.success(function(data) {
					if(data.result == true) {
						
						$.messager.alert({
							title: 'Сообщение',
							msg: 'Объект удален',
							fn: function(){
								window.close();
							}
						});
						
					}
					if(typeof data.error != 'undefined') {
						$.messager.alert('Ошибка', data.error.message);
					}
				});
		    }
		});
		return false;
	});

	//сохранение формы свойств объекта
	$("#save-entity-form").click(function(){
		//var entity_rows = $('#propertiesfull-grid').propertygrid('getData');
		var new_object_form_data = {};
	    var form_fields_filled_by_user = $('#propertiesfull-grid').propertygrid('getChanges');

	    form_fields_filled_by_user.forEach(function(arrayItem){
	    	if(typeof arrayItem.property_name != 'undefined') {
	    		if(typeof arrayItem.tmpvalue != 'undefined') {
	    			if(typeof arrayItem["classificator"] != 'undefined') {
	    				arrayItem["classificator"].__id = arrayItem.tmpvalue;
	    				new_object_form_data[arrayItem.property_name] = arrayItem["classificator"]; //{"value": arrayItem.tmpvalue};
	    			}
	    		} else {
	    			if(arrayItem.value == '<input type="checkbox">') {
	    				new_object_form_data[arrayItem.property_name] = {"value": false};
	    			} else if(arrayItem.value == '<input type="checkbox" checked>') {
	    				new_object_form_data[arrayItem.property_name] = {"value": true};
	    			} else {
	    				new_object_form_data[arrayItem.property_name] = {"value": arrayItem.value};
	    			}	
	    		}
	    	}
	    });
	
		
		if(!$.isEmptyObject(new_object_form_data)) {
			var update_params = {};
			update_params["__id"] = item_id;
			update_params["__type"] = params.entity;

			for(var entity_filed in new_object_form_data) {
				if(typeof new_object_form_data[entity_filed].__type != 'undefined') {
					update_params[entity_filed] = new_object_form_data[entity_filed];
				} else {
					update_params[entity_filed] = new_object_form_data[entity_filed].value;
				}
			}
			
			var entity_item_update = JSONRPC_PROMISE(method_class+".Update", update_params, Cookies.get('uid'));
			entity_item_update.success(function(data) {
				
				if(isObject(data.result)) {
					$.messager.show({
		                title:'Подтверждение',
		                msg:'Изменения приняты.',
		                timeout:3000,
		                showType:'slide'
		            });
		
				}
				if(typeof data.error != 'undefined') {
					$.messager.alert('Ошибка', data.error.message);
				}
				
			});
		} else {
			$.messager.alert('Ошибка', 'Вы не изменили ни одного поля');
		}
		return false;
	});
}

// Получение перечня свойств сущности с их описанием
function _getEntityProperties(entity) {
    // json_schema = localStorage.getItem('schema_object'); // TODO: Сделать сохранение в хранилище
    // schema = JSON.parse(json_schema); 
	var entity_properties = []; // Список с описанием полей формы
	var result_properties_responce = JSONRPC_PROMISE("Entity.Properties", {"entity": entity}, Cookies.get('uid')); // Получение массива свойств сущности
	result_properties_responce.success(function(data) {
				if(isObject(data.result)) { // Зачем узнать у Кирилла ??
					for(var item in data.result.items) {
						// Формирование описания поля
						var grid_column = {};
						grid_column["field"] = item.name;
						grid_column["title"] = item.title;
						grid_column["required"] = item.required;
						entity_properties.push(grid_column);
					 }
				} else if(typeof data.error != 'undefined') {
					$.messager.alert('Ошибка', data.error.message);
				}
			});
    return [entity_properties];
}

// Форматирование данных для отображения свойств редактирования
_formatDataForPropertyGridEntityView = function(entity_unformated_data) {
    var formated_data_rows = [];
    var properties_count = 0;
	entity_properties = _getEntityProperties(entity); // Приходит из шаблона entity.html

	// Перебор строк неотформатированных данных
    for(var entity_filed in entity_unformated_data) {
		// Исключение свойств, не подлежащих обработке
        if ( 0 > $.inArray( entity_filed, ['type', 'id', 'head_key', 'rating'] ) ) {
            entity_filed_title = _getColumnTitle(entity_filed, entity_columns_with_parents[0]);
            if(isObject(entity_unformated_data[entity_filed])) {
                var entity_filed_value = entity_unformated_data[entity_filed].__info;
                var entity_filed_value_type = entity_unformated_data[entity_filed].__type;
                var entity_filed_value_id = entity_unformated_data[entity_filed].__id;
                var classificator = {"__type": entity_filed_value_type, "__id": entity_filed_value_id};

                formated_data_rows.push({"name":entity_filed_title, "value":entity_filed_value, "property_name": entity_filed, "classificator": classificator});
            } else {
                var entity_filed_value = entity_unformated_data[entity_filed];

                if(entity_filed_value === false) {
                    entity_filed_value = '<input disabled type="checkbox">';
                }
                if(entity_filed_value === true) {
                    entity_filed_value = '<input disabled checked type="checkbox">';
                }

                formated_data_rows.push({"name":entity_filed_title, "value":entity_filed_value, "property_name": entity_filed});
            }

            ++properties_count;
        }
    };
    return {"total": properties_count, rows: formated_data_rows};
}
