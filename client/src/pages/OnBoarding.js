import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import ImageUpload from "../components/ImageUpload";

const OnBoarding = ({header}) => {
  const navigate = useNavigate();
  const [id, setId] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    show_gender: 0,
    gender_identity: "man",
    gender_interest: "woman",
    about: "",
    image_0: "",
    image_1: "",
    image_2: "",
    image_3: "",
    image_4: "",
    matches: JSON.stringify([]),
    initialized: 1,
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/auth/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          navigate("/");
        }
      })
      .then((data) => {
        if (data) {
          console.log(data.user)
          const date = new Date(data.user.date_of_birth);
          const formattedDate = date.toISOString().split('T')[0];
          setFormData((prevState) => ({
            ...prevState,
            ...data.user,
            date_of_birth: formattedDate,
            initialized: 1,
          }));
          setId(data.user.id);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const body = new FormData();
    Object.keys(formData).forEach((key) => {
      body.append(key, formData[key]);
    });

    for (let i = 0; i < 5; i++) {
      const blobUrl = formData[`image_${i}`];
      if (blobUrl && document.getElementById(`image_${i}`).files[0]) {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const file = new File([blob], `image_${i}.jpg`, { type: document.getElementById(`image_${i}`).files[0].type });
        body.append(`uploadedImages`, file);
      }
    }

    const dataFetch = async () => {
      return await fetch(`/api/user/${id}`, {
        method: "PUT",
        credentials: "include",
        body: body,
      });
    };

    const data = await dataFetch();
    if (!data.ok) {
      console.log("error");
    } else {
      if (header) {
        console.log("ok");
        navigate("/dashboard");
      }
    }
  };

  const handleChange = async (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      let image = ""
      if (file) {
        image = URL.createObjectURL(file);
      };
      const name = e.target.name;
      setFormData((prevState) => ({
        ...prevState,
        [name]: image,
      }));
    } else {
      const value =
        e.target.type === "checkbox" ? (e.target.checked ? 1 : 0) : e.target.value;
      const name = e.target.name;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <>
      {
        header !== 0 && 
          <Nav minimal={true} setShowModal={() => {}} showModal={false} />
      }

      <div className="onboarding">
        {header !== 0 && <h2>Create account</h2>}
        <form onSubmit={handleSubmit}>
          <section>
            <div>
              <label htmlFor="first_name">First name</label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                placeholder="First name"
                required={true}
                value={formData.first_name ?? ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="first_name">Last name</label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                placeholder="Last name"
                required={true}
                value={formData.last_name ?? ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Birthday</label>
              <input
                id="date_of_birth"
                type="date"
                name="date_of_birth"
                placeholder="MM"
                required={true}
                value={formData.date_of_birth ?? ''}
                onChange={handleChange}
                min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label>Gender</label>
              <div className="multiple-input-container">
                <input
                  id="man-gender-identity"
                  type="radio"
                  name="gender_identity"
                  value="man"
                  onChange={handleChange}
                  checked={formData.gender_identity === "man"}
                />
                <label htmlFor="man-gender-identity">Man</label>
                <input
                  id="woman-gender-identity"
                  type="radio"
                  name="gender_identity"
                  value="woman"
                  onChange={handleChange}
                  checked={formData.gender_identity === "woman"}
                />
                <label htmlFor="woman-gender-identity">Woman</label>
                <input
                  id="more-gender-identity"
                  type="radio"
                  name="gender_identity"
                  value="more"
                  onChange={handleChange}
                  checked={formData.gender_identity === "more"}
                />
                <label htmlFor="more-gender-identity">More</label>
              </div>
            </div>

            <div>
              <label htmlFor="show-gender">
                Show gender on my profile
              </label>
              <div className="multiple-input-container">
                <input
                  id="show-gender"
                  type="checkbox"
                  name="show_gender"
                  onChange={handleChange}
                  checked={formData.show_gender}
                />
              </div>
            </div>

            <div>
              <label>Show me</label>
              <div className="multiple-input-container">
                <input
                  id="man-gender-interest"
                  type="radio"
                  name="gender_interest"
                  value="man"
                  onChange={handleChange}
                  checked={formData.gender_interest === "man"}
                />
                <label htmlFor="man-gender-interest">Man</label>
                <input
                  id="woman-gender-interest"
                  type="radio"
                  name="gender_interest"
                  value="woman"
                  onChange={handleChange}
                  checked={formData.gender_interest === "woman"}
                />
                <label htmlFor="woman-gender-interest">Woman</label>
                <input
                  id="everyone-gender-interest"
                  type="radio"
                  name="gender_interest"
                  value="everyone"
                  onChange={handleChange}
                  checked={
                    formData.gender_interest === "everyone"
                  }
                />
                <label htmlFor="everyone-gender-interest">
                  Everyone
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="about">About me</label>
              <textarea
                id="about"
                name="about"
                placeholder="I like long walks..."
                required={true}
                value={formData.about ?? ''}
                onChange={handleChange}
              />
            </div>
          </section>

          <section>
            {
              [...Array(5).keys()].map((index) => {
                return <ImageUpload
                  name={`image_${index}`}
                  key={index}
                  imageBuffer={formData[`image_${index}`]}
                  onFileChange={handleChange}
                  />
              })
            }
          </section>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
};

export default OnBoarding;
