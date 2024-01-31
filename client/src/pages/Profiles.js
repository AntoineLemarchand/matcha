import { useEffect, useState } from "react";
import sendHttp from "../utils/sendHttp";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {

  const navigate = useNavigate();

  const [propositions, setPropositions] = useState([]);

  const getImageURL = (imageBuffer) => {
    if (imageBuffer.startsWith('/')) {
      return `${process.env.REACT_APP_API_URL}${imageBuffer}`;
    } else {
      return imageBuffer.toString("base64");
    }
  }

  useEffect(() => {
    sendHttp("/user/propositions", "GET").then((data) => {
      setPropositions(data);
    })
    .catch((error) => {
      console.log(error);
      if (error === 400)
          navigate("/onboarding")
      // navigate("/");
      console.error(error);
    });
  }, [navigate]);

  return (
    <table>
      <tbody>
      {
        propositions.map((proposition, index) =>
          <tr key={index}>
              <td>
                <img src={getImageURL(proposition.image_0 ?? '')} alt={proposition.name} />
              </td>
              <td>
                {proposition.first_name} {proposition.last_name}
              </td>
              <td>
                <button><FontAwesomeIcon icon={faLink} onClick={()=>navigate(`profile/${proposition.id}`)}/></button>
              </td>
          </tr>
        )
      }
      </tbody>
    </table>
  )
}

export default Profile;
