from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from foodordering.serializers import OrderSerializer

@api_view(["POST"])
# @permission_classes([IsAuthenticated])
# Step 2: Validate data
def payment_initiate(request):

    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        return Response({
            "message":"Data is valid"
        })

    return Response(serializer.errors, status=400)

def payment_success(request):
    return JsonResponse({"message": "Payment Successful"})

def payment_fail(request):
    return JsonResponse({"message": "Payment Failed"})

def payment_cancel(request):
    return JsonResponse({"message": "Payment Cancelled"})

def payment_ipn(request):
    return JsonResponse({"message": "Payment IPN Received"})
