from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from user import views
from .views import ProfileView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', auth_views.LoginView.as_view(template_name='user/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(template_name='user/logout.html'), name='logout'),
    path('profile/', views.profile, name='profile'),
    #path('login/', views.login_view, name='login'),
    path('register/', views.register, name='register'),
    path('user/', ProfileView.as_view(), name='user'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)