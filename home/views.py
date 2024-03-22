from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from products.models import Product
from django.core.paginator import Paginator
from django.db.models import Q
from order.models import Order

# Create your views here.
def home(request):
    data = Product.objects.all()
    new = Product.objects.all().order_by('-entry_date')
    random_product = Product.objects.order_by('?').first()
    context={
        'data': data,
        'new': new,
        'special': random_product,
    }
    return render(request, 'index.html', context)


def product_listing_display(request):
    all_data = Product.objects.all()
    paginator = Paginator(all_data, 12)

    page_number = request.GET.get('page')
    data = paginator.get_page(page_number)

    context = {
        'data': data,
        'total': all_data,
    }
    return render(request, 'product_listing.html', context)


def about_us(request):
    return render(request, 'about_us.html')


# Search/ Filters Logics
def search_products(request):
    filtered_data = Product.objects.all()
    
    if request.method == 'POST':
        searched_data = request.POST.get('search')
        
        if searched_data:
            filtered_data = filtered_data.filter(name__icontains=searched_data)
        
    paginator = Paginator(filtered_data, 12)
    page_number = request.GET.get('page')
    data = paginator.get_page(page_number)

    context = {
        'data': data,
        'total': data
    }
    return render(request, 'product_listing.html', context)


def filter_by_price(request):
    filtered_data = Product.objects.all()

    if request.method == 'POST':
        from_price = request.POST.get('from')
        to_price = request.POST.get('to')

        if from_price is not None and to_price is not None:
            filtered_data = filtered_data.filter(new_price__gte=from_price, new_price__lte=to_price)

    paginator = Paginator(filtered_data, 12)
    page_number = request.GET.get('page')
    data = paginator.get_page(page_number)

    context = {
        'data': data,
    }
    return render(request, 'product_listing.html', context)


def filter_cat(request):
    if request.method == 'POST':
        categories = request.POST.getlist('category')
        if categories:
            data = Product.objects.filter(type__in=categories)
        else:
            data = Product.objects.all()
    else:
        data = Product.objects.all()

    paginator = Paginator(data, 12)
    page_number = request.GET.get('page')
    data = paginator.get_page(page_number)

    context = {
        'data': data,
    }
    return render(request, 'product_listing.html', context)


def contact_display(request):
    return render(request, 'contact_us.html')


@login_required
def order_trace(request):
    data = Order.objects.filter(customer=request.user)
    context = {
        'data': data,
    }
    return render(request, 'order_tracking.html', context)
