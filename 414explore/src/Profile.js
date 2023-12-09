import {useEffect, useState} from "react";
import keysFile from "./keys.json";
import rsa from "./RSAEncryption";

let keys = [BigInt(keysFile.publicKey), BigInt(keysFile.modulus)];
function Profile({email}) {
    const [userEmail, setUserEmail] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [interests, setInterests] = useState("");
    const [age, setAge] = useState("");
    const [school, setSchool] = useState("");
    const [location, setLocation] = useState("");
    useEffect(() => {
        fetch("http://localhost:3001/get-User?email="+email, {
            headers: {
                'Authorization':rsa.encrypt("414ExploreAdmin!", keys)
            }}).then(response2 => {
            return response2.json();
        }).then(user => {
            let interests = "";
            user.msg.intrests.forEach((item, i) =>{
                if(i === user.msg.intrests.length-1){
                    interests += item;
                }
                else {
                    interests += item + ", ";
                }
            })
            interests.substring(0,(interests.length-1));
            setUsername(user.msg.userName);
            setName(user.msg.name);
            setUserEmail(user.msg.email);
            setInterests(interests);
            setSchool(user.msg.school);
            setAge(user.msg.age);
            setLocation(user.msg.location);
        });
    }, []);

    return (
        <div>
            <h4>
                User name: {username}
            </h4>
            <h4>
                Name: {name}
            </h4>
            <h4>
                Email: {userEmail}
            </h4>
            <h4>
                Age: {age}
            </h4>
            <h4>
                Interests: {interests}
            </h4>
            <h4>
                School: {school}
            </h4>
            <h4>
                Location: {location}
            </h4>
        </div>
    );
}

export default Profile;
