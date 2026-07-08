from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..handlers import tool_entry_handler
from ..serializers.tool_entry_serializer import (
    ToolEntryInputSerializer,
    ToolEntrySerializer,
)


@api_view(["GET", "POST"])
def entry_list_view(request, slug):
    try:
        if request.method == "GET":
            entries = tool_entry_handler.list_entries(request.user, slug)
            return Response(ToolEntrySerializer(entries, many=True).data)

        serializer = ToolEntryInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        entry = tool_entry_handler.create_entry(
            request.user, slug, **serializer.validated_data
        )
        return Response(
            ToolEntrySerializer(entry).data, status=status.HTTP_201_CREATED
        )
    except tool_entry_handler.ToolNotFound as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_404_NOT_FOUND)


@api_view(["PUT", "DELETE"])
def entry_detail_view(request, entry_id):
    try:
        if request.method == "DELETE":
            tool_entry_handler.delete_entry(request.user, entry_id)
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = ToolEntryInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        entry = tool_entry_handler.update_entry(
            request.user, entry_id, **serializer.validated_data
        )
        return Response(ToolEntrySerializer(entry).data)
    except tool_entry_handler.EntryNotFound as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_404_NOT_FOUND)
