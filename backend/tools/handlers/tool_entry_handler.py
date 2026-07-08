"""Business logic for saved tool entries. Uses services for all DB access."""

from ..services import tool_entry_service, tool_service


class EntryNotFound(Exception):
    pass


class ToolNotFound(Exception):
    pass


def _get_tool(slug):
    tool = tool_service.get_tool_by_slug(slug)
    if tool is None:
        raise ToolNotFound(f"No tool with slug '{slug}'.")
    return tool


def list_entries(user, slug):
    return tool_entry_service.list_entries(user, _get_tool(slug))


def create_entry(user, slug, name, data):
    return tool_entry_service.create_entry(user, _get_tool(slug), name, data)


def update_entry(user, entry_id, name, data):
    entry = tool_entry_service.get_entry_for_user(user, entry_id)
    if entry is None:
        raise EntryNotFound("Saved entry not found.")
    return tool_entry_service.update_entry(entry, name, data)


def delete_entry(user, entry_id):
    entry = tool_entry_service.get_entry_for_user(user, entry_id)
    if entry is None:
        raise EntryNotFound("Saved entry not found.")
    tool_entry_service.delete_entry(entry)
