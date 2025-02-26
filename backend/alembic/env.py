from alembic import context
from sqlalchemy import engine_from_config, pool
from logging.config import fileConfig
import sys
import os

# Alembic の Config オブジェクト
config = context.config

# ログ設定
fileConfig(config.config_file_name)

# models.py から Base を正しく読み込む
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")
from database import Base
from models import *

# 対象となる全テーブルを Alembic に認識させる
target_metadata = Base.metadata

def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True
        )

        with context.begin_transaction():
            context.run_migrations()

run_migrations_online()
