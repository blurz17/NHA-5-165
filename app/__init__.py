"""Root proxy package to support both 'uvicorn app.main:app' and 'uvicorn backend.app.main:app' seamlessly."""

from backend.app.main import app

__all__ = ["app"]
