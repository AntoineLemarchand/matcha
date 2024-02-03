import { useEffect, useState } from "react";
import sendHttp from "../utils/sendHttp";
import { useNavigate, useParams } from "react-router-dom";
import ImagePreview from "../components/ImagePreview";
import Interests from "../components/Interests";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faExclamation, faHeart, faMessage, faStop } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [like, setLike] = useState(true);

  useEffect(() => {
    sendHttp(`/user/${id ?? ''}`).then((data) => {
      setUser(data);
    }).catch(() => {
      navigate("/dashboard");
    })
  }, [id, navigate]);

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
          { id && <div className="button-checkbox">
            <input id="LikeCheckbox" type="checkbox" checked={like} onChange={() => setLike(!like)}/>
            <label htmlFor="LikeCheckbox"><FontAwesomeIcon icon={faHeart}/></label>
          </div>
          }
          { id && <button disabled={like}><FontAwesomeIcon icon={faMessage}/></button>}
          { id && <button><FontAwesomeIcon icon={faBan}/></button>}
          { id && <button><FontAwesomeIcon icon={faExclamation}/></button>}
          { !id && <button onClick={()=>navigate('/dashboard/edit')}>edit</button>}
        </div>
    </div>
  );
}

export default Profile;
