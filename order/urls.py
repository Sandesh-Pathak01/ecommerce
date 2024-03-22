from django.urls import path
from .import views

urlpatterns = [
    path('', views.checkout_display, name='checkout_display'),
    path('Order/', views.order, name='order'),
    path('Order-Success/', views.order_success, name='order_success'),
]