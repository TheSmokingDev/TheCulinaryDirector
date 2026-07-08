"""Database interactions for tools. No business logic here."""

from ..models import Tool


def list_tools():
    return Tool.objects.all()


def get_tool_by_slug(slug):
    return Tool.objects.filter(slug=slug).first()
