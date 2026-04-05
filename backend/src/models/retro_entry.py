import datetime as dt
import uuid

from sqlalchemy import UniqueConstraint, Date, Text, Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from src.services.db import Base

class RetroEntry(Base):
    __tablename__ = "retro_entries"
    __table_args__ = (UniqueConstraint("entry_date", name="uq_retro_entries_entry_date"),)

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        nullable=False
    )
    entry_date: Mapped[dt.date] = mapped_column(
        Date,
        nullable=False
    )
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )
    rewarded: Mapped[bool] = mapped_column(
        Boolean, nullable=False,
        default=False
    )
    created_at: Mapped[dt.datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: dt.datetime.now(dt.timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[dt.datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: dt.datetime.now(dt.timezone.utc),
        onupdate=lambda: dt.datetime.now(dt.timezone.utc),
        nullable=False,
    )