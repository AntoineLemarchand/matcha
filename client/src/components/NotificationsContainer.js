import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react"

const NotificationsContainer = ({notifications, clearNotifications, readMessages}) => {

  useEffect(() => {
    if (document.querySelector(".notifications-container").style.left === '0%' && notifications.length > 0) {
      clearNotifications()
    }
  }, [notifications, clearNotifications]);

  const closeNotifications = () => {
    readMessages();
    document.querySelector('.notifications-container').style.left = '100%'
  }

  const timeSince = (date) => {
    date = new Date(date);
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return "Now";
  }

  return (
    <div className="notifications-container">
      <div className="top-bar">
        <button onClick={closeNotifications}>
          <FontAwesomeIcon icon={faTimes}/>
        </button>
      </div>
      <div className="dashboard-content">
        <h1>Notifications</h1>
        {notifications.length === 0 && <div className="notification">No notifications</div>}
        {notifications.map((notification, index) => (
          <div key={index} className={"notification " + notification.type} onClick={notification.action}>
            <p>{notification.message}</p>
            <p>{timeSince(notification.time)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationsContainer;
