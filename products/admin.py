from django.contrib import admin

# Register your models here.

from .models import Product, PriceHistory, PriceAlert

admin.site.register(Product)
admin.site.register(PriceHistory)
admin.site.register(PriceAlert)