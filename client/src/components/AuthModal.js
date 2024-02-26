import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthModal = ({ setShowModal, isSignUp }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = () => {
    setShowModal(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
    }
    fetch(`${process.env.REACT_APP_API_URL}/auth/${isSignUp ? "signup" : "login"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    .then((response) => {
      if (response.status === 200) {
        navigate("/dashboard");
      };
      return response.json()
    })
    .then((data) => {
      if (data.message) {
        setError(data.message);
      } else {
        setShowModal(false);
      }
    })
    .catch((error) => {
      setError(error.message);
    });
  };

  return (
    <div className="auth-modal">
      <div className="close-icon" onClick={handleClick}>
        ✕
      </div>
      <h2>{isSignUp ? "Create account" : "Get Started"}</h2>
      <p>
        By clicking Log in, you agree to our Terms. Learn how we process
        your data in our Privacy Policy and Cookie Policy.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp && (
          <input
            type="password"
            id="password-check"
            name="password-check"
            placeholder="Confirm password"
            required={true}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <input
          className="secondary-button"
          type="submit"
          value="Submit"
        />
        {!isSignUp && <button className="secondary-button" onClick={()=>navigate('/recovery')}>Forgot password</button>}
        <p>{error}</p>
      </form>
      <hr />
      <h2>Get the app!</h2>
    </div>
  );
};
export default AuthModal;
