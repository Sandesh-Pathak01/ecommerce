# Generated by Django 4.2.7 on 2024-02-17 07:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='type',
            field=models.CharField(choices=[('backpack', 'Back Pack'), ('waistbag', 'Waist Bag'), ('other', 'Other')], default='backpack', max_length=30),
        ),
    ]
