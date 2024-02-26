import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import sendHttp from "../utils/sendHttp";
import sendNotification from "../utils/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import ImagePreview from "../components/ImagePreview";

const Chat = () => {
  const [ sendMessage, receivedMessage ] = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([])

  const handleOnInput = (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
      if (!message) return
      handleOnSend();
      return
    }
    if (e.key === "Backspace") return setMessage(message.slice(0, -1));
    else if (e.key === "Control" || e.key === "Shift" || e.key === "Alt" || e.key === "Tab") return;
    if (message.length > 100) return sendNotification('Message too long', 'error')
    setMessage(message + e.key);
  }

  const handleOnSend = () => {
    if (!message) return
    sendMessage(JSON.stringify({action: "chat", to: id, message}));
    setMessage('');
  }

  useEffect(() => {
    if (!id) return navigate("/dashboard");
    sendHttp(`/user/${id}`).then((data) => {
      if (!data.liked || !data.like_back) return navigate("/dashboard");
      setUser(data);
    }).catch(() => {
      navigate("/dashboard");
    })
    sendHttp(`/user/messages/${id}`).then((data) => {
      setMessages(data);
    }).catch(() => {
      sendNotification('Could not fetch messages', 'error');
    });
  }, [id, navigate]);

  useEffect(() => {
    if (!receivedMessage) return;
    const currentId = parseInt(id);
    if (receivedMessage.action === 'unlike' && receivedMessage.from === currentId) navigate('/dashboard');
    if (receivedMessage.action !== 'chat' || (receivedMessage.from !== currentId && receivedMessage.to !== currentId)) return;
    setMessages([...messages, {from: receivedMessage.from, to: receivedMessage.to, message: receivedMessage.message}]);
    // eslint-disable-next-line
  }, [receivedMessage, id, navigate])

  useEffect(() => {
    const chat = document.querySelector('.body');
    chat.scrollTop = chat.scrollHeight;
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="header">
        {user.image_0 && <ImagePreview image={user.image_0} className={user.online ? 'online' : 'offline'}/>}
        <p>{user.first_name} {user.last_name}</p>
      {user.online ? (
        <p>Online</p>
      ) : (
        <p>(Last seen: {
          new Date(user.last_seen).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
        })</p>
      )}
      </div>
      <div className="body">
      {
        messages.map((message, index) => (
        <div key={index} className={message.from === parseInt(id) ? 'message received' : 'message sent'}>
          <p>{message.message}</p>
        </div>
      ))}
      </div>
      <div className="sendInput">
        <input type='text' onKeyDown={handleOnInput} defaultValue={message}/>
        <button onClick={handleOnSend}><FontAwesomeIcon icon={faPaperPlane}/></button>
      </div>
    </div>
  )
}

export default Chat;
