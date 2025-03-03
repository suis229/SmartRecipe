"""Add favorite_recipes table

Revision ID: b867a9f2e59b
Revises: 29a44cba94a3
Create Date: 2025-02-28 00:42:24.776781

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b867a9f2e59b'
down_revision: Union[str, None] = '29a44cba94a3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('favorite_recipes', sa.Column('title', sa.String(), nullable=False))
    op.add_column('favorite_recipes', sa.Column('video_url', sa.String(), nullable=False))
    op.add_column('favorite_recipes', sa.Column('thumbnail_url', sa.String(), nullable=False))
    op.alter_column('favorite_recipes', 'user_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.drop_index('ix_favorite_recipes_recipe_title', table_name='favorite_recipes')
    op.drop_index('ix_favorite_recipes_recipe_url', table_name='favorite_recipes')
    op.drop_index('ix_favorite_recipes_user_id', table_name='favorite_recipes')
    op.create_foreign_key(None, 'favorite_recipes', 'users', ['user_id'], ['id'], ondelete='CASCADE')
    op.drop_column('favorite_recipes', 'recipe_url')
    op.drop_column('favorite_recipes', 'recipe_title')
    op.add_column('users', sa.Column('password', sa.String(), nullable=False))
    op.alter_column('users', 'email',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.drop_index('ix_users_email', table_name='users')
    op.create_unique_constraint(None, 'users', ['email'])
    op.drop_column('users', 'hashed_password')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('hashed_password', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'users', type_='unique')
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.alter_column('users', 'email',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.drop_column('users', 'password')
    op.add_column('favorite_recipes', sa.Column('recipe_title', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('favorite_recipes', sa.Column('recipe_url', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'favorite_recipes', type_='foreignkey')
    op.create_index('ix_favorite_recipes_user_id', 'favorite_recipes', ['user_id'], unique=False)
    op.create_index('ix_favorite_recipes_recipe_url', 'favorite_recipes', ['recipe_url'], unique=False)
    op.create_index('ix_favorite_recipes_recipe_title', 'favorite_recipes', ['recipe_title'], unique=False)
    op.alter_column('favorite_recipes', 'user_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.drop_column('favorite_recipes', 'thumbnail_url')
    op.drop_column('favorite_recipes', 'video_url')
    op.drop_column('favorite_recipes', 'title')
    # ### end Alembic commands ###
