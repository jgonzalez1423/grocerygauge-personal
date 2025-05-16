from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .utils import search_kroger_products
from .models import Product, PriceHistory, PriceAlert
from .serializers import ProductSerializer, PriceHistorySerializer, PriceAlertSerializer

@api_view(["GET"])
def all_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def one_product(request, product_id):
    product = get_object_or_404(Product, product_id=product_id)
    serializer = ProductSerializer(product)
    return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(["POST"])
def create_price_alert(request):
    product_id = request.data.get("product_id")
    email = request.data.get("email")
    target_price = request.data.get("target_price")
    product = get_object_or_404(Product, product_id=product_id)
    alert = PriceAlert.objects.create(
        product=product,
        email=email,
        target_price=target_price,
        is_active=True
    )
    
    serializer = PriceAlertSerializer(alert)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class PriceHistoryView(APIView):
    
    def get(self, request, product_id):
        product = get_object_or_404(Product, product_id=product_id)
        histories = PriceHistory.objects.filter(product=product).order_by('-timestamp')
        serializer = PriceHistorySerializer(histories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    