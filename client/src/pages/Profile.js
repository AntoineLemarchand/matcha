import { useEffect, useState } from "react";
import sendHttp from "../utils/sendHttp";
import { useNavigate, useParams } from "react-router-dom";
import ImagePreview from "../components/ImagePreview";
import Interests from "../components/Interests";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faExclamation, faHeart, faMessage } from "@fortawesome/free-solid-svg-icons";
import sendNotification from "../utils/notifications";

const Profile = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [like, setLike] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    sendHttp(`/user/${id ?? ''}`).then((data) => {
      setUser(data);
      setLike(data.liked);
      setBlocked(data.blocked);
    }).catch(() => {
      navigate("/dashboard");
    })
  }, [id, navigate]);

  const sendAction = (action, event) => {
    event.preventDefault();
    const actionWord = action[0].toUpperCase() + action.slice(1);
    sendHttp(`/user/action`, 'POST', JSON.stringify({
      action,
      user_id: id
    }))
    .then(() => {
      if (action === 'like' || action === 'unlike') setLike(!like);
      if (action === 'block' || action === 'unblock') setBlocked(!blocked);
      sendNotification(`Action performed: ${actionWord}`, 'success')
    })
    .catch(() => sendNotification(`Could not perform: ${actionWord}`, 'error'))
  };

  return user && (
    <div id="profile">
        <div className="infos">
          <h1>{user.first_name} {user.last_name}</h1>
          <p>{user.biography}</p>
          {user.tags &&<Interests tags={user.tags.split('|').filter((tag) => tag !== '')} />}
        </div>
        <div className="galery">
          {user.image_0 && <ImagePreview image={user.image_0} />}
          {user.image_1 && <ImagePreview image={user.image_1} />}
          {user.image_2 && <ImagePreview image={user.image_2} />}
          {user.image_3 && <ImagePreview image={user.image_3} />}
          {user.image_4 && <ImagePreview image={user.image_4} />}
        </div>
        <div className="action">
          { id &&
          <label className="button-checkbox" onClick={(event)=>sendAction(like ? 'unlike' : 'like', event)}
            style={like ? {
              background: 'white',
              color: 'rgb(255, 89, 64)',
            } : {}}
          >
            <input id="LikeCheckbox" type="checkbox" checked={like}/>
            <FontAwesomeIcon icon={faHeart}/>
          </label>
          }
          { id && <button disabled={!like}><FontAwesomeIcon icon={faMessage}/></button>}
          { id &&
          <label className="button-checkbox" onClick={(event)=>sendAction(blocked ? 'unblock' : 'block', event)}
            style={blocked ? {
              background: 'white',
              color: 'rgb(255, 89, 64)',
            } : {}}
          >
            <input id="LikeCheckbox" type="checkbox" checked={blocked}/>
            <FontAwesomeIcon icon={faBan}/>
          </label>
          }
          { id && <button><FontAwesomeIcon onClick={(event)=>sendAction('report', event)} icon={faExclamation}/></button>}
          { !id && <button onClick={()=>navigate('/dashboard/edit')}>edit</button>}
        </div>
    </div>
  );
}

export default Profile;
