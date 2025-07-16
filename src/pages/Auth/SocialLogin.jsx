import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

const SocialLogin = () => {
  const { signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();

      Swal.fire({
        title: "🎉 Welcome!",
        text: `Signed in as ${result?.user?.displayName || "User"}`,
      
        imageWidth: 120,
        imageHeight: 120,
        showConfirmButton: false,
        timer: 2000,
      });

      navigate("/");
    } catch (err) {
      Swal.fire({
        title: "🚫 Google Sign-In Failed",
        text: err.message || "Please try again.",
        
        imageWidth: 120,
        imageHeight: 120,
        confirmButtonText: "OK",
      });
      console.error("❌ Google sign-in failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full p-3 rounded btn-primary btn-outline"
      >
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>
    </div>
  );
};

export default SocialLogin;
