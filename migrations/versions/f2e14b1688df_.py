"""empty message

Revision ID: f2e14b1688df
Revises: 961fcd67cecf
Create Date: 2024-06-26 19:11:06.192397

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f2e14b1688df'
down_revision = '961fcd67cecf'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('mentor', schema=None) as batch_op:
        batch_op.drop_constraint('mentor_phone_key', type_='unique')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('mentor', schema=None) as batch_op:
        batch_op.create_unique_constraint('mentor_phone_key', ['phone'])

    # ### end Alembic commands ###