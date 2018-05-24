// Общий функционал, используемый везде

// Проверка, является ли переданный аргумент объектом
isObject = function(o) {
    return null != o &&
        typeof o === 'object' &&
        Object.prototype.toString.call(o) === '[object Object]';
}

// Определение обязательности атрибута сущности
function _getIsRequired(property, entity_columns_with_parents) {
        var is_required = false;
        entity_columns_with_parents.forEach( function (arrayItem) {
            if(arrayItem.field == property) {
                is_required = arrayItem.required;
            }
        });
        if(is_required) {
            return true;
        } else {
            return false;
        }
    }