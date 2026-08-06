from django.contrib.auth import authenticate
from django.db import transaction
from rest_framework import permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Alumni, ConvenerInfo, Event, GalleryItem, Member, UpdatePost, WebsiteSettings
from .permissions import CanEdit, IsAdmin
from .serializers import (
    AlumniSerializer,
    ConvenerInfoSerializer,
    EventSerializer,
    GalleryItemSerializer,
    MemberSerializer,
    UpdatePostSerializer,
    WebsiteSettingsSerializer,
)


class CollectionView(APIView):
    """GET returns the full collection; POST performs an atomic full replace.

    The frontend sends the complete, sorted collection as ``{"items": [...]}``
    after every add/edit/delete/reorder, so persistence is always consistent and
    deletions are final (nothing is merged back from defaults).
    """

    model = None
    serializer_class = None
    permission_classes = [CanEdit]

    def get(self, request):
        items = self.model.objects.all()
        return Response(self.serializer_class(items, many=True).data)

    def post(self, request):
        items = request.data.get('items', request.data)
        if not isinstance(items, list):
            return Response({'error': 'Expected a JSON list under "items".'}, status=status.HTTP_400_BAD_REQUEST)

        ids = [i.get('id') for i in items if isinstance(i, dict) and i.get('id') is not None]
        if len(ids) != len(set(ids)):
            return Response({'error': 'Duplicate item ids in payload.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(data=items, many=True)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            self.model.objects.all().delete()
            serializer.save()

        saved = self.model.objects.all()
        return Response(self.serializer_class(saved, many=True).data)


class MemberCollectionView(CollectionView):
    model = Member
    serializer_class = MemberSerializer


class EventCollectionView(CollectionView):
    model = Event
    serializer_class = EventSerializer


class GalleryCollectionView(CollectionView):
    model = GalleryItem
    serializer_class = GalleryItemSerializer


class AlumniCollectionView(CollectionView):
    model = Alumni
    serializer_class = AlumniSerializer


class UpdateCollectionView(CollectionView):
    model = UpdatePost
    serializer_class = UpdatePostSerializer


class SingletonView(APIView):
    """Single-row resource exposed as one object (id always 1)."""

    model = None
    serializer_class = None
    permission_classes = [CanEdit]

    def get_object(self):
        obj, _ = self.model.objects.get_or_create(id=1)
        return obj

    def get(self, request):
        return Response(self.serializer_class(self.get_object()).data)

    def put(self, request):
        obj = self.get_object()
        serializer = self.serializer_class(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(self.serializer_class(self.get_object()).data)


class ConvenerView(SingletonView):
    model = ConvenerInfo
    serializer_class = ConvenerInfoSerializer


class SettingsView(SingletonView):
    model = WebsiteSettings
    serializer_class = WebsiteSettingsSerializer
    permission_classes = [IsAdmin]


def _user_payload(user):
    profile = getattr(user, 'profile', None)
    return {
        'username': user.username,
        'role': profile.role if profile else 'viewer',
    }


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '')
        password = request.data.get('password', '')
        user = authenticate(username=username, password=password)
        if user is None or not user.is_active:
            return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, **_user_payload(user)})


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        self._delete_token(request.user)
        return Response({'ok': True})

    def delete(self, request):
        self._delete_token(request.user)
        return Response({'ok': True})

    def _delete_token(self, user):
        Token.objects.filter(user=user).delete()


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(_user_payload(request.user))
