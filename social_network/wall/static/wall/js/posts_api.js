
function create_post() {
    var actionUrl = 'http://localhost:8000/posts/';
    formdata = new FormData();
    formdata.append("content", content_id.value);
    var file = $("#image")[0].files[0];
   
    formdata.append("image", file);
    res = send_data(actionUrl, 'post', formdata)
    console.log(res)
    if(res != false) {
        window.location.href = 'http://localhost:8000/' + res;
    }
  
}

function update_post() {
    
}

function get_post_details() {
    var url = '' + window.location.href;
    // console.log(url.pathname.substring(6,7))
    var reg = /[0-9]+/g;
    var post_id = url.match(reg)[1];

    var post_data = get_data("http://localhost:8000/posts?id=" + post_id);
    var user_data = get_data("http://localhost:8000/user?id=" + post_data.author);
    
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

    return post_id
}


function toggle_comment() {

}

//implement comments