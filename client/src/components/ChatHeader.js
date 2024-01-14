import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";

const ChatHeader = ({user, tab, switchTab}) => {

  useEffect(() => {
    changeTab(tab)
  }, [])

  const changeTab = (value) => {
    switchTab(value)
    document.querySelector('.chat-container-options').childNodes.forEach((child) => {
      child.classList.add('disabled')
      if (child.innerHTML === 'Matches' && value) {
        child.classList.remove('disabled')
      } else if (child.innerHTML === 'Chat' && !value) {
        child.classList.remove('disabled')
      }
    })
  }

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
        <button className='option' onClick={()=>changeTab(true)}>Matches</button>
        <button className='option' onClick={()=>changeTab(false)}>Chat</button>
      </div>
    </div>
  );
};

export default ChatHeader;
