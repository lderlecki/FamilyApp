import threading

from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from rest_framework import serializers
from django.core.mail import send_mail, EmailMessage
from django.dispatch import receiver
from django.urls import reverse
from django.utils.encoding import smart_bytes
from django.utils.http import urlsafe_base64_encode


class EmailThread(threading.Thread):
    def __init__(self, email_message):
        self.email_message = email_message
        threading.Thread.__init__(self)

    def run(self):
        self.email_message.send()


def generate_password_reset_email(request, user):
    uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
    token = PasswordResetTokenGenerator().make_token(user)

    domain = settings.FRONTEND_URL
    rel_link = f'password-reset-confirm/{uidb64}/{token}'

    baseurl = '{domain}{relLink}'.format(domain=domain, relLink=rel_link)
    body = f'Hello, \n Use link below to reset your password. \n {baseurl}'
    email = {
        'email_body': body,
        'to_email': (user.email,),
        'email_subject': 'Reset your password'
    }
    return email


def send_email(data):
    email = EmailMessage(
        subject=data['email_subject'], body=data['email_body'], to=data['to_email']
    )
    EmailThread(email).start()


def password_valid(p1, p2):
    if p1 != p2:
        raise serializers.ValidationError({'password': 'Passwords must match.'})
    if not p1:
        raise serializers.ValidationError({'password': 'Enter password.'})

    return True
