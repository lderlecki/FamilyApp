from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

from family.models import Family


# is_active=True, is_admin=False, is_staff=False, is_superuser=False
class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password=None, **perm_fields):
        if not email:
            raise ValueError("User must have an email address")
        if not password:
            raise ValueError("User must have a password")

        user = self.model(
            email=self.normalize_email(email),
            **perm_fields
        )
        user.set_password(password)
        user.save()
        return user

    def create_user(self, email, password=None, **perm_fields):
        perm_fields.setdefault('is_staff', False)
        perm_fields.setdefault('is_superuser', False)
        return self._create_user(email, password=password, **perm_fields)

    def create_superuser(self, email, password=None, **perm_fields):
        perm_fields.setdefault('is_staff', True)
        perm_fields.setdefault('is_admin', True)
        perm_fields.setdefault('is_superuser', True)

        if not perm_fields.get('is_staff'):
            raise ValueError('Superuser must have is_staff=True.')
        if not perm_fields.get('is_admin'):
            raise ValueError('Superuser must have is_admin=True.')
        if not perm_fields.get('is_superuser'):
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(email, password=password, **perm_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Meta:
        db_table = 'user'

    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)  # model date created
    last_login = models.DateTimeField(auto_now=True)  # user last login timestamp

    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email


class Profile(models.Model):
    class Meta:
        db_table = 'profile'

    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    surname = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    family = models.ForeignKey('family.Family', on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"{self.name} {self.surname}"

    @property
    def has_family(self):
        return self.family is not None

    @property
    def full_name(self):
        return f"{self.name} {self.surname}"

    @property
    def family_name(self):
        try:
            return self.family.family_name
        except AttributeError:
            return None
