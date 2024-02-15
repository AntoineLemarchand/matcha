import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import colorLogo from "../images/color-logo.png";

const Recovery = () => {

  const [email, setEmail] = useState("");
  const [info, setInfo] = useState(null);
  const [pChangeInfo, setPChangeInfo] = useState(null);
  const { code } = useParams();
  const navigate = useNavigate();

  const sendRecoveryEmail = (event) => {
    event.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/auth/recovery`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }).then((response) => {
      if (response.ok) {
        setInfo("Recovery email sent");
      } else {
        setInfo("Invalid email");
      }
    }).catch((error) => {
      console.error('There was an error!', error);
    });
  };

  const validateRecoveryCode = () => {
    fetch(`${process.env.REACT_APP_API_URL}/auth/validate-recovery-code`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    }).then((response) => {
      if (!response.ok) {
        setInfo("Invalid recovery code");
      }
    }).catch((error) => {
      console.error('There was an error!', error);
    });
  }

  const handlePasswordChange = (event) => {
    event.preventDefault();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (password !== confirmPassword) {
      setPChangeInfo("Passwords do not match");
      return;
    }
    fetch(`${process.env.REACT_APP_API_URL}/auth/password-change`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, password }),
    }).then((response) => {
      if (response.ok) {
        setInfo("Password changed");
      } else {
        return response.json();
      }
    }).then((data) => setPChangeInfo(data.message ?? ''))
      .catch((error) => {
      console.error('There was an error!', error);
    });
  }

  if (!info && !code) {
    return (
      <div className='recovery'>
        <img src={colorLogo} alt="logo" style={{maxWidth: "70%"}}/>
        <h1>Password Recovery</h1>
        <form onSubmit={sendRecoveryEmail}>
          <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required={true}
          />
          <button className="primary-button">Submit</button>
        </form>
      </div>)
    }
  else if (info) {
    return (
      <div className='recovery'>
      <img src={colorLogo} alt="logo" style={{maxWidth: "70%"}}/>
      <h1>Password Recovery</h1>
      <p>{info}</p>
      <button onClick={()=>navigate('/')} className="primary-button">Return to login</button>
      </div>
    )
  } else {
    validateRecoveryCode();
    return (
    <div className='recovery'>
      <form onSubmit={handlePasswordChange}>
        <img src={colorLogo} alt="logo" style={{maxWidth: "70%"}}/>
        <h1>Password Recovery</h1>
        <input type="password" id="password" name="password" placeholder="New Password" required={true}/>
        <input type="password" id="confirmPassword" name="confirmPasswordpassword" placeholder="Confirm New Password" required={true}/>
        <button className="primary-button">Change password</button>
        <p>{pChangeInfo}</p>
      </form>
    </div>
    )
  }
};

export default Recovery;
