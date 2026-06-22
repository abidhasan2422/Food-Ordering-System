from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import  CategorySerializer,FoodSerializer,RegisterSerializer,LoginSerializer,CartItemSerializer,OrderSerializer
from .models import Category,Food,User,Cart,CartItem,OrderItem,Order
from django.shortcuts import get_object_or_404
from .Pagination import FoodPagination
import random
from django.db.models import Q
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.decorators import permission_classes
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from django.db.models.functions import TruncDate

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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):

    orders = Order.objects.filter(
        user=request.user
    ).order_by('-id')

    serializer = OrderSerializer(
        orders,
        many=True
    )

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_details(request, id):

    order = Order.objects.get(
        id=id,
        user=request.user
    )

    serializer = OrderSerializer(order)

    return Response(serializer.data)



from django.http import HttpResponse
from reportlab.lib.styles import ParagraphStyle

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)

from .models import Order, OrderItem

def download_invoice(request, id):

    order = Order.objects.get(id=id)

    response = HttpResponse(
        content_type="application/pdf"
    )

    response[
        "Content-Disposition"
    ] = (
        f'attachment; '
        f'filename="Invoice-{order.id}.pdf"'
    )

    doc = SimpleDocTemplate(response)

    styles = getSampleStyleSheet()

    elements = []

    order_number = f"FO-{order.id:06d}"
    invoice_number = f"INV-{order.id:06d}"

    # ==========================
    # COMPANY HEADER
    # ==========================

    title_style = ParagraphStyle(
    "TitleStyle",
    parent=styles["Title"],
    alignment=1,
    fontSize=24
)

    subtitle_style = ParagraphStyle(
        "SubtitleStyle",
        parent=styles["BodyText"],
        alignment=1,
        textColor=colors.grey
    )

    elements.append(
        Paragraph(
            "<b>FOOD ORDERING SYSTEM</b>",
            title_style
        )
    )

    elements.append(
        Paragraph(
            "Fast • Fresh • Delivered",
            subtitle_style
        )
    )

    elements.append(
        Spacer(1, 15)
    )

    # ==========================
    # INVOICE INFO
    # ==========================

    invoice_data = [
        [
            f"Invoice No: {invoice_number}",
            f"Order ID: {order_number}"
        ],
        [
            f"Date: {order.created_at.strftime('%d %b %Y')}",
            f"Status: {order.status}"
        ]
    ]

    invoice_table = Table(
        invoice_data,
        colWidths=[250, 250]
    )

    invoice_table.setStyle(
        TableStyle([
            (
                "GRID",
                (0, 0),
                (-1, -1),
                1,
                colors.black
            ),
            (
                "BACKGROUND",
                (0, 0),
                (-1, -1),
                colors.whitesmoke
            ),
            (
                "FONTNAME",
                (0, 0),
                (-1, -1),
                "Helvetica-Bold"
            )
        ])
    )

    elements.append(
        invoice_table
    )

    elements.append(
        Spacer(1, 20)
    )

    # ==========================
    # CUSTOMER INFO
    # ==========================

    elements.append(
        Paragraph(
            "<b>Customer Information</b>",
            styles["Heading3"]
        )
    )

    customer_data = [
        ["Name", order.full_name],
        ["Phone", order.phone],
        ["Email", order.email],
    ]

    customer_table = Table(
        customer_data,
        colWidths=[120, 350]
    )

    customer_table.setStyle(
        TableStyle([
            (
                "GRID",
                (0, 0),
                (-1, -1),
                1,
                colors.lightgrey
            )
        ])
    )

    elements.append(
        customer_table
    )

    elements.append(
        Spacer(1, 15)
    )

    # ==========================
    # DELIVERY ADDRESS
    # ==========================

    elements.append(
        Paragraph(
            "<b>Delivery Address</b>",
            styles["Heading3"]
        )
    )

    address_data = [
        ["Area", order.area],
        ["City", order.city],
        ["Address", order.address],
    ]

    address_table = Table(
        address_data,
        colWidths=[120, 350]
    )

    address_table.setStyle(
        TableStyle([
            (
                "GRID",
                (0, 0),
                (-1, -1),
                1,
                colors.lightgrey
            )
        ])
    )

    elements.append(
        address_table
    )

    elements.append(
        Spacer(1, 20)
    )

    # ==========================
    # ORDER ITEMS
    # ==========================

    elements.append(
        Paragraph(
            "<b>Ordered Items</b>",
            styles["Heading3"]
        )
    )

    items = OrderItem.objects.filter(
        order=order
    )

    table_data = [
        [
            "#",
            "Item Name",
            "Qty",
            "Unit Price",
            "Total"
        ]
    ]

    for index, item in enumerate(
        items,
        start=1
    ):

        item_total = (
            item.quantity *
            item.price
        )

        table_data.append([
            str(index),
            item.food.item_name,
            str(item.quantity),
            f"BDT {item.price}",
            f"BDT {item_total}"
        ])

    item_table = Table(
        table_data,
        colWidths=[
            40,
            220,
            60,
            90,
            90
        ]
    )

    item_table.setStyle(
        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#198754")
            ),

            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white
            ),

            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                1,
                colors.black
            ),

            (
                "ALIGN",
                (0, 0),
                (-1, -1),
                "CENTER"
            ),
        ])
    )

    elements.append(
        item_table
    )

    elements.append(
        Spacer(1, 20)
    )

    # ==========================
    # PAYMENT SUMMARY
    # ==========================

    elements.append(
        Paragraph(
            "<b>Payment Summary</b>",
            styles["Heading3"]
        )
    )

    payment_data = [
        [
            "Subtotal",
            f"BDT {order.subtotal}"
        ],
        [
            "Delivery Charge",
            f"BDT {order.delivery_charge}"
        ],
        [
            "Total Amount",
            f"BDT {order.total_amount}"
        ]
    ]

    payment_table = Table(
        payment_data,
        colWidths=[250, 200]
    )

    payment_table.setStyle(
        TableStyle([
            (
                "GRID",
                (0, 0),
                (-1, -1),
                1,
                colors.black
            ),
            (
                "BACKGROUND",
                (0, 2),
                (-1, 2),
                colors.lightgrey
            ),
            (
                "FONTNAME",
                (0, 2),
                (-1, 2),
                "Helvetica-Bold"
            )
        ])
    )

    elements.append(
        payment_table
    )

    elements.append(
        Spacer(1, 20)
    )

    # ==========================
    # NOTES
    # ==========================

    if order.notes:

        elements.append(
            Paragraph(
                "<b>Special Instructions</b>",
                styles["Heading3"]
            )
        )

        elements.append(
            Paragraph(
                order.notes,
                styles["BodyText"]
            )
        )

        elements.append(
            Spacer(1, 20)
        )

    # ==========================
    # FOOTER
    # ==========================

    footer_style = ParagraphStyle(
    "FooterStyle",
    parent=styles["BodyText"],
    alignment=1
)
    elements.append(
    Paragraph(
        "<b>Thank You For Your Order!</b>",
        footer_style
    )
)
    elements.append(
    Paragraph(
        "support@foodordering.com",
        footer_style
    )
)
    elements.append(
    Paragraph(
         "+8801XXXXXXXXX",
        footer_style
    )
)
    elements.append(
    Paragraph(
         "This invoice serves as proof of purchase.",
        footer_style
    )
)
    doc.build(elements)

    return response


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order_from_cart(request):

    serializer = OrderSerializer(
        data=request.data
    )

    if serializer.is_valid():

        order = serializer.save(
            user=request.user
        )

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

        return Response({
            "message": "Order Created Successfully",
            "order_id": order.id
        })

    return Response(
        serializer.errors,
        status=400
    )

