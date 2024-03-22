from django.shortcuts import render
from .models import Product

# Create your views here.
def Product_details_display(request, sid):
    data = Product.objects.get(id=sid)
    related_products = Product.objects.all()
    context = {
        'data': data,
        'prod': related_products,
    }
    return render(request, 'product_details.html', context)