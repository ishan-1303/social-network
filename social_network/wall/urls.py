from django.contrib import admin
from django.urls import path, include
from .views import PostView, CommentView
from wall import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('posts/', PostView.as_view(), name='posts'),
    path('create-post/', views.create_post, name='create_post'),
    path('post/<int:pk>/', views.post_detail, name='post_detail'),
    path('home/', views.homepage, name='wall'),
    path('comment/', CommentView.as_view(), name='comment'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)