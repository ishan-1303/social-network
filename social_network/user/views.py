from base64 import b64encode
from django.shortcuts import render, get_object_or_404
from pytz import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from user.serializers import ProfileSerializer
from .models import Profile
from django.contrib.auth.models import User
# Create your views here.

def login_view(request):
    return render(request, 'user/login.html')

def profile(request):
    return render(request, 'user/profile.html')

class ProfileView(APIView):
    def get(self, request):
        data = request.GET.get('id', request.user.id)
        #return Response(data, content_type='application/json')
        user = User.objects.get(pk=data)
        #serialized = ProfileSerializer(user.profile)
        res = {
            "username": user.username,
            "image": request.build_absolute_uri(user.profile.image.url)
        }
        return Response(res, content_type='application/json')
    
    def post(self, request):
        post_data = {}
        post_data['email'] = request.POST.get('email')
        post_data['username'] = request.POST.get('username')
        post_data['password'] = request.POST.get('password')
        #return Response(post_data)
        user = User.objects.create_user(username=post_data['username'], email=post_data['email'], password=post_data['password'])
        user.save()
        #return Response(user.id)
        post_data = {}
        post_data['user'] = user.id
        #return Response(post_data)
        serializer = ProfileSerializer(data=post_data)
        if serializer.is_valid():
            serializer.save()
            return Response("Added Successfully")

        return Response("Failed")

    def put(self, request):
        put_data = {}
        username = request.POST.get('username')
        image = request.FILES.get('image', None)
        user = User.objects.get(id=request.user.id)
        user.username = username
        user.save()
        profile = Profile.objects.get(user=user.id)
        put_data['user'] = user.id
        put_data['image'] = image
        #return Response(b64encode(image.read()))
        serializer = ProfileSerializer(profile, data=put_data)
        if serializer.is_valid():
            serializer.save()
            return Response("Updated Successfully")
        else:
             return Response(serializer.errors)

        return Response("Failed")



def register(request):
    return render(request, 'user/register.html')