import React from "react";
import { doSignInWithGoogle, doSignOut } from "../../Firebase/auth";
import { useAuth } from "../../Contexts/AuthContext/authContext";
import "./header.css";

const Header = () => {
  const { userLoggedIn, currentUser } = useAuth();

  console.log("currentUser", currentUser);

  const handleSignIn = async () => {
    try {
      await doSignInWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await doSignOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className={`header ${!userLoggedIn ? "active" : ""}`}>
      {userLoggedIn ? (
        <>
          <div className="user-data">
            <img
              src={currentUser.photoURL}
              alt="profile-photo"
              className="user-img"
            />
            <div className="user-name">{currentUser.displayName}</div>
          </div>
          <button className="btn" onClick={handleSignOut}>
            Log Out
          </button>
        </>
      ) : (
        <button className={`sign-in-btn btn`} onClick={handleSignIn}>
          <img src="google.png" alt="Google sign-in" className="google-img"/>
          <div>Sign with the Google</div>
        </button>
      )}
    </div>
  );
};

export default Header;
