import './Communities.css';
import { React, useState } from 'react'
import data from "./Communites.json"
import Events from "./Events";
import keysFile from "./keys.json";
import rsa from "./RSAEncryption";

let keys = [BigInt(keysFile.publicKey), BigInt(keysFile.modulus)];

const Communities = ({email}) => {
    const [inputText, setInputText] = useState("");
    const [page, setPage] = useState("communites");
    const [userEmail, setUserEmail] = useState("");
    const [username, setUsername] = useState("");
    const [interests, setInterests] = useState("");
    const [age, setAge] = useState("");
    const [school, setSchool] = useState("");
    const [location, setLocation] = useState("");
    let inputHandler = (e) => {
        //convert input text to lower case
        let lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    };

    const handleProfileClick = () => {
        fetch("http://localhost:3001/get-User?email="+email, {
            headers: {
                'Authorization':rsa.encrypt("414ExploreAdmin!", keys)
            }}).then(response2 => {
            return response2.json();
        }).then(user => {
            let interests = "";
            user.msg.intrests.forEach(item =>{
                interests += item +" ";
            })
            setUsername(user.msg.userName);
            setUserEmail(user.msg.email);
            setInterests(interests);
            setSchool(user.msg.school);
            setAge(user.msg.age);
            setLocation(user.msg.location);
        });
        setPage('profile');
    };
    // TEXT FIELD TBD
    return (
        <div className="main">
            <div className="search">
                <form className="form-inline">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                    <button className="btn btn-outline-success" disabled={true}>Search</button>
                </form>
            </div>
            <div className="card-container">
                {data.map((item) => (
                    <div key={item.name} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">{item.name}</h5>
                            <p className="card-text">Number of Members: {item.numberOfMembers}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default  Communities;