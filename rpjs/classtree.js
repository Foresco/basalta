// Построение дерева классификационных групп
_fillClassificationTree = function() {
	$('#classification-tree').tree({
	    loader: function(param, success, error) {

	    	if(!jQuery.isEmptyObject(param)) {
	    		if (typeof param.id !== 'undefined') {
					classification_params.group = {"__id":param.id, "__type":"Classification"};
				}
	    	}

			var result_items_responce = JSONRPC_PROMISE("Classification.List", classification_params, Cookies.get('uid'));
			result_items_responce.success(function(data) {
				if(isObject(data.result)) {
					var formatted_data = [];
					
					data.result.forEach( function (arrayItem) {
							
						formatted_data.push({
							id: arrayItem.__id,
							text: arrayItem.caption,
							state: "closed",
							_hasGroupChilds: arrayItem._hasGroupChilds,
						});
					});
					success(formatted_data)
				} else if(typeof data.error != 'undefined') {
					$.messager.alert('Ошибка', data.error.message);
				}

				
			});
	    },
	    onClick: function(node) {
	    	$('#central-grid').datagrid('reload', {tree_classificator: node.id});
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
				if (node._hasGroupChilds == false){
					node.state = 'open';
					node.iconCls = 'tree-folder';
				}
			});
			return data;
		}
	});
}