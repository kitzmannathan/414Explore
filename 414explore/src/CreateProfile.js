import './CreateProfile.css';
import { useState } from 'react';
import emailjs from 'emailjs-com';
import keysFile from "./keys.json"
import rsa from "./RSAEncryption";


let keys = [BigInt(keysFile.publicKey), BigInt(keysFile.modulus)]
function CreateProfile() {

  const [view, setView] = useState("first");
  const [verificationCode, setVerificationCode] = useState(0);
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  
  const [password, setPassword] = useState("");
  
  const sendEmail = (e) => {
    e.preventDefault(); 
    let num = Math.floor(1000 + Math.random() * 9000);
    setVerificationCode(num);
    const address = {
      reply_to: e.target.reply_to.value,
      code: num
    }
    console.log(num);
    // emailjs.send('service_r6rrkdo', 'template_ygla1qm', address, 'HEDXSuwTR5Q-cpA8e')
    // .then((result) => {
      setView("confirmation");
    // }, (error) => {
    //   console.log(error.text);
    // });
    }
  const confirmCode = (e) => {
    e.preventDefault();
    if(parseInt(e.target.code.value) === verificationCode){
      setView("unPW");
    }

  }
  const validateInformation = (e) =>{
    e.preventDefault();
    const usernameRegex = /^[a-z0-9_.]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if(usernameRegex.test(e.target.username.value)){
      console.log(e.target.pass.value);
      if(passwordRegex.test(e.target.pass.value)){
        if(e.target.password.value === e.target.pass2.value){
          setUsername(e.target.username.value);
          setPassword(e.target.pass.value);
          console.log("username: ", username);
          console.log("password: ", password);
        } else{
          window.alert("Passwords do not match");
        }
      } else {
        window.alert("Password does not follow the correct format");
      }
    } else{
      window.alert("Username does not follow the correct format");
    }

  }

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
      {view==="first"&&(
      <div className='loginModal'>
        <h1>414Explore</h1>
        <h4>Discover all the Milwaukee has to offer.</h4>
        <button className='topButton' onClick={() => setView("create")}>Create Profile</button>
        <button className='bottomButton' onClick={() => setView("signIn")} disabled>Sign In</button>
      </div>
      )}
      {view==="create" &&(
        <div className='loginModal'>
          <div id="defineUser">
            <h3 id="userTypes">Are you an event attendee or and event organizer?</h3>
            <button className='topButton' onClick={() => setView("userEmail")}>I'm an Attendee</button>
            <button className='bottomButton' onClick={() => setView("eoEmail")} disabled>I'm an Event Organizer</button>
          </div>
        </div>
      )}
      {view==="userEmail" &&(
        <div className='loginModal'>
          <h3 id="userTypes">Please enter your email</h3>
          <form onSubmit={sendEmail}>
          <label>
            Email:
          </label>
          <input type='email' name='reply_to'/>
          <input id='sendConfirmation' type='submit' value="Send"/>
          </form>
        </div>
      )}
      {view==="confirmation"&&(
        <div className='loginModal'>
          <form onSubmit={confirmCode}>
          <label>
            Confirmation Code:
          </label>
          <input type='number' name='code'/>
          <input id='confirmEmail' type='submit' value="Confirm email"/>
          </form>
      </div>
      )}
      {view==="unPW" &&(
        <div className='loginModal'>

          <form onSubmit={validateInformation} id="unPW">

            <label>
              Username:
            </label>
            <p className='instructions'>Your username can contain letters, numbers, underscores and periods.</p>
            <input type='text' name='username' value={username} onChange={(e) => setUsername(e.target.value)} className='upInput'/>


            <label>
              Password:
            </label>
            <p className='instructions'>Password must be at least 6 characters with at least one capital letter and one number.</p>
            <input type={showPassword ? "text" : "password"} name='pass'/>
            <div className='showPass'>
              <label>Show Password</label>
                <input type="checkbox" value={showPassword} onChange={() => setShowPassword((prev) => !prev)}/>
            </div>


            <label>
              Confirm password:
            </label>
            <input type={showPassword2 ? "text" : "password"} name='pass2'/>
            <div className='showPass'>
              <label>Show Password</label>
                <input type="checkbox" value={showPassword2} onChange={() =>setShowPassword2((prev) => !prev)}/>
            </div>
            <input id='continue' type='submit' value="Continue" name="continue"/>

          </form>
      </div>
      )}
      
    </div>
  );
}
// https://stackoverflow.com/questions/55795125/how-to-send-email-from-my-react-web-application

export default CreateProfile;
