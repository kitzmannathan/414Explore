function Navbar({setPage}) {
    const handleCommunitiesClick = () => {
        setPage('Communities');
    };

    const handleEventsClick = () => {
        setPage('Events');
    };

    const handleProfileClick = () => {
        setPage('Profile');
    };
    return (
        <div className="events-header">
            <header class="d-flex flex-wrap py-3 mb-4 border-bottom">
                <h1>414Explore</h1>
                <ul class="nav nav-pills">
                    <li class="nav-item"><button onClick={handleEventsClick}>Events</button></li>
                    <li className="nav-item"><button onClick={handleCommunitiesClick}>Communities</button></li>
                    <li class="nav-item"><button onClick={handleProfileClick}>Profile</button></li>
                </ul>
            </header>
        </div>
    );
}

export default Navbar;
