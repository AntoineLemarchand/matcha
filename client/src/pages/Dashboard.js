import { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import useWebSocket from "react-use-websocket";
import sendHttp from "../utils/sendHttp";
import sendNotification from "../utils/notifications";

const Dashboard = () => {

  const location = useLocation();
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
    switch (data.action) {
      case 'chat':
        if (location.pathname !== `/dashboard/chat/${data.from}`
          && data.from !== user.id) {
          sendHttp(`/user/${data.from}`).then((user) => {
            sendNotification(`New message from ${user.first_name} ${user.last_name}`, 'info', () => {
              navigate(`/dashboard/chat/${data.from}`);
            });
          });
          break;
        }
      case 'like':
        sendHttp(`/user/${data.from}`).then((user) => {
          sendNotification(`${user.first_name} ${user.last_name} liked you`, 'info', () => {
            navigate(`/dashboard/profile/${data.from}`);
          });
        });
        break;
      case 'unlike':
        sendHttp(`/user/${data.from}`).then((user) => {
          sendNotification(`${user.first_name} ${user.last_name} unliked you`, 'info', () => {
            navigate(`/dashboard/profile/${data.from}`);
          });
        });
        break;
      case 'match':
        sendHttp(`/user/${data.from}`).then((user) => {
          sendNotification(`${user.first_name} ${user.last_name} liked you back`, 'info', () => {
            navigate(`/dashboard/profile/${data.from}`);
          });
        });
        break;
      case 'seen':
        sendHttp(`/user/${data.from}`).then((user) => {
          sendNotification(`${user.first_name} ${user.last_name} saw your profile`, 'info', () => {
            navigate(`/dashboard/profile/${data.from}`);
          });
        });
        break;
      default:
        break;
    }
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
          <Outlet context={[sendMessage, receivedMessage, user]}/>
        </div>
        <div className="card-container">
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
