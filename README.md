# Beyond The Words

A comprehensive story analysis platform built with React.js frontend and Django backend. Beyond the Words provides advanced text analytics, content authentication, and intelligent story recommendations to help users analyze and discover stories.

## 🌐 Live Demo

Visit the live application: [https://beyond-words-frontend.onrender.com](https://beyond-words-frontend.onrender.com)

## 🚀 Tech Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **Create React App** - Bootstrapped for quick setup and development
- **Tailwind CSS** - Utility-first CSS framework for styling
- **PostCSS** - CSS post-processor for enhanced styling capabilities

### Backend
- **Django** - High-level Python web framework
- **Django REST Framework** - For building robust APIs
- **Python** - Backend programming language
- **Machine Learning Libraries** - Scikit-learn, NLTK, TextStat for text analysis
- **Random Forest Classifier** - For AI vs Human content authentication

### Deployment
- **Frontend**: Deployed on Render
- **Backend**: Deployed on Render

## ✨ Features

### 🔍 Advanced Search Functionality
- **Story Name Search** - Find stories by their titles
- **Content-Based Search** - Search for stories containing specific words or phrases
- **Intelligent Matching** - Advanced text matching algorithms for precise results

### 🎯 Smart Filtering
- **Age Group Filtering** - Filter stories based on appropriate age demographics
- **Category-Based Organization** - Organized story browsing experience

### 📊 Comprehensive Story Analysis
- **Text Statistics** - Total word count, sentence analysis
- **Readability Metrics** - ARI (Automated Readability Index) and Flesch-Kincaid scores
- **Sentiment Analysis** - Emotional tone and sentiment detection
- **POS Tagging Distribution** - Part-of-speech analysis with interactive charts
- **Visual Analytics** - Data visualization through charts and graphs

### 🤖 AI Content Authentication
- **Human vs AI Detection** - Machine learning-powered content verification
- **Random Forest Classifier** - Advanced ML model for accurate prediction
- **Content Authenticity Verification** - Ensures story originality and authorship

### 🎭 Story Recommendations
- **Similar Stories** - Intelligent recommendations based on content analysis
- **Personalized Suggestions** - Stories tailored to user preferences
- **Content-Based Filtering** - Advanced algorithms for story matching

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)
- Git

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/SatvikaSS/beyondthewords.git
   cd beyondthewords
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   
   The app will open at [http://localhost:3000](http://localhost:3000)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend  # or your Django project directory
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Start the Django server**
   ```bash
   python manage.py runserver
   ```
   
   The API will be available at [http://localhost:8000](http://localhost:8000)

## 📁 Project Structure

```
beyondthewords/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── analysis/          # Story analysis functionality
│   ├── authentication/    # User authentication
│   ├── beyond_words/      # Main Django project
│   ├── stories/           # Story management
│   ├── static/           # Static files
│   ├── ai_stories.json   # AI-generated stories dataset
│   ├── human_stories.json # Human-written stories dataset
│   ├── manage.py
│   ├── requirements.txt
│   └── settings.py
├── .gitattributes
├── .gitignore
└── README.md
```

## 🔧 Available Scripts

### Frontend Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

### Backend Scripts

- `python manage.py runserver` - Start Django development server
- `python manage.py migrate` - Run database migrations
- `python manage.py createsuperuser` - Create admin user
- `python manage.py collectstatic` - Collect static files for production

## 🌍 Environment Variables

Create a `.env` file in the root directory and add:

```env
# Frontend
REACT_APP_API_BASE_URL=https://your-backend-url.onrender.com/api

# Backend
DEBUG=False
SECRET_KEY=your-secret-key-here
DATABASE_URL=your-database-url
ALLOWED_HOSTS=your-backend-url.onrender.com,localhost,127.0.0.1
```

## 🚀 Deployment

### Frontend (Render)
1. Connect your GitHub repository to Render
2. Set build command: `cd frontend && npm install && npm run build`
3. Set publish directory: `frontend/build`
4. Set environment variables in Render dashboard
5. Deploy

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && pip install -r requirements.txt`
4. Set start command: `cd backend && python manage.py runserver 0.0.0.0:$PORT`
5. Configure environment variables
6. Deploy

## 🤖 Machine Learning Features

The application leverages several ML and NLP techniques:

- **Random Forest Classifier** for AI vs Human content detection
- **NLTK** for natural language processing and text analysis
- **TextStat** for readability metrics calculation
- **Sentiment Analysis** for emotional content evaluation
- **POS Tagging** for grammatical analysis and visualization
- **Content-Based Filtering** for story recommendation system

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Create React App for the initial setup
- Django and Django REST Framework communities
- Scikit-learn for machine learning capabilities
- NLTK team for natural language processing tools
- TextStat library for readability analysis
- Render for seamless deployment platform
