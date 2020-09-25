import uuid

from django.db import models


class Family(models.Model):
    class Meta:
        db_table = 'family'

    budget = models.FloatField()
    family_name = models.CharField(max_length=255)
    group_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    family_head = models.OneToOneField('accounts.Profile', on_delete=models.CASCADE, related_name='family_head')

    def __str__(self):
        return f'{self.family_name}'  # - {self.family_head}'

    @property
    def family_members(self):
        return self.profile_set.all()

    # @property
    # def family_head(self):
    #     return self.profile_set.get(family_head=True)
