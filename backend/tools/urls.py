from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import auth_views, tool_entry_views, tool_views

urlpatterns = [
    path("auth/register/", auth_views.register_view, name="auth-register"),
    path("auth/login/", auth_views.login_view, name="auth-login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="auth-refresh"),
    path("auth/me/", auth_views.me_view, name="auth-me"),
    path("tools/", tool_views.list_tools_view, name="tool-list"),
    path(
        "tools/<slug:slug>/entries/",
        tool_entry_views.entry_list_view,
        name="entry-list",
    ),
    path("tools/<slug:slug>/", tool_views.tool_detail_view, name="tool-detail"),
    path(
        "entries/<int:entry_id>/",
        tool_entry_views.entry_detail_view,
        name="entry-detail",
    ),
]
