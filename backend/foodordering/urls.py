from django.urls import path
from .import views

urlpatterns = [
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
]
