function get_posts() {
    $.ajax({
        url : "http://localhost:8000/posts",
        success : function (data) {
            render_posts(data);
        }
    });
}

function render_posts(data) {
    var post_tag = '<div>';
    var posts = data;
    for (let i = 0; i < posts.length; i++) {
        var id = posts[i].author;
        user_data = get_data("http://localhost:8000/user?id=" + id);
        comments = get_comments(posts[i].id, false);

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
        post_tag += comments;
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
    if(current_post.classList.contains('btn-info')) {
        current_post.classList.remove('btn-info');
        current_post.classList.add('btn-primary');
    } else {
        current_post.classList.add('btn-info');
        current_post.classList.remove('btn-primary');
    }
}

function get_comments(post_id, all) {
    var comments = get_data("http://localhost:8000/comment?post_id=" + post_id);

    var comments_tag = 'Comments (' + comments.length + ')';

    length = 2;

    if(all || comments.length < 2) {
        length = comments.length;
    }
    for (let i = 0; i < length; i++) {
        author = comments[i].comment_author;
        author_data = get_data("http://localhost:8000/user?id=" + author);

        var date = new Date(comments[i].created);
        d = date.toDateString();
        t = date.toLocaleTimeString();
        comments_tag += '<br>';
        comments_tag += '<img src="' + author_data.image + '" class="rounded-circle" alt="Cinque Terre" width="20" height="20">'
        comments_tag += '<h5>' + author_data.username + '</h5>';
        comments_tag += '<p>' + comments[i].comment + '</p>';
        comments_tag += '<small>' + d + ' ' + t + '</small>';  
    }
    if(!all) {
        comments_tag += '<br><a href="http://localhost:8000/post/' + post_id + '/" class="btn btn-sm btn-info">View all comments</a>';  
    }
    return comments_tag;
}

function get_post_id_from_url() {
    var url = '' + window.location.href;
    var reg = /[0-9]+/g;
    var post_id = url.match(reg)[1];

    return post_id
}

function create_comment() {
    post_id = get_post_id_from_url();
    var actionUrl = 'http://localhost:8000/comment/';

    formdata = new FormData();
    formdata.append("comment", comment_id.value);
    formdata.append("post_id", post_id);

    comment_created = send_data(actionUrl, 'post', formdata)

    document.getElementById('comments').innerHTML = get_comments(post_id, true);
} 