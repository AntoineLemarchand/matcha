import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import sendHttp from "../utils/sendHttp";
import sendNotification from "../utils/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import ImagePreview from "../components/ImagePreview";

const Chat = ({sendWs}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [message, setMessage] = useState('');

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
    console.log('sending message: ', message)
    // if (!message) return
    // sendWs(JSON.stringify({action: "message", to: id, message}));
    setMessage('');
  }

  useEffect(() => {
    if (!id) return navigate("/dashboard");
    sendHttp(`/user/${id}`).then((data) => {
      setUser(data);
    }).catch(() => {
      navigate("/dashboard");
    })
  }, [id, navigate]);

  return (
    <div className="chat-container">
      <div className="header">
        {user.image_0 && <ImagePreview image={user.image_0} className={user.online ? 'online' : 'offline'}/>}
        <p>{user.first_name} {user.last_name}</p>
      </div>
      <div className="body">
      </div>
      <div className="sendInput">
        <input type='text' onKeyDown={handleOnInput} defaultValue={message}/>
        <button onClick={handleOnSend}><FontAwesomeIcon icon={faPaperPlane}/></button>
      </div>
    </div>
  )
}

export default Chat;
