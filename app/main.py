"""Root proxy module forwarding directly to backend.app.main."""

from backend.app.main import app

__all__ = ["app"]
