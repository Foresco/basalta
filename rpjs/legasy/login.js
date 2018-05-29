$(document).ready(function(){
    var t = $('#password-box');
    t.textbox('textbox').bind('keydown', function(e){
        if (e.keyCode == 13) {
            submitForm();
        }
    }); 
});
function submitForm(){
    var loginFormProperties = {};
    var url = backend_url;
    $.each($('#login-form').serializeArray(), function(_, kv) {
        loginFormProperties[kv.name] = kv.value;
    });
    jQuery.ajax({
        url: url,
        processData: false,
        type: 'POST',
        crossDomain: true,
        contentType: 'application/json',
        data: JSON.stringify({
            "jsonrpc": "2.0", 
            "method": "System.Login", 
            "params": {"login": loginFormProperties.username, "password": loginFormProperties.password}, 
        }),
        success: function(data, textStatus, jqXHR){
            if(data.result !== null) {
                var user_uid = data.result;
                jQuery.ajax({
                    url: 'login',
                    processData: false,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "uid": user_uid, 
                    }),
                    success: function(data, textStatus, jqXHR){
                        jQuery.ajax({
                            url: url,
                            processData: false,
                            type: 'POST',
                            crossDomain: true,
                            contentType: 'application/json',
                            data: JSON.stringify({
                                "jsonrpc": "2.0", 
                                "method": "System.GetSchema", 
                                "uid": user_uid,
                            }),
                            success: function(data, textStatus, jqXHR) {
                                localStorage.setItem('schema_object', JSON.stringify(data.result));
                                jQuery.ajax({
                                    url: url,
                                    processData: false,
                                    type: 'POST',
                                    crossDomain: true,
                                    contentType: 'application/json',
                                    data: JSON.stringify({
                                        "jsonrpc": "2.0", 
                                        "method": "Menu.Show", 
                                        "uid": user_uid,
                                    }),
                                    success: function(data, textStatus, jqXHR) {
                                        localStorage.setItem('menu_object', JSON.stringify(data.result));
                                        location.href='complex';
                                    }
                                });

                            }
                        });
                    }
                });
            } else {
                $("#login-form-error").text("Не верно введены логин или пароль").show();
            }
        }
    });
}
