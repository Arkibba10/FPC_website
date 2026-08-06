from django.urls import path

from . import views

urlpatterns = [
    path('members/', views.MemberCollectionView.as_view(), name='members'),
    path('events/', views.EventCollectionView.as_view(), name='events'),
    path('gallery/', views.GalleryCollectionView.as_view(), name='gallery'),
    path('alumni/', views.AlumniCollectionView.as_view(), name='alumni'),
    path('updates/', views.UpdateCollectionView.as_view(), name='updates'),
    path('convener/', views.ConvenerView.as_view(), name='convener'),
    path('settings/', views.SettingsView.as_view(), name='settings'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('auth/me/', views.MeView.as_view(), name='me'),
]
