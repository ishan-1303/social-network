function edit_user_profile() {
    formdata = new FormData();
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    var file = $("#image")[0].files[0];
    if(username.value != "") {
        formdata.append("username", username.value);
    }
    if(image.value != "") {
        var file = $("#image")[0].files[0];
        formdata.append("image", file);
        console.log(file)
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });
    $.ajax({
        url : "http://localhost:8000/user/",
        type: 'put',
        data: formdata,
        processData: false,
        contentType: false,
        success : function (data) {
            console.log(data);
            show_edit_profile(document.getElementById('edit_btn'));
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function show_edit_profile(btn) {
    edit_profile.classList.remove('d-none');
    if(btn.innerHTML == "Edit Profile") {
        btn.innerHTML = "Cancel";
    }
    else {
        btn.innerHTML = "Edit Profile";
        edit_profile.classList.add('d-none');
        get_user_profile();
    }
}

function get_user_profile() {
    var user_profile = function () {
        $.ajax({
            url : "http://localhost:8000/user",
            type: 'get',
            async: false,
            success : function (data) {
                //console.log(data);
                user_profile = data;
            },
            error: function(err) {
                console.log(err)
            }
        });
        return user_profile;
    }();
    user_image_id.src = user_profile.image;
    username_id.innerHTML = user_profile.username;
}
