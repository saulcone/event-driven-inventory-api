from datetime import datetime, timedelta, timezone
from typing import Set, Optional
import jwt
from django.conf import settings
from ninja.security import HttpBearer
from users.models import User

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

class RoleJWTAuth(HttpBearer):
    def __init__(self, allowed_roles: Optional[Set[str]] = None):
        super().__init__()
        self.allowed_roles = allowed_roles

    def authenticate(self, request, token):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            if not user_id:
                return None
            user = User.objects.filter(id=int(user_id)).first()
            if not user:
                return None
            if self.allowed_roles and user.role not in self.allowed_roles:
                return None
            return user
        except (jwt.PyJWTError, ValueError):
            return None

jwt_auth = RoleJWTAuth()
admin_jwt_auth = RoleJWTAuth(allowed_roles={"admin"})
staff_or_admin_jwt_auth = RoleJWTAuth(allowed_roles={"staff", "admin"})