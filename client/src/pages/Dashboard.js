import TinderCard from "react-tinder-card";
import { createRef, useEffect, useMemo, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose, faHeart } from "@fortawesome/free-solid-svg-icons";
import useWebSocket from "react-use-websocket";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [propositions, setPropositions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const cardRef = useMemo(() =>
    Array(propositions.length)
      .fill(0)
      .map(() => createRef()),
    [propositions.length]);

  const { sendMessage } = useWebSocket(
    process.env.REACT_APP_WS_URL + '/connection', {
    onError: (event) => console.error(event),
    onMessage: handleReceiveMessage,
  })

  const getImageURL = (imageBuffer) => {
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
        if (propositions.length > currentIdx) return;
        const newPropositions = [...propositions, ...data.data];
        console.log(newPropositions);
        //remove already swiped propositions
        newPropositions.splice(0, currentIdx);
        setPropositions(newPropositions);
        setCurrentIdx(0);
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

  const swipe = async (dir) => {
    cardRef[currentIdx].current.swipe(dir);
  }

  const swiped = (direction) => {
    console.log(direction);
    sendMessage(JSON.stringify({ action: 'swipe', data: { direction, user_id: propositions[currentIdx].id } }))
    if (currentIdx >= propositions.length - 2) {
      sendMessage(JSON.stringify({ action: 'propositions' }))
    }
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
            propositions.map((proposition, index) =>
              <TinderCard
                  ref={cardRef[index]}
                  className="swipe"
                  onSwipe={(dir) => swiped(dir)}
                  preventSwipe={["up", "down"]}
                  key={index}
                >
                  <div className="card" style={{backgroundImage: `url(${getImageURL(proposition.image_0)})`}}>
                    <h3>{getImageURL(proposition.first_name)}</h3>
                    <p className="swipe-info">{proposition.about}</p>
                  </div>
              </TinderCard>
            )
          }
        </div>
        <div className="bottom-bar">
          <button onClick={() => swipe("left")}>
            <FontAwesomeIcon icon={faClose}/>
          </button>
          <button onClick={() => swipe("right")}>
            <FontAwesomeIcon icon={faHeart}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
