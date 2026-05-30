from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


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