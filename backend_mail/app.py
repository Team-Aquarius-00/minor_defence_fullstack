
from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.message import EmailMessage
import os
# from dotenv import load_dotenv

# load_dotenv()

app = Flask(__name__)
CORS(app)

EMAIL_USER = 'strange426344@gmail.com'
EMAIL_PASS = 'nsqhrjstugtxfjwb'


@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json
    recipient = data.get('email')
    goal_price = data.get('goalPrice')

    if not recipient or not goal_price:
        return jsonify({"error": "Missing recipient or goal price"}), 400

    try:
        msg = EmailMessage()
        msg.set_content(
            f"Your stock has reached the target price of {goal_price}!")
        msg['Subject'] = "Stock Price Alert"
        msg['From'] = EMAIL_USER
        msg['To'] = recipient

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)

        return jsonify({"success": "Email sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5050)
