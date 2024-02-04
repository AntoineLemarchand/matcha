import Nav from "../components/Nav";
import AuthModal from "../components/AuthModal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true);
    const authToken = false;
    const navigate = useNavigate();

    const handleClick = () => {
        setShowModal(true);
        setIsSignUp(true);
    };

    useEffect(() => {
      fetch(`${process.env.REACT_APP_API_URL}/auth/verify`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
      })
      .then((response) => {
          if (response.ok) {
            return response.json();
          }
      })
      .then((data) => {
          if (data) {
            console.log(data);
            navigate("/dashboard", { user_id: data.user_id })
          }
      })
      .catch((error) => {
          console.error(error);
      });
    }, [navigate]);

    return (
        <div className="overlay">
            <Nav
                minimal={false}
                //authToken={authToken}
                setShowModal={setShowModal}
                showModal={showModal}
                setIsSignUp={setIsSignUp}
            />
            <div className="home">
                <h1 className="primary-title">Meeting table®</h1>
                <button className="primary-button" onClick={handleClick}>
                    {authToken ? "Sign out" : "Create Account"}
                </button>
                {showModal && (
                    <AuthModal
                        setShowModal={setShowModal}
                        isSignUp={isSignUp}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
