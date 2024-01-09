import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChatHeader = ({user}) => {
    return (
        <div className="chat-container-header">
            <div className="profile">
                <div className="img-container">
                    <img src="" alt="profile" />
                </div>
                <h3>{user.first_name}</h3>
            </div>
            <button>
              <FontAwesomeIcon icon={faSignOutAlt}/>
            </button>
        </div>
    );
};

export default ChatHeader;
