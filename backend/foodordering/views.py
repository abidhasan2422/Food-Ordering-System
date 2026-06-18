from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import  CategorySerializer,FoodSerializer,RegisterSerializer,LoginSerializer,CartItemSerializer,OrderSerializer
from .models import Category,Food,User,Cart,CartItem,OrderItem
from django.shortcuts import get_object_or_404
from .Pagination import FoodPagination
import random
from django.db.models import Q
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes


@api_view(['POST'])
def admin_login_api(request):
    print(request.data)
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '').strip()

    if not email or not password:
        return Response(
            {
                "success": False,
                "message": "Email and Password are required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)

    except User.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Invalid Credentials"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Check password
    if not user.check_password(password):
        return Response(
            {
                "success": False,
                "message": "Invalid Credentials"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Check admin permission
    if not user.is_staff:
        return Response(
            {
                "success": False,
                "message": "Admin Access Required"
            },
            status=status.HTTP_403_FORBIDDEN
        )

    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "success": True,
            "message": "Admin Login Successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "email": user.email,
            "name": f"{user.first_name} {user.last_name}"
        },
        status=status.HTTP_200_OK
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
    identifier = request.data.get('identifier', '').strip()
    password   = request.data.get('password', '').strip()

    if not identifier or not password:
        return Response(
            {"error": "Please provide both identifier and password"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Find user by email OR mobile
    try:
        if '@' in identifier:
            user = User.objects.get(email=identifier)
        else:
            user = User.objects.get(mobile=identifier)
    except User.DoesNotExist:
        return Response(
            {"error": "Invalid email/mobile or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    #  Check if account is active
    if not user.is_active:
        return Response(
            {"error": "Account is disabled"},
            status=status.HTTP_403_FORBIDDEN
        )

    #Verify password using AbstractBaseUser's built-in method
    if not user.check_password(password):  
        return Response(
            {"error": "Invalid email/mobile or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    #  Generate JWT tokens
    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "Login successful",
        "access":  str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "first_name": user.first_name,
            "last_name":  user.last_name,
            "email":      user.email,
        }
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_food_detail(request, id):
    try:
        food = Food.objects.get(id=id)
    except Food.DoesNotExist:
        return Response(
            {"error": "Food not found"},
            status=404
        )

    serializer = FoodSerializer(food)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):

    user = request.user

    food_id = request.data.get("food_id")

    food = Food.objects.get(id=food_id)

    cart, created = Cart.objects.get_or_create(
        user=user
    )

    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        food=food
    )

    if not created:
        cart_item.quantity += 1
        cart_item.save()

    return Response({
        "message": "Added to cart"
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):

    print(request.user)

    cart, created = Cart.objects.get_or_create(
        user=request.user
    )

    serializer = CartItemSerializer(
        cart.items.all(),
        many=True
    )

    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def increase_quantity(request, id):

    item = CartItem.objects.get(id=id)

    item.quantity += 1

    item.save()

    return Response({
        "message": "updated"
    })

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def decrease_quantity(request, id):

    item = CartItem.objects.get(id=id)

    if item.quantity > 1:
        item.quantity -= 1
        item.save()

    return Response({
        "message": "updated"
    })

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, id):

    item = CartItem.objects.get(id=id)

    item.delete()

    return Response({
        "message": "removed"
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):

    serializer = OrderSerializer(
        data=request.data
    )

    if serializer.is_valid():

        order = serializer.save(
            user=request.user
        )

        food = Food.objects.get(
            id=request.data.get("food_id")
        )

        OrderItem.objects.create(
            order=order,
            food=food,
            quantity=request.data.get("quantity"),
            price=food.item_price
        )

        return Response({
            "message": "Order Created",
            "order_id": order.id
        })

    return Response(
        serializer.errors,
        status=400
    )