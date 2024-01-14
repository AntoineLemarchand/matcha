import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";

const OnBoarding = () => {
    const navigate = useNavigate();
    const [id, setId] = useState(0);
    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        date_of_birth: "",
        show_gender: false,
        gender_identity: "man",
        gender_interest: "woman",
        about: "",
        image_url: "",
        matches: JSON.stringify([]),
        initialized: true,
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
            setFormData((prevState) => ({
              ...prevState,
              email: data.user.email,
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
        const dataFetch = async () => {
            return await fetch(`/api/user/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });
        };
        const data = await dataFetch();
        if (!data.ok) {
            console.log("error");
        } else {
            navigate("/dashboard");
        }
    };
    const handleChange = (e) => {
        const value =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        const name = e.target.name;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    
    return (
        <>
            <Nav minimal={true} setShowModal={() => {}} showModal={false} />

            <div className="onboarding">
                <h2>Create account</h2>
                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="first_name">First name</label>
                        <input
                            id="first_name"
                            type="text"
                            name="first_name"
                            placeholder="First name"
                            required={true}
                            value={formData.first_name}
                            onChange={handleChange}
                        />

                        <label htmlFor="first_name">Last name</label>
                        <input
                            id="last_name"
                            type="text"
                            name="last_name"
                            placeholder="Last name"
                            required={true}
                            value={formData.last_name}
                            onChange={handleChange}
                        />

                        <label>Birthday</label>
                        <input
                            id="date_of_birth"
                            type="date"
                            name="date_of_birth"
                            placeholder="MM"
                            required={true}
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
                            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        />

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

                        <label htmlFor="about">About me</label>
                        <input
                            id="about"
                            type="text"
                            name="about"
                            placeholder="I like long walks..."
                            required={true}
                            value={formData.about}
                            onChange={handleChange}
                        />
                        <input type="submit" value="Submit" />
                    </section>

                    <section>
                        <label htmlFor="profile-picture">Profile picture</label>
                        <input
                            type="text"
                            name="image_url"
                            id="image_url"
                            onChange={handleChange}
                            required={true}
                        />
                        <div className="profile-picture-container">
                            <img src={formData.url} alt="profile pic preview" />
                        </div>
                    </section>
                </form>
            </div>
        </>
    );
};

export default OnBoarding;
