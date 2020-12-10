import pytest

from django.test import TestCase

from mixer.backend.django import mixer

from accounts.models import User, Profile
from family.models import Family

pytest_mark = pytest.mark.django_db


class TestUserModel(TestCase):
    def setUp(self) -> None:
        self.user = User.objects.create_user(
            email='testusercreate@gmail.com',
            password='testing321'
        )
        self.user.profile.name = 'Test name'
        self.user.profile.surname = 'Test surname'
        self.user.profile.save()

    def test_user_create(self):
        assert isinstance(self.user, User)
        assert str(self.user) == 'testusercreate@gmail.com'

    def test_profile_created_after_user_create(self):
        assert isinstance(self.user.profile, Profile)
        assert self.user.profile.email == 'testusercreate@gmail.com'

    def test_user_create_no_email(self):
        with pytest.raises(ValueError) as e_info:
            User.objects.create_user(email=None, password='testing321')

    def test_user_create_no_password(self):
        with pytest.raises(ValueError) as e_info:
            User.objects.create_user(email='TestUserNoPassword@gmail.com', password=None)

    def test_superuser_create(self):
        superuser = User.objects.create_superuser(
            email='superuser@gmail.com',
            password='testing321',
            is_staff=True,
            is_admin=True,
            is_superuser=True
        )
        assert isinstance(superuser, User)
        assert superuser.is_admin
        assert superuser.is_staff
        assert superuser.is_superuser

    def test_superuser_create_no_is_admin(self):
        superuser = User.objects.create_superuser(
            email='superuser@gmail.com',
            password='testing321',
            is_staff=True,
            is_superuser=True
        )
        self.validate_superuser(superuser)

    def test_superuser_create_no_is_staff(self):
        superuser = User.objects.create_superuser(
            email='superuser@gmail.com',
            password='testing321',
            is_admin=True,
            is_superuser=True
        )
        self.validate_superuser(superuser)

    def test_superuser_create_no_is_superuser(self):
        superuser = User.objects.create_superuser(
            email='superuser@gmail.com',
            password='testing321',
            is_staff=True,
            is_admin=True
        )
        self.validate_superuser(superuser)

    def test_superuser_create_is_admin_false(self):
        with pytest.raises(ValueError) as e_info:
            superuser = User.objects.create_superuser(
                email='superuser@gmail.com',
                password='testing321',
                is_staff=True,
                is_admin=False,
                is_superuser=True
            )

    def test_superuser_create_is_staff_false(self):
        with pytest.raises(ValueError) as e_info:
            superuser = User.objects.create_superuser(
                email='superuser@gmail.com',
                password='testing321',
                is_staff=False,
                is_admin=True,
                is_superuser=True
            )

    def test_superuser_create_is_superuser_false(self):
        with pytest.raises(ValueError) as e_info:
            superuser = User.objects.create_superuser(
                email='superuser@gmail.com',
                password='testing321',
                is_staff=True,
                is_admin=True,
                is_superuser=False
            )

    def validate_superuser(self, superuser):
        assert superuser.is_superuser
        assert superuser.is_admin
        assert superuser.is_staff


class TestProfileModel(TestCase):
    def setUp(self) -> None:
        self.profile = Profile.objects.create(
            email='TestProfileCreate@gmail.com',
            user=None,
            name='Profile',
            surname='Testing',
            phone='999888777',
            family=None,
        )

    def test_profile_created(self):
        assert isinstance(self.profile, Profile)
        assert str(self.profile) == 'Profile Testing'

    def test_profile_fullname(self):
        assert self.profile.full_name == 'Profile Testing'

    def test_profile_has_family_without_family(self):
        assert self.profile.family is None

    def test_profile_has_family_with_family(self):
        family = mixer.blend(Family, family_name='testfamilyname', family_head=self.profile)
        self.profile.family = family
        self.profile.save()

        assert self.profile.has_family

    def test_profile_family_name_without_family(self):
        assert self.profile.family_name is None

    def test_profile_family_name_with_family(self):
        family = mixer.blend(Family, family_name='testfamilyname', family_head=self.profile)
        self.profile.family = family
        self.profile.save()

        assert self.profile.family_name == 'testfamilyname'
