from base64 import b64encode
from django.shortcuts import render, get_object_or_404
from pytz import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.contrib.auth.decorators import login_required

from wall.serializers import PostSerializer, CommentSerializer
from .models import Post, Comment
from django.contrib.auth.models import User

# Create your views here.
class PostView(APIView):
    def get(self, request):
        if(request.GET.get('id') != None):
            posts = Post.objects.get(id=request.GET.get('id'))
            serialized = PostSerializer(posts)
        else:
            posts = Post.objects.all().order_by('-date_posted')[:10]
            serialized = PostSerializer(posts, many = True)
        
        return Response(serialized.data, content_type='application/json')
    
    def post(self, request):
        post_data = {}
        post_data['content'] = request.POST.get('content', '')
        post_data['author'] = request.user.id #request.POST.get('author', '')
        post_data['image'] = request.FILES.get('image', None)
        #return Response(b64encode(request.FILES.get('image').read()))
        post_data['likes'] = []
        serializer = PostSerializer(data=post_data)
        if serializer.is_valid():
            obj = serializer.save()
            return Response("post/" + str(obj.pk) + "/")

        return Response("Failed")

    def put(self, request):
        put_data = {}
        if request.POST.get('like') == 'true':
            post_id = request.POST.get('post_id')
            current_user = User.objects.get(id=request.user.id)
            current_post = Post.objects.get(id=post_id)
            likes = current_post.likes.all()

            put_data['likes'] = current_post.likes

            if current_user in likes:
                put_data['likes'].remove(User.objects.get(id=request.user.id))
            else:
                put_data['likes'].add(User.objects.get(id=request.user.id))
            #return Response(put_data)
            serializer = PostSerializer(current_post, data=put_data)
            if serializer.is_valid():
                serializer.save()
                return Response("Added Successfully")

        return Response("Failed")

class CommentView(APIView):
    def get(self, request):
        post_id = request.GET.get('post_id')
        #return Response(post_id)
        comments = Comment.objects.filter(post=post_id)
        serialized = CommentSerializer(comments, many = True)
        return Response(serialized.data, content_type='application/json')

    def post(self, request):
        post_id = request.POST.get('post_id')
        comment = request.POST.get('comment')
        comment_author = request.user.id

        comment_data = {}
        comment_data['post'] = post_id
        comment_data['comment'] = comment
        comment_data['comment_author'] = comment_author
        serializer = CommentSerializer(data=comment_data)
        if serializer.is_valid():
            serializer.save()
            return Response("Added Successfully")
        
        return Response("Failed")

@login_required
def homepage(request):
    return render(request, 'wall/home.html')

@login_required    
def create_post(request):
    return render(request, 'wall/create_post.html')

@login_required
def post_detail(request, pk):
    return render(request, 'wall/post_detail.html')



