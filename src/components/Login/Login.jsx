import { useContext, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";
import "./Login.css";
import { UserContext } from "../../App";
import { useNavigate, useLocation } from "react-router-dom";

import {sendPasswordResetEmail } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || { from: { pathname: "/" } };

  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    password: "",
    photo: "",
    error: "",
  });
  const [newUser, setNewUser] = useState(false);

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);

  const provider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();

  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, photoURL, email } = result.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL,
      };
      setUser(signedInUser);
      setLoggedInUser(signedInUser);
    } catch (error) {
      console.error("Error during Google sign-in:", error.message);
      setUser({ ...user, error: error.message });
    }
  };

  const handleSignInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, fbProvider);
      const { displayName, photoURL, email } = result.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL,
      };
      setUser(signedInUser);
    } catch (error) {
      console.error("Error during Facebook sign-in:", error.message);
      setUser({ ...user, error: error.message });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser({
        isSignedIn: false,
        name: "",
        email: "",
        photo: "",
        error: "",
      });
    } catch (error) {
      console.error("Error signing out:", error.message);
      setUser({ ...user, error: error.message });
    }
  };

  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /^\S+@\S+\.\S+$/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newUser) {
        await createUserWithEmailAndPassword(auth, user.email, user.password);
        setUser({ ...user, error: "" });
        setLoggedInUser(user);
        verifyEmail();
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
        const signedInUser = {
          isSignedIn: true,
          name: userCredential.user.displayName || "User",
          email: userCredential.user.email,
          photo: userCredential.user.photoURL,
        };
        setUser(signedInUser);
        setLoggedInUser(signedInUser);
        navigate(from.pathname);
      }
    } catch (error) {
      const errorMessage =
        error.code === "auth/email-already-in-use"
          ? "This email is already registered. Please log in instead."
          : error.message;
      setUser({ ...user, error: errorMessage });
    }
  };

  const verifyEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      alert("A verification email has been sent to your email address. Please check your inbox.");
    } catch (error) {
      console.error("Error sending email verification:", error.message);
      setUser({ ...user, error: "Failed to send verification email. Please try again later." });
    }
  };


const resetPassword=email=>{
  const auth = getAuth();
sendPasswordResetEmail(auth, email)
  .then(() => {
    // Password reset email sent!
    // ..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
}

  return (
    <div className="login-container">
      <h1>{user.isSignedIn ? `Welcome, ${user.name}` : "Please Sign In"}</h1>
      {!user.isSignedIn ? (
        <>
          <button onClick={handleSignInWithGoogle}>Sign in with Google</button>
          <button onClick={handleSignInWithFacebook}>Sign in with Facebook</button>
          <form onSubmit={handleSubmit}>
            {newUser && <input type="text" name="name" placeholder="Your name" onBlur={handleBlur} />}
            <input type="email" name="email" placeholder="Your email" onBlur={handleBlur} required />
            <input type="password" name="password" placeholder="Your password" onBlur={handleBlur} required />
            <input type="submit" value={newUser ? "Sign Up" : "Sign In"} />
          </form>
          <button onClick={()=>resetPassword(user.email)}>Forget or Reset Password</button>
          <p style={{ color: "red" }}>{user.error}</p>
          <label>
            <input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)} />
            New User Sign Up
          </label>
        </>
      ) : (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
          {user.photo && <img src={user.photo} alt="User profile" />}
        </>
      )}
    </div>
  );
}

export default Login;
