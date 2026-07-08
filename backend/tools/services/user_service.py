"""Database interactions for users. No business logic here."""

from ..models import User


def get_user_by_email(email):
    return User.objects.filter(email__iexact=email).first()


def email_exists(email):
    return User.objects.filter(email__iexact=email).exists()


def create_user(email, password, first_name="", last_name=""):
    return User.objects.create_user(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
    )
