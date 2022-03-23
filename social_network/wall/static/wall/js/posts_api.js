function create_post() {
    var actionUrl = 'http://localhost:8000/posts/';
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    console.log(csrftoken)
    formdata = new FormData();
    formdata.append("content", content_id.value);
    var file = $("#image")[0].files[0];
   
    formdata.append("image", file);
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });
    
    $.ajax({
        type: "POST",
        url: actionUrl,
        data: formdata, // serializes the form's elements.
        processData: false,
        contentType: false,
        success: function(data)
        {
            // console.log(data)
            window.location.href = 'http://localhost:8000/' + data;
        }
    });
  
}

function update_post() {
    
}

function get_post_details() {
    var url = '' + window.location.href;
    // console.log(url.pathname.substring(6,7))
    var reg = /[0-9]+/g;
    var post_id = url.match(reg)[1];
    var post_data = function () {
        $.ajax({
            url : "http://localhost:8000/posts?id=" + post_id,
            type: 'get',
            async: false,
            success : function (data) {
                console.log(data);
                post_data = data;
            },
            error: function(err) {
                console.log(err)
            }
        });
        return post_data;
    }();
    var user_data = function () {
        $.ajax({
            url : "http://localhost:8000/user?id=" + post_data.author,
            type: 'get',
            async: false,
            success : function (data) {
                console.log(data);
                user_data = data;
            },
            error: function(err) {
                console.log(err)
            }
        });
        return user_data;
    }();
    var date = new Date(post_data.date_posted);
    d = date.toDateString();
    t = date.toLocaleTimeString();
    user_image_id.src = user_data.image;
    username_id.innerHTML = user_data.username;
    message_id.innerHTML = post_data.content;
    date_id.innerHTML = d + ' ' + t;
    if(post_data.image != undefined) {
        image_id.src = post_data.image;
        image_id.classList.remove('d-none');
    }
}
