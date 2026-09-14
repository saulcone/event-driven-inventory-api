from ninja import NinjaAPI, Schema
from products.api import router as products_router
from users.api import router as users_router

api = NinjaAPI(
    title="Application API",
    version="1.0.0",
    description="API Backend built with Django Ninja"
)

api.add_router("/products/", products_router, tags=["Products"])
api.add_router("/auth/", users_router, tags=["Authentication"])

