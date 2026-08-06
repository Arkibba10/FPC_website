from rest_framework import serializers

from .fields import Base64ImageField
from .models import Alumni, ConvenerInfo, Event, GalleryItem, Member, UpdatePost, WebsiteSettings


class MemberSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    photo = Base64ImageField(required=False, allow_blank=True, default='')

    class Meta:
        model = Member
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    coverImage = Base64ImageField(required=False, allow_blank=True, default='')
    images = serializers.JSONField(default=list)

    class Meta:
        model = Event
        fields = '__all__'


class GalleryItemSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    image = Base64ImageField(required=False, allow_blank=True, default='')

    class Meta:
        model = GalleryItem
        fields = '__all__'


class AlumniSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    photo = Base64ImageField(required=False, allow_blank=True, default='')

    class Meta:
        model = Alumni
        fields = '__all__'


class UpdatePostSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    image = Base64ImageField(required=False, allow_blank=True, default='')

    class Meta:
        model = UpdatePost
        fields = '__all__'


class ConvenerInfoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    photo = Base64ImageField(required=False, allow_blank=True, default='')

    class Meta:
        model = ConvenerInfo
        fields = '__all__'


class WebsiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteSettings
        fields = '__all__'
