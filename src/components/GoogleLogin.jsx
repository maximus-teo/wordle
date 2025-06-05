import { useEffect } from "react";

const GoogleLogin = ({ onSuccess }) => {
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "912767498043-2dk2gf5triilmdvoqls8hpd4qfcjbuvb.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  const handleCredentialResponse = (response) => {
    const userObject = parseJwt(response.credential);
    onSuccess(userObject); // send data to parent
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  return <div id="google-signin-btn"></div>;
};

export default GoogleLogin;
