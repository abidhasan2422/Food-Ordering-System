from django.core.mail import send_mail
from django.conf import settings


def send_order_confirmation_email(order):

    subject = f"Order Confirmation - FO-{order.id:06d}"

    message = f"""
Hello {order.full_name},

Thank you for your order!

Your order has been received successfully.

Order Number: FO-{order.id:06d}

Items:
"""

    for item in order.items.all():

        message += (
            f"- {item.food.item_name} x {item.quantity} "
            f"(৳{item.price})\n"
        )

    message += f"""

Subtotal: ৳{order.subtotal}
Delivery Charge: ৳{order.delivery_charge}
Total Amount: ৳{order.total_amount}

Delivery Address:
{order.address}
{order.city}

Payment Method:
{order.payment_method}

Order Status:
{order.status}

Thank you for choosing BiteBox!

Best Regards,
BiteBox Team
"""

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [order.email],
        fail_silently=False,
    )