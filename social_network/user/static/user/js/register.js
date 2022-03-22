function register() {
    var actionUrl = 'http://localhost:8000/user/';
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    const json = {
        'username': username.value,
        'email': email.value,
        'password': password.value,
    };
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });
    console.log(json);

    $.ajax({
        url : "http://localhost:8000/user/",
        type: 'post',
        data: json,
        success : function (data) {
            alert("Account Created");
            window.location = "http://localhost:8000/login/";
        },
        error: function(err) {
            console.log(err)
        }
    });
}
