"use strict";
/**
 * Text Analyzer Module
 *
 * This module analyzes text input and provides statistics as required in Q3 of the assignment.
 */
class TextAnalyzer {
    constructor() {
        // Lists of words to check against
        this.pronouns = [
            'i', 'me', 'my', 'mine', 'myself',
            'you', 'your', 'yours', 'yourself', 'yourselves',
            'he', 'him', 'his', 'himself',
            'she', 'her', 'hers', 'herself',
            'it', 'its', 'itself',
            'we', 'us', 'our', 'ours', 'ourselves',
            'they', 'them', 'their', 'theirs', 'themselves',
            'this', 'that', 'these', 'those',
            'who', 'whom', 'whose', 'which', 'what'
        ];
        this.prepositions = [
            'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among',
            'around', 'as', 'at', 'before', 'behind', 'below', 'beneath', 'beside',
            'between', 'beyond', 'by', 'concerning', 'considering', 'despite', 'down',
            'during', 'except', 'for', 'from', 'in', 'inside', 'into', 'like', 'near',
            'of', 'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'regarding',
            'round', 'since', 'through', 'throughout', 'to', 'toward', 'towards', 'under',
            'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without'
        ];
        this.indefiniteArticles = ['a', 'an', 'some', 'any'];
        // Get DOM elements
        this.textInput = document.getElementById('text-input');
        this.analyzeButton = document.getElementById('analyze-button');
        this.resultsSection = document.getElementById('analysis-results');
        this.countLetters = document.getElementById('count-letters');
        this.countWords = document.getElementById('count-words');
        this.countSpaces = document.getElementById('count-spaces');
        this.countNewlines = document.getElementById('count-newlines');
        this.countSpecial = document.getElementById('count-special');
        this.pronounsList = document.getElementById('pronouns-list');
        this.prepositionsList = document.getElementById('prepositions-list');
        this.articlesList = document.getElementById('articles-list');
        // Set up event listeners
        this.setupEventListeners();
    }
    /**
     * Set up event listeners for the analyzer
     */
    setupEventListeners() {
        this.analyzeButton.addEventListener('click', this.analyzeText.bind(this));
    }
    /**
     * Main function to analyze the input text
     */
    analyzeText() {
        const text = this.textInput.value;
        // Check if text meets minimum requirements
        if (text.trim() === '') {
            alert('Please enter some text for analysis.');
            return;
        }
        // Count characters, words, spaces, etc.
        this.countBasicElements(text);
        // Tokenize and analyze the text for word types
        this.tokenizeAndAnalyze(text);
        // Show results section
        this.resultsSection.classList.remove('hidden');
    }
    /**
     * Count basic text elements: letters, words, spaces, newlines, special symbols
     */
    countBasicElements(text) {
        // Count letters (alphabetic characters)
        const letters = (text.match(/[a-zA-Z]/g) || []).length;
        // Count words (sequences of characters separated by whitespace)
        const words = text.trim().split(/\s+/).length;
        // Count spaces
        const spaces = (text.match(/\s/g) || []).length;
        // Count newlines
        const newlines = (text.match(/\n/g) || []).length;
        // Count special symbols (non-alphanumeric, non-whitespace)
        const special = (text.match(/[^\w\s]/g) || []).length;
        // Update the UI with counts
        this.countLetters.textContent = letters.toString();
        this.countWords.textContent = words.toString();
        this.countSpaces.textContent = spaces.toString();
        this.countNewlines.textContent = newlines.toString();
        this.countSpecial.textContent = special.toString();
    }
    /**
     * Tokenize the text and analyze word types
     */
    tokenizeAndAnalyze(text) {
        // Tokenize the text into words
        // Convert to lowercase and remove punctuation
        const words = text.toLowerCase()
            .replace(/[^\w\s]|_/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ');
        // Count word types
        const pronounCounts = {};
        const prepositionCounts = {};
        const articleCounts = {};
        // Process each word
        words.forEach(word => {
            // Check if word is a pronoun
            if (this.pronouns.includes(word)) {
                pronounCounts[word] = (pronounCounts[word] || 0) + 1;
            }
            // Check if word is a preposition
            if (this.prepositions.includes(word)) {
                prepositionCounts[word] = (prepositionCounts[word] || 0) + 1;
            }
            // Check if word is an indefinite article
            if (this.indefiniteArticles.includes(word)) {
                articleCounts[word] = (articleCounts[word] || 0) + 1;
            }
        });
        // Update the UI with word type counts
        this.updateWordTypeCounts(pronounCounts, this.pronounsList);
        this.updateWordTypeCounts(prepositionCounts, this.prepositionsList);
        this.updateWordTypeCounts(articleCounts, this.articlesList);
    }
    /**
     * Update UI with word type counts
     */
    updateWordTypeCounts(counts, element) {
        // Clear previous results
        element.innerHTML = '';
        // Sort words by frequency (descending)
        const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        if (sortedEntries.length === 0) {
            element.innerHTML = '<p class="text-center italic">None found</p>';
            return;
        }
        // Create a list of words with their counts
        const list = document.createElement('ul');
        list.className = 'space-y-2';
        sortedEntries.forEach(([word, count]) => {
            const item = document.createElement('li');
            item.className = 'flex justify-between items-center';
            const wordSpan = document.createElement('span');
            wordSpan.textContent = word;
            wordSpan.className = 'font-medium';
            const countSpan = document.createElement('span');
            countSpan.textContent = count.toString();
            countSpan.className = 'px-3 py-1 rounded-full text-sm font-medium';
            countSpan.style.backgroundColor = 'var(--accent-color)';
            countSpan.style.color = 'var(--btn-text-color)';
            item.appendChild(wordSpan);
            item.appendChild(countSpan);
            list.appendChild(item);
        });
        element.appendChild(list);
    }
}
// Initialize the text analyzer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TextAnalyzer();
});
