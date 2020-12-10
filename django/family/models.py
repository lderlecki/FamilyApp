import uuid

from django.db import models


class Family(models.Model):
    class Meta:
        db_table = 'family'

    budget = models.FloatField()
    family_name = models.CharField(max_length=255)
    group_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    family_head = models.OneToOneField('accounts.Profile', on_delete=models.CASCADE, related_name='family_head')
    address = models.OneToOneField('Address', on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f'{self.family_name}'  # - {self.family_head}'

    @property
    def family_members(self):
        return self.profile_set.all()


class Address(models.Model):
    class Meta:
        db_table = 'address'
    territory = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    street = models.CharField(max_length=255)
    street_no = models.CharField(max_length=255)
    flat_no = models.CharField(max_length=255, blank=True, null=True)
    postal_code = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.city}, {self.street}, {self.street_no}, {self.postal_code}'
