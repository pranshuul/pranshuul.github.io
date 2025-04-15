/**
 * Event Tracker Module
 * 
 * This module captures all click events and page views performed by a user
 * across HTML tags and CSS objects, as required in Q2 of the assignment.
 */

/**
 * Interface for a tracked event
 */

interface TrackedEvent {
    timestamp: string;
    type: 'click' | 'view';
    object: string;
}

class EventTracker {
    private isTracking: boolean = false;
    private events: TrackedEvent[] = [];
    private viewedElements: Set<Element> = new Set();
    private intersectionObserver: IntersectionObserver;
    
    /**
     * Initialize the event tracker
     */
    constructor() {
        // Start tracking once the DOM is fully loaded
        this.startTracking();
        
        // Set up intersection observer for tracking views
        this.setupViewTracking();
    }
    
    /**
     * Starts tracking user interactions
     */
    private startTracking(): void {
        if (this.isTracking) return;
        
        // Listen for click events on the entire document
        document.addEventListener('click', this.handleClick.bind(this), true);
        
        // Mark tracking as active
        this.isTracking = true;
        
        console.log('Event tracking started');
    }
    
    /**
     * Sets up the intersection observer to track element views
     */
    private setupViewTracking(): void {
        // Create an intersection observer to track when elements come into view
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
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
            },
            { threshold: 0.5 } // Element is considered viewed when 50% visible
        );
        
        // Track views for important elements
        this.observeElements();
    }
    
    /**
     * Observe important elements for view tracking
     */
    private observeElements(): void {
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
    private handleClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        
        // Get element information
        const elementInfo = this.getElementInfo(target);
        
        // Log the click event
        this.logClickEvent(elementInfo);
    }
    
    /**
     * Get information about an element
     */
    private getElementInfo(element: HTMLElement): string {
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
            const text = element.textContent?.trim();
            if (text) {
                info += ` (${text.substring(0, 20)}${text.length > 20 ? '...' : ''})`;
            }
        } else if (element.tagName === 'IMG') {
            const alt = (element as HTMLImageElement).alt;
            if (alt) {
                info += ` (${alt})`;
            }
        }
        
        return info;
    }
    
    /**
     * Log a click event to the console
     */
    private logClickEvent(elementInfo: string): void {
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
    private logViewEvent(element: Element): void {
        const elementInfo = this.getElementInfo(element as HTMLElement);
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
    public getEvents(): TrackedEvent[] {
        return this.events;
    }
}

/**
 * Interface for a tracked event
 */
interface TrackedEvent {
    timestamp: string;
    type: 'click' | 'view';
    object: string;
}

// Initialize the event tracker when the page loads
if (document.readyState !== 'loading') {
    // DOM already ready
    new EventTracker();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        new EventTracker();
    });
}
