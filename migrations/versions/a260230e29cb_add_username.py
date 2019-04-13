"""add username

Revision ID: a260230e29cb
Revises: c4a0135c84f5
Create Date: 2019-04-12 22:50:31.243939

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a260230e29cb'
down_revision = 'c4a0135c84f5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('username', sa.String(length=255), nullable=True))
    op.create_index(op.f('ix_user_username'), 'user', ['username'], unique=True)
    op.drop_index('ix_user_email', table_name='user')
    op.create_unique_constraint(None, 'user', ['email'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'user', type_='unique')
    op.create_index('ix_user_email', 'user', ['email'], unique=1)
    op.drop_index(op.f('ix_user_username'), table_name='user')
    op.drop_column('user', 'username')
    # ### end Alembic commands ###
