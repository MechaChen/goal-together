import datetime as dt

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from src.services.db import Base


class LifePlaybook(Base):
    __tablename__ = "life_playbook"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        default=1
    )
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="",
    )
    updated_at: Mapped[dt.datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: dt.datetime.now(dt.timezone.utc),
        onupdate=lambda: dt.datetime.now(dt.timezone.utc),
        nullable=False,
    )
