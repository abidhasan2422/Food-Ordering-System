from django.urls import path
from .import views

urlpatterns = [
    path('admin-login/',views.admin_login_api,name='admin-login'),
    path('add-category/',views.add_category, name='add-category')
]