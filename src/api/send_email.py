import smtplib
from email.message import EmailMessage
import os

MAIL_SERVER="smtp.gmail.com"
#replace with your email providers smtp server if needed
MAIL_PORT = 465 #TLS PORT
MAIL_USE_TLS = True
MAIL_USERNAME = os.getenv("GMAIL")
MAIL_PASSWORD = os.getenv("GMAIL_PASSWORD")

def send_email(recipient, body, subject):
    try: 
        with smtplib.SMTP_SSL(MAIL_SERVER, MAIL_PORT) as server:
            server.login(MAIL_USERNAME, MAIL_PASSWORD)
            msg = EmailMessage()
            msg["Subject"] = subject
            msg["From"] = MAIL_USERNAME
            msg["To"] = recipient
            # msg.set_content(body)
            msg.add_alternative(body, subtype='html')
            server.send_message(msg)
    except smtplib.SMTPException as e: 
        #log the exception e
        raise Exception(f"failed to send email: {str(e)}")