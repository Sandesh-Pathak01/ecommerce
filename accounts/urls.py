from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_display, name='login_display'),
    path('SignUp/', views.signup_display, name='signup_display'),
    path('login-user/', views.login_user, name='login_user'),
    path('signup-user/', views.signup_user, name='signup_user'),
    path('signout/', views.signout, name='signout'),
    path('account-info/', views.account_info, name='account_info'),
    path('My-address/', views.address_info, name='address_info'),
    path('add_address/', views.add_address, name='add_address'),
    path('delete_address/<sid>', views.delete_address, name='delete_address'),
    path('edit_address_display/<sid>', views.edit_address_display, name='edit_address_display'),
    path('edit_address/<sid>', views.edit_address, name='edit_address'),
]