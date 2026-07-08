from rest_framework import serializers

from ..models import ToolEntry


class ToolEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ToolEntry
        fields = ("id", "name", "data", "created_at", "updated_at")


class ToolEntryInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    data = serializers.JSONField()

    def validate_data(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("data must be an object.")
        return value
