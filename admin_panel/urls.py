from django.urls import path
from .import views

urlpatterns = [
    path('', views.admin_panel_display, name='admin_panel_display'),
    path('Products/', views.product_display, name='product_display'),
    path('Products-entry/', views.add_product_display, name='add_product_display'),
    path('add-product/', views.add_product, name='add_product'),
    path('Manage-Orders/', views.order_master, name='order_master'),
    path('Orders/', views.all_orders, name='all_orders'),
    path('Deliver-Verification/<sid>', views.deliver_order, name='deliver_order'),
    path('Cofirm-Delivery/<sid>', views.confirm_delivery, name='confirm_delivery'),
    path('Processing-orders/', views.processing_orders, name='processing_orders'),
    path('Ready-Orders/<sid>', views.processed_orders, name='processed_orders'),
    path('Ship-Order/<sid>', views.ship_order, name='ship_order'),
    path('Shipped-Orders/', views.shipped_orders_display, name='shipped_orders_display'),
]