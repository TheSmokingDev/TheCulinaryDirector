"""Business logic for tools. Uses services for all DB access."""

from ..services import tool_service


class ToolNotFound(Exception):
    pass


def list_tools():
    return tool_service.list_tools()


def get_tool(slug):
    tool = tool_service.get_tool_by_slug(slug)
    if tool is None:
        raise ToolNotFound(f"No tool with slug '{slug}'.")
    return tool
