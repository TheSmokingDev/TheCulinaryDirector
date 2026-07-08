"""Database interactions for saved tool entries. No business logic here."""

from ..models import ToolEntry


def list_entries(user, tool):
    return ToolEntry.objects.filter(user=user, tool=tool)


def get_entry_for_user(user, entry_id):
    return ToolEntry.objects.filter(user=user, id=entry_id).first()


def create_entry(user, tool, name, data):
    return ToolEntry.objects.create(user=user, tool=tool, name=name, data=data)


def update_entry(entry, name, data):
    entry.name = name
    entry.data = data
    entry.save(update_fields=["name", "data", "updated_at"])
    return entry


def delete_entry(entry):
    entry.delete()
