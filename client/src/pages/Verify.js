import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import sendHttp from "../utils/sendHttp";

const Verify = () => {

  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      sendHttp('/auth/validate', 'POST', JSON.stringify({ code }))
    }
  });

  return (
    <main className='recovery'>
      <header></header>
      <div>
        <h1>Account verified</h1>
        <button className="primary-button" onClick={()=>navigate('/dashboard')}>Go to dashboard</button>
      </div>
      <footer></footer>
    </main>
  )
};

export default Verify;
