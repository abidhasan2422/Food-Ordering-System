from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from foodordering.serializers import OrderSerializer
from foodordering.models import Food, Order,OrderItem,Cart
import requests 
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])

# def payment_initiate(request):

#     serializer = OrderSerializer(data=request.data)
#     if serializer.is_valid():
#         print(request.data)
#         print("Food ID:", request.data.get("food_id"))
#         order = serializer.save(
#             user= request.user,
#             payment_status = "Pending"
#         )

#         food = Food.objects.get(
#             id=request.data.get("food_id")
#         )
#         OrderItem.objects.create(
#             order=order,
#             food=food,
#             quantity=request.data.get("quantity"),
#             price=food.item_price
#         )
#         payment_data = {

#         "store_id": settings.SSLCOMMERZ_STORE_ID,

#         "store_passwd": settings.SSLCOMMERZ_STORE_PASSWORD,

#         "total_amount": order.total_amount, 

#         "currency": "BDT",

#         "tran_id":  f"FO-{order.id}",

#         "cus_name": order.full_name,

#         "cus_email": order.email,

#         "cus_phone": order.phone,

#         "cus_add1": order.address,

#         "cus_city": order.city,

#         "success_url": "http://127.0.0.1:8000/api/payment/success/",

#         "fail_url": "http://127.0.0.1:8000/api/payment/fail/",

#         "cancel_url": "http://127.0.0.1:8000/api/payment/cancel/",

#         "ipn_url": "http://127.0.0.1:8000/api/payment/ipn/",
    
# }
#         response = requests.post(
#         settings.SSLCOMMERZ_API_URL,
#         data=payment_data
#         )
#         response_data = response.json()
#         gateway_url = response_data.get("GatewayPageURL")

#         print(response_data)  
#         print(response_data.get("status"))
#         print(response_data.get("GatewayPageURL"))       
                
#         return Response({
#             "GatewayPageURL": gateway_url,
#             "order_id": order.id
#         })

#     return Response(serializer.errors, status=400)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def payment_initiate(request):

    serializer = OrderSerializer(data=request.data)

    if serializer.is_valid():

        # Create Order
        order = serializer.save(
            user=request.user,
            payment_status="Pending"
        )

        # -----------------------------
        # Buy Now
        # -----------------------------
        if request.data.get("food_id"):

            food = Food.objects.get(
                id=request.data.get("food_id")
            )

            OrderItem.objects.create(
                order=order,
                food=food,
                quantity=request.data.get("quantity"),
                price=food.item_price
            )

       

        else:

            cart = Cart.objects.get(
                user=request.user
            )

            cart_items = cart.items.all()


            for item in cart_items:


                OrderItem.objects.create(
                    order=order,
                    food=item.food,
                    quantity=item.quantity,
                    price=item.food.item_price
                )

            cart_items.delete()

        # -----------------------------
        # SSLCOMMERZ Payment Data
        # -----------------------------
        payment_data = {

            "store_id": settings.SSLCOMMERZ_STORE_ID,

            "store_passwd": settings.SSLCOMMERZ_STORE_PASSWORD,

            "total_amount": order.total_amount,

            "currency": "BDT",

            "tran_id": f"FO-{order.id}",

            "cus_name": order.full_name,

            "cus_email": order.email,

            "cus_phone": order.phone,

            "cus_add1": order.address,

            "cus_city": order.city,

            "success_url": "http://127.0.0.1:8000/api/payment/success/",

            "fail_url": "http://127.0.0.1:8000/api/payment/fail/",

            "cancel_url": "http://127.0.0.1:8000/api/payment/cancel/",

            "ipn_url": "http://127.0.0.1:8000/api/payment/ipn/",

        }

        response = requests.post(
            settings.SSLCOMMERZ_API_URL,
            data=payment_data
        )

        response_data = response.json()

        gateway_url = response_data.get("GatewayPageURL")

        return Response({
            "GatewayPageURL": gateway_url,
            "order_id": order.id
        })

    return Response(serializer.errors, status=400)

from django.shortcuts import redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def payment_success(request):

    tran_id = request.POST.get("tran_id")
    payment_status = request.POST.get("status")
    bank_tran_id = request.POST.get("bank_tran_id")

    if not tran_id:
        return JsonResponse(
            {"message": "Transaction ID not found"},
            status=400
        )

    if payment_status != "VALID":
        return JsonResponse(
            {"message": "Payment is not valid"},
            status=400
        )

    order_id = tran_id.replace("FO-", "")

    order = Order.objects.filter(id=order_id).first()

    if not order:
        return JsonResponse(
            {"message": "Order not found"},
            status=404
        )

    order.payment_status = "Paid"
    order.transaction_id = bank_tran_id
    order.save()

    return redirect(f"http://localhost:3000/order-success/{order.id}")

@csrf_exempt
def payment_fail(request):

    tran_id = request.POST.get("tran_id")

    if not tran_id:
        return JsonResponse(
            {"message": "Transaction ID not found"},
            status=400
        )

    order_id = tran_id.replace("FO-", "")

    order = Order.objects.filter(id=order_id).first()

    if not order:
        return JsonResponse(
            {"message": "Order not found"},
            status=404
        )

    order.payment_status = "Failed"
    order.save()

    return redirect(f"http://localhost:3000/order-failed/{order.id}")

@csrf_exempt
def payment_cancel(request):

    tran_id = request.POST.get("tran_id")

    if not tran_id:
        return JsonResponse(
            {"message": "Transaction ID not found"},
            status=400
        )

    order_id = tran_id.replace("FO-", "")

    order = Order.objects.filter(
        id=order_id
    ).first()

    if not order:
        return JsonResponse(
            {"message": "Order not found"},
            status=404
        )

    order.payment_status = "Cancelled"
    order.save()

    return redirect(
        f"http://localhost:3000/payment-cancel/{order.id}"
    )

def payment_ipn(request):
    return JsonResponse({"message": "Payment IPN Received"})
