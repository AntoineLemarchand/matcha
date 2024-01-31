import { useEffect, useState } from "react";
import sendHttp from "../utils/sendHttp";
import { useNavigate, useParams } from "react-router-dom";
import ImagePreview from "../components/ImagePreview";
import Interests from "../components/Interests";

const Profile = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    sendHttp(`/user/${id ?? ''}`).then((data) => {
      setUser(data);
    }).catch((error) => {
      navigate("/dashboard");
    })
  }, []);

  return user && (
    <div id="profile">
        <h1>{user.first_name} {user.last_name}</h1>
        <ImagePreview image={user.image_0} />
        <p>{user.about}</p>
        <Interests tags={['salsa', 'rock', 'bites']}/>
        <ImagePreview image={user.image_1} />
        <ImagePreview image={user.image_2} />
        <ImagePreview image={user.image_3} />
        <ImagePreview image={user.image_4} />
        <div className="action">
          { id && <button>Like</button>}
          { id && <button>Message</button>}
          { id && <button>Block</button>}
          { id && <button>report</button>}
          { !id && <button onClick={()=>navigate('/dashboard/edit')}>edit</button>}
        </div>
    </div>
  );
}

export default Profile;
