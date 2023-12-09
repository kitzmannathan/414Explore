import './Communities.css';
import {React, useEffect, useState} from 'react'
import keysFile from "./keys.json";
import rsa from "./RSAEncryption";

let keys = [BigInt(keysFile.publicKey), BigInt(keysFile.modulus)];

const Communities = () => {
    const [communities, setCommunities] = useState([]);
    const [failed, setFailed] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/get-Communities', {
            headers: {
                "Authorization": rsa.encrypt("414ExploreAdmin!", keys)
            }
        }).then(response => response.json())
            .then(data => {
                if(data.status === "fail"){
                    alert(data.msg)
                    setFailed(true);
                }
                else{
                    setCommunities(data.msg[0]);
                    setFailed(false);
                }
            });
    }, []);

    return (
        (!failed)&&<div className="main">
            <div className="search">
                <form className="form-inline">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                    <button className="btn btn-outline-success" disabled={true}>Search</button>
                </form>
            </div>
            <div className="card-container">
                {communities.map((item) => (
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