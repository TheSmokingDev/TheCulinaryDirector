from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from ..handlers import tool_handler
from ..serializers.tool_serializer import ToolSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def list_tools_view(request):
    tools = tool_handler.list_tools()
    return Response(ToolSerializer(tools, many=True).data)


@api_view(["GET"])
def tool_detail_view(request, slug):
    try:
        tool = tool_handler.get_tool(slug)
    except tool_handler.ToolNotFound as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_404_NOT_FOUND)
    return Response(ToolSerializer(tool).data)
