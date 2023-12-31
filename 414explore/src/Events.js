import React, { useState, useEffect } from 'react';
import './Events.css';

import keysFile from "./keys.json";
import rsa from "./RSAEncryption";

let keys = [BigInt(keysFile.publicKey), BigInt(keysFile.modulus)];

const Events = ({email}) => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [failed, setFailed] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/get-Events', {
            headers: {
                "Authorization": rsa.encrypt("414ExploreAdmin!", keys)
            }
        }).then(response => response.json())
        .then(data => {
            if(data.status === "fail"){
                alert(data.msg);
                setFailed(true);
            }
            else {
                const flattenedEvents = data.msg[0].organizers.flatMap(org => org.events);
                setEvents(flattenedEvents);
                setFilteredEvents(flattenedEvents);
                setFailed(false);
            }
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

    const formatDate = (datesArray) => {
        return datesArray.map(date => {
          const month = date.month;
          const year = date.year;
          const dayList = date.days.join(', ');
          return `${month} ${dayList} ${year}`;
        }).join('; ');
    };

    return (
        (!failed)&&<div>
            <div className="events-body">
                <nav className="navbar navbar-light bg-light">
                    <div class="container-fluid">
                        <form className="form-inline">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                            <button className="btn btn-outline-success" disabled={true}>Search</button>
                        </form>
                    </div>
                        <h5>Filters:</h5>
                        <ul class="nav nav-tabs">
                            {
                                getAllTags().map((tag) => (
                                    <li role="presentation"><button type="button" className="btn btn-outline-primary">{tag}</button></li>
                                )
                            )}
                        </ul>
                    </nav>
                    <div className="event-cards">
                        {filteredEvents.map((event, index) => (
                            <div class="card" key={index}>
                                <div class="card-body">
                                    <h5 class="card-title">{event.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{formatDate(event.dates)}</h6>
                                    <p class="card-text">{event.description}</p>
                                    <ul>
                                        {event.tags.map(tag => (
                                            <li>{tag}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
        </div>
    );
};

export default Events;
