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
        <div>
            <div>
                <header class="d-flex flex-wrap justify-content-left py-3 mb-4 border-bottom">
                    <h1>414Explore</h1>
                    <ul class="nav nav-pills justify-content-right">
                        <li class="nav-item"><button>Communities</button></li>
                        <li class="nav-item"><button>Favorites</button></li>
                        <li class="nav-item"><button>Profile</button></li>
                    </ul>
                </header>
            </div>
            <div className="events-body">
                <nav className="navbar navbar-light bg-light">
                    <form className="input-group">
                        <input className="form-control rounded" type="search" placeholder="Search" aria-label="Search"/>
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>

                    Filters:
                    {/* <div className="btn-group" role="group">
                        {
                            getAllTags().map((tag) => (
                                <button type="button" className="btn btn-outline-primary">{tag}</button>
                            )
                        )}
                    </div> */}
                <ul class="nav nav-tabs">
                    {
                        getAllTags().map((tag) => (
                            <li role="presentation"><button type="button" className="btn btn-outline-primary">{tag}</button></li>
                        )
                    )}
                </ul>
                </nav>
            </div>
        </div>
    );
};

export default Events;
