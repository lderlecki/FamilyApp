import pytest

from django.test import TestCase

from mixer.backend.django import mixer

from accounts.models import User, Profile
from ..models import Family, Address

pytest_mark = pytest.mark.django_db


@pytest_mark
class TestFamilyModel(TestCase):
    def setUp(self) -> None:
        self.user = User.objects.create_user(
            email='testfamilymodel@gmail.com',
            password='testing321'
        )

    def test_family_create(self):
        family = mixer.blend(Family, family_name='testfamilyname', family_head=self.user.profile)
        family_result = Family.objects.last()

        assert isinstance(family_result, Family)
        assert family_result.family_name == 'testfamilyname'
        assert str(family_result) == 'testfamilyname'

    def test_family_members(self):
        family = mixer.blend(Family, family_head=self.user.profile)
        family_result = Family.objects.last()
        self.user.profile.family = family_result
        self.user.profile.save()

        assert family_result.family_members.exists()
        assert family_result.family_members.count() == 1


class TestAddressModel(TestCase):
    def test_family_create(self):
        address = Address.objects.create(
            territory='Poland',
            city='Warsaw',
            street='Some Street',
            street_no='91',
            flat_no='32',
            postal_code='00-028'
        )
        address_result = Address.objects.last()

        assert isinstance(address_result, Address)
        assert str(address_result) == 'Warsaw, Some Street, 91, 00-028'
