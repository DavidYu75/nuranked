# Northeastern Ranked

A web application that showcases exceptional engineering talent at Northeastern University through a fun, interactive ranking system.

## Technologies Used

- Frontend: Next.js, Tailwind CSS
- Backend: Python, FastAPI
- Database: MongoDB

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js and npm
- MongoDB

### 1. Setting up MongoDB
```
# Install MongoDB using Homebrew (macOS)
brew tap mongodb/brew
brew install mongodb-community@6.0

# Start MongoDB service
brew services start mongodb-community@6.0

# Create the database (run in MongoDB shell)
mongosh
> use northeastern_ranked
> db.createCollection("profiles")
> exit
```

### 2. Setting up the backend
```
# Navigate to backend directory
cd nuranked/backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn motor pydantic python-dotenv

# Create .env file with database configuration
echo "MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=northeastern_ranked" > .env

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API documentation will be available at: http://localhost:8000/docs

### 3. Setting up the frontend
```
# Navigate to frontend directory
cd nuranked/frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start the development server
npm run dev
```

## Development Workflow
1. Run both backend and frontend servers in seperate terminal windows
2. Make changes to the codebase
3. The servers will automatically reload when files are changed
