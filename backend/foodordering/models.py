from django.db import models
from django.conf import settings

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin  

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)  
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):  
    first_name   = models.CharField(max_length=100)
    last_name    = models.CharField(max_length=100)
    email        = models.EmailField(max_length=50, unique=True)
    mobile       = models.CharField(max_length=15, unique=True)
    is_active    = models.BooleanField(default=True)
    is_staff     = models.BooleanField(default=False)
    reg_date     = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'mobile']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
class Category(models.Model):

    category_name = models.CharField(max_length=100)
    creation_date = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.category_name
class Food(models.Model):

    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    item_name = models.CharField(max_length=50)
    item_price = models.DecimalField(max_digits=10, decimal_places=2)
    item_description = models.TextField(max_length=500, null=True, blank=True)
    image = models.ImageField(upload_to='food-images/')
    item_quantity = models.CharField(max_length=50)
    is_available = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.item_name} ({self.item_quantity})"
    


class Cart(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.user.username


class CartItem(models.Model):

    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items"
    )

    food = models.ForeignKey(
        Food,
        on_delete=models.CASCADE
    )

    quantity = models.PositiveIntegerField(
        default=1
    )

    def __str__(self):
        return self.food.item_name


class Order(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    
    STATUS_CHOICES = (
    ("Pending", "Pending"),
    ("Confirmed", "Confirmed"),
    ("Processing", "Processing"),
    ("Delivered", "Delivered"),
    ("Cancelled", "Cancelled"),
)

   
    full_name = models.CharField(max_length=100)

    phone = models.CharField(max_length=20)

    email = models.EmailField()

    address = models.TextField()

    city = models.CharField(max_length=100)

    notes = models.TextField(
        blank=True,
        null=True
    )

    area = models.CharField(
        max_length=50
    )

    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    delivery_charge = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    payment_method = models.CharField(
        max_length=20,
        default="COD"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    food = models.ForeignKey(
        Food,
        on_delete=models.CASCADE
    )

    quantity = models.PositiveIntegerField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )


class Wishlist(models.Model):

    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="wishlist_items")
    food = models.ForeignKey(Food,on_delete=models.CASCADE,related_name="wishlisted_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "food")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.food.item_name}"