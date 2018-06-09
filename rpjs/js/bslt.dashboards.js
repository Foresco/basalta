south_panel = function(id, entity_type) {
	var area = $("#south_panel");
	if(area.length) {
		area.html('South area');
		return 0;
	}
	return 1;
}

east_panel = function(id, entity_type) {
	var area = $("#east_panel");
	if(area.length) {
		area.html('East area');
		return 0;
	}
	return 1;
}

west_panel = function(id, entity_type) {
	var area = $("#west_panel");
	if(area.length) {
		area.html('West area');
		return 0;
	}
	return 1;
}

center_panel = function(id, entity_type) {
	var area = $("#center_panel");
	if(area.length) {
		// Получаем массив описаний свойств


		// Получаем массив со значениями свойств

		// Заполняем поля свойствами

		// Отображаем форму свойств сущности

		area.html('Center area');
		return 0;
	}
	return 1;
}

// Функция получения массива описаний свойств сущности
entityPropsGet = function(entity_type) {
	// Проверка наличия в хранилище

	// Нет - заправшиваем - сохраняем

	// Возвращаетм
}


// Функция получения элементов списка из хранилица
listItemsGetFromStorage = function(entity_type) {
	// Проверка наличия в хранилище
	// Нет - заправшиваем - сохраняем
    list_items = localStorage.getItem(entity_type) || listItemsGetFromServer(entity_type);
	// Возвращаетм
	return list_items;
}

