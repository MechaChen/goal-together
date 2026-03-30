import datetime as dt

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.services.db import Base


class RewardAudioSettings(Base):
    __tablename__ = "reward_audio_settings"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, default="default")

    normal_original_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    normal_mime_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    normal_file_size_bytes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    normal_storage_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    normal_updated_at: Mapped[dt.datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    bonus_original_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    bonus_mime_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    bonus_file_size_bytes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    bonus_storage_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    bonus_updated_at: Mapped[dt.datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
