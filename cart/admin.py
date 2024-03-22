from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.Cart)
admin.site.register(models.CartItem)
admin.site.register(models.WishList)
admin.site.register(models.WishListItem)