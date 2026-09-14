import random
from decimal import Decimal
from django.core.management.base import BaseCommand
from faker import Faker
from products.models import Product

fake = Faker()

CATEGORIES = ["Bakery", "Dairy", "Beverages", "Produce", "Meat", "Pantry"]
ADJECTIVES = ["Organic", "Fresh", "Premium", "Artisan", "Smoked", "Classic", "Local"]
FOOD_ITEMS = [
    "Sourdough Bread", "Croissant", "Olive Oil", "Cheddar Cheese", "Whole Milk",
    "Espresso Beans", "Earl Grey Tea", "Avocado", "Tomatoes", "Salmon Fillet",
    "Chicken Breast", "Oat Flakes", "Honey", "Pasta", "Tomato Sauce"
]

class Command(BaseCommand):
    help = "Populate the database with sample products using Faker"

    def add_arguments(self, parser):
        parser.add_argument(
            "--count",
            type=int,
            default=50,
            help="Quantity of products to create (default: 50)",
        )

    def handle(self, *args, **options):
        count = options["count"]
        self.stdout.write("Generating products...")

        products_to_create = []
        for _ in range(count):
            price = Decimal(str(round(random.uniform(1.50, 99.99), 2)))
            stock = random.randint(0, 150)
            sold = random.randint(0, 500)

            product = Product(
                name = f"{random.choice(ADJECTIVES)} {random.choice(FOOD_ITEMS)}",
                description=fake.paragraph(nb_sentences=2),
                category=random.choice(CATEGORIES),
                price=price,
                stock_quantity=stock,
                total_sold=sold,
            )
            products_to_create.append(product)

        Product.objects.bulk_create(products_to_create)
        self.stdout.write(
            self.style.SUCCESS(f"Success! {count} products have been created.")
        )