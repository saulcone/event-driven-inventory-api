from datetime import datetime, timedelta, timezone
from typing import Optional, Set

import jwt
from django.conf import settings
from ninja.security import HttpBearer
from ninja.errors import AuthenticationError
from django.core.exceptions import PermissionDenied

from users.models import User


SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


class RoleJWTAuth(HttpBearer):

    def __init__(self, allowed_roles: Optional[Set[str]] = None):
        super().__init__()
        self.allowed_roles = allowed_roles

    def authenticate(self, request, token):
        try:
            payload = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=[ALGORITHM],
            )

            user_id = payload.get("sub")

            if not user_id:
                raise AuthenticationError(
                    "Invalid authentication token."
                )

            user = User.objects.filter(id=int(user_id)).first()

            if not user:
                raise AuthenticationError(
                    "User not found."
                )

            if self.allowed_roles and user.role not in self.allowed_roles:
                raise PermissionDenied(
                    "You do not have permission to perform this action."
                )

            return user

        except (jwt.PyJWTError, ValueError):
            raise AuthenticationError(
                "Invalid authentication token."
            )


jwt_auth = RoleJWTAuth()

admin_jwt_auth = RoleJWTAuth(
    allowed_roles={"admin"}
)

staff_or_admin_jwt_auth = RoleJWTAuth(
    allowed_roles={"staff", "admin"}
)