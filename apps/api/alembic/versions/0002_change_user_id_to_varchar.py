from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '0002_change_user_id_to_varchar'
down_revision = '0001'
branch_labels = None
depends_on = None

TABLES = [
    "daily_logs",
    "cycle_baselines",
    "pattern_results",
    "early_feedback",
    "audit_events",
]

def upgrade() -> None:
    for table in TABLES:
        op.alter_column(
            table, "user_id",
            existing_type=postgresql.UUID(as_uuid=True),
            type_=sa.String(255),
            postgresql_using="user_id::text",
        )

def downgrade() -> None:
    for table in TABLES:
        op.alter_column(
            table, "user_id",
            existing_type=sa.String(255),
            type_=postgresql.UUID(as_uuid=True),
            postgresql_using="user_id::uuid",
        )
