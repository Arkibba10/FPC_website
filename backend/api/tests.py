from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from api.models import ConvenerInfo, Member, Profile, WebsiteSettings


class ApiTestCase(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username='admin', password='pw')
        Profile.objects.create(user=self.admin, role='admin')
        self.editor = User.objects.create_user(username='editor', password='pw')
        Profile.objects.create(user=self.editor, role='editor')
        self.other = User.objects.create_user(username='other', password='pw')
        Profile.objects.create(user=self.other, role='viewer')

        Member.objects.create(id='m1', name='A', position='P', batch='B', photo='', order=1)
        Member.objects.create(id='m2', name='B', position='P', batch='B', photo='', order=2)
        ConvenerInfo.objects.create(id=1, name='Shammi Akhter', designation='', quote='', welcomeMessage='', photo='', email='', phone='')
        WebsiteSettings.objects.create(id=1, siteName='FPC', tagline='t', contactEmail='', contactPhone='', address='')

    def _member_payload(self, token, items):
        return self.client.post(
            '/api/members/',
            {'items': items},
            format='json',
            HTTP_AUTHORIZATION=f'Token {token}',
        )


class PublicReadsTest(ApiTestCase):
    def test_members_public(self):
        r = self.client.get('/api/members/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(r.json()), 2)

    def test_convener_and_settings_public(self):
        self.assertEqual(self.client.get('/api/convener/').status_code, 200)
        self.assertEqual(self.client.get('/api/settings/').status_code, 200)


class AuthTest(ApiTestCase):
    def test_login_success_and_failure(self):
        ok = self.client.post('/api/auth/login/', {'username': 'admin', 'password': 'pw'}, format='json')
        self.assertEqual(ok.status_code, 200)
        self.assertEqual(ok.json()['role'], 'admin')
        bad = self.client.post('/api/auth/login/', {'username': 'admin', 'password': 'no'}, format='json')
        self.assertEqual(bad.status_code, 401)

    def test_me_and_logout(self):
        token = self.client.post('/api/auth/login/', {'username': 'admin', 'password': 'pw'}, format='json').json()['token']
        me = self.client.get('/api/auth/me/', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(me.status_code, 200)
        out = self.client.delete('/api/auth/logout/', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(out.status_code, 200)
        after = self.client.get('/api/auth/me/', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(after.status_code, 401)


class PermissionsTest(ApiTestCase):
    def test_anonymous_write_rejected(self):
        r = self.client.post('/api/members/', {'items': []}, format='json')
        self.assertEqual(r.status_code, 401)

    def test_editor_can_replace_members(self):
        token = self.client.post('/api/auth/login/', {'username': 'editor', 'password': 'pw'}, format='json').json()['token']
        r = self._member_payload(token, [{'id': 'm9', 'name': 'X', 'position': 'P', 'batch': 'B', 'photo': '', 'order': 1}])
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.json()), 1)

    def test_editor_cannot_edit_settings(self):
        token = self.client.post('/api/auth/login/', {'username': 'editor', 'password': 'pw'}, format='json').json()['token']
        r = self.client.put('/api/settings/', {'tagline': 'x'}, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(r.status_code, 403)

    def test_viewer_cannot_write(self):
        token = self.client.post('/api/auth/login/', {'username': 'other', 'password': 'pw'}, format='json').json()['token']
        r = self._member_payload(token, [])
        self.assertEqual(r.status_code, 403)


class BulkReplaceTest(ApiTestCase):
    def setUp(self):
        super().setUp()
        self.token = self.client.post('/api/auth/login/', {'username': 'admin', 'password': 'pw'}, format='json').json()['token']

    def test_deletion_is_final(self):
        r = self._member_payload(self.token, [{'id': 'm2', 'name': 'B', 'position': 'P', 'batch': 'B', 'photo': '', 'order': 1}])
        self.assertEqual(r.status_code, 200)
        remaining = self.client.get('/api/members/').json()
        self.assertEqual([m['id'] for m in remaining], ['m2'])

    def test_duplicate_ids_rejected(self):
        item = {'id': 'm1', 'name': 'A', 'position': 'P', 'batch': 'B', 'photo': '', 'order': 1}
        r = self._member_payload(self.token, [item, item])
        self.assertEqual(r.status_code, 400)

    def test_bad_payload_rejected(self):
        r = self.client.post('/api/members/', {'foo': 1}, format='json', HTTP_AUTHORIZATION=f'Token {self.token}')
        self.assertEqual(r.status_code, 400)

    def test_missing_required_field_rejected(self):
        r = self._member_payload(self.token, [{'id': 'm1', 'name': 'A'}])
        self.assertEqual(r.status_code, 400)
