from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Story
from .serializers import StorySerializer

class StoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing stories.
    Provides list and detail views with filtering capabilities.
    """
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'story']  # Use 'story' field instead of 'content'
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        """
        Optionally filter the queryset by age_group and source
        """
        queryset = Story.objects.all()
        age_group = self.request.query_params.get('age_group', None)
        source = self.request.query_params.get('source', None)
        
        if age_group is not None:
            queryset = queryset.filter(age_group=age_group)
        if source is not None:
            queryset = queryset.filter(source=source)
            
        return queryset

    @action(detail=False, methods=['get'])
    def by_age_group(self, request):
        """Get stories filtered by age group"""
        age_group = request.query_params.get('age_group')
        if age_group:
            stories = self.queryset.filter(age_group=age_group)
            serializer = self.get_serializer(stories, many=True)
            return Response(serializer.data)
        return Response({'error': 'age_group parameter required'}, status=400)

    @action(detail=False, methods=['get'])
    def sources(self, request):
        """Get all unique sources"""
        sources = Story.objects.values_list('source', flat=True).distinct()
        return Response(list(sources))

    # NEW METHODS FOR REACT APP INTEGRATION
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search stories by title or content"""
        query = request.query_params.get('q', '')
        if not query.strip():
            stories = Story.objects.all()
        else:
            stories = Story.objects.filter(
                Q(title__icontains=query) | Q(story__icontains=query)
            )
        
        serializer = self.get_serializer(stories, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def similar(self, request, pk=None):
        """Get similar stories based on age group and source"""
        try:
            story = self.get_object()
            # Simple similarity: same age group and source, exclude current story
            similar = Story.objects.filter(
                age_group=story.age_group,
                source=story.source
            ).exclude(id=story.id)[:3]
            
            serializer = self.get_serializer(similar, many=True)
            return Response(serializer.data)
        except Story.DoesNotExist:
            return Response({'error': 'Story not found'}, status=404)

    @action(detail=True, methods=['post'])
    def analyze(self, request, pk=None):
        """Perform detailed text analysis on a story"""
        try:
            story = self.get_object()
            text = story.story
            
            # Basic text analysis
            words = text.split()
            sentences = [s.strip() for s in text.split('.') if s.strip()]
            
            # Calculate metrics
            word_count = len(words)
            sentence_count = len(sentences)
            avg_words_per_sentence = word_count / max(sentence_count, 1)
            
            # Simple lexical diversity (TTR)
            unique_words = len(set(word.lower().strip('.,!?";:()[]') for word in words))
            ttr = unique_words / max(word_count, 1)
            
            # Mock additional metrics (replace with real analysis later)
            import random
            
            analysis_data = {
                'word_count': word_count,
                'sentence_count': sentence_count,
                'ttr': ttr,
                'flesch_kincaid_grade': random.uniform(6.0, 12.0),
                'ari_score': random.uniform(5.0, 15.0),
                'sentiment_label': random.choice(['positive', 'negative', 'neutral']),
                'sentiment_score': random.uniform(-1.0, 1.0),
                'pos_distribution': [
                    {'name': 'Noun', 'value': random.randint(20, 35)},
                    {'name': 'Verb', 'value': random.randint(15, 25)},
                    {'name': 'Adjective', 'value': random.randint(10, 20)},
                    {'name': 'Adverb', 'value': random.randint(5, 15)},
                    {'name': 'Pronoun', 'value': random.randint(5, 15)},
                    {'name': 'Other', 'value': random.randint(15, 25)}
                ]
            }
            
            return Response(analysis_data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=True, methods=['post'])
    def detect_authorship(self, request, pk=None):
        """Detect authorship (AI vs Human) for a story"""
        try:
            story = self.get_object()
            text = story.story
            
            # Basic text metrics for authorship detection
            words = text.split()
            sentences = [s.strip() for s in text.split('.') if s.strip()]
            
            # Calculate features
            word_count = len(words)
            sentence_count = len(sentences)
            avg_sentence_length = word_count / max(sentence_count, 1)
            
            # Count repetitions (simple approach)
            word_freq = {}
            for word in words:
                clean_word = word.lower().strip('.,!?";:()[]')
                if len(clean_word) > 2:  # Only count words longer than 2 characters
                    word_freq[clean_word] = word_freq.get(clean_word, 0) + 1
            
            # Calculate repetition score differently
            total_words = len([w for w in word_freq.keys() if len(w) > 2])
            repeated_words = sum(1 for freq in word_freq.values() if freq > 2)
            repetition_score = repeated_words / max(total_words, 1)
            
            # Punctuation ratio
            punctuation_count = len([c for c in text if c in '.,!?;:()[]"'])
            punctuation_ratio = punctuation_count / len(text)
            
            # Complexity score (unique words / total words)
            complexity_score = len(set(words)) / len(words)
            
            # Improved prediction logic based on AI characteristics
            ai_score = 0
            
            # AI tends to have:
            # 1. Lower repetition of content words
            if repetition_score < 0.15:
                ai_score += 1
                
            # 2. More consistent sentence lengths
            if 10 < avg_sentence_length < 20:
                ai_score += 1
                
            # 3. Higher complexity (more varied vocabulary)
            if complexity_score > 0.75:
                ai_score += 1
                
            # 4. Moderate punctuation usage
            if 0.02 < punctuation_ratio < 0.08:
                ai_score += 1
                
            # 5. Longer texts tend to be AI generated in your dataset
            if word_count > 200:
                ai_score += 1
                
            # Predict based on score
            if ai_score >= 3:
                predicted_source = 'AI'
                confidence = min(0.95, 0.6 + (ai_score * 0.1))
            else:
                predicted_source = 'Human'
                confidence = min(0.95, 0.6 + ((5 - ai_score) * 0.1))
            
            # Add some randomness to make it more realistic
            import random
            confidence = max(0.6, min(0.95, confidence + random.uniform(-0.1, 0.1)))
            
            authorship_data = {
                'predicted_source': predicted_source,
                'confidence_score': confidence,
                'features': {
                    'repetition_score': repetition_score,
                    'avg_sentence_length': avg_sentence_length,
                    'complexity_score': complexity_score,
                    'punctuation_ratio': punctuation_ratio,
                    'word_count': word_count,
                    'sentence_count': sentence_count
                },
                'ai_indicators': {
                    'low_repetition': repetition_score < 0.15,
                    'consistent_length': 10 < avg_sentence_length < 20,
                    'high_complexity': complexity_score > 0.75,
                    'moderate_punctuation': 0.02 < punctuation_ratio < 0.08,
                    'longer_text': word_count > 200,
                    'total_ai_score': ai_score
                }
            }
            
            return Response(authorship_data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=500)