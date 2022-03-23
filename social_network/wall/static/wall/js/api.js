//function get_posts() {
    $.ajax({
        url : "http://localhost:8000/posts",
        success : function (data) {
            render_posts(data);
        }
    });
var data_ = '';
function read_user_data(data_) {
    data_ = data_;
}

function render_posts(data) {
    var post_tag = '<div>';
    var posts = data;
    for (let i = 0; i < posts.length; i++) {
        var id = posts[i].author;
        
        var user_data = function () {
            $.ajax({
                url : "http://localhost:8000/user?id=" + id,
                type: 'get',
                async: false,
                success : function (data) {
                    //console.log(data);
                    user_data = data;
                },
                error: function(err) {
                    console.log(err)
                }
            });
            return user_data;
        }();
        var date = new Date(posts[i].date_posted);
        d = date.toDateString();
        t = date.toLocaleTimeString();
        post_tag += '<a href="http://localhost:8000/post/' + posts[i].id + '/">'
        post_tag += '<img src="' + user_data.image + '" class="rounded-circle" alt="Cinque Terre" width="50" height="50">'
        post_tag += '<h2>' + user_data.username + '</h2>';
        if(posts[i].image != undefined) {
            post_tag += '<img src="' + posts[i].image + '" width="200"></img>';    
        }  
        post_tag += '<p>' + posts[i].content + '</p>';    
        post_tag += '<small>' + d + ' ' + t + '</small>';  
        post_tag += '</a>'
        post_tag += '<p><button class="btn btn-sm btn-info" onclick="like_post(this)" id="' + posts[i].id + '">Like </button> <span id="post' + posts[i].id + '">' + posts[i].likes.length + ' likes </span></p>';  
        post_tag += '<hr>';       
        // console.log(posts[i].id)
    }
    post_tag += '</div>';
    //console.log(post_tag)
    posts_id.innerHTML += post_tag;
}

function like_post(current_post) {
    var actionUrl = "http://localhost:8000/posts/";
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    json = {
        post_id: current_post.id,
        'like': 'true'
    };
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });
    console.log(current_post.id)
    $.ajax({
        type: "PUT",
        url: actionUrl,
        data: json, // serializes the form's elements.
        success: function(data)
        {
            $.ajax({
                url : "http://localhost:8000/posts?id=" + current_post.id,
                type: 'get',
                async: false,
                success : function (data) {
                    console.log(data)
                    document.getElementById('post' + current_post.id).innerHTML = data.likes.length + ' likes';
                },
                error: function(err) {
                    console.log(err)
                }
            });
        },
        error: function(err) {
            console.log(err)
        }
    });
}