import { useEffect, useState } from "react";
import sendHttp from "../utils/sendHttp";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import ImagePreview from "../components/ImagePreview";
import Interests from "../components/Interests";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faExclamation, faHeart, faMessage, faTimes } from "@fortawesome/free-solid-svg-icons";
import sendNotification from "../utils/notifications";

const Profile = () => {

  const [sendMessage, receivedMessage, currentUser] = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [like, setLike] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [likeBack, setLikeBack] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    sendHttp(`/user/${id ?? ''}`).then((data) => {
      setUser(data);
      setLike(data.liked);
      setLikeBack(data.like_back);
      setBlocked(data.blocked ? data.blocked[1] : false);
      setReported(data.reported ? data.reported[1] : false);
      if (!data.liked)
        sendMessage(JSON.stringify({action: 'seen', id}));
      if (currentUser && currentUser.image_0)
        setHasImage(currentUser.image_0 !== 'null');
    }).catch((error) => {
      navigate("/dashboard");
    })
  }, [id, navigate, sendMessage, currentUser]);

  useEffect(() => {
    if (receivedMessage
      && (receivedMessage.action === 'like'
        || receivedMessage.action === 'match'
        || receivedMessage.action === 'unlike')
      && receivedMessage.from === parseInt(id)) {
      switch (receivedMessage.action) {
        case 'like':
          setLikeBack(true);
          break;
        case 'match':
          setLike(true);
          setLikeBack(true);
        break;
        case 'unlike':
          setLikeBack(false);
          break;
        default: break;
      }
    }
  }, [receivedMessage, id]);


  const sendAction = (action, event) => {
    event.preventDefault();
    if (action === 'report' && reported) return sendNotification('Already reported', 'error');
    sendMessage(JSON.stringify({action, id}));
    if (action === 'like' || action === 'unlike') setLike(!like);
    if (action === 'block' || action === 'unblock') setBlocked(!blocked);
    if (action === 'report') setReported(true);
  };


  return user && (
    <div id="profile">
      <div className="content">
        <div className="infos">
          <h1>
            {user.first_name} {user.last_name}: {Math.round(user.fame * 100) / 100}
            &nbsp;{user.verified ? <FontAwesomeIcon icon={faCheck}/> : <FontAwesomeIcon icon={faTimes}/>}
          </h1>
          <p>{user.biography}</p>
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
          {user.tags &&<Interests tags={user.tags.split('|').filter((tag) => tag !== '')} />}
        </div>
        <div className="galery">
          {user.image_0 && <ImagePreview image={user.image_0} />}
          {user.image_1 && <ImagePreview image={user.image_1} />}
          {user.image_2 && <ImagePreview image={user.image_2} />}
          {user.image_3 && <ImagePreview image={user.image_3} />}
          {user.image_4 && <ImagePreview image={user.image_4} />}
        </div>
      </div>
      <div className="action">
        { id && hasImage &&
          <label className="button-checkbox" onClick={(event)=>sendAction(like ? 'unlike' : 'like', event)}
            style={like ? {
              background: 'white',
              color: 'rgb(255, 89, 64)',
            } : {}}
          >
            <input id="LikeCheckbox" type="checkbox" defaultChecked={like}/>
            <FontAwesomeIcon icon={faHeart}/>
          </label>
        }
        { id && hasImage && <button disabled={!(like && likeBack)} onClick={()=>navigate(`/dashboard/chat/${id}`)}><FontAwesomeIcon icon={faMessage}/></button>}
        { id &&
          <label className="button-checkbox" onClick={(event)=>sendAction(blocked ? 'unblock' : 'block', event)}
            style={blocked ? {
              background: 'white',
              color: 'rgb(255, 89, 64)',
            } : {}}
          >
            <input id="LikeCheckbox" type="checkbox" defaultChecked={blocked}/>
            <FontAwesomeIcon icon={faBan}/>
          </label>
        }
        { id && <button disabled={reported} onClick={(event)=>sendAction('report', event)}><FontAwesomeIcon icon={faExclamation}/></button>}
        { !id && <button onClick={()=>navigate('/dashboard/edit')}>edit</button>}
      </div>
    </div>
  );
}

export default Profile;
