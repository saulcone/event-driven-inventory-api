from decimal import Decimal
from django.test import TestCase
from ninja.testing import TestClient
from core.api import api
from products.models import Product
from users.models import User
from users.security import create_access_token


class ProductAPITestCase(TestCase):
    def setUp(self):
        self.client = TestClient(api)
        self.product1 = Product.objects.create(
            name="Organic Sourdough Bread",
            description="Fresh artisan sourdough bread",
            category="Bakery",
            price=Decimal("4.50"),
            stock_quantity=20,
            total_sold=100,
        )
        self.product2 = Product.objects.create(
            name="Artisan Cheddar Cheese",
            description="Aged cheddar cheese",
            category="Dairy",
            price=Decimal("12.00"),
            stock_quantity=5,
            total_sold=50,
        )
        self.staff = User.objects.create_user(
            email="staff@test.com",
            username="staff-test",
            password="password123",
            role="staff",
        )
        self.viewer = User.objects.create_user(
            email="viewer@test.com",
            username="viewer-test",
            password="password123",
            role="viewer",
        )

    def test_list_products_pagination(self):
        response = self.client.get("/products/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("items", data)
        self.assertIn("count", data)
        self.assertEqual(data["count"], 2)
        self.assertEqual(len(data["items"]), 2)

    def test_search_products(self):
        response = self.client.get("/products/?search=Cheddar")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["count"], 1)
        self.assertEqual(data["items"][0]["name"], "Artisan Cheddar Cheese")

    def test_order_by_price_descending(self):
        response = self.client.get("/products/?order_by=-price")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["items"][0]["name"], "Artisan Cheddar Cheese")
        self.assertEqual(data["items"][1]["name"], "Organic Sourdough Bread")

    def test_most_sold_products(self):
        response = self.client.get("/products/most-sold")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["items"][0]["name"], "Organic Sourdough Bread")
        self.assertEqual(data["items"][0]["total_sold"], 100)

    def test_product_summary(self):
        response = self.client.get("/products/summary")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {"total_products": 2, "low_stock_items": 0, "total_sold": 150},
        )

    def test_get_single_product(self):
        response = self.client.get(f"/products/{self.product1.id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], "Organic Sourdough Bread")

    def test_update_product(self):
        payload = {
            "name": "Updated Sourdough Bread",
            "description": "Updated description",
            "category": "Bakery",
            "price": "5.00",
            "stock_quantity": 30,
        }
        response = self.client.put(
            f"/products/{self.product1.id}",
            json=payload,
            headers={"Authorization": f"Bearer {create_access_token(self.staff.id)}"},
        )
        self.assertEqual(response.status_code, 200)

        self.product1.refresh_from_db()
        self.assertEqual(self.product1.name, "Updated Sourdough Bread")
        self.assertEqual(self.product1.price, Decimal("5.00"))
        self.assertEqual(self.product1.stock_quantity, 30)

    def test_viewer_cannot_update_product(self):
        response = self.client.put(
            f"/products/{self.product1.id}",
            json={"name": "Blocked update"},
            headers={"Authorization": f"Bearer {create_access_token(self.viewer.id)}"},
        )
        self.assertEqual(response.status_code, 401)

    def test_delete_product(self):
        response = self.client.delete(f"/products/{self.product2.id}")
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Product.objects.filter(id=self.product2.id).exists())