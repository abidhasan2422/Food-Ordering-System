from rest_framework import serializers
from .models import Category,Food,User
from django.contrib.auth.hashers import make_password


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"


class FoodSerializer(serializers.ModelSerializer):

    image = serializers.ImageField(
        use_url=True
    )

    class Meta:
        model = Food
        fields = "__all__"


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