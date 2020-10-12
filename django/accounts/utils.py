import threading

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
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
    domain = get_current_site(request).domain
    rel_link = reverse(
        'password-reset-confirm',
        kwargs={'uidb64': uidb64, 'token': token}
    )
    baseurl = 'http://{domain}{relLink}'.format(domain=domain, relLink=rel_link, token=token)
    body = f'Hello, \n Use link below to reset your password. \n {baseurl}'
    email = {
        'email_body': body,
        'to_email': (user.email, ),
        'email_subject': 'Reset your password'
    }
    # 18:00
    return email


def send_email(data):
    email = EmailMessage(
        subject=data['email_subject'], body=data['email_body'], to=data['to_email']
    )
    EmailThread(email).start()
