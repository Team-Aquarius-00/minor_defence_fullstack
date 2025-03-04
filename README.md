# Future Stock Price Prediction and Alert System Mechanism

## Overview
This project is a multi-feature stock prediction system that utilizes Long Short-Term Memory (LSTM) networks to forecast stock prices based on key financial metrics. The system integrates a frontend built with TypeScript  and a backend powered by FastAPI, with an additional email notification service.

## Features
- **Stock Price Prediction** using LSTM deep learning models
- **Multi-feature Analysis** incorporating Close Price, P/E Ratio, and EPS
- **MongoDB Integration** for storing predictions
- **Email Alerts** for significant stock conditions
- **User Authentication** (No role-based access control)

## Tech Stack
- **Frontend**: TypeScript (React + Vite)
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: Supabase
- **Deployment**: Local setup with npm and Python

## Installation & Setup
### Prerequisites
Ensure you have the following installed on your system:
- Node.js & npm
- Python 3.x
- MongoDB

### Setup Instructions
1. **Clone the Repository**
   ```sh
   git clone git@github.com:Team-Aquarius-00/minor_defence_fullstack.git
   cd minor_defence_fullstack
   ```

2. **Start the Frontend**
   ```sh
   cd frontend
   npm install  # Install dependencies
   npm run dev  # Runs on port 8080
   ```

3. **Start the Backend**
   ```sh
   cd ../backend
   pip install -r requirements.txt  # Install dependencies
   python app.py  # Runs on port 5000
   ```

4. **Start the Email Service**
   ```sh
   cd ../backend_email
   pip install -r requirements.txt  # Install dependencies
   python app.py  # Runs on port 5050
   ```

## API Endpoints
### Backend Service (Port 5000)
- `POST /predict` - Accepts stock data and returns predicted stock prices.
- `GET /history` - Retrieves historical predictions from MongoDB.

### Email Service (Port 5050)
- `POST /send-email` - Sends stock alert notifications to users.

## Usage
1. Open the frontend at `http://localhost:8080`.
2. Enter stock data for predictions.
3. View predicted prices and receive email alerts when configured conditions are met.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for discussions.

## License
This project is licensed under the MIT License.

