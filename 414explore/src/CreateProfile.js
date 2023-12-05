import './CreateProfile.css';
import { useState } from 'react';
import emailjs from 'emailjs-com';
import keysFile from "./keys.json"
import rsa from "./RSAEncryption";
import Events from './Events';
// var url = new URL("http://localhost:3001/create-User?userName=test&password="+rsa.encrypt("test", keys) + "&email=test@email.com&userType=user");


let keys = [BigInt(keysFile.publicKey), BigInt(keysFile.modulus)]
function CreateProfile() {

  const [view, setView] = useState("first");
  const [verificationCode, setVerificationCode] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [interests, setInterests] = useState("");
  const [age, setAge] = useState("");
  const [school, setSchool] = useState("");
  const [location, setLocation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [signinTries, setSigninTries] = useState(6);
  
  const [password, setPassword] = useState("");

  const validInterests = ["music","food","festival","fair","pop","metal","rock","country","alternative","r&b","rap"]

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
      setUserEmail(e.target.reply_to.value);
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
    const usernameRegex = /^[A-Za-z0-9_.]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    const ageRegex = /^\d+$/;
    if(usernameRegex.test(e.target.username.value)){
      console.log(e.target.pass.value);
      if(passwordRegex.test(e.target.pass.value)){
        if(e.target.pass.value === e.target.pass2.value){
          if(e.target.age.value === "" || (ageRegex.test(e.target.age.value) && parseInt(e.target.age.value) >= 18 && parseInt(e.target.age.value) <= 25)) {
            if(e.target.school.value === "" || e.target.school.value === "MSOE" || e.target.school.value === "UWM" || e.target.school.value === "MU" || e.target.school.value === "MIAD") {
              let interests = "";
              let create = true;
              if (e.target.intrests.value === "") {
                interests = "[]";
              } else if (!e.target.intrests.value.includes(",") && validInterests.includes(e.target.intrests.value)) {
                interests = "[" + e.target.intrests.value + "]";
              } else if (e.target.intrests.value.includes(",")) {
                let valid = true;
                e.target.intrests.value.split(",").forEach(item => {
                  if (!validInterests.includes(item.trim())) {
                    valid = false;
                  }
                });
                if (valid) {
                  interests = "[" + e.target.intrests.value + "]";
                } else {
                  create = false;
                  alert("Interests list contains non valid interests");
                }
              } else {
                create = false;
                alert("Interests list is not valid");
              }

              if (create) {
                fetch("http://localhost:3001/create-User?userName=" + e.target.username.value + "&password=" + rsa.encrypt(e.target.pass.value, keys) + "&email=" + userEmail + "&userType=user&school=" + e.target.school.value + "&age=" + e.target.age.value + "&intrests=" + interests + "&location=" + e.target.location.value, {
                  headers: {
                    "Authorization": rsa.encrypt("414ExploreAdmin!", keys)
                  }
                }).then(response => {
                  return response.json();
                }).then(data => {
                  console.log(data);
                  if (data.status === "fail") {
                    alert(data.msg)
                  } else {
                    setUsername(e.target.username.value);
                    setPassword(e.target.pass.value);
                    setInterests(interests);
                    setSchool(e.target.school.value);
                    setAge(e.target.age.value);
                    setLocation(e.target.location.value);
                    setView("userInfo");
                  }
                });
              }
            }
            else {
              window.alert("School code is not valid. Valid options are MSOE, UWM, MU, and MIAD");
            }
          }
          else{
            window.alert("Age must be number between 18 and 25");
          }
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

  const signInUser =(e)=> {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if(signinTries === 0){
      window.alert("You have reached you sign in attempt limit, please try again later");
      e.target.signinButton.disabled = true;
    }
    fetch("http://localhost:3001/login?email="+ email +"&password="+rsa.encrypt(password, keys), {
          headers: {
              'Authorization':rsa.encrypt("414ExploreAdmin!", keys)
          }}).then(response => {
      return response.json();
    }).then(data => {
      console.log(data);
      if(data.status === "fail"){
        alert(data.msg);
        console.log(signinTries);
        setSigninTries(signinTries-1);
      }
      else{
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
          // setUsername(user.msg.userName);
          // setUserEmail(user.msg.email);
          // setInterests(interests);
          // setSchool(user.msg.school);
          // setAge(user.msg.age);
          // setLocation(user.msg.location);
          // setView("userInfo");
          setView("events");
      });
      }
    });
  }

    // fetch("http://localhost:3001/login?userName=what&password="+rsa.encrypt("huh", keys), {
    //     headers: {
    //         'Authorization':rsa.encrypt("414ExploreAdmin!", keys)
    //     }});
    // fetch("http://localhost:3001/create-User?userName=test&password="+rsa.encrypt("test", keys) + "&email=test@email.com&userType=user", {
    //     headers: {
    //         "Authorization": rsa.encrypt("414ExploreAdmin!", keys)
    //     }
    // })
    // fetch("http://localhost:3001/get-Events", {
    //     headers: {
    //         "Authorization": rsa.encrypt("414ExploreAdmin!", keys)
    //     }
    // })
    // fetch("http://localhost:3001/get-Communities", {
    //     headers: {
    //         "Authorization": rsa.encrypt("414ExploreAdmin!", keys)
    //     }
    // })
    // fetch("http://localhost:3001/get-User?userName=what", {
    //     headers: {
    //         "Authorization": rsa.encrypt("414ExploreAdmin!", keys)
    //     }
    // })
  return (
    <div>
      {(view=="events") && (
          <Events/>
      )}
      <div className="App">
        {view==="first"&&(
          <div className='loginModal'>
            <h1>414Explore</h1>
            <h4>Discover all the Milwaukee has to offer.</h4>
            <button className='topButton' onClick={() => setView("create")}>Create Profile</button>
            <button className='bottomButton' onClick={() => setView("signIn")} >Sign In</button>
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
            <form onSubmit={sendEmail} className='upInput'>
            <label>
              Email:
            </label>
            <input type='email' name='reply_to'/>
            <input id='sendConfirmation' type='submit' value="Send" className='topButton'/>
            </form>
          </div>
        )}
        {view==="confirmation"&&(
          <div className='loginModal'>
            <form onSubmit={confirmCode} className='upInput'>
            <label>
              Confirmation Code:
            </label>
            <input type='number' name='code'/>
            <input id='confirmEmail' type='submit' value="Confirm email" className='topButton'/>
            </form>
        </div>
        )}
        {view==="unPW" &&(
          <div className='loginModal'>

            <form onSubmit={validateInformation} id="unPW">
              <label>
                Intrests:
              </label>
              <p className='instructions'>Enter your interests as a coma seperated list valid intrests are {validInterests.map(item =>{
                return item + " "
              })}</p>
              <input type='text' name='intrests' className='upInput'/>
              <label>
                Age:
              </label>
              <p className='instructions'>Enter your age</p>
              <input type='text' name='age' className='upInput'/>
              <label>
                School:
              </label>
              <p className='instructions'>Enter your Code</p>
              <input type='text' name='school' className='upInput'/>
              <label>
                Location:
              </label>
              <p className='instructions'>Enter your location</p>
              <input type='text' name='location' className='upInput'/>
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
        {(view==="signIn") &&(
          <div className='loginModal'>
            <form onSubmit={signInUser}>
              <label>
                Email:
              </label>
              <input type='email' name='email' className='upInput'/>
              <label>
                Password:
              </label>
              <input type='password' name='password' className='upInput'/>
              <input id='signin' type='submit' value="Sign In" name='signinButton' className='topButton'/>
            </form>
          </div>
        )}

        {(view==="userInfo") &&(
            <div>
              <h4>
                User name: {username}
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
        )}
      </div>
    </div>
    
  );
}
// https://stackoverflow.com/questions/55795125/how-to-send-email-from-my-react-web-application

export default CreateProfile;
