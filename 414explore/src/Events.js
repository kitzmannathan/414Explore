import React, { useState, useEffect } from 'react';
import './Events.css';
import keysFile from "./keys.json"
import rsa from "./RSAEncryption";

let keys = [BigInt(keysFile.publicKey), BigInt(keysFile.modulus)];

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/get-Events', {
            headers: {
                "Authorization": rsa.encrypt("414ExploreAdmin!", keys)
            }
        }).then(response => response.json())
        .then(data => {
            console.log(data)
            const flattenedEvents = data.msg[0].organizers.flatMap(org => org.events);
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
        <div className="events-body">
            <nav className="navbar navbar-light bg-light">
                <form className="input-group">
                    <input className="form-control rounded" type="search" placeholder="Search" aria-label="Search"/>
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>

                Filters:
                <div className="btn-group" role="group">
                    {
                        getAllTags().map((tag) => (
                            <button type="button" className="btn btn-outline-primary">{tag}</button>
                        )
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Events;
