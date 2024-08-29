from app import db

class Notifications(db.Model):
    __tablename__ = 'NOTIFICATIONS'

    id = db.Column(db.Integer, primary_key=True)
    table_name = db.Column(db.Text)
    type = db.Column(db.Text)
    tenant_id = db.Column(db.Integer)
    office_id = db.Column(db.Integer)
    user_name = db.Column(db.String(100))
    message = db.Column(db.Text)
    date = db.Column(db.DateTime)