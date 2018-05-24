// Функция формирования отчета на основе параметров
RunReport = function (method, params, uid, successfn, failurefn) {
    var data = JSON.stringify({"jsonrpc": "2.0", "method": method, "params": params, 'uid': uid});

    var xhr = new XMLHttpRequest();
    xhr.open('POST', backend_report_url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
      if (this.status == 200) {
          successfn(this.response, this);
      } else {
          failurefn(this.response)
      }
    };
    xhr.send(data);
}

// Формирование заголовков для получения отчета
download = function(content, filename, contentType) {
    if(!contentType) contentType = 'application/octet-stream';

    if(window.navigator.msSaveBlob) {
        var blob = new Blob([content], {'type':contentType});
        window.navigator.msSaveBlob(blob, filename);
    } else {

        var a = document.createElement('a');
        var blob = new Blob([content], {'type':contentType});
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        a.click();
    }
}