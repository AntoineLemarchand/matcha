import { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import { useNavigate, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import useWebSocket from "react-use-websocket";
import sendHttp from "../utils/sendHttp";

const Dashboard = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);

  const { sendMessage } = useWebSocket(
    process.env.REACT_APP_WS_URL + '/connection', {
    onError: (event) => console.error(event),
    onMessage: handleReceiveMessage,
  })

  function handleReceiveMessage(event) {
    const data = JSON.parse(event.data);
    setReceivedMessage(data);
  }

  function openMenu() {
    if (user)
      document.querySelector('.menu-container').style.right = '0%'
  }

  useEffect(() => {
    sendHttp("/user", "GET").then((data) => {
      setUser(data);
    })
    .catch((error) => {
      if (error === 400)
          navigate("/onboarding")
      navigate("/");
    });
  }, [navigate]);

  return (
    <div className="dashboard">
      { user && <ChatContainer user={user} />}
      <div className="main-container">
        <div className="top-bar">
          <button onClick={openMenu}>
            <FontAwesomeIcon icon={faBars}/>
          </button>
        </div>
        <div className="dashboard-content">
          <Outlet context={[sendMessage, receivedMessage]}/>
        </div>
        <div className="card-container">
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
