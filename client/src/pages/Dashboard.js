import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    useEffect(() => {
      fetch(`${process.env.REACT_APP_API_URL}/auth/verify`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
      })
      .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            navigate("/")
          }
      })
      .then((data) => {
        if (!data.user.initialized) {
          navigate("/onboarding");
        }
        setUser(data.user);
      })
      .catch((error) => {
          console.error(error);
      });
    }, [navigate]);

    const characters = [
        {
            name: "Richard Hendricks",
            url: "./img/richard.jpg",
        },
        {
            name: "Erlich Bachman",
            url: "./img/erlich.jpg",
        },
        {
            name: "Monica Hall",
            url: "./img/monica.jpg",
        },
        {
            name: "Jared Dunn",
            url: "./img/jared.jpg",
        },
        {
            name: "Dinesh Chugtai",
            url: "./img/dinesh.jpg",
        },
    ];
    const [lastDirection, setLastDirection] = useState();

    const swiped = (direction, nameToDelete) => {
        setLastDirection(direction);
    };

    const outOfFrame = (name) => {
    };
    return (
        <div className="dashboard">
            <ChatContainer user={user} />
            <div className="swipe-container">
                <div className="card-container">
                    {characters.map((character) => (
                        <TinderCard
                            className="swipe"
                            key={character.name}
                            onSwipe={(dir) => swiped(dir, character.name)}
                            onCardLeftScreen={() => outOfFrame(character.name)}
                        >
                            <div
                                style={{
                                    backgroundImage:
                                        "url(" + character.url + ")",
                                }}
                                className="card"
                            >
                                <h3>{character.name}</h3>
                            </div>
                        </TinderCard>
                    ))}
                    <div className="swipe-info">
                        {lastDirection ? (
                            <p>You swiped {lastDirection}</p>
                        ) : (
                            <p />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
