import re
import nltk
import textstat
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from collections import Counter
import numpy as np
from sklearn.ensemble import RandomForestClassifier

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    nltk.download('averaged_perceptron_tagger')

class StylometricAnalyzer:
    def __init__(self):
        self.sentiment_analyzer = SentimentIntensityAnalyzer()
    
    def analyze_text(self, text):
        words = self.get_words(text)
        sentences = self.get_sentences(text)
        
        word_count = len(words)
        sentence_count = len(sentences)
        
        unique_words = len(set(word.lower() for word in words))
        ttr = unique_words / word_count if word_count > 0 else 0
        
        flesch_kincaid = textstat.flesch_kincaid_grade(text)
        ari = textstat.automated_readability_index(text)
        
        sentiment_scores = self.sentiment_analyzer.polarity_scores(text)
        sentiment_label = self.get_sentiment_label(sentiment_scores['compound'])
        
        pos_distribution = self.get_pos_distribution(text)
        
        return {
            'word_count': word_count,
            'sentence_count': sentence_count,
            'ttr': ttr,
            'flesch_kincaid_grade': flesch_kincaid,
            'ari_score': ari,
            'sentiment_label': sentiment_label,
            'sentiment_score': sentiment_scores['compound'],
            'pos_distribution': pos_distribution
        }
    
    def get_words(self, text):
        return re.findall(r'\b\w+\b', text.lower())
    
    def get_sentences(self, text):
        return nltk.sent_tokenize(text)
    
    def get_sentiment_label(self, compound_score):
        if compound_score >= 0.05:
            return 'positive'
        elif compound_score <= -0.05:
            return 'negative'
        else:
            return 'neutral'
    
    def get_pos_distribution(self, text):
        words = nltk.word_tokenize(text)
        pos_tags = nltk.pos_tag(words)
        
        simplified_pos = []
        for word, pos in pos_tags:
            if pos.startswith('N'):
                simplified_pos.append('Noun')
            elif pos.startswith('V'):
                simplified_pos.append('Verb')
            elif pos.startswith('J'):
                simplified_pos.append('Adjective')
            elif pos.startswith('R'):
                simplified_pos.append('Adverb')
            elif pos in ['PRP', 'PRP$']:
                simplified_pos.append('Pronoun')
            elif pos in ['IN', 'TO']:
                simplified_pos.append('Preposition')
            else:
                simplified_pos.append('Other')
        
        pos_counts = Counter(simplified_pos)
        total_words = len(simplified_pos)
        
        pos_distribution = []
        for pos, count in pos_counts.most_common():
            percentage = (count / total_words) * 100
            pos_distribution.append({
                'name': pos,
                'value': round(percentage, 1)
            })
        
        return pos_distribution

class AuthorshipDetector:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
    
    def extract_features(self, text):
        words = re.findall(r'\b\w+\b', text.lower())
        sentences = nltk.sent_tokenize(text)
        
        avg_word_length = np.mean([len(word) for word in words]) if words else 0
        avg_sentence_length = len(words) / len(sentences) if sentences else 0
        
        punct_count = len(re.findall(r'[.,;:!?]', text))
        punctuation_ratio = punct_count / len(text) if text else 0
        
        word_freq = Counter(words)
        repeated_words = sum(1 for count in word_freq.values() if count > 1)
        repetition_score = repeated_words / len(word_freq) if word_freq else 0
        
        unique_words = len(set(words))
        complexity_score = unique_words / len(words) if words else 0
        
        return {
            'avg_word_length': avg_word_length,
            'avg_sentence_length': avg_sentence_length,
            'punctuation_ratio': punctuation_ratio,
            'repetition_score': repetition_score,
            'complexity_score': complexity_score
        }
    
    def predict_authorship(self, text):
        features = self.extract_features(text)
        
        score = 0
        
        if features['repetition_score'] > 0.3:
            score += 0.3
        if features['avg_sentence_length'] > 15:
            score += 0.2
        if features['complexity_score'] < 0.7:
            score += 0.2
        if features['punctuation_ratio'] < 0.05:
            score += 0.3
        
        prediction = 'AI' if score > 0.5 else 'Human'
        confidence = max(0.6, min(0.95, score + 0.1))
        
        return {
            'prediction': prediction,
            'confidence': confidence,
            'features': features
        }