import colorLogo from "../images/color-logo.png";
import whiteLogo from "../images/white-logo.png";

const Nav = ({ minimal, setShowModal, showModal, setIsSignUp }) => {
    const authToken = false;

    const handleClick = () => {
        setShowModal(true);
        setIsSignUp(false);
    };

    return (
        <nav>
            <div className="logo-container">
                <img
                    className="logo"
                    src={minimal ? colorLogo : whiteLogo}
                    alt="logo"
                />
            </div>
            {!authToken && !minimal && (
                <button
                    className="nav-button"
                    onClick={handleClick}
                    disabled={showModal}
                >
                    Log in
                </button>
            )}
        </nav>
    );
};
export default Nav;
