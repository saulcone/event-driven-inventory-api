from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    
    name = models.CharField(max_length=255, blank=True)
    
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('staff', 'Staff'),
        ('viewer', 'Viewer'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email