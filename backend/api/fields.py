import base64
import uuid

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from rest_framework import serializers


class Base64ImageField(serializers.CharField):
    """Accepts a plain URL/path string or a base64 data-URL.

    Data URLs are decoded and stored on disk under ``MEDIA_ROOT/uploads`` and the
    resulting URL path is returned, so the API never stores base64 blobs in the DB.
    """

    def to_internal_value(self, data):
        if not isinstance(data, str):
            raise serializers.ValidationError('Expected a string image reference.')
        data = data.strip()
        if not data:
            return ''
        if not data.startswith('data:image/'):
            return data

        header, _, b64 = data.partition(',')
        mime = header[5:header.find(';')] if ';' in header else 'png'
        ext = mime.split('/')[-1].lower()
        if ext not in ('png', 'jpeg', 'jpg', 'webp', 'gif'):
            ext = 'png'
        try:
            content = base64.b64decode(b64)
        except (ValueError, TypeError) as exc:
            raise serializers.ValidationError('Invalid base64 image data.') from exc
        if not content:
            raise serializers.ValidationError('Empty image data.')
        if len(content) > 25 * 1024 * 1024:
            raise serializers.ValidationError('Image is too large (max 25MB).')

        path = default_storage.save(f'uploads/{uuid.uuid4().hex}.{ext}', ContentFile(content))
        return default_storage.url(path)
