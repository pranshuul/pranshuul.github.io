"use strict";
/**
 * Event Tracker Module
 *
 * This module captures all click events and page views performed by a user
 * across HTML tags and CSS objects, as required in Q2 of the assignment.
 */
class EventTracker {
    /**
     * Initialize the event tracker
     */
    constructor() {
        this.isTracking = false;
        this.events = [];
        this.viewedElements = new Set();
        // Start tracking once the DOM is fully loaded
        this.startTracking();
        // Set up intersection observer for tracking views
        this.setupViewTracking();
    }
    /**
     * Starts tracking user interactions
     */
    startTracking() {
        if (this.isTracking)
            return;
        // Listen for click events on the entire document
        document.addEventListener('click', this.handleClick.bind(this), true);
        // Mark tracking as active
        this.isTracking = true;
        console.log('Event tracking started');
    }
    /**
     * Sets up the intersection observer to track element views
     */
    setupViewTracking() {
        // Create an intersection observer to track when elements come into view
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    // Only log each element once
                    if (!this.viewedElements.has(element)) {
                        this.viewedElements.add(element);
                        this.logViewEvent(element);
                    }
                }
            });
        }, { threshold: 0.5 } // Element is considered viewed when 50% visible
        );
        // Track views for important elements
        this.observeElements();
    }
    /**
     * Observe important elements for view tracking
     */
    observeElements() {
        // Get all major sections and elements we want to track views for
        const sectionsToTrack = document.querySelectorAll('section, header, footer');
        const cardsToTrack = document.querySelectorAll('.card');
        const imagesToTrack = document.querySelectorAll('img');
        const buttonsToTrack = document.querySelectorAll('button, a.btn-primary, a.btn-secondary');
        // Add all these elements to the intersection observer
        [...sectionsToTrack, ...cardsToTrack, ...imagesToTrack, ...buttonsToTrack].forEach(element => {
            this.intersectionObserver.observe(element);
        });
    }
    /**
     * Handle click events
     */
    handleClick(event) {
        const target = event.target;
        // Get element information
        const elementInfo = this.getElementInfo(target);
        // Log the click event
        this.logClickEvent(elementInfo);
    }
    /**
     * Get information about an element
     */
    getElementInfo(element) {
        var _a;
        // Start with the tag name
        let info = element.tagName.toLowerCase();
        // Add id if present
        if (element.id) {
            info += `#${element.id}`;
        }
        // Add class names if present
        if (element.className && typeof element.className === 'string') {
            const classes = element.className.split(' ')
                .filter(cls => cls.trim() !== '')
                .join('.');
            if (classes) {
                info += `.${classes}`;
            }
        }
        // Add content hint for certain elements
        if (element.tagName === 'A' || element.tagName === 'BUTTON') {
            const text = (_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim();
            if (text) {
                info += ` (${text.substring(0, 20)}${text.length > 20 ? '...' : ''})`;
            }
        }
        else if (element.tagName === 'IMG') {
            const alt = element.alt;
            if (alt) {
                info += ` (${alt})`;
            }
        }
        return info;
    }
    /**
     * Log a click event to the console
     */
    logClickEvent(elementInfo) {
        const timestamp = new Date().toISOString();
        console.log(`${timestamp}, click, ${elementInfo}`);
        // Add to events array
        this.events.push({
            timestamp,
            type: 'click',
            object: elementInfo
        });
    }
    /**
     * Log a view event to the console
     */
    logViewEvent(element) {
        const elementInfo = this.getElementInfo(element);
        const timestamp = new Date().toISOString();
        console.log(`${timestamp}, view, ${elementInfo}`);
        // Add to events array
        this.events.push({
            timestamp,
            type: 'view',
            object: elementInfo
        });
    }
    /**
     * Get all tracked events
     */
    getEvents() {
        return this.events;
    }
}
// Initialize the event tracker when the page loads
if (document.readyState !== 'loading') {
    // DOM already ready
    new EventTracker();
}
else {
    document.addEventListener('DOMContentLoaded', () => {
        new EventTracker();
    });
}
