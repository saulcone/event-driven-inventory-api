from typing import List
from django.db.models import Count, Q, Sum, Value
from django.db.models.functions import Coalesce
from django.shortcuts import get_object_or_404
from ninja import Router, Query
from ninja.pagination import paginate, PageNumberPagination

from products.models import Product
from products.schemas import ProductSchemaOut, ProductSchemaIn, ProductSummarySchema, ProductUpdateIn
from users.security import staff_or_admin_jwt_auth

from typing import Optional

router = Router()


@router.get("/", response=list[ProductSchemaOut])
@paginate(PageNumberPagination, page_size=10)
def get_products(
    request, 
    search: Optional[str] = None, 
    order_by: Optional[str] = Query(None, regex="^(-)?(name|price)$")
):
    queryset = Product.objects.all()
    if search:
        queryset = queryset.filter(name__icontains=search)
    if order_by:
        queryset = queryset.order_by(order_by)
    return queryset


@router.post("/", response=ProductSchemaOut, auth=staff_or_admin_jwt_auth)
def create_product(request, payload: ProductSchemaIn):
    product = Product.objects.create(**payload.dict())
    return product


@router.put("/{int:product_id}", response=ProductSchemaOut, auth=staff_or_admin_jwt_auth)
def update_product(request, product_id: int, payload: ProductUpdateIn):
    product = get_object_or_404(Product, id=product_id)
    for attr, value in payload.dict().items():
        if value is not None:
            setattr(product, attr, value)
        
    product.save()

    return product


@router.delete("/{int:product_id}", response={204: None}, auth=staff_or_admin_jwt_auth)
def delete_product(request, product_id: int):
    product = get_object_or_404(Product, id=product_id)
    product.delete()
    return 204, None


@router.get("/most-sold", response=list[ProductSchemaOut], auth=staff_or_admin_jwt_auth)
@paginate(PageNumberPagination, page_size=5)
def get_most_sold_products(request):
    queryset = Product.objects.order_by("-total_sold")
    return queryset


@router.get("/summary", response=ProductSummarySchema, auth=staff_or_admin_jwt_auth)
def get_product_summary(request):
    return Product.objects.aggregate(
        total_products=Count("id"),
        low_stock_items=Count("id", filter=Q(stock_quantity__lt=5)),
        total_sold=Coalesce(Sum("total_sold"), Value(0)),
    )


@router.get("/{int:product_id}", response=ProductSchemaOut, auth=staff_or_admin_jwt_auth)
def get_product(request, product_id: int):
    product = get_object_or_404(Product, id=product_id)
    return product