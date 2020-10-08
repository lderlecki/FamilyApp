from django.db.models.signals import post_save
from .models import User, Profile


def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, email=instance.email)


post_save.connect(create_profile, sender=User)
