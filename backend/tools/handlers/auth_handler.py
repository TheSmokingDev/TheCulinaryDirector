"""Business logic for authentication. Uses services for all DB access."""

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from ..services import user_service


class AuthError(Exception):
    def __init__(self, message, status_code=400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def _tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),
    }


def register(email, password, first_name="", last_name=""):
    if user_service.email_exists(email):
        raise AuthError("An account with that email already exists.", 409)

    user = user_service.create_user(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
    )
    return user, _tokens_for_user(user)


def login(email, password):
    user = authenticate(username=email, password=password)
    if user is None:
        raise AuthError("Invalid email or password.", 401)
    return user, _tokens_for_user(user)
