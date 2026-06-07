"""create predictions table

Revision ID: cc60b23ed589
Revises: 
Create Date: 2026-06-05 18:47:26.916324

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'cc60b23ed589'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "predictions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        # Сырые входные признаки
        sa.Column("rotational_speed", sa.Float(), nullable=False),
        sa.Column("torque", sa.Float(), nullable=False),
        sa.Column("tool_wear", sa.Float(), nullable=False),
        sa.Column("air_temperature", sa.Float(), nullable=False),
        sa.Column("process_temperature", sa.Float(), nullable=False),
        sa.Column("product_type", sa.String(length=1), nullable=False),
        # Производные признаки
        sa.Column("temp_diff", sa.Float(), nullable=False),
        sa.Column("power", sa.Float(), nullable=False),
        sa.Column("tool_wear_torque", sa.Float(), nullable=False),
        # Результат
        sa.Column("is_failure", sa.Boolean(), nullable=False),
        sa.Column("failure_probability", sa.Float(), nullable=False),
        sa.Column("failure_type", sa.String(length=64), nullable=True),
        # Мета
        sa.Column("inference_time_ms", sa.Float(), nullable=False),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("predictions")
