from django.shortcuts import render
from django.http import JsonResponse

def payment_initiate(request):
    return JsonResponse({"message": "Payment Initiate API"})

def payment_success(request):
    return JsonResponse({"message": "Payment Successful"})

def payment_fail(request):
    return JsonResponse({"message": "Payment Failed"})

def payment_cancel(request):
    return JsonResponse({"message": "Payment Cancelled"})

def payment_ipn(request):
    return JsonResponse({"message": "Payment IPN Received"})
