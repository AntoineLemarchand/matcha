import { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import useWebSocket from "react-use-websocket";
import sendHttp from "../utils/sendHttp";
import NotificationsContainer from "../components/NotificationsContainer";

const Dashboard = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const { sendMessage } = useWebSocket(
      process.env.REACT_APP_WS_URL + '/connection', {
      onMessage: handleReceiveMessage,
      onClose: () => true,
      shouldReconnect: (closeEvent) => true,
  })

  async function addNotification(data) {
    const previousNotifications = [...notifications];
    const notification = {
      type: 'info',
      time: new Date(),
    };
    var user;
    switch (data.action) {
      case 'chat':
        if (location.pathname !== `/dashboard/chat/${data.from}`
          && data.from !== user.id) {
          user = await sendHttp(`/user/${data.from}`)
          notification.message = `New message from ${user.first_name} ${user.last_name}`;
          notification.action = () => {
            navigate(`/dashboard/chat/${data.from}`);
          }
          setNotifications(prevNotifications => [notification, ...prevNotifications]);
        }
        break;
      case 'like':
        user = await sendHttp(`/user/${data.from}`)
        notification.message = `${user.first_name} ${user.last_name} liked you`;
        notification.action = () => {
          navigate(`/dashboard/profile/${data.from}`);
        }
        previousNotifications.unshift(notification)
        setNotifications(prevNotifications => [notification, ...prevNotifications]);
        break;
      case 'unlike':
        user = await sendHttp(`/user/${data.from}`)
        notification.message = `${user.first_name} ${user.last_name} unliked you`;
        notification.action = () => {
          navigate(`/dashboard/profile/${data.from}`);
        }
        previousNotifications.unshift(notification)
        setNotifications(prevNotifications => [notification, ...prevNotifications]);
        break;
      case 'match':
        user = await sendHttp(`/user/${data.from}`)
        notification.message = `${user.first_name} ${user.last_name} liked you back`;
        notification.action = () => {
          navigate(`/dashboard/profile/${data.from}`);
        }
        previousNotifications.unshift(notification)
        setNotifications(prevNotifications => [notification, ...prevNotifications]);
        break;
      case 'seen':
        user = await sendHttp(`/user/${data.from}`)
        notification.message = `${user.first_name} ${user.last_name} saw your profile`;
        notification.action = () => {
          navigate(`/dashboard/profile/${data.from}`);
        }
        previousNotifications.unshift(notification)
        setNotifications(prevNotifications => [notification, ...prevNotifications]);
        break;
      default:
        break;
    }
  }

  function handleReceiveMessage(event) {
    const data = JSON.parse(event.data);
    setReceivedMessage(data);
    addNotification(data);
  }

  function openMenu() {
    if (user)
      document.querySelector('.menu-container').style.right = '0%'
  }

  function openNotifications() {
    if (user)
      document.querySelector('.notifications-container').style.left = '0%'
  }

  async function initNotifications(data) {
    for (const notification of data) {
      await addNotification(JSON.parse(notification.message));
    }
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
      initNotifications(data.notifications)
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
      { user && <NotificationsContainer
        notifications={notifications}
        clearNotifications={()=>setNotifications([])}
        readMessages={()=>sendMessage(JSON.stringify({ action: 'readNotifications' }))} />}
      <div className="main-container">
        <header className="top-bar">
          <button onClick={openMenu}>
            <FontAwesomeIcon icon={faBars}/>
          </button>
          <button onClick={openNotifications}>
            <FontAwesomeIcon icon={faBell}/>
            {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
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
