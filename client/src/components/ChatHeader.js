import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChatHeader = ({user, switchTab}) => {
    return (
        <div className="chat-container-header">
            <div className="chat-container-header-account">
              <div className="profile">
                  <div className="img-container">
                      <img src="" alt="profile" />
                  </div>
                  <h3>{user.first_name}</h3>
              </div>
              <button className="log-out-icon">
                <FontAwesomeIcon icon={faSignOutAlt}/>
              </button>
            </div>
            <div className="chat-container-options">
                <button className="option" onClick={()=>switchTab(true)}>Matches</button>
                <button className="option" onClick={()=>switchTab(false)}>Chat</button>
            </div>
        </div>
    );
};

export default ChatHeader;
