from app import db

class GeneralInput(db.Model):
    __tablename__ = 'GENERAL_QS_TBL'

    id = db.Column(db.Integer, primary_key=True)
    user_input = db.Column(db.Text)
    date = db.Column(db.DateTime)
    tenantid = db.Column(db.Integer)
    officeid = db.Column(db.Integer)
    username = db.Column(db.String(50))
    response = db.Column(db.Text)

class GeneralFirstInput(db.Model):
    __tablename__ = 'GENERAL_FIRST_QS_TBL'

    id = db.Column(db.Integer, primary_key=True)
    user_input = db.Column(db.Text)
    date = db.Column(db.DateTime)
    tenantid = db.Column(db.Integer)
    officeid = db.Column(db.Integer)
    username = db.Column(db.String(50))

class OurBotInput(db.Model):
    __tablename__ = 'EZEEBOT_QS_TBL'

    id = db.Column(db.Integer, primary_key=True)
    module = db.Column(db.String(50))
    user_input = db.Column(db.Text)
    date = db.Column(db.DateTime)
    tenantid = db.Column(db.Integer)
    officeid = db.Column(db.Integer)
    username = db.Column(db.String(50))
    environment = db.Column(db.Text)
    response = db.Column(db.Text)