from tkinter import CASCADE
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.urls import reverse

class Post(models.Model):
    content = models.TextField()
    date_posted = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post_media', blank=True, null=True)
    likes = models.ManyToManyField(User, related_name='post_like', blank=True)

    #def __str__(self):
    #    return self.title

    def get_absolute_url(self):
        return reverse('post-detail', kwargs={'pk':self.pk})

    def number_of_likes(self):
        return self.likes.count()

# class Comment(models.Model):
#     comment = models.CharField(max_length=200, blank=True, default='')
#     author = models.ForeignKey(User, on_delete=models.CASCADE)
#     post = models.ForeignKey(Post, on_delete=models.CASCADE)
#     created = models.DateTimeField(default=timezone.now)

#     class Meta:
#         ordering = ('-created',)
