// create a toast notification
const sendNotification = async (message, type, onClick) => {
  //all other notifications up 100%;
  const notifications = document.querySelectorAll('.notification');
  notifications.forEach((notification) => {
    notification.style.transform = 'translateY(-100%)';
  });
  const notification = document.createElement('div');
  notification.onclick = onClick;
  notification.classList.add('notification');
  notification.classList.add(type);
  notification.innerText = message;
  document.body.appendChild(notification);
  // lower and remove the notification after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateY(100%)';
    setTimeout(() => {
      notification.remove();
    }, 1000);
  }, 3000);
}

export default sendNotification;
