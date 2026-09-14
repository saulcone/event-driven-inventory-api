from typing import Optional

from django.db.models import Q
from ninja import Query, Router
from ninja.pagination import PageNumberPagination, paginate
from django.shortcuts import get_object_or_404
from users.models import User
from users.schemas import RegisterIn, LoginIn, TokenOut, UserOut
from users.security import admin_jwt_auth, create_access_token, jwt_auth

router = Router()

@router.post("/register", response={201: UserOut, 400: dict})
def register(request, payload: RegisterIn):
    if User.objects.filter(email=payload.email).exists():
        return 400, {"message": "Email already registered"}
    if User.objects.filter(username=payload.username).exists():
        return 400, {"message": "Username already taken"}

    user = User.objects.create_user(
        username=payload.username,
        email=payload.email,
        password=payload.password,
        name=payload.name,
    )
    return 201, user

@router.post("/login", response={200: TokenOut, 401: dict})
def login(request, payload: LoginIn):
    try:
        user = User.objects.get(email=payload.email)
    except User.DoesNotExist:
        return 401, {"message": "Invalid email or password"}

    if not user.check_password(payload.password):
        return 401, {"message": "Invalid email or password"}

    token = create_access_token(user.id)
    return 200, {"access_token": token, "token_type": "bearer"}

@router.get("/me", response=UserOut, auth=jwt_auth)
def get_me(request):
    return request.auth

@router.get("/users", response=list[UserOut], auth=admin_jwt_auth)
@paginate(PageNumberPagination, page_size=10)
def list_users(
    request,
    search: Optional[str] = None,
    order_by: Optional[str] = Query(None, regex="^(-)?(username|name|email|role)$"),
):
    queryset = User.objects.all()
    if search:
        queryset = queryset.filter(
            Q(username__icontains=search)
            | Q(name__icontains=search)
            | Q(email__icontains=search)
        )
    if order_by:
        queryset = queryset.order_by(order_by)
    return queryset

@router.get("/users/{user_id}", response=UserOut, auth=admin_jwt_auth)
def get_user(request, user_id: int):
    return get_object_or_404(User, id=user_id)