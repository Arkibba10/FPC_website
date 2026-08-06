from django.conf import settings
from django.db import models


class Member(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    name = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    batch = models.CharField(max_length=100)
    email = models.CharField(max_length=254, blank=True, default='')
    facebook = models.CharField(max_length=500, blank=True, default='')
    linkedin = models.CharField(max_length=500, blank=True, default='')
    instagram = models.CharField(max_length=500, blank=True, default='')
    photo = models.CharField(max_length=2000, blank=True, default='')
    order = models.IntegerField(default=1)
    quote = models.TextField(blank=True, default='')
    bio = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['order']


class Event(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    title = models.CharField(max_length=300)
    date = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    coverImage = models.CharField(max_length=2000, blank=True, default='')
    images = models.JSONField(default=list, blank=True)
    videoUrl = models.CharField(max_length=2000, blank=True, default='')
    location = models.CharField(max_length=300, blank=True, default='')
    details = models.TextField(blank=True, default='')
    order = models.IntegerField(default=1)

    class Meta:
        ordering = ['order']


class GalleryItem(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    title = models.CharField(max_length=300)
    category = models.CharField(max_length=100, default='Landscape')
    image = models.CharField(max_length=2000, blank=True, default='')
    photographer = models.CharField(max_length=200, blank=True, default='')
    date = models.CharField(max_length=100, blank=True, default='')
    description = models.TextField(blank=True, default='')
    order = models.IntegerField(default=1)

    class Meta:
        ordering = ['order']


class Alumni(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    name = models.CharField(max_length=200)
    batch = models.CharField(max_length=100)
    currentPosition = models.CharField(max_length=300, blank=True, default='')
    organization = models.CharField(max_length=300, blank=True, default='')
    photo = models.CharField(max_length=2000, blank=True, default='')
    order = models.IntegerField(default=1)

    class Meta:
        ordering = ['order']


class UpdatePost(models.Model):
    CATEGORY_CHOICES = (
        ('Celebration', 'Celebration'),
        ('Announcement', 'Announcement'),
        ('Achievement', 'Achievement'),
    )
    STATUS_CHOICES = (
        ('published', 'published'),
        ('upcoming', 'upcoming'),
    )
    id = models.CharField(max_length=64, primary_key=True)
    title = models.CharField(max_length=400)
    date = models.CharField(max_length=100)
    category = models.CharField(max_length=40, choices=CATEGORY_CHOICES, default='Announcement')
    image = models.CharField(max_length=2000, blank=True, default='')
    content = models.TextField(blank=True, default='')
    link = models.CharField(max_length=2000, blank=True, default='')
    order = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published')

    class Meta:
        ordering = ['order']


class ConvenerInfo(models.Model):
    id = models.IntegerField(primary_key=True, default=1)
    name = models.CharField(max_length=200)
    designation = models.CharField(max_length=300, blank=True, default='')
    quote = models.TextField(blank=True, default='')
    welcomeMessage = models.TextField(blank=True, default='')
    photo = models.CharField(max_length=2000, blank=True, default='')
    email = models.CharField(max_length=254, blank=True, default='')
    phone = models.CharField(max_length=100, blank=True, default='')


class WebsiteSettings(models.Model):
    id = models.IntegerField(primary_key=True, default=1)
    siteName = models.CharField(max_length=200)
    tagline = models.CharField(max_length=300, blank=True, default='')
    contactEmail = models.CharField(max_length=254, blank=True, default='')
    contactPhone = models.CharField(max_length=100, blank=True, default='')
    address = models.CharField(max_length=600, blank=True, default='')
    facebookUrl = models.CharField(max_length=2000, blank=True, default='')
    instagramUrl = models.CharField(max_length=2000, blank=True, default='')
    youtubeUrl = models.CharField(max_length=2000, blank=True, default='')
    linkedinUrl = models.CharField(max_length=2000, blank=True, default='')
    heroTitle = models.CharField(max_length=300, blank=True, default='')
    heroSubtitle = models.CharField(max_length=300, blank=True, default='')
    motto = models.TextField(blank=True, default='')
    mottoBgImages = models.JSONField(default=list, blank=True)


class Profile(models.Model):
    ROLE_CHOICES = (
        ('admin', 'admin'),
        ('editor', 'editor'),
        ('viewer', 'viewer'),
    )
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer')

    def __str__(self):
        return f'{self.user.username} ({self.role})'
