from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from .models import (
    Alumni,
    ConvenerInfo,
    Event,
    GalleryItem,
    Member,
    Profile,
    UpdatePost,
    WebsiteSettings,
)


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'


class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)


admin.site.unregister(User)
admin.site.register(User, UserAdmin)


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'batch', 'order')


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'order')


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'photographer', 'order')


@admin.register(Alumni)
class AlumniAdmin(admin.ModelAdmin):
    list_display = ('name', 'batch', 'currentPosition', 'organization', 'order')


@admin.register(UpdatePost)
class UpdatePostAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'category', 'status', 'order')


admin.site.register(ConvenerInfo)
admin.site.register(WebsiteSettings)
