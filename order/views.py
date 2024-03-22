from django.shortcuts import render, redirect, HttpResponse
from accounts.models import Addres, UserInfo
from cart.models import Cart, CartItem
from products.models import Product
from .models import Order, OrderAddress, OrderItem
from django.db import transaction
import uuid
from django.db.models import Sum
from django.contrib import messages
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required


# Create your views here.
@login_required
def checkout_display(request):
    data = CartItem.objects.filter(cart__cart_user=request.user)
    total_quantity = data.aggregate(total_quantity=Sum('quantity'))['total_quantity'] or 0
    total_price = sum(item.product.new_price * item.quantity for item in data)
    try:
        address = Addres.objects.get(user=request.user)
    except ObjectDoesNotExist:
        address = None
    context = {
        'data': data,
        'add': address,
        'total_quantity': total_quantity,
        'total_price': total_price,
    }
    return render(request, 'checkout.html', context)


@login_required
def order(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                # Create Order Address
                order_address_data = {
                    'user': request.user,
                    'first_name': request.POST.get('first_name'),
                    'last_name': request.POST.get('last_name'),
                    'address': request.POST.get('address'),
                    'inner_address': request.POST.get('inner_address'),
                    'province': request.POST.get('province'),
                }
                order_address = OrderAddress.objects.create(**order_address_data)

                # Create Order
                order_num = uuid.uuid4()
                order_data = {
                    'customer': request.user,
                    'order_number': order_num,
                    'total_price': request.POST.get('total_price'),
                    'shipping_address': order_address,
                    'payment_method': request.POST.get('payment_method'),
                    'payment_status': 'pending', 
                    'order_status': 'pending', 
                    'email': request.POST.get('email'),
                    'contact': request.POST.get('contact'),
                }
                order = Order.objects.create(**order_data)

                product_names = request.POST.getlist('product_name[]')
                quantities = request.POST.getlist('quantity[]')
                total_prices = request.POST.getlist('total_price[]')

                for i in range(len(product_names)):
                    product = Product.objects.get(name=product_names[i])
                    quantity = quantities[i]
                    total_price = total_prices[i]
                    OrderItem.objects.create(order=order, product=product, quantity=quantity, total_price=total_price)
                
                cart_data = CartItem.objects.filter(cart__cart_user=request.user)
                cart_data.delete()

                messages.info(request, order_num)
                return redirect('order_success')
        except Exception as e:
            messages.error(request, str(e))
        
        return redirect('home')
    else:
        return HttpResponse('Not Found')


@login_required
def order_success(request):
    return render(request, 'order/success_page.html')



