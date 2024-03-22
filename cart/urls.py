from django.urls import path
from .import views

urlpatterns = [
    path('', views.cart_display, name='cart_display'),
    path('add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path('delete-cart-item/<sid>', views.cart_item_delete, name='cart_item_delete'),
    path('Wishlist/', views.wishlist_display, name='wishlist_display'),
    path('add-to-wishlist/', views.add_to_wishlist, name='add_to_wishlist'),
]