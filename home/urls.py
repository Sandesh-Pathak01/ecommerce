from django.urls import path
from .import views

urlpatterns = [
    path('', views.home, name='home'),
    path('Our-products/', views.product_listing_display, name='product_listing_display'),
    path('About-ShopSandes/', views.about_us, name='about_us'),
    path('Search-products/', views.search_products, name='search_products'),
    path('filter-price/', views.filter_by_price, name='filter_by_price'),
    path('filter-cat/', views.filter_cat, name='filter_cat'),
    path('contact-us/', views.contact_display, name='contact_display'),
    path('Order_track/', views.order_trace, name='trace_order'),
]