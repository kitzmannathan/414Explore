import {useState}  from "react";
import Navbar from "./Navbar";
import CreateProfile from "./CreateProfile";
import Events from "./Events";
import Communities from "./Communities";
import Profile from "./Profile";
function App() {
    const [page, setPage] = useState("CreateProfile");
    const [email, setEmail] = useState("");

    return (
        <div>
            {
                (page !== "CreateProfile") && <Navbar setPage={setPage}/>
            }
            {
                (page === "CreateProfile") && <CreateProfile setPage={setPage} setEmail={setEmail}/>
            }
            {
                (page === "Events") && <Events/>
            }
            {
                (page === "Communities") && <Communities/>
            }
            {
                (page === "Profile") && <Profile email={email}/>
            }
        </div>
    );
}

export default App;
