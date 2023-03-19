import React, { useState } from "react";

const AuthModal = ({ setShowModal, isSignUp }) => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [error, setError] = useState(null);

    console.log(email, password, confirmPassword);

    const handleClick = () => {
        setShowModal(false);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            if (isSignUp && password !== confirmPassword) {
                setError("Passwords do not match");
            }
            console.log("make a post request to our database");
        } catch (error) {
            console.log(error);
        }
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
                <p>{error}</p>
            </form>
            <hr />
            <h2>Get the app!</h2>
        </div>
    );
};
export default AuthModal;
