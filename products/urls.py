from django.urls import path
from . import views

urlpatterns = [
    path('Product-details-display/<int:sid>/', views.Product_details_display, name='Product_details_display'),
]