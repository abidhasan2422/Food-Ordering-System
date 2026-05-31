from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import  CategorySerializer
from .models import Category
from django.shortcuts import get_object_or_404

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