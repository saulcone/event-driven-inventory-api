from django.core.management.base import BaseCommand
from users.models import User

DEFAULT_USERS = [
    {
        "email": "admin1@example.com",
        "username": "admin1",
        "name": "Primary Admin",
        "role": "admin",
        "is_staff": True,
        "is_superuser": True,
    },
    {
        "email": "admin2@example.com",
        "username": "admin2",
        "name": "Secondary Admin",
        "role": "admin",
        "is_staff": True,
        "is_superuser": True,
    },
    {
        "email": "staff1@example.com",
        "username": "staff1",
        "name": "Kitchen Staff",
        "role": "staff",
        "is_staff": True,
        "is_superuser": False,
    },
    {
        "email": "staff2@example.com",
        "username": "staff2",
        "name": "Front-of-House Staff",
        "role": "staff",
        "is_staff": True,
        "is_superuser": False,
    },
    {
        "email": "viewer1@example.com",
        "username": "viewer1",
        "name": "Guest Viewer",
        "role": "viewer",
        "is_staff": False,
        "is_superuser": False,
    },
    {
        "email": "viewer2@example.com",
        "username": "viewer2",
        "name": "Audit Viewer",
        "role": "viewer",
        "is_staff": False,
        "is_superuser": False,
    },
]

PASSWORD = "password123"


class Command(BaseCommand):
    help = "Create default users in the database if they do not exist."

    def handle(self, *args, **options):
        for user_data in DEFAULT_USERS:
            email = user_data["email"]
            if not User.objects.filter(email=email).exists():
                User.objects.create_user(
                    email=email,
                    username=user_data["username"],
                    password=PASSWORD,
                    name=user_data["name"],
                    role=user_data["role"],
                    is_staff=user_data["is_staff"],
                    is_superuser=user_data["is_superuser"],
                )
                self.stdout.write(self.style.SUCCESS(f"Created: {email} ({user_data['role']})"))
            else:
                self.stdout.write(f"Already exists: {email}")