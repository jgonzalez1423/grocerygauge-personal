from rest_framework import serializers
from .models import Product, PriceHistory, PriceAlert

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class PriceHistorySerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = PriceHistory
        fields = ('id', 'product', 'price', 'timestamp')
        
class PriceAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceAlert
        fields = '__all__'
