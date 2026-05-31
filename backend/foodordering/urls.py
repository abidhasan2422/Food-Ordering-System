from django.urls import path
from .import views

urlpatterns = [
    path('admin-login/',views.admin_login_api,name='admin-login'),
    path('add-category/',views.add_category, name='add-category'),
    path('categories/',views.get_categories,name='categories'),
    path('category/delete/<int:id>/',views.delete_category,name='delete_category'),
    path('category/update/<int:id>/',views.update_category,name='update_category'),

]