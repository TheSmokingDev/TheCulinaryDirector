from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from ..handlers import auth_handler
from ..serializers.user_serializer import (
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        user, tokens = auth_handler.register(**serializer.validated_data)
    except auth_handler.AuthError as exc:
        return Response({"detail": exc.message}, status=exc.status_code)

    return Response(
        {"user": UserSerializer(user).data, "tokens": tokens},
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        user, tokens = auth_handler.login(**serializer.validated_data)
    except auth_handler.AuthError as exc:
        return Response({"detail": exc.message}, status=exc.status_code)

    return Response({"user": UserSerializer(user).data, "tokens": tokens})


@api_view(["GET"])
def me_view(request):
    return Response(UserSerializer(request.user).data)
