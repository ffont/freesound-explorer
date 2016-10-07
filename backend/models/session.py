from sqlalchemy import Column, String, Integer, Boolean, DateTime
from sqlalchemy.schema import ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from backend import db_session


Base = declarative_base()
Base.query = db_session.query_property()


class Session(Base):
    __tablename__ = 'sessions'
    id = Column(String(200), primary_key=True)
    name = Column(String(200))
    user_id = Column(Integer)
    created = Column(DateTime)
    last_modified = Column(DateTime)
