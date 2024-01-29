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
  const [propositions, setPropositions] = useState([]);
  const [currentProposition, setCurrentProposition] = useState(null);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    process.env.REACT_APP_WS_URL + '/connection', {
    onOpen: () => console.log("ws connection opened"),
    onClose: () => console.log("ws connection closed"),
    onError: (event) => console.error(event),
    onMessage: handleReceiveMessage,
  })

  const getImageURL = (imageBuffer) => {
    // if image buffer is a relative path render from static backend
    if (imageBuffer.startsWith('/')) {
      return `${process.env.REACT_APP_API_URL}${imageBuffer}`;
    } else {
      return imageBuffer.toString("base64");
    }
  }

  function handleReceiveMessage(event) {
    const data = JSON.parse(event.data);
    switch (data.action) {
      case 'propositions':
        loadPropositions(data.data)
        break;
      default:
        console.log(data);
        break;
    }
  }


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
    sendMessage(JSON.stringify({ action: 'propositions' }))
  }, [navigate]);

  const openChat = () => {
    document.querySelector('.chat-container').style.right = '0%'
  }

  const [lastDirection, setLastDirection] = useState();

  const loadPropositions = (newPropositions) => {
    if (newPropositions.length === 0) return;
    const propositionsCopy = [...newPropositions];
    const newProposition = propositionsCopy.pop();
    fetch(`${process.env.REACT_APP_API_URL}/user/${newProposition[0]}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      if (response.status === 200) {
        const currentUser = response.json().then((jsonResponse) =>{
          setCurrentProposition(jsonResponse);
          setPropositions(newPropositions);
          console.log(newPropositions);
        });
      } else {
        navigate("/")
      }
    })
  }

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
          {
            currentProposition &&
            <TinderCard className="swipe">
                <div className="card" style={{backgroundImage: `url(${getImageURL(currentProposition.image_0)})`}}>
                  <h3>{getImageURL(currentProposition.first_name)}</h3>
                  <p className="swipe-info">{currentProposition.about}</p>
                </div>
            </TinderCard>
          }
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
