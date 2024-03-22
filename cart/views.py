from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from products.models import Product
from .models import Cart, CartItem, WishList, WishListItem
from django.db.models import Sum
from django.contrib import messages

# Create your views here.

@login_required
def cart_display(request):
    data = CartItem.objects.filter(cart__cart_user=request.user)
    total_quantity = data.aggregate(total_quantity=Sum('quantity'))['total_quantity'] or 0
    total_price = sum(item.product.new_price * item.quantity for item in data)
    context = {
        'data': data,
        'total_quantity': total_quantity,
        'total_price': total_price,
    }
    return render(request, 'cart.html', context)

@login_required
def add_to_cart(request):
    user = request.user
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        quantity = request.POST.get('quantity')
        name = Product.objects.filter(id=product_id).first()
        cart, _ = Cart.objects.update_or_create(cart_user=user)
        data_dict={
            'product': name,
            'cart': cart,
            'quantity': quantity,
        }  
        CartItem.objects.update_or_create(**data_dict)
        try:
            wl = WishListItem.objects.get(product__id=product_id)
            wl.delete()
        except:
            pass
        messages.info(request, 'Added To Cart')
        return redirect(request.META.get('HTTP_REFERER', '/'))
    

@login_required
def cart_item_delete(request, sid):
    data = CartItem.objects.get(id=sid)
    data.delete()
    return redirect(request.META.get('HTTP_REFERER', '/'))


# WIshlist Logics
@login_required
def wishlist_display(request):
    data = WishListItem.objects.filter(wishlist__wishlist_user=request.user)
    total_quantity = data.aggregate(total_quantity=Sum('quantity'))['total_quantity'] or 0
    total_price = sum(item.product.new_price * item.quantity for item in data)
    context = {
        'data': data,
        'total_quantity': total_quantity,
        'total_price': total_price,
    }
    return render(request, 'wishlist.html', context)


@login_required
def add_to_wishlist(request):
    user = request.user
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        quantity = request.POST.get('quantity')
        name = Product.objects.filter(id=product_id).first()
        wishlist, _ = WishList.objects.update_or_create(wishlist_user=user)
        data_dict={
            'product': name,
            'wishlist': wishlist,
            'quantity': quantity,
        }  
        WishListItem.objects.update_or_create(**data_dict)
        messages.info(request, 'Added To Wishlist')
        return redirect(request.META.get('HTTP_REFERER', '/'))
