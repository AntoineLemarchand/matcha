import { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
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
        }
        break;
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

  const signOut = () => {
    fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      if (response.status === 200) {
        navigate("/");
      } else {}
    }).catch((error) => {
      console.error(error);
    });
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
        <header className="top-bar">
          <button onClick={openMenu}>
            <FontAwesomeIcon icon={faBars}/>
          </button>
          <button onClick={signOut}>
            <FontAwesomeIcon icon={faSignOutAlt}/>
          </button>
        </header>
        <main className="dashboard-content">
          <Outlet context={[sendMessage, receivedMessage, user]}/>
        </main>
        <div className="card-container">
        </div>
      </div>
      <footer></footer>
    </div>
  );
};

export default Dashboard;
