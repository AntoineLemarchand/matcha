import { useState } from "react";
import Nav from "../components/Nav";

const OnBoarding = () => {
    const handleSubmit = () => {
        console.log("submitted");
    };
    const handleChange = () => {
        console.log("changed");
    };

    return (
        <>
            <Nav minimal={true} setShowModal={() => {}} showModal={false} />
            <div className="onboarding">
                <h2>Create account</h2>
                <form onSubmit={handleSubmit}>
                    <section>
                        <la htmlFor="first_name">First name</la>
                        <input
                            id="first_name"
                            type="text"
                            name="first_name"
                            placeholder="First name"
                            required={true}
                            value={""}
                            onChange={handleChange}
                        />

                        <la>Birthday</la>
                        <div className="multiple-input-container">
                            <input
                                id="dob_day"
                                type="number"
                                name="dob_day"
                                placeholder="DD"
                                required={true}
                                value={""}
                                onChange={handleChange}
                            />
                            <input
                                id="dob_month"
                                type="number"
                                name="dob_month"
                                placeholder="MM"
                                required={true}
                                value={""}
                                onChange={handleChange}
                            />
                            <input
                                id="dob_year"
                                type="number"
                                name="dob_year"
                                placeholder="YYYY"
                                required={true}
                                value={""}
                                onChange={handleChange}
                            />
                        </div>

                        <la>Gender</la>
                        <div className="multiple-input-container">
                            <input
                                id="man-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="man"
                                onChange={handleChange}
                                Checked={false}
                            />
                            <la htmlFor="man-gender-identity">Man</la>
                            <input
                                id="woman-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="woman"
                                onChange={handleChange}
                                Checked={false}
                            />
                            <la htmlFor="woman-gender-identity">Woman</la>
                            <input
                                id="more-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="more"
                                onChange={handleChange}
                                Checked={false}
                            />
                            <la htmlFor="more-gender-identity">More</la>
                        </div>
                        <la htmlFor="show-gender">Show gender on my profile</la>
                        <input
                            id="show-gender"
                            type="checkbox"
                            name="show_gender"
                            onChange={handleChange}
                            Checked={false}
                        />

                        <la>Show me</la>
                        <div className="multiple-input-container">
                            <input
                                id="man-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="man"
                                onChange={handleChange}
                                Checked={false}
                            />
                            <la htmlFor="man-gender-interest">Man</la>
                            <input
                                id="woman-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="woman"
                                onChange={handleChange}
                                Checked={false}
                            />
                            <la htmlFor="woman-gender-interest">Woman</la>
                            <input
                                id="everyone-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="everyone"
                                onChange={handleChange}
                                Checked={false}
                            />
                            <la htmlFor="more-gender-interest">Everyone</la>
                        </div>

                        <la htmlFor="about">About me</la>
                        <input
                            id="about"
                            type="text"
                            name="about"
                            placeholder="I like wong walks..."
                            required={true}
                            value={""}
                            onChange={handleChange}
                        />
                        <input type="submit" value="Submit" />
                    </section>

                    <section>
                        <la htmlFor="profile-picture">Profile picture</la>
                        <input
                            type="url"
                            name="url"
                            id="url"
                            onChange={handleChange}
                            required={true}
                        />
                        <div className="profile-picture-container"></div>
                    </section>
                </form>
            </div>
        </>
    );
};
export default OnBoarding;
