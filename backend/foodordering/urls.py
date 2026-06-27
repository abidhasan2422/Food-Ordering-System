from django.urls import path
from .import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
      path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin-login/',views.admin_login_api,name='admin-login'),
    path('add-category/',views.add_category, name='add-category'),
    path('categories/',views.get_categories,name='categories'),
    path('category/delete/<int:id>/',views.delete_category,name='delete_category'),
    path('category/update/<int:id>/',views.update_category,name='update_category'),
    path('add-food/',views.add_food, name='add-food'),
    path('foods/',views.get_foods, name='get-foods'),
    path('food/delete/<int:id>/',views.delete_food,name='delete_food'),
    path('food/update/<int:id>/',views.update_food,name='update_food'),
    path('search-food/',views.search_food, name='search-food'),
    path('random-foods/',views.random_foods, name='random-foods'),
    path('register/',views.register, name='register'),
    path('login/',views.login_user, name='login_user'),
    path('foods/<int:id>/', views.get_food_detail, name='food-detail'),
    path(
    "cart/add/",
    views.add_to_cart,
    name="add_to_cart"
),

path(
    "cart/",
    views.get_cart,
    name="get_cart"
),

path(
    "cart/increase/<int:id>/",
    views.increase_quantity,
    name = "increase_quantity"

),

path(
    "cart/decrease/<int:id>/",
    views.decrease_quantity,
    name=" decrease_quantity"
),

path(
    "cart/remove/<int:id>/",
    views.remove_cart_item,
    name="remove_cart_item"
),
path(
    "order/create/",
    views.create_order,
    name="create_order"
),
path(
    "my-orders/",
    views.my_orders,
    name="my_orders"
),
path(
    "order/<int:id>/",
    views.order_details,
    name="order_details"
),
path(
    "order/<int:id>/invoice/",
    views.download_invoice,
    name="download-invoice"
),
path(
    "order/create-from-cart/",
    views.create_order_from_cart,
    name = "create_order_from_cart"
),
path(
    "admin/orders/",
    views.admin_orders,
    name="admin_order"
),
path(
    "admin/orders/<int:id>/status/",
    views.update_order_status,
    name="update_order_status"
),
path(
    "admin/order/<int:id>/",
    views.admin_order_details,
    name="admin_order_details"
),
path(
    "admin/dashboard/stats/",
    views.dashboard_stats,
    name="dashboard_stats"
),
path(
    "admin/customers/",
    views.customers,
    name="customers"
),
path(
    "admin/customers/<int:id>/",
    views.customer_details,
    name="customer_details"
),
path(
    "admin/sales-report/",
    views.sales_report,
    name="sales_report"
   
),
path(
    "admin/order-report/",
    views.order_report,
    name="order_report"
   
),
path(
    "admin/order-report/pdf/",
    views.export_order_report_pdf
),
path(
    "admin/order-report/excel/",
    views.export_order_report_excel,
    name="export_order_report_excel"
),
path(
    "profile/",
    views.profile,
    name="profile"
   
),
path(
    "update/profile/",
    views.update_profile,
    name="update_profile"
   
),

]
