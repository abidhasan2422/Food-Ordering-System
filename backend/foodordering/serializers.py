from rest_framework import serializers
from .models import Category,Food,User,CartItem,Order,OrderItem, Wishlist
from django.contrib.auth.hashers import make_password


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"


# class FoodSerializer(serializers.ModelSerializer):

#     image = serializers.ImageField(
#         use_url=True
#     )

#     class Meta:
#         model = Food
#         fields = "__all__"

class FoodSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source='category.category_name',
        read_only=True
    )
    image = serializers.ImageField(
        use_url=True
    )

    class Meta:
        model = Food
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "email",
            "mobile",
            "password",
            "confirm_password",
        ]

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                {"password": "Passwords do not match"}
            )
        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")

        user = User.objects.create(
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
            mobile=validated_data["mobile"],
            password=make_password(validated_data["password"]),
        )

        return user

class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField()


class CartItemSerializer(serializers.ModelSerializer):

    item_name = serializers.CharField(
        source="food.item_name",
        read_only=True
    )

    image = serializers.ImageField(
        source="food.image",
        read_only=True
    )

    item_price = serializers.DecimalField(
        source="food.item_price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = CartItem
        fields = "__all__"




class OrderItemSerializer(serializers.ModelSerializer):

    item_name = serializers.CharField(
        source="food.item_name",
        read_only=True
    )

    image = serializers.ImageField(
        source="food.image",
        read_only=True
    )

    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    order_number = serializers.SerializerMethodField()
    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = ["user"]
    
    def get_order_number(self, obj):
        return f"FO-{obj.id:06d}"

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "mobile",
            "reg_date",
        ]

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "mobile",
        ]

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )
        return data


class MenuCategorySerializer(serializers.ModelSerializer):

    foods = FoodSerializer(
        source="food_set",
        many=True,
        read_only=True
    )

    class Meta:
        model = Category
        fields = [
            "id",
            "category_name",
            "foods",
        ]




class WishlistSerializer(serializers.ModelSerializer):

    food = FoodSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = [
            "id",
            "food",
        ]

from rest_framework import serializers

class ForgotPasswordSerializer(serializers.Serializer):

    email = serializers.EmailField()