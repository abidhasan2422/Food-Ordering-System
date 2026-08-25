from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import  CategorySerializer,FoodSerializer,RegisterSerializer,LoginSerializer,CartItemSerializer,OrderSerializer, WishlistSerializer
from .models import Category,Food,User,Cart,CartItem,OrderItem,Order, Wishlist
from django.shortcuts import get_object_or_404
from .Pagination import FoodPagination, OrderReportPagination
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
from .throttles import UserLoginThrottle,AdminLoginThrottle,RegisterThrottle,SearchThrottle,WishlistThrottle
from rest_framework.decorators import throttle_classes
from .utils import send_order_confirmation_email

@api_view(['POST'])
@throttle_classes([AdminLoginThrottle])
def admin_login_api(request):

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
@permission_classes([IsAdminUser])
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
@permission_classes([IsAdminUser])
def get_categories(request):

    categories = Category.objects.all().order_by('-id')

    serializer = CategorySerializer(
        categories,
        many=True
    )

    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_category(request,id):
    category= get_object_or_404(Category,id=id)
    category.delete()
    return Response({
        "message": "Category Deleted Successfully"
    })

@api_view(['PUT'])
@permission_classes([IsAdminUser])
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
@permission_classes([IsAdminUser])
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
@permission_classes([IsAdminUser])
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
@permission_classes([IsAdminUser])
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
@throttle_classes([SearchThrottle])
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
@throttle_classes([RegisterThrottle])
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
@throttle_classes([UserLoginThrottle])
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

        # Send confirmation email
        try:
            send_order_confirmation_email(order)
        except Exception as e:
            print("EMAIL ERROR:", e)

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


from django.db import transaction

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order_from_cart(request):

    try:
        with transaction.atomic():

            cart = Cart.objects.get(
                user=request.user
            )

            cart_items = cart.items.select_related(
                "food"
            ).all()

            if not cart_items.exists():
                return Response(
                    {
                        "message": "Your cart is empty."
                    },
                    status=400
                )

            serializer = OrderSerializer(
                data=request.data
            )

            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=400
                )

            order = serializer.save(
                user=request.user
            )

            for item in cart_items:

                OrderItem.objects.create(
                    order=order,
                    food=item.food,
                    quantity=item.quantity,
                    price=item.food.item_price
                )

            cart_items.delete()

           
            send_order_confirmation_email(order)

            return Response({
                "message": "Order Created Successfully",
                "order_id": order.id
            })

    except Cart.DoesNotExist:
        return Response(
            {
                "message": "Cart not found."
            },
            status=404
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

from rest_framework import status

@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def update_order_status(request, id):

    order = Order.objects.get(id=id)

    new_status = request.data.get("status")

    # Reduce stock only the first time the order becomes Delivered
    if order.status != "Delivered" and new_status == "Delivered":

        for item in order.items.all():

            food = item.food

            current_quantity = int(food.item_quantity)

            if current_quantity >= item.quantity:

                food.item_quantity = str(
                    current_quantity - item.quantity
                )

                food.save()

            else:

                return Response(
                    {
                        "message": f"Not enough stock for {food.item_name}"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

    order.status = new_status
    order.save()

    return Response({
        "message": "Status Updated Successfully"
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


@api_view(["GET"])
@permission_classes([IsAdminUser])
def customer_details(request, id):

    user = get_object_or_404(
        User,
        id=id
    )

    orders = Order.objects.filter(
        user=user
    ).order_by("-id")

    total_orders = orders.count()

    total_spending = (
        orders.aggregate(
            total=Sum("total_amount")
        )["total"]
        or 0
    )

    order_data = []

    for order in orders:

        order_data.append({
            "id": order.id,
            "order_number": f"FO-{order.id:06d}",
            "status": order.status,
            "total_amount": order.total_amount,
            "created_at": order.created_at,
        })

    data = {
        "id": user.id,
        "name": f"{user.first_name} {user.last_name}",
        "email": user.email,
        "phone": user.mobile,
        "join_date": user.reg_date,
        "total_orders": total_orders,
        "total_spending": total_spending,
        "orders": order_data,
    }

    return Response(data)

# For Sales Report 
from django.db.models import Sum, Avg
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
@api_view(["GET"])
@permission_classes([IsAdminUser])
def sales_report(request):

    today = timezone.now().date()
    this_week_start = today - timedelta(days=7)
    last_week_start = today - timedelta(days=14)
    last_week_end = today - timedelta(days=7)

    total_revenue = (
        Order.objects
        .filter(status="Delivered")
        .aggregate(
            total=Sum("total_amount")
        )["total"] or 0
    )

    today_revenue = (
        Order.objects
        .filter(
            status="Delivered",
            created_at__date=today
        )
        .aggregate(
            total=Sum("total_amount")
        )["total"] or 0
    )

    monthly_revenue = (
        Order.objects
        .filter(
            status="Delivered",
            created_at__month=today.month,
            created_at__year=today.year
        )
        .aggregate(
            total=Sum("total_amount")
        )["total"] or 0
    )

    average_order = (
        Order.objects
        .filter(status="Delivered")
        .aggregate(
            avg=Avg("total_amount")
        )["avg"] or 0
    )

    revenue_chart = (
        Order.objects
        .filter(status="Delivered")
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(
            revenue=Sum("total_amount")
        )
        .order_by("day")
    )
    this_week_revenue = (
    Order.objects.filter(
        status="Delivered",
        created_at__date__gte=this_week_start
    ).aggregate(
        total=Sum("total_amount")
    )["total"] or 0
)
    last_week_revenue = (
    Order.objects.filter(
        status="Delivered",
        created_at__date__gte=last_week_start,
        created_at__date__lt=last_week_end
    ).aggregate(
        total=Sum("total_amount")
    )["total"] or 0
)
    if last_week_revenue > 0:
        growth = (
            (
                this_week_revenue -
                last_week_revenue
            )
            / last_week_revenue
        ) * 100
    else:
        growth = 0

    recent_sales = (
        Order.objects
        .filter(status="Delivered")
        .order_by("-id")[:5]
    )
    top_foods = (
    OrderItem.objects
    .values(
        "food__item_name"
    )
    .annotate(
        total_sold=Sum("quantity"),
        revenue=Sum("price")
    )
    .order_by("-total_sold")[:5]
)


    recent_sales_data = []

    for sale in recent_sales:

        recent_sales_data.append({
            "id": sale.id,
            "order_number": f"FO-{sale.id:06d}",
            "full_name": sale.full_name,
            "total_amount": sale.total_amount,
            "created_at": sale.created_at
        })

    return Response({
        "total_revenue": total_revenue,
        "today_revenue": today_revenue,
        "monthly_revenue": monthly_revenue,
        "average_order": round(average_order, 2),
        "revenue_chart": revenue_chart,
        "recent_sales": recent_sales_data,
         "top_foods": top_foods,
          "revenue_growth": round(growth, 1)
    })


@api_view(["GET"])
@permission_classes([IsAdminUser])
def order_report(request):
    status = request.GET.get("status")
    from_date = request.GET.get("from_date")
    to_date = request.GET.get("to_date")

    total_orders = Order.objects.count()

    pending = Order.objects.filter(
        status="Pending"
    ).count()

    confirmed = Order.objects.filter(
        status="Confirmed"
    ).count()

    processing = Order.objects.filter(
        status="Processing"
    ).count()

    delivered = Order.objects.filter(
        status="Delivered"
    ).count()

    cancelled = Order.objects.filter(
        status="Cancelled"
    ).count()

    orders = Order.objects.order_by("-id")
    if status and status != "All Orders":

      orders = orders.filter(
        status=status
    )
    if from_date:

       orders = orders.filter(
        created_at__date__gte=from_date
    )

    if to_date:

        orders = orders.filter(
            created_at__date__lte=to_date
        )
    pagination = OrderReportPagination()

    page = pagination.paginate_queryset(
    orders,
    request
)
      

    order_data = []

    for order in page:

     order_data.append({
        "id": order.id,
        "order_number": f"FO-{order.id:06d}",
        "customer": order.full_name,
        "status": order.status,
        "total": order.total_amount,
        "date": order.created_at
    })

    return pagination.get_paginated_response({
        "total_orders": total_orders,
        "pending": pending,
        "confirmed": confirmed,
        "processing": processing,
        "delivered": delivered,
        "cancelled": cancelled,
        "recent_orders": order_data
    })

from django.http import HttpResponse
from django.db.models import Sum
from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser

from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer
)

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

from .models import Order
from django.http import HttpResponse
from django.utils import timezone
from django.db.models import Sum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

@api_view(["GET"])
@permission_classes([IsAdminUser])
def export_order_report_pdf(request):

    # Filters
    status = request.GET.get("status")
    from_date = request.GET.get("from_date")
    to_date = request.GET.get("to_date")

    # Base Query (Assuming 'Order' model is imported at the top of your file)
    orders = Order.objects.order_by("-id")

    if status and status != "All Orders":
        orders = orders.filter(status=status)

    if from_date:
        orders = orders.filter(created_at__date__gte=from_date)

    if to_date:
        orders = orders.filter(created_at__date__lte=to_date)

    # Summary
    total_orders = orders.count()

    total_revenue = (
        orders.aggregate(
            total=Sum("total_amount")
        )["total"]
        or 0
    )

    # PDF Response
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="Order_Report.pdf"'

    # PDF Document
    doc = SimpleDocTemplate(response)
    elements = []
    styles = getSampleStyleSheet()

    # Title
    elements.append(Paragraph("Order Report", styles["Title"]))
    elements.append(Spacer(1, 15))

    # Report Info
    elements.append(
        Paragraph(
            f"Generated On: {timezone.localtime(timezone.now()).strftime('%d %b %Y %I:%M %p')}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"Status Filter: {status if status else 'All Orders'}",
            styles["Normal"]
        )
    )

    if from_date or to_date:
        elements.append(
            Paragraph(
                f"Date Range: {from_date or 'Beginning'} to {to_date or 'Today'}",
                styles["Normal"]
            )
        )

    elements.append(Spacer(1, 10))

    # Summary Section
    elements.append(
        Paragraph(
            f"<b>Total Orders:</b> {total_orders}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"<b>Total Revenue:</b> BDT{total_revenue:,.0f}",
            styles["Normal"]
        )
    )

    elements.append(Spacer(1, 20))

    # Table Data - Added '#' and 'Date' columns
    # Table Data
    data = [
        [
            "#", 
            "Order ID", 
            "Customer", 
            "Date", 
            "Status", 
            "Amount"
        ]
    ]

    for index, order in enumerate(orders, start=1):
        data.append([
            str(index),
            f"FO-{order.id:06d}",
            order.full_name,
            order.created_at.strftime("%d Jun %Y"),
            order.status,
            f"BDT {float(order.total_amount):,.0f}" # FIXED: Replaced ৳ with BDT
        ])

    # Table Setup
    table = Table(data, hAlign='LEFT') # FIXED: Aligns table to the left

    # Simplified styling
    table.setStyle(
        TableStyle([
            # Bold headers
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            
            # Alignments
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("ALIGN", (-1, 0), (-1, -1), "RIGHT"), # Right align the Amount column
            
            # Simple top and bottom borders
            ("LINEABOVE", (0, 0), (-1, 0), 1, colors.black),      
            ("LINEBELOW", (0, 0), (-1, 0), 1, colors.black),      
            ("LINEBELOW", (0, -1), (-1, -1), 1, colors.black),    
            
            # Spacing
            ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ])
    )

    elements.append(table)

    # Footer
    elements.append(Spacer(1, 20))
    elements.append(
        Paragraph(
            "Generated by Food Ordering System Admin Panel",
            styles["Italic"]
        )
    )

    # Build PDF
    doc.build(elements)

    return response


from openpyxl import Workbook
@api_view(["GET"])
@permission_classes([IsAdminUser])

def export_order_report_excel(request):

    response = HttpResponse(
        content_type=
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

    response[
        "Content-Disposition"
    ] = 'attachment; filename="Order_Report.xlsx"'

    wb = Workbook()

    ws = wb.active

    ws.title = "Order Report"

    # Header Row

    ws.append([
        "Order ID",
        "Customer",
        "Status",
        "Amount",
        "Date"
    ])

    status = request.GET.get("status")
    from_date = request.GET.get("from_date")
    to_date = request.GET.get("to_date")
    orders = Order.objects.order_by("-id")
    if status and status != "All Orders":

        orders = orders.filter(
            status=status
        )

    if from_date:

        orders = orders.filter(
            created_at__date__gte=from_date
        )

    if to_date:

        orders = orders.filter(
            created_at__date__lte=to_date
        )

    for order in orders:

        ws.append([
            f"FO-{order.id:06d}",
            order.full_name,
            order.status,
            float(order.total_amount),
            order.created_at.strftime(
                "%d-%m-%Y"
            )
        ])

    wb.save(response)

    return response

from .serializers import UserProfileSerializer,UserUpdateSerializer,ChangePasswordSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile(request):

    serializer = UserProfileSerializer(request.user)

    return Response(serializer.data)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):

    serializer = UserUpdateSerializer(
        request.user,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():

        serializer.save()

        return Response({
            "message":"Profile Updated"
        })

    return Response(serializer.errors)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def change_password(request):

    serializer = ChangePasswordSerializer(
        data=request.data
    )

    if serializer.is_valid():

        user = request.user

        old_password = serializer.validated_data["old_password"]
        new_password = serializer.validated_data["new_password"]

        if not user.check_password(old_password):

            return Response(
                {
                    "success": False,
                    "message": "Old password is incorrect."
                },
                status=400
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {
                "success": True,
                "message": "Password changed successfully."
            }
        )

    return Response(
        serializer.errors,
        status=400
    )

from .serializers import MenuCategorySerializer
@api_view(["GET"])
def menu(request):

    categories = Category.objects.all()

    serializer = MenuCategorySerializer(
        categories,
        many=True
    )

    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@throttle_classes([WishlistThrottle])
def add_to_wishlist(request, food_id):

    food = get_object_or_404(
        Food,
        id=food_id
    )

    wishlist, created = Wishlist.objects.get_or_create(
        user=request.user,
        food=food
    )

    if created:
        return Response({
            "success": True,
            "message": "Added to wishlist."
        })

    return Response({
        "success": False,
        "message": "Already in wishlist."
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def wishlist_list(request):

    wishlist = Wishlist.objects.filter(
        user=request.user
    )

    serializer = WishlistSerializer(
        wishlist,
        many=True
    )

    return Response(serializer.data)
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_wishlist(request, food_id):

    Wishlist.objects.filter(
        user=request.user,
        food_id=food_id
    ).delete()

    return Response({
        "message": "Removed from wishlist."
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_wishlist(request, food_id):

    exists = Wishlist.objects.filter(
        user=request.user,
        food_id=food_id
    ).exists()

    return Response({
        "is_wishlisted": exists
    })


from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from .serializers import ForgotPasswordSerializer,ResetPasswordSerializer
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
@api_view(["POST"])
def forgot_password(request):

    serializer = ForgotPasswordSerializer(data=request.data)

    if serializer.is_valid():

        email = serializer.validated_data["email"]

        try:

            user = User.objects.get(email=email)

        except User.DoesNotExist:

            return Response({
                "success": False,
                "message": "No account found with this email."
            }, status=404)

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = default_token_generator.make_token(user)

        current_site = get_current_site(request)

        reset_link = (
            f"http://localhost:3000/reset-password/{uid}/{token}/"
        )

        send_mail(
            subject="Password Reset",
            message=f"""
Hello {user.first_name},

Click the link below to reset your password:

{reset_link}

If you didn't request this, ignore this email.
""",
            from_email=None,
            recipient_list=[email],
        )

        return Response({
            "success": True,
            "message": "Password reset link sent successfully."
        })

    return Response(serializer.errors, status=400)






@api_view(["POST"])
def reset_password(request):

    serializer = ResetPasswordSerializer(
        data=request.data
    )

    if serializer.is_valid():

        uid = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        try:

            uid = force_str(
                urlsafe_base64_decode(uid)
            )

            user = User.objects.get(pk=uid)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):

            return Response({
                "success": False,
                "message": "Invalid reset link."
            }, status=400)

        if not default_token_generator.check_token(user, token):

            return Response({
                "success": False,
                "message": "Reset link has expired or is invalid."
            }, status=400)

        user.set_password(new_password)
        user.save()

        return Response({
            "success": True,
            "message": "Password reset successfully."
        })

    return Response(
        serializer.errors,
        status=400
    )