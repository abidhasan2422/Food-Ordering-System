import resend
from django.conf import settings
from django.template.loader import render_to_string


def send_order_confirmation_email(order):

    subject = f"Order Confirmation - FO-{order.id:06d}"

    # Dynamic payment message
    if order.payment_method == "COD":
        payment_message = (
            "Payment will be collected upon delivery."
        )
    else:
        payment_message = (
            "Your payment has been received successfully."
        )

    message = f"""
Hello {order.full_name},

Thank you for your order!

{payment_message}

Order Number: FO-{order.id:06d}

Items:
"""

    # Order Items
    for item in order.items.all():

        total = item.price * item.quantity

        message += (
            f"- {item.food.item_name}\n"
            f"  Qty: {item.quantity}\n"
            f"  Unit Price: ৳{item.price}\n"
            f"  Total: ৳{total}\n\n"
        )

    # Remaining Details
    message += f"""
Subtotal: ৳{order.subtotal}
Delivery Charge: ৳{order.delivery_charge}
Total Amount: ৳{order.total_amount}

Delivery Address:
{order.address}
{order.city}

Payment Method:
{order.payment_method}

Payment Status:
{order.payment_status}

Order Status:
{order.status}

Thank you for choosing BiteBox!

Best Regards,
BiteBox Team
"""

    html_content = render_to_string(
        "emails/order_confirmation.html",
        {
            "order": order
        }
    )

    resend.api_key = settings.RESEND_API_KEY

    resend.Emails.send({
        "from": "BiteBox <onboarding@resend.dev>",
        "to": [order.email],
        "subject": subject,
        "html": html_content,
        "text": message,
    })