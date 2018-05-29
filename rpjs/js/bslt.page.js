// Класс отображения страницы
function BsltPage(
        id, // Идентификатор отображаемой сущности
        panels // Массив с функциями формирования панелей
) {
    // Функция заполнения 
    this.id = id;

    this.loadPanels = function(){
	    // Перебор всех полученных функций формирования панелей
	    panels.forEach(function(item){
	        result = item(this.id); // Вызов функции заполнения панели
	    }, this);
    }
}