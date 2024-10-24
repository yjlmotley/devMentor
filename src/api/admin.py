  
import os
from flask_admin import Admin
from .models import db, Customer, CustomerImage, Session, Mentor, MentorImage, PortfolioPhoto, Message
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    # app.config['FLASK_ADMIN_SWATCH'] = 'journal'
    app.config['FLASK_ADMIN_SWATCH'] = 'sandstone'
    # app.config['FLASK_ADMIN_SWATCH'] = 'cyborg'
    admin = Admin(app, name='devMentor Admin', template_mode='bootstrap3')

    
    admin.add_view(ModelView(Customer, db.session))
    admin.add_view(ModelView(CustomerImage, db.session))
    admin.add_view(ModelView(Session, db.session))
    admin.add_view(ModelView(Mentor, db.session))
    admin.add_view(ModelView(MentorImage, db.session))
    admin.add_view(ModelView(PortfolioPhoto, db.session))
    admin.add_view(ModelView(Message, db.session))
    