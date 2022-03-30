function send_data(target_url, method_type, formdata) {
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });

    var result = function () {
        $.ajax({
            url : target_url,
            type: method_type,
            processData: false,
            contentType: false,
            data: formdata,
            async: false,
            success : function (data) {
                result = data;
                // console.log(data)
            },
            error: function(err) {
                result = false;
                console.log(err)
            }
        });
        return result;
    }();

    return result;
}

function get_data(target_url) {
    var result = function () {
        $.ajax({
            url : target_url,
            type: 'get',
            async: false,
            success : function (data) {
                console.log(data);
                result = data;
            },
            error: function(err) {
                console.log(err)
            }
        });
        return result;
    }();

    return result;
}