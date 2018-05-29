// Инструменты выполнения запросов

// ajax запрос асинхронный
JSONRPC_PROMISE = function (method, params, uid) {
    return $.ajax({
        url: backend_url,
        processData: false,
        type: 'POST',
        crossDomain: true,
        contentType: 'application/json',
        data: JSON.stringify({"jsonrpc": "2.0", "id": "rp2", "method": method, "params": params, "uid": uid})
    });
}

// ajax запрос синхронный
JSONRPC_PROMISE_SYNC = function (method, params, uid) {
    return $.ajax({
        url: backend_url,
        processData: false,
        type: 'POST',
        crossDomain: true,
        async: false,
        contentType: 'application/json',
        data: JSON.stringify({"jsonrpc": "2.0", "method": method, "params": params, "uid": uid})
    });
}

// Получение состояния объекта ajax запроса для формирования отчета
JSONRPC_REPORT_PROMISE = function (method, params, uid) {
    return $.ajax({
        url: backend_report_url,
        processData: false,
        type: 'POST',
        crossDomain: true,
        contentType: 'application/json',
        data: JSON.stringify({"jsonrpc": "2.0", "method": method, "params": params, "uid": uid})
    });
}