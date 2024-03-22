from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    contact = models.PositiveIntegerField()
    gender = models.CharField(max_length=20)

    def __str__(self):
        return str(self.user)

    
class Addres(models.Model):
    fname = models.CharField(max_length=100, default='')
    lname = models.CharField(max_length=100, default='')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    province = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    inner_address = models.CharField(max_length=100, blank=True, null=True)
    is_default = models.BooleanField(default=True)
    dlvr_contact = models.IntegerField()

    def __str__(self):
        return f"{self.fname} {self.lname}, Address: {self.address}, Province: {self.province}"

    
    
