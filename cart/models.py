from django.db import models
from products.models import Product
from django.contrib.auth.models import User

# Create your models here.
class Cart(models.Model):
    cart_user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_paid = models.BooleanField(default=False)

    def total_price(self):
        total = sum(item.product.price * item.quantity for item in self.cartitem_set.all())
        return total

    def adjust_quantity(self, product, new_quantity):
        cart_item = self.cartitem_set.get(product=product)
        cart_item.quantity = new_quantity
        cart_item.save()

    def total_items(self):
        total = sum(item.quantity for item in self.cartitem_set.all())
        return total

    def remove_item(self, product):
        cart_item = self.cartitem_set.get(product=product)
        cart_item.delete()

    def is_empty(self):
        return self.cartitem_set.count() == 0
    
    def __str__(self):
        return f"Cart for {self.cart_user.username} - Total Items: {self.total_items()}, Total Price: {self.total_price()}, Is Paid: {self.is_paid}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='products')
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.FloatField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.product.new_price and self.quantity:
            self.total_price = float(self.product.new_price) * float(self.quantity)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - Quantity: {self.quantity}"
    
class WishList(models.Model):
    wishlist_user = models.OneToOneField(User, on_delete=models.CASCADE)

    def total_price(self):
        total = sum(item.product.price * item.quantity for item in self.cartitem_set.all())
        return total

    def adjust_quantity(self, product, new_quantity):
        cart_item = self.cartitem_set.get(product=product)
        cart_item.quantity = new_quantity
        cart_item.save()

    def total_items(self):
        total = sum(item.quantity for item in self.cartitem_set.all())
        return total

    def remove_item(self, product):
        cart_item = self.cartitem_set.get(product=product)
        cart_item.delete()

    def is_empty(self):
        return self.cartitem_set.count() == 0
    
    def __str__(self):
        return f"Wishlist for {self.wishlist_user.username}"

class WishListItem(models.Model):
    wishlist = models.ForeignKey(WishList, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlist_item')
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.FloatField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.product.new_price and self.quantity:
            self.total_price = float(self.product.new_price) * float(self.quantity)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - Quantity: {self.quantity}"