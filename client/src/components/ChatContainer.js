import ImagePreview from "./ImagePreview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faClose } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ChatContainer = ({user}) => {

  const navigate = useNavigate();
  
  const closeMenu = () => {
    document.querySelector('.menu-container').style.right = '100%'
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
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  const goTo = (path) => {
    navigate(path);
    closeMenu();
  }

  return (
    <div className="menu-container">
      <div className="menu-header">
        <div onClick={()=>goTo('profile')}>
          <ImagePreview image={user.image_0} />
          {user.first_name}
        </div>
        <div className="icons">
          <button onClick={signOut}>
            <FontAwesomeIcon icon={faSignOutAlt}/>
          </button>
          <button onClick={closeMenu}>
            <FontAwesomeIcon icon={faClose}/>
          </button>
        </div>
      </div>
      <ul>
        <li onClick={()=>goTo('')}>Meet</li>
        <li onClick={()=>goTo('likes')}>Likes</li>
        <li onClick={()=>goTo('history')}>History</li>
      </ul>
    </div>
  );
};

export default ChatContainer;