@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_orders(request):

    status = request.GET.get("status")

    orders = Order.objects.all()

    if status:
        orders = orders.filter(
            status=status
        )

    orders = orders.order_by("-id")

    serializer = OrderSerializer(
        orders,
        many=True
    )

    return Response(serializer.data)

@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def update_order_status(request, id):

    order = Order.objects.get(id=id)

    status = request.data.get("status")

    order.status = status

    order.save()

    return Response({
        "message": "Status Updated"
    })

@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_order_details(request, id):

    order = Order.objects.get(id=id)

    serializer = OrderSerializer(order)

    return Response(serializer.data)

from django.db.models import Sum
@api_view(["GET"])
@permission_classes([IsAdminUser])
def dashboard_stats(request):

    total_orders = Order.objects.count()

    pending_orders = Order.objects.filter(
        status="Pending"
    ).count()

    delivered_orders = Order.objects.filter(
        status="Delivered"
    ).count()

    processing_orders = Order.objects.filter(
        status="Processing"
    ).count()
    confirmed_orders = Order.objects.filter(
        status="Confirmed"
    ).count()
    cancelled_orders = Order.objects.filter(
        status="Cancelled"
    ).count()


    total_revenue = (
        Order.objects.filter(
            status="Delivered"
        ).aggregate(
            total=Sum("total_amount")
        )["total"]
        or 0
    )

    total_users = User.objects.count()

    total_foods = Food.objects.count()

    total_category = Category.objects.count()
    revenue_data = (
    Order.objects
    .filter(status="Delivered")
    .annotate(day=TruncDate("created_at"))
    .values("day")
    .annotate(
        revenue=Sum("total_amount")
    )
    .order_by("day")
)
    recent_orders = Order.objects.order_by("-id")[:5]

    recent_orders_data = []

    for order in recent_orders:

        recent_orders_data.append({
            "id": order.id,
            "order_number":  f"FO-{order.id:06d}",
            "customer": order.full_name,
            "status": order.status,
            "total": order.total_amount,
            "created_at":order.created_at
        })


    return Response({
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "confirmed_orders": confirmed_orders,
        "delivered_orders":delivered_orders,
        "cancelled_orders": cancelled_orders,
        "processing_orders":processing_orders,
        "total_revenue": total_revenue,
        "total_users": total_users,
        "total_foods": total_foods,
        "total_category":total_category,
        "revenue_chart": revenue_data,
        "recent_orders": recent_orders_data
    })


@api_view(["GET"])
@permission_classes([IsAdminUser])
def customers(request):

    users = User.objects.all().order_by("-id")

    data = []

    for user in users:

        data.append({
            "id": user.id,
            "name": f"{user.first_name} {user.last_name}",
            "email": user.email,
            "phone": user.mobile,
            "join_date": user.reg_date,
            "total_orders": user.order_set.count()
        })

    return Response(data)