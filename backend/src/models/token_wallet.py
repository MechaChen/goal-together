import datetime as dt

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.services.db import Base


class TokenWallet(Base):
    __tablename__ = "token_wallets"

    user_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    balance: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    rewarded_completion_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    updated_at: Mapped[dt.datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: dt.datetime.now(dt.timezone.utc),
        onupdate=lambda: dt.datetime.now(dt.timezone.utc),
        nullable=False,
    )
