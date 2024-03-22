from django.db import models
from django.core.validators import FileExtensionValidator
from django.contrib.auth.models import User

# Create your models here.
class Availabilty(models.TextChoices):
    AVAILABLE = 'available', 'Available'
    NOT_AVAILABLE = 'not_available', 'Not Available'

class RefundableChoices(models.TextChoices):
    YES = 'yes', 'Yes'
    NO = 'no', 'No'

class Type(models.TextChoices):
    BACKPACK = 'backpack', 'Back Pack'
    WAISTBAG = 'waistbag', 'Waist Bag'
    OTHER = 'other', 'Other'

class Gender(models.TextChoices):
    MALE = 'male', 'Male'
    FEMALE = 'female', 'Female'
    UNISEX = 'unisex', 'Unisex'

class Product(models.Model):
    name = models.CharField(max_length=180)
    description = models.TextField()
    image = models.ImageField(upload_to='products', validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp'])])
    image2 = models.ImageField(upload_to='products',blank=True, null=True, validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp'])])
    image3 = models.ImageField(upload_to='products',blank=True, null=True, validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp'])])
    availabilty = models.CharField(max_length=50, choices=Availabilty.choices, default='available')
    price = models.PositiveIntegerField()
    discount = models.PositiveIntegerField(blank= True,null=True)
    new_price = models.PositiveIntegerField(default=0)
    refundable = models.CharField(max_length=10, choices=RefundableChoices.choices, default='yes')
    type = models.CharField(max_length=30, choices=Type.choices, default='backpack')
    gender = models.CharField(max_length=30, choices=Gender.choices, default='male')
    width = models.IntegerField()
    height = models.IntegerField()
    color = models.CharField(max_length=30)
    quantity = models.IntegerField()
    entry_by = models.ForeignKey(User, on_delete=models.PROTECT)
    entry_date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.discount is not None:
            self.new_price = self.price - self.discount
        else:
            self.new_price = self.price
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

