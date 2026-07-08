from django.contrib import admin

from .models import Tool, ToolEntry, User

admin.site.register(User)


@admin.register(ToolEntry)
class ToolEntryAdmin(admin.ModelAdmin):
    list_display = ("name", "tool", "user", "updated_at")
    list_filter = ("tool",)


@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "category", "status", "sort_order")
    prepopulated_fields = {"slug": ("name",)}
