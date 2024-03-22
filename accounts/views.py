from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import UserInfo, Addres
from django.contrib.auth.decorators import login_required


# Create your views here.
def login_display(request):
    return render(request, 'login.html')


def signup_display(request):
    return render(request, 'signup.html')


def login_user(request):
    if request.method == 'POST':
        try:
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
            else:
                messages.info(request, 'Username and Password doesnt matches')
                return redirect('login_display')
        except Exception as e:
            messages.info(request, str(e))
            return redirect('login_display')
    else:
        return HttpResponse('Invalid Request')
    

def signup_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        contact = request.POST.get('contact')
        gender = request.POST.get('gender')

        if User.objects.filter(username=username).exists():
            messages.info(request, 'This username already exists')
            return redirect('signup_display')
        else:
            if password == password2:
                try:
                    new_user = User.objects.create_user(
                        username=username,
                        email=request.POST.get('email'),
                        password=password,
                        first_name=request.POST.get('fname'),
                        last_name=request.POST.get('lname')
                    )
                    UserInfo.objects.create(
                        user=new_user,
                        contact=contact,
                        gender=gender
                    )                  
                    login(request, new_user)
                    return redirect('home')
                except Exception as e:
                    messages.info(request, str(e))
                    return redirect('signup_display')
            else:
                messages.info(request, 'Passwords do not match')
                return redirect('signup_display')          
    

def signout(requst):
    logout(requst)
    messages.info(requst, 'Succesfully Logged Out')
    return redirect('home')

# Account Functionality's

@login_required
def account_info(request):
    data = UserInfo.objects.get(user=request.user)
    context = {
        'data': data,
    }
    return render(request, 'acc_details/account_info.html', context)


@login_required
def address_info(request):
    data = Addres.objects.filter(user=request.user)
    context = {
        'data': data,
    }
    return render(request, 'acc_details/address.html', context)


@login_required
def add_address(request):
    user_addresses = Addres.objects.filter(user=request.user)
    if user_addresses.exists():
        messages.info(request, 'An address already exists.')
        return redirect('address_info')
    if request.method == "POST":
        try:
            data_dict = {
                'fname': request.POST.get('fname'),
                'lname': request.POST.get('lname'),
                'user': request.user,
                'province': request.POST.get('province'),
                'address': request.POST.get('address'),
                'inner_address': request.POST.get('inner_address', None),
                'dlvr_contact': request.POST.get('dlvr_contact')
            }
            new_address = Addres.objects.create(**data_dict)
            messages.success(request, 'Address added successfully!')
        except Exception as e:
            messages.error(request, str(e))
        return redirect('address_info')
    else:
        return render(request, 'add_address.html')


@login_required
def delete_address(request, sid):
    data = Addres.objects.get(id=sid)
    data.delete()
    messages.info(request, 'Address Deleted Successfully.')
    return redirect('address_info')


@login_required
def edit_address_display(request, sid):
    data = Addres.objects.get(id=sid)
    context = {
        'data': data,
    }
    return render(request, 'acc_details/address_edit.html', context)


@login_required
def edit_address(request, sid):
    if request.method == 'POST':
        data = Addres.objects.filter(id=sid)
        data.first()
        try:
            data_dict = {
                'fname': request.POST.get('fname'),
                'lname': request.POST.get('lname'),
                'user': request.user,
                'province': request.POST.get('province'),
                'address': request.POST.get('address'),
                'inner_address': request.POST.get('inner_address', None),
                'dlvr_contact': request.POST.get('dlvr_contact')
            }
            messages.info(request, 'Address Updated Succesfully')
            data.update(**data_dict)
        except Exception as e:
            messages.info(request, str(e))
        return redirect('address_info')