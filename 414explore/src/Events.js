import React, { useState, useEffect } from 'react';
import './Events.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        fetch('/path/to/Events.json')
            .then(response => response.json())
            .then(data => {
                const flattenedEvents = data.organizers.flatMap(org => org.events);
                setEvents(flattenedEvents);
                setFilteredEvents(flattenedEvents);
            });
    }, []);

    useEffect(() => {
        if (selectedTags.length === 0) {
            setFilteredEvents(events);
            return;
        }

        const filtered = events.filter(event =>
            selectedTags.some(tag => event.tags.includes(tag))
        );

        setFilteredEvents(filtered);
    }, [selectedTags, events]);

    const handleTagClick = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const getAllTags = () => {
        const allTags = new Set();
        events.forEach(event => {
            event.tags.forEach(tag => allTags.add(tag));
        });
        return Array.from(allTags);
    };

    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <form className="form-inline">
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>

                Filters:
                <div class="btn-group" role="group">
                    {
                        getAllTags().map((tag) => (
                            <button type="button" class="btn btn-outline-primary">{tag}</button>
                        )
                    )}
                </div>
                
            </nav>
        </div>
    );
};

export default Events;
