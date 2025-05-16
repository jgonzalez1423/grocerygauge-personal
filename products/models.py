from django.db import models
# Create your models here.

class Product(models.Model):
    product_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255, null=True, blank=True)
    upc = models.CharField(max_length=50, null=True, blank=True)
    current_price = models.FloatField(null=True, blank=True)
    last_updated = models.DateTimeField(auto_now=True)
    image_url      = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"{self.name} (${self.current_price})"
    
class PriceHistory(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='price_history')
    price = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - ${self.price} on {self.timestamp.strftime('%Y-%m-%d')}"
    
class PriceAlert(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='price_alerts')
    email = models.EmailField()
    target_price = models.FloatField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Alert for {self.product.name} under ${self.target_price}"
    
   