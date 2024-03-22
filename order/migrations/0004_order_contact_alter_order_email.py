# Generated by Django 4.2.7 on 2024-02-22 05:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0003_alter_order_shipping_address'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='contact',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='order',
            name='email',
            field=models.EmailField(max_length=254),
        ),
    ]