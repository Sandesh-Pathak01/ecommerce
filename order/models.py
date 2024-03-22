from django.db import models
from django.contrib.auth.models import User
from accounts.models import Addres
from products.models import Product
import uuid

class OrderAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    inner_address = models.CharField(max_length=100, blank=True, null=True)
    province = models.CharField(max_length=100)

    def __str__(self):
        return f"Address for {self.first_name} {self.last_name}: {self.address}, {self.inner_address}, {self.province}"


class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('canceled', 'Canceled'),
    )
    
    PAYMENT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
    )
    
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    order_number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    order_date = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = models.ForeignKey(OrderAddress, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=100)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    order_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    email = models.EmailField()
    contact = models.IntegerField()

    def __str__(self):
        return f"Order #{self.pk} - {self.customer.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='order_items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2) 

    def subtotal(self):
        return self.product.price * self.quantity
    
    def __str__(self):
        return f"Order: {self.order}, Product: {self.product}, Quantity: {self.quantity}, Total Price: {self.total_price}"