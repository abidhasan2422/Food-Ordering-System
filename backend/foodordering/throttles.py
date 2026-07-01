from rest_framework.throttling import UserRateThrottle


class UserLoginThrottle(UserRateThrottle):
    scope = "user_login"
class AdminLoginThrottle(UserRateThrottle):
    scope = "admin_login"


class RegisterThrottle(UserRateThrottle):
    scope = "register"


class SearchThrottle(UserRateThrottle):
    scope = "search"


class WishlistThrottle(UserRateThrottle):
    scope = "wishlist"