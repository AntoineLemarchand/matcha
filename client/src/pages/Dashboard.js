import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose, faHeart } from "@fortawesome/free-solid-svg-icons";
import useWebSocket from "react-use-websocket";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    process.env.REACT_APP_WS_URL + '/connection', {
    onOpen: () => console.log("ws connection opened"),
    onClose: () => console.log("ws connection closed"),
    onError: (event) => console.error(event),
    onreceiveMessage: (event) => console.log(event),
  })


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
    sendMessage(JSON.stringify({ action: 'propositions' }));
  }, [navigate]);

  const openChat = () => {
    document.querySelector('.chat-container').style.right = '0%'
  }

  const characters = [
  ];
  const [lastDirection, setLastDirection] = useState();

  const swiped = (direction, nameToDelete) => {
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(lastDirection);
  };

  return (
    <div className="dashboard">
      <ChatContainer user={user} />
      <div className="swipe-container">
        <div className="top-bar">
          <button onClick={openChat}>
            <FontAwesomeIcon icon={faBars}/>
          </button>
        </div>
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
        </div>
        <div className="bottom-bar">
          <button onClick={openChat}>
            <FontAwesomeIcon icon={faClose}/>
          </button>
          <button onClick={openChat}>
            <FontAwesomeIcon icon={faHeart}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
