from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import  CategorySerializer,FoodSerializer,RegisterSerializer,LoginSerializer
from .models import Category,Food,User
from django.shortcuts import get_object_or_404
from .Pagination import FoodPagination
import random
from django.db.models import Q
from django.contrib.auth.hashers import check_password


@api_view(['POST'])
def admin_login_api(request):

    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {
                "success": False,
                "message": "Username and Password are required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(
        username=username,
        password=password
    )

    if user is not None and user.is_staff:

        return Response(
            {
                "success": True,
                "message": "Admin Login Successful",
                "username": user.username
            },
            status=status.HTTP_200_OK
        )

    return Response(
        {
            "success": False,
            "message": "Invalid Credentials"
        },
        status=status.HTTP_401_UNAUTHORIZED
    )
@api_view(["POST"])
def add_category(request):

    serializer = CategorySerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response({
            "success": True,
            "message": "Category Added Successfully"
        })

    return Response({
        "success": False,
        "errors": serializer.errors
    })

@api_view(['GET'])
def get_categories(request):

    categories = Category.objects.all().order_by('-id')

    serializer = CategorySerializer(
        categories,
        many=True
    )

    return Response(serializer.data)

@api_view(['DELETE'])
def delete_category(request,id):
    category= get_object_or_404(Category,id=id)
    category.delete()
    return Response({
        "message": "Category Deleted Successfully"
    })

@api_view(['PUT'])
def update_category(request, id):

    category = get_object_or_404(
        Category,
        id=id
    )

    serializer = CategorySerializer(
        category,
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response({
            "message": "Category Updated Successfully"
        })

    return Response(serializer.errors)

@api_view(['POST'])
def add_food(request):

    serializer = FoodSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response({
            "message":
            "Food Added Successfully"
        })

    return Response(
        serializer.errors
    )

@api_view(['GET'])
def get_foods(request):

    foods = Food.objects.all().order_by('-id')

    paginator = FoodPagination()

    paginated_foods = paginator.paginate_queryset(
        foods,
        request
    )

    serializer = FoodSerializer(
        paginated_foods,
        many=True
    )

    return paginator.get_paginated_response(
        serializer.data
    )


@api_view(['DELETE'])
def delete_food(
    request,
    id
):

    food =Food.objects.get(id=id)

    food.delete()

    return Response({
        "message":
        "Food Deleted Successfully"
    })

@api_view(['PUT'])
def update_food(
    request,
    id
):

    food =Food.objects.get(id=id)

    serializer =FoodSerializer(
        food,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():

        serializer.save()

        return Response({
            "message":
            "Food Updated Successfully"
        })

    return Response(
        serializer.errors
    )

@api_view(['GET'])
def search_food(request):
    keyword = request.GET.get('keyword', '')

    foods = Food.objects.filter(
        item_name__icontains=keyword
    )

    serializer = FoodSerializer(
        foods,
        many=True
    )

    return Response(serializer.data)



@api_view(['GET'])
def random_foods(request):
    foods = list(Food.objects.all())

    random.shuffle(foods)

    limited_foods = foods[0:9]

    serializer = FoodSerializer(
        limited_foods,
        many=True
    )

    return Response(serializer.data)

@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User registered successfully"}
        )

    print(serializer.errors)
    return Response(
        serializer.errors,
        status=400
    )


@api_view(['POST'])
def login_user(request):

    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():

        identifier = serializer.validated_data["identifier"]
        password = serializer.validated_data["password"]

        try:
            user = User.objects.get(
                Q(email=identifier) |
                Q(mobile=identifier)
            )

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=400
            )

        if not check_password(password, user.password):
            return Response(
                {"error": "Invalid password"},
                status=400
            )

        return Response({
            "message": "Login Successful",
            "user_id": user.id,
            "first_name": user.first_name,
            "email": user.email,
            "mobile": user.mobile
        })

    return Response(serializer.errors, status=400)