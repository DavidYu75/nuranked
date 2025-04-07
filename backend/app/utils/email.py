import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def send_verification_email(recipient_email, verification_code):
    sender_email = os.environ.get("EMAIL_USER")
    password = os.environ.get("EMAIL_PASSWORD")
    
    message = MIMEMultipart("alternative")
    message["Subject"] = "Verify your Northeastern CS Ranked account"
    message["From"] = sender_email
    message["To"] = recipient_email
    
    text = f"""
    Hello,
    
    Please verify your Northeastern CS Ranked account by entering this code: {verification_code}
    
    Thank you,
    Northeastern CS Ranked Team
    (This website is not affiliated with, endorsed by, or connected to Northeastern University)
    """
    
    html = f"""
    <html>
      <body>
        <p>Hello,</p>
        <p>Please verify your Northeastern CS Ranked account by entering this code: <strong>{verification_code}</strong></p>
        <p>Thank you,<br>Northeastern CS Ranked Team</p>
        <p><em>This website is not affiliated with, endorsed by, or connected to Northeastern University</em></p>
      </body>
    </html>
    """
    
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    
    message.attach(part1)
    message.attach(part2)
    
    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(sender_email, password)
        server.sendmail(sender_email, recipient_email, message.as_string())
        server.quit()
    except Exception as e:
        print(f"Error sending email: {e}")
