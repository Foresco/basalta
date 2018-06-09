// ajax запрос
jsonRPC = function (method, params, uid, async=true) {
    return $.ajax({
        url: backend_url,
        processData: false,
        type: 'POST',
        crossDomain: true,
        async: async,
        contentType: 'application/json',
        data: JSON.stringify({"jsonrpc": "2.0", "id": "rp2", "method": method, "params": params, "uid": uid})
    });
}
