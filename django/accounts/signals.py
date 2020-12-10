from django.db.models.signals import post_save
from .models import User, Profile


def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, email=instance.email)


def update_user_email(sender, instance, created, **kwargs):
    if not created and instance.user is not None:
        instance.user.email = instance.email
        instance.user.save()


post_save.connect(create_profile, sender=User)
post_save.connect(update_user_email, sender=Profile)
