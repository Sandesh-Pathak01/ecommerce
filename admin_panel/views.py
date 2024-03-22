from django.shortcuts import render, redirect, HttpResponse
from products.models import Product
from django.contrib import messages
from django.db import transaction
from order.models import Order, OrderAddress, OrderItem
from django.contrib.admin.views.decorators import staff_member_required

# Create your views here.
@staff_member_required
def admin_panel_display(request):
    return render(request, 'dashboard.html')


# Product Logic
@staff_member_required
def product_display(request):
    data=Product.objects.all()
    context = {
        'data': data,
    }
    return render(request, 'product.html', context)


@staff_member_required
def add_product_display(request):
    return render(request, 'product_entry.html')


@staff_member_required
def add_product(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                data_dict = {
                    'name': request.POST.get('name'),
                    'description': request.POST.get('description'),
                    'image': request.FILES.get('image'),
                    'availabilty': request.POST.get('availability'),
                    'price': int(request.POST.get('price', 0)),
                    'discount': int(request.POST.get('discount', 0)),
                    'refundable': request.POST.get('refundable'),
                    'type': request.POST.get('type'),
                    'gender': request.POST.get('gender'),
                    'width': request.POST.get('width'),
                    'height': request.POST.get('height'),
                    'color': request.POST.get('color'),
                    'quantity': request.POST.get('quantity'),
                    'entry_by': request.user,
                }
                if 'image2' in request.FILES:
                    data_dict['image2'] = request.FILES['image2']
                if 'image3' in request.FILES:
                    data_dict['image3'] = request.FILES['image3']
                
                Product.objects.create(**data_dict)
                messages.success(request, 'add')
        except Exception as e:
            messages.error(request, str(e))
    else:
        messages.info(request, 'Problem')
    
    return redirect('add_product_display')


# Order Logic
@staff_member_required
def order_master(request):
    return render(request, 'order_master.html')


@staff_member_required
def all_orders(request):
    data = Order.objects.filter(order_status='pending')
    context = {
        'data': data,
    }
    return render(request, 'order_display.html', context)


@staff_member_required
def deliver_order(request, sid):
    data = Order.objects.filter(id=sid).first()
    context = {
        'data': data,
    }
    return render(request, 'deliver/delivery_verification.html', context)


@staff_member_required
def confirm_delivery(request, sid):
    data = Order.objects.get(id=sid)
    if request.method == 'POST':
        new_status = 'processing'
        data.order_status = new_status
        data.save()
        messages.info(request, 'Order Starting To Processed')
    
    return redirect('all_orders')


@staff_member_required
def processing_orders(request):
    data = Order.objects.filter(order_status='processing')
    context = {
        'data': data,
    }
    return render(request, 'deliver/processing_orders.html', context)


@staff_member_required
def processed_orders(request, sid):
    data = Order.objects.filter(id=sid).first()
    context = {
        'data': data,
    }
    return render(request, 'deliver/send_to_deliver.html', context)


@staff_member_required
def ship_order(request, sid):
    data = Order.objects.get(id=sid)
    if request.method == 'POST':
        new_status = 'shipped'
        data.order_status = new_status
        data.save()
        messages.info(request, 'Order Shipped')
    
    return redirect('processing_orders')


@staff_member_required
def shipped_orders_display(request):
    data = Order.objects.filter(order_status='shipped')
    context = {
        'data': data,
    }
    return render(request, 'shipped_orders_list.html', context)

