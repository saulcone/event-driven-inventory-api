from decimal import Decimal
from typing import Optional
from ninja import Schema

class ProductSchemaIn(Schema):
    name: str
    description: str
    category: str
    price: Decimal
    stock_quantity: int

class ProductUpdateIn(Schema):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[Decimal] = None
    stock_quantity: Optional[int] = None

class ProductSchemaOut(Schema):
    id: int
    name: str
    description: str
    category: str
    price: Decimal
    stock_quantity: int
    total_sold: int

class ProductSummarySchema(Schema):
    total_products: int
    low_stock_items: int
    total_sold: int