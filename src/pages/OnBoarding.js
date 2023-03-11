import { useState } from "react";
import Nav from "../components/Nav";

const OnBoarding = () => {
    return (
        <>
            <Nav
            minimal={true}
            setShowModal={() => {}}
            showModal={false}
            /> 
            <div>OnBoarding</div>
        </>
    );
};
export default OnBoarding;
