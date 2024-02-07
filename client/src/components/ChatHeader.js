import { faClose, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({user, tab, switchTab}) => {

  const navigate = useNavigate();

  useEffect(() => {
    changeTab(tab)
  }, [])

  const changeTab = (value) => {
    switchTab(value)
    document.querySelector('.chat-container-options').childNodes.forEach((child) => {
      child.classList.add('disabled')
      if (child.innerHTML === 'Matches' && value) {
        child.classList.remove('disabled')
      } else if (child.innerHTML === 'Profile' && !value) {
        child.classList.remove('disabled')
      }
    })
  }

  const closeChat = () => {
    document.querySelector('.chat-container').style.right = '100%'
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
      } else {
        console.log('error')
      }
    }).catch((error) => {
      console.error(error);
    });
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
        <div className="icons">
          <button onClick={signOut}>
            <FontAwesomeIcon icon={faSignOutAlt}/>
          </button>
          <button onClick={closeChat}>
            <FontAwesomeIcon icon={faClose}/>
          </button>
        </div>
      </div>
      <div className="chat-container-options">
        <button className='option' onClick={()=>changeTab(true)}>Matches</button>
        <button className='option' onClick={()=>changeTab(false)}>Profile</button>
      </div>
    </div>
  );
};

export default ChatHeader;
