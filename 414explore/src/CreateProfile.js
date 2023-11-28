import './CreateProfile.css';
import keysFile from "./keys.json"
import rsa from "./RSAEncryption";

let keys = [BigInt(keysFile.publicKey), BigInt(keysFile.modulus)]
function CreateProfile() {
    fetch("http://localhost:3001/login?userName=what&password="+rsa.encrypt("huh", keys), {
        headers: {
            'Authorization':rsa.encrypt("414ExploreAdmin!", keys)
        }});
    fetch("http://localhost:3001/create-User?userName=test&password="+rsa.encrypt("test", keys) + "&email=test@email.com&userType=user", {
        headers: {
            "Authorization": rsa.encrypt("414ExploreAdmin!", keys)
        }
    })
    fetch("http://localhost:3001/get-Events", {
        headers: {
            "Authorization": rsa.encrypt("414ExploreAdmin!", keys)
        }
    })
    fetch("http://localhost:3001/get-Communities", {
        headers: {
            "Authorization": rsa.encrypt("414ExploreAdmin!", keys)
        }
    })
    fetch("http://localhost:3001/get-User?userName=what", {
        headers: {
            "Authorization": rsa.encrypt("414ExploreAdmin!", keys)
        }
    })
  return (
    <div className="App">
      <header className="App-header">
        
      </header>
    </div>
  );
}

export default CreateProfile;
