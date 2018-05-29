// Не используется Проверить ??
_formatDataForPropertyGridEntityViewNonValue = function(entity_unformated_data) {
    var formated_data_rows = [];
    var properties_count = 0;
	console.log('_formatDataForPropertyGridEntityViewNonValue called');
    for(var entity_filed in entity_unformated_data) {
        if ( 0 > $.inArray( entity_filed, ['__type', '__id', '__info', '_hasLinkChilds', '_listOrder', 'key', 'raiting', 'newVersion', 'source', 'state', 'preference'] ) ) {
            entity_columns_with_parents = _getEntityColumns(params.entity);

            entity_filed_title = _getColumnTitle(entity_filed, entity_columns_with_parents[0]);
            entity_filed_is_required = _getIsRequired(entity_filed, entity_columns_with_parents[0]);
            if(entity_filed_is_required) {
	            if(isObject(entity_unformated_data[entity_filed])) {
	                var entity_filed_value = entity_unformated_data[entity_filed].__info;
	                var entity_filed_value_type = entity_unformated_data[entity_filed].__type;
	                var entity_filed_value_id = entity_unformated_data[entity_filed].__id;
	                var classificator = {"__type": entity_filed_value_type, "__id": entity_filed_value_id};



	                formated_data_rows.push({"name":entity_filed_title, "value":'', "property_name": entity_filed, "classificator": classificator});
	            } else {
	                var entity_filed_value = entity_unformated_data[entity_filed];

	                if(entity_filed_value === false || entity_filed_value === true) {
	                    entity_filed_value = '<input disabled type="checkbox">';
	                } else {
	                	entity_filed_value = '';
	                }

	                formated_data_rows.push({"name":entity_filed_title, "value":entity_filed_value, "property_name": entity_filed});
	            }
	        }

            ++properties_count;
        }
    };
    return {"total": properties_count, rows: formated_data_rows};
}

// Не используется, но оставим пока Проверить ??
_formatDataForPropertyGridEntityViewIn = function(entity_in_unformated_data) {
    var formated_data_rows = [];
    var properties_count = 0;
	console.log('_formatDataForPropertyGridEntityViewIn called');
    for(var entity_filed in entity_in_unformated_data) {
        if ( 0 > $.inArray( entity_filed, ['__type', '__id', '__info', '_hasLinkChilds', '_listOrder', 'key', 'raiting', 'newVersion'] ) ) {
            entity_columns_with_parents = _getEntityColumns(params.entity);
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

					//оставим на будущее - функционал открытия правой части и перехода к вкладке свойств объекта
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
                    
//$('#btn-for-tree').bind('click', function(){
	//	alert(1);
	    //var selected_node = $('#composition-treegrid').treegrid('getSelected');
	
	 //    if(isObject(selected_node)) {

	 //    	var new_object_form_data = {};
		//     var form_fields_filled_by_user = $('#property-grid-relation-create-form').propertygrid('getChanges');

		


		//     form_fields_filled_by_user.forEach(function(arrayItem){
		//     	if(typeof arrayItem.property_id != 'undefined') {
		//     		if(typeof arrayItem.tmpvalue != 'undefined') {
		//     			new_object_form_data[arrayItem.property_id] = {"value": arrayItem.tmpvalue};
		//     		} else {
		//     			new_object_form_data[arrayItem.property_id] = {"value": arrayItem.value};
		//     		}
		    		
		//     	}
		//     });


		//     if(typeof new_object_form_data.__type != 'undefined' &&
		//     	typeof new_object_form_data.caption != 'undefined' &&
		//     		typeof new_object_form_data.name != 'undefined' &&
		//     			typeof new_object_form_data.unit != 'undefined') {


		// 	    //check if Entity exists
		// 	    var selected_suggestion_params = JSONRPC_PROMISE("Entity.ShowObjectByCaption", {caption: new_object_form_data.caption.value, __type: new_object_form_data.__type.value}, Cookies.get('uid'));
		// 		selected_suggestion_params.success(function(data) {
		// 			if(typeof data.error != 'undefined') {
		// 				//this item not find
		// 				//create new Entity
		// 		    	var new_entity_params = {
		// 		    		__type: new_object_form_data.__type.value,
		// 		    		caption: new_object_form_data.caption.value,
		// 		    		name: new_object_form_data.name.value,
		// 		    		state: {__id: create_object_params.state},
		// 		    		source: {__id: create_object_params.source},
		// 		    		unit: {__id: new_object_form_data.unit.value},
		// 		    		preference: {__id: create_object_params.preference},
		// 		    	};

		// 		    	var create_new_entity_responce = JSONRPC_PROMISE("Entity.Create", new_entity_params, Cookies.get('uid'));
		// 				create_new_entity_responce.success(function(data) {
		// 					if(typeof data.error != 'undefined') {
		// 		 				$.messager.alert('Ошибка', data.error.message);
		// 					} else {
		// 						//create link for new entity
		// 						var new_link_params = {
		// 							__type: "Part",
		// 							parent: {__id: selected_node.__id, __type: selected_node.__type },
		// 							child: data.result,
		// 							position: new_object_form_data.position.value,
		// 							quantity: new_object_form_data.quantity.value,
		// 							regQuantity: new_object_form_data.regQuantity.value,
		// 						};

		// 						var create_new_link_responce = JSONRPC_PROMISE("Link.Create", new_link_params, Cookies.get('uid'));
		// 						create_new_link_responce.success(function(data) {
		// 							if(typeof data.error != 'undefined') {
		// 								$.messager.alert('Ошибка', data.error.message);
		// 							} else {
		// 								$.messager.show({
		// 					                title:'Подтверждение',
		// 					                msg:'Объект добавлен в состав.',
		// 					                timeout:3000,
		// 					                showType:'slide'
		// 					            });
		// 					            $('#composition-treegrid').treegrid('reload', {id: selected_node.__id});
		// 							}
		// 						});
		// 					}
		// 				});

					
		// 			} else {

		// 				var new_link_params = {
		// 					__type: "Part",
		// 					parent: {__id: selected_node.__id, __type: selected_node.__type },
		// 					child: data.result,
		// 					position: new_object_form_data.position.value,
		// 					quantity: new_object_form_data.quantity.value,
		// 					regQuantity: new_object_form_data.regQuantity.value,
		// 				};

		// 				var create_new_link_responce = JSONRPC_PROMISE("Link.Create", new_link_params, Cookies.get('uid'));
		// 				create_new_link_responce.success(function(data) {
		// 					if(typeof data.error != 'undefined') {
		// 						$.messager.alert('Ошибка', data.error.message);
		// 					} else {
		// 						$.messager.show({
		// 			                title:'Подтверждение',
		// 			                msg:'Объект добавлен в состав.',
		// 			                timeout:3000,
		// 			                showType:'slide'
		// 			            });
		// 			            $('#composition-treegrid').treegrid('reload', {id: selected_node.__id});
		// 					}
		// 				});
		// 			}
		// 		});

		// 	} else {
		//      	$.messager.alert('Ошибка', 'Пожалуйста, заполните все поля для добавления объекта.');
		//     }

		// } else {
		// 	$.messager.alert('Ошибка', 'Пожалуйста, укажите строку в дереве состава, куда необходимо вставить новый объект.');
		// }

	    //return false;
	//});