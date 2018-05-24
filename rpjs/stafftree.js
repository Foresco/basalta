// Системные функции используются для получения значений (идентификаторы, связи и тп) внутри дерева состава

// Функция формирования дерева состава
_fillCompositionTreeGrid = function() {
	var caption_autocomplited_object_found = false; // установка по умолчанию, объект не найден для автокомплита
	var filters_wrapper_active_panel = 'Добавление записи в состав'; // ??

	// Получение родителя дерева
	var entity_item_responce = JSONRPC_PROMISE(method_class+".Show", {__id: item_id, __type: params.entity}, Cookies.get('uid'));
	entity_item_responce.success(function(data) {

		if(isObject(data.result)) {

			entity_prepeared_data = _formatDataForPropertyGridEntityView(data.result);
			entity_prepeared_data_tree = _formatDataForEntityView(data.result);
			// Вызов функции получения потомков
			_createTreeGridForItem(entity_prepeared_data_tree);

			entity_prepeared_data_with_editor = [];
			entity_prepeared_data.rows.forEach(function(arrayItem){
				if(typeof arrayItem["classificator"] == 'undefined') {
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
					// ??
					var entity_data_responce = JSONRPC_PROMISE(method_class+".List", {entity: arrayItem.classificator.__type}, Cookies.get('uid'));
					var editor_data = [];
					entity_data_responce.success(function(data) {

						if(isObject(data.result)) {
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
										var row = $('#property-grid-entity-form').propertygrid('getRows')[index];
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

						} else if(typeof data.error != 'undefined') {
							$.messager.alert('Ошибка', data.error.message);
						}
					});
				}
				// ??
				entity_prepeared_data_with_editor.push(arrayItem);
			});
			entity_prepeared_data.rows = entity_prepeared_data_with_editor;
			
			$('#property-grid-entity-form').propertygrid({
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
			
			// ??
			var type_combobox_editor = {
				"type":"combobox",
				"options": {
					valueField: 'value',
					textField: 'text',
					panelHeight: 'auto',
					data: object_types,
					formatter:function(row){
						var imageFile = 'assets/img/icons/' + row.icon;
		        		return '<img class="item-img" src="'+imageFile+'"/> <span class="item-text">'+row.text+'</span>';
					},
					onChange:function(value){
						var index = $(this).closest('tr.datagrid-row').attr('datagrid-row-index');
						var row = $('#property-grid-relation-create-form').propertygrid('getRows')[index];
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
				},
			};
			// ??
			var unit_data = JSONRPC_PROMISE(method_class+".List", {entity: 'Unit'}, Cookies.get('uid'));
			unit_data.success(function(data) {

				if(isObject(data.result)) {
					
					var unit_prepeared_data = [];
					data.result.items.forEach(function(arrayItem){
						unit_prepeared_data.push({value: arrayItem.__id, text: arrayItem.__info});
					});
					// ??
					var unit_combobox_editor = {
						"type":"combobox",
						"options": {
							valueField: 'value',
							textField: 'text',
							panelHeight: 'auto',
							data: unit_prepeared_data,
							onChange:function(value){
								var index = $(this).closest('tr.datagrid-row').attr('datagrid-row-index');
								var row = $('#property-grid-relation-create-form').propertygrid('getRows')[index];
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
							},
						},
					};
					var caption_textbox_editor = {
						"type": "textbox",
						"options": {
							cls: 'caption_textbox_field',
							onChange: function(newValue,oldValue) {
							}
						},
					}

					// форма создания объекта в дереве состава Используется ??
					$('#property-grid-relation-create-form').propertygrid({
					    data: {rows:[
					    	{
					    		property_id: "__type",
					    		name: "Тип",
					    		value: null,
					    		editor: type_combobox_editor,
					    	},
					    	{property_id: "caption", name: "Обозначение", value: null, editor: caption_textbox_editor},
					    	{property_id: "name", name: "Наименование", value: null, editor: 'text'},
					    	{property_id: "unit", name: "Единица измерения", value: null, editor: unit_combobox_editor},
					    	{property_id: "position", name: "Позиция", value: null, editor: 'text'},
					    	{property_id: "quantity", name: "Количество", value: null, editor: 'text'},
					    	{property_id: "regQuantity", name: "Количество на регулировку", value: null, editor: 'text'},
					    ]},
					    showGroup: false,
					    scrollbarSize: 0,
					    columns: [[
				            {field:'name', title:'Значение', width:30, resizable:false},
				            {field:'value', title:'Параметр', width:70, resizable:false},
				        ]],
				        footer:'#property-grid-footer',
				        onAfterEdit:function(index,row){
							$(this).propertygrid('updateRow',{
								index:index,
								row:{value:row.tmpname}
							});
						},
						onBeginEdit:function(index, row) {
							
							var this_field = $('.caption_textbox_field');
							var row_index = this_field.closest('tr.datagrid-row').attr('datagrid-row-index');
							this_field.find('.textbox-text').autocomplete({
							    lookup: function (query, done) {
							    	var search_caption_params = {
							    		entity: 'Object',
							    		limit: 20,
							    		filters: [{
							    			attribute: "caption",
							    			type: "string",
							    			value: '%'+query+'%',
							    			func: "like"
							    		}]
							    	};
							        var caption_list_result = JSONRPC_PROMISE(method_class+".List", search_caption_params, Cookies.get('uid'));
									caption_list_result.success(function(data) {

										if(isObject(data.result)) {
											
											var suggestions_list = [];
											data.result.items.forEach(function(arrayItem){
												suggestions_list.push({value: arrayItem.caption, data: arrayItem.caption, __id: arrayItem.__id, name: arrayItem.name, __type: arrayItem.__type});
											});
											done({suggestions: suggestions_list});

										} else if(typeof data.error != 'undefined') {
											$.messager.alert('Ошибка', data.error.message);
										}
										
									});
							    },
							    onSelect: function (suggestion) {
							    	
									var selected_type = suggestion.__type;
									
									for(type in object_types) {
										if (type.value == suggestion.__type) {
											selected_type = type.text;
										}
									}

									var selected_suggestion_params = JSONRPC_PROMISE(method_class+".ShowObjectByCaption", {caption: suggestion.value, __type: suggestion.__type}, Cookies.get('uid'));
									selected_suggestion_params.success(function(data) {
										if(typeof data.error == 'undefined') {
											//found
											var type_text;
											object_types.forEach(function(arrayItem){

												if (arrayItem.value == data.result.__type) {
													type_text = arrayItem.text;
												}
											});

											$('#property-grid-relation-create-form').propertygrid('updateRow',{
												index: parseInt(row_index)-1,
												row:{value:type_text, tmpvalue: data.result.__type, tmpname: type_text}
											});

											// var row = $('#property-grid-relation-create-form').propertygrid('getRows')[parseInt(row_index)-1];
											// row['tmpname'] = data.result.__type;
											// row['tmpvalue'] = data.result.__type;

											$('#property-grid-relation-create-form').propertygrid('updateRow',{
												index: parseInt(row_index)+1,
												row:{value:suggestion.name}
											});
											if(data.result.unit.__info != 'undefined') {
												$('#property-grid-relation-create-form').propertygrid('updateRow',{
													index: parseInt(row_index)+2,
													row:{value:data.result.unit.__info}
												});
											}
											
											caption_autocomplited_object_found = data.result;
										} else {
											
											caption_autocomplited_object_found = false;
										}

								    	$('#property-grid-relation-create-form').propertygrid('updateRow',{
											index: row_index,
											row:{value:suggestion.value}
										});
								    	this_field.find('.textbox-value').val(suggestion.value);
									});
							    }
							});
						}
					});
					// ??
					$('#btn-for-tree').bind('click', function(){
						
						var selected_node = $('#composition-treegrid').treegrid('getSelected');

					    if(isObject(selected_node)) {

					    	var new_object_form_data = {};
						    var form_fields_filled_by_user = $('#property-grid-relation-create-form').propertygrid('getChanges');
							// ??
						    form_fields_filled_by_user.forEach(function(arrayItem){
						    	if(typeof arrayItem.property_id != 'undefined') {
						    		if(typeof arrayItem.tmpvalue != 'undefined') {
						    			new_object_form_data[arrayItem.property_id] = {"value": arrayItem.tmpvalue};
						    		} else {
						    			new_object_form_data[arrayItem.property_id] = {"value": arrayItem.value};
						    		}
						    	}
						    });
							// ??
						    if(typeof new_object_form_data.__type != 'undefined' &&
						    	typeof new_object_form_data.caption != 'undefined' &&
						    		typeof new_object_form_data.name != 'undefined' &&
						    		typeof new_object_form_data.position != 'undefined' &&
						    		typeof new_object_form_data.quantity != 'undefined' &&
						    		typeof new_object_form_data.regQuantity != 'undefined' &&
						    			typeof new_object_form_data.unit != 'undefined') {

							    // check if Entity exists
							    var selected_suggestion_params = JSONRPC_PROMISE("Entity.ShowObjectByCaption", {caption: new_object_form_data.caption.value, __type: new_object_form_data.__type.value}, Cookies.get('uid'));
								selected_suggestion_params.success(function(data) {
									if(typeof data.error != 'undefined') {
										// this item not find
										// create new Entity
								    	var new_entity_params = {
								    		__type: new_object_form_data.__type.value,
								    		caption: new_object_form_data.caption.value,
								    		name: new_object_form_data.name.value,
								    		state: {__id: create_object_params.state},
								    		source: {__id: create_object_params.source},
								    		unit: {__id: new_object_form_data.unit.value},
								    		preference: {__id: create_object_params.preference},
								    	};
										// ??
								    	var create_new_entity_responce = JSONRPC_PROMISE("Entity.Create", new_entity_params, Cookies.get('uid'));
										create_new_entity_responce.success(function(data) {
											if(typeof data.error != 'undefined') {
								 				$.messager.alert('Ошибка', data.error.message);
											} else {
												// create link for new entity
												var new_link_params = {
													__type: "Part",
													parent: {__id: selected_node.__id, __type: selected_node.__type },
													child: data.result,
													position: new_object_form_data.position.value,
													quantity: new_object_form_data.quantity.value,
													regQuantity: new_object_form_data.regQuantity.value,
												};
												// ??
												var create_new_link_responce = JSONRPC_PROMISE("Link.Create", new_link_params, Cookies.get('uid'));
												create_new_link_responce.success(function(data) {
													if(typeof data.error != 'undefined') {
														$.messager.alert('Ошибка', data.error.message);
													} else {
														$.messager.show({
											                title:'Подтверждение',
											                msg:'Объект добавлен в состав.',
											                timeout:3000,
											                showType:'slide'
											            });
											            $('#composition-treegrid').treegrid('reload', {id: selected_node.__id});
													}
												});
											}
										});
									} else {
										// ??
										var new_link_params = {
											__type: "Part",
											parent: {__id: selected_node.__id, __type: selected_node.__type },
											child: data.result,
											position: new_object_form_data.position.value,
											quantity: new_object_form_data.quantity.value,
											regQuantity: new_object_form_data.regQuantity.value,
										};
										// ??
										var create_new_link_responce = JSONRPC_PROMISE("Link.Create", new_link_params, Cookies.get('uid'));
										create_new_link_responce.success(function(data) {
											if(typeof data.error != 'undefined') {
												$.messager.alert('Ошибка', data.error.message);
											} else {
												$.messager.show({
									                title:'Подтверждение',
									                msg:'Объект добавлен в состав.',
									                timeout:3000,
									                showType:'slide'
									            });
									            $('#composition-treegrid').treegrid('reload', {id: selected_node.__id});
											}
										});
									}
								});
							} else {
						     	$.messager.alert('Ошибка', 'Пожалуйста, заполните все поля для добавления объекта.');
						    }
						} else {
							$.messager.alert('Ошибка', 'Пожалуйста, укажите строку в дереве состава, куда необходимо вставить новый объект.');
						}
						return false;
					});

				} else if(typeof data.error != 'undefined') {
					$.messager.alert('Ошибка', data.error.message);
				}
			});
		} else if(typeof data.error != 'undefined') {
			$.messager.alert('Ошибка', data.error.message);
		}
	});

	// Функция создания объекта в составе дерева
	function _createTreeGridForItem(entity_prepeared_data) {

		var parent_item = {};
		entity_prepeared_data.rows.forEach(function(arrayItem){
			var attribute_name = arrayItem.property_name;
			if(typeof parent_item[attribute_name] == 'undefined') {
	    		parent_item[attribute_name] = arrayItem.value;
	    	}
		});
		$('#composition-treegrid').treegrid({
			loadMsg: 'Обновление',
			idField: "__id",
			treeField: "caption",
			pagination: false,
			rownumbers: true,
			remoteSort: true,
			fitColumns: true,
			striped: true,
			loader: function(param, success, error) {

				var parent_id = item_id;
				if (typeof param.id !== 'undefined') {
					parent_id = param.id;
				}

				var realtion_params = {};
				realtion_params.entity = 'Part';
				realtion_params.filters = [{attribute: 'parent', value: parent_id, func: 'eq', type: 'entity'}];
				var treegrid_items_responce = JSONRPC_PROMISE("Link.Part.ListChilds", realtion_params, Cookies.get('uid'));
				treegrid_items_responce.success(function(data) {

					if(isObject(data.result)) {
											
						var prepeared_data = [];
						
						data.result.items.forEach(function(arrayItem){
							if(arrayItem.child._hasLinkChilds == true) {
								arrayItem.child.state = "closed";
							}
							//for position and quantity fields
							arrayItem.child.position = arrayItem.position;
							arrayItem.child.quantity = parseInt(arrayItem.quantity);
							if(arrayItem.regQuantity) {
								arrayItem.child.regQuantity = parseInt(arrayItem.regQuantity);
							} else {
								arrayItem.child.regQuantity = arrayItem.regQuantity;
							}
							arrayItem.child.relation_id = arrayItem.__id;
							arrayItem.child.relation_type = arrayItem.__type;
							prepeared_data.push(arrayItem.child);

							if(isObject(arrayItem.child.unit)) {
								arrayItem.child.unit = arrayItem.child.unit.__info;
							}

						});

						if (typeof param.id !== 'undefined') {
							success(prepeared_data);
						} else {
							parent_item.children = prepeared_data;
							success([parent_item]);
						}

					} else if(typeof data.error != 'undefined') {
						$.messager.alert('Ошибка', data.error.message);
					}

					

				});

			},
			loadFilter: function(data) {
				if (!this.columns){
					
					entity_columns_with_parents = _getEntityColumns(params.entity);
					//for position and quantity fields
					entity_columns_with_parents[0].push({field: "quantity", title: "Кол-во"});
					entity_columns_with_parents[0].push({field: "regQuantity", title: "на рег."});
					entity_columns_with_parents[0].push({field: "position", title: "поз."});
					entity_columns_with_parents[0].push({field: "grid_actions", title: " "});
					entity_columns_with_parents[0].push({field: "relation_id"});
					entity_columns_with_parents[0].push({field: "relation_type"});
					entity_columns_with_parents[0].push({field: "_parentId"});
					var object_item = data[0];
					object_item.position = null;
					object_item.quantity = null;
					object_item.regQuantity = null;
					object_item.grid_actions = null;
					object_item.relation_id = null;
					object_item.relation_type = null;
					object_item._parentId = null;
					var grid_columns = _generateGridColumns(entity_columns_with_parents, object_item);
					var grid_columns_with_settings = [];
					grid_columns[0].forEach(function(arrayItem){
						if(composition_treegrid_columns.indexOf(arrayItem.field) >= 0) {
						//if (composition_treegrid_columns.includes(arrayItem.field)) {
							
							if(0 > $.inArray(arrayItem.field, ['grid_actions', 'name', 'unit']) ) {
								arrayItem.editor = 'text';
							}
							if ( 0 > $.inArray( arrayItem.field, ['relation_id', 'relation_type', '_parentId'])) {
								arrayItem.hidden = false;
							} else {
								arrayItem.hidden = true;
							}
							if(arrayItem.field == 'grid_actions') {
								arrayItem.sortable = false;
							}

							grid_columns_with_settings.push(arrayItem);
						}
					});
					
					this.columns = [grid_columns_with_settings];
					
					var opts = $(this).treegrid('options');
					var url = opts.url;
					$(this).treegrid({columns:this.columns,url:null});
					setTimeout(function(){
						opts.url = url;
					},0);
				}
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
					switch(node.__type) {
						case 'StandartPart':
							node.iconCls = 'standart';
							break;
						default:
							node.iconCls = node.__type.toLowerCase();
					}
				});
				
				return data;
			},
			onBeforeEdit:function(row){
				row.editing = true;
				$(this).treegrid('refresh', row.__id);
			},
			onAfterEdit:function(row, changes){

				var update_params_for_link = {};
				var update_params_for_entity = {};
				

				if (typeof changes.position !== 'undefined') {
					update_params_for_link.position = changes.position;
				}
				if (typeof changes.quantity !== 'undefined') {
					update_params_for_link.quantity = changes.quantity;
				}
				if (typeof changes.regQuantity !== 'undefined') {
					update_params_for_link.regQuantity = changes.regQuantity;
				}
				if (typeof changes.caption !== 'undefined') {
					update_params_for_entity.caption = changes.caption;
				}

				if(!$.isEmptyObject(update_params_for_link)) {
					update_params_for_link["__id"] = row.relation_id;
					update_params_for_link["__type"] = row.relation_type;
					var link_item_update = JSONRPC_PROMISE("Link.Update", update_params_for_link, Cookies.get('uid'));
					link_item_update.success(function(data) {
						if(isObject(data.result)) {
							$.messager.show({
				                title:'Подтверждение',
				                msg:'Изменения приняты.',
				                timeout:3000,
				                showType:'slide'
				            });
						} else if(typeof data.error != 'undefined') {
							$.messager.alert('Ошибка', data.error.message);
						}
					});
				}

				if(!$.isEmptyObject(update_params_for_entity)) {
					update_params_for_entity["__id"] = row.__id;
					update_params_for_entity["__type"] = row.__type;
					var entity_item_update = JSONRPC_PROMISE(method_class+".Update", update_params_for_entity, Cookies.get('uid'));
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
				}
				$('#composition-treegrid').treegrid('reload', {id: row.__id});
				// if(success == true) {
				

				// for(var entity_filed in changes) {
				// 	if(0 > $.inArray(entity_filed, ['relation_id', 'position', '_parentId'])) {
				// 		update_params[entity_filed] = changes[entity_filed];
				// 	}
				// }
				row.editing = false;
				$(this).treegrid('refresh', row.__id);
			},
			onCancelEdit:function(row){
				row.editing = false;
				$(this).treegrid('refresh', row.__id);
			},
			onContextMenu: function(e, row) {
				if (row) {
	                e.preventDefault();
	                $(this).treegrid('select', row.__id);
	                $('#mm').menu('show',{
	                    left: e.pageX,
	                    top: e.pageY
	                });
	            }
			},
			onClickRow: function(row) {
				
				var filtersForLoader = {};
				filtersForLoader.filter_objects = row;
				
				$('#data-grid-entity-in').datagrid('reload', filtersForLoader);
				
				var entity_item_responce = JSONRPC_PROMISE(method_class+".Show", {__id: row.__id, __type: row.__type}, Cookies.get('uid'));
				entity_item_responce.success(function(data) {

					if(isObject(data.result)) {
						
						entity_prepeared_data = _formatDataForPropertyGridEntityView(data.result);

						$('#property-grid-entity').propertygrid({
						    data: entity_prepeared_data,
						    showGroup: false,
						    scrollbarSize: 0,
						    columns: [[
					            {field:'name', title:'Значение', width:100, resizable:false},
					            {field:'value', title:'Параметр', width:100, resizable:false},
					        ]],
						});



						//prepare east panel and accordion region
						// var east_region = $('#cc').layout('panel', 'east').panel('options');
						// if(east_region.collapsed == true) {
						// 	$('#cc').layout('expand', 'east');
						// }
						// var panels = $('#filters-wrapper').accordion('panels');
						// $.map(panels, function(p){
						// 	var panel_options = p.panel('options');
						// 	if(panel_options.title == 'Свойства') {
						// 		p.panel('expand');
						// 	} else {
						// 		p.panel('collapse');
						// 	}
						// });

					} else if(typeof data.error != 'undefined') {
						$.messager.alert('Ошибка', data.error.message);
					}
					
				});
			},
			onDblClickRow: function(row) {
				
				window.open(row.__type.toLowerCase()+'/update/'+row.__id, '_blank');

			}
		});
		//входит в для дерева состава
		$('#data-grid-entity-in').datagrid({
			loadMsg: 'Загрузка',
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
	}
	// До изделий для дерева состава
	$("#is_entrance_in_to_top").change(function(){
		var filtersForLoader = {};
		filtersForLoader.filter_objects = $('#composition-treegrid').treegrid('getSelected');
		// ??
		if ($(this).is(':checked')) {
			filtersForLoader.toTop = true;
			$('#data-grid-entity-in').datagrid('reload', filtersForLoader);
		} else {
			filtersForLoader.toTop = false;
			$('#data-grid-entity-in').datagrid('reload', filtersForLoader);
		}
	});
}

// Системные функции используются для получения значений (идентификаторы, связи и тп) внутри дерева состава
// Возвращает идентификатор узла в строке ??
getRowNode = function(target){
	var tr = $(target).closest('tr.datagrid-row');
	return parseInt(tr.attr('node-id'));
}
// Возвращает идентификатор связи ??
getRowLink = function(target){
	var tr = $(target).closest('tr.datagrid-row');
	var wrapper = tr.find("[field='relation_id']");
	return parseInt(wrapper.text());
}
// Возвращает тип связи ??
getRowRelationType = function(target){
	var tr = $(target).closest('tr.datagrid-row');
	var wrapper = tr.find("[field='relation_type']");
	return wrapper.text();
}
// Возвращает идентификатор родителя ??
getRowParentId = function(target){
	var tr = $(target).closest('tr.datagrid-row');
	var wrapper = tr.find("[field='_parentId']");
	return parseInt(wrapper.text());
}
// Перевод строки дерева в режим редактирования ??
editrow = function(target) {
	$('#composition-treegrid').treegrid('select', getRowNode(target));
	var row = $('#composition-treegrid').treegrid('getSelected');
    if (row){
        $('#composition-treegrid').treegrid('beginEdit', row.__id);
    }
}
// Отмена режима редактирования строки дерева ??
canceleditrow = function(target) {
	$('#composition-treegrid').treegrid('cancelEdit', getRowNode(target));
}
// Удаление строки из дерева состава
deleterow = function(target) {
	$.messager.confirm('Подтверждение', 'Вы уверены, что хотите исключить объект из состава?',function(r){
		if (r){
			// Получение необходимых идентификаторов
			var relation_id = getRowLink(target);
			var relation_type = getRowRelationType(target);
			var node_id = getRowNode(target);
			var parent_id = getRowParentId(target);
			// Оправка запроса на удаление
			var item_delete_responce = JSONRPC_PROMISE("Link.Delete", {__id: relation_id, __type: relation_type}, Cookies.get('uid'));
			item_delete_responce.success(function(data) {
				if(typeof data.result != 'undefined') {
					if(data.result == true) {
						// Отобра
						$.messager.show({
			                title:'Подтверждение',
			                msg:'Связь удалена.',
			                timeout:3000,
			                showType:'slide'
			            });
					}
				}
				if(typeof data.error != 'undefined') {
					$.messager.alert('Ошибка', data.error.message);
				}
				//to do reload parent and do state is open
				if(item_id != parent_id) {
					$('#composition-treegrid').treegrid('reload', {id: parent_id});
				} else {
					$('#composition-treegrid').treegrid('reload');
				}
			});
		}
	});
}
// Сохранение изменений строки дерева состава ??
saverow = function(target) {
	$.messager.confirm('Подтверждение', 'Вы уверены, что хотите применить изменения?',function(r){
		if (r){
			var node_id = getRowNode(target);
			$('#composition-treegrid').treegrid('endEdit', node_id);

		}
	});
}

// Удаление объекта дерева состава, в чем отличие от deleterow ??
removeTreeGridItem = function() {
	var selected_node = $('#composition-treegrid').treegrid('getSelected');
	$.messager.confirm('Подтверждение', 'Вы уверены, что хотите удалить объект?',function(r){
		if (r){
			var relation_id = selected_node.relation_id;
			var relation_type = selected_node.relation_type;
			var node_id = selected_node.__id;
			var parent_id = selected_node._parentId;
			
			var item_delete_responce = JSONRPC_PROMISE("Link.Delete", {__id: relation_id, __type: relation_type}, Cookies.get('uid'));
			item_delete_responce.success(function(data) {
				if(typeof data.result != 'undefined') {
					if(data.result == true) {
						$.messager.show({
			                title:'Подтверждение',
			                msg:'Связь удалена.',
			                timeout:3000,
			                showType:'slide'
			            });
					}
				}
				if(typeof data.error != 'undefined') {
					$.messager.alert('Ошибка', data.error.message);
				}
				//to do reload parent and do state is open
				if(item_id != parent_id) {
					$('#composition-treegrid').treegrid('reload', {id: parent_id});
				} else {
					$('#composition-treegrid').treegrid('reload');
				}
			});
		}
	});
}

// Используется? Проверить ??
editTreeGridItem = function() {
	var selected_node = $('#composition-treegrid').treegrid('getSelected');
	$('#composition-treegrid').treegrid('beginEdit', selected_node.__id);
}
// Отображение формы добавления записи в состав Проверить ??
addNewItem = function() {
	var east_region = $('#cc').layout('panel', 'east').panel('options');
	if(east_region.collapsed == true) {
		$('#cc').layout('expand', 'east');
	}
	var panels = $('#filters-wrapper').accordion('panels');
	$.map(panels, function(p){
		var panel_options = p.panel('options');
		if(panel_options.title == 'Добавление записи в состав') {
			p.panel('expand');
		} else {
			p.panel('collapse');
		}
	});
}