import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
import { auth } from "../firebase/firebase.init";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "./AuthContext";
import Swal from "sweetalert2";

const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // ✅ Save new user in DB and show Swal alert
 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);
    setLoading(false);

    if (currentUser?.email) {
      try {
        const res = await axiosSecure.post("/users", {
          name: currentUser.displayName || "Unnamed",
          email: currentUser.email,
          image: currentUser.photoURL || "",
        });

        if (res.status === 201) {
          Swal.fire({
            icon: "success",
            title: "🎉 Welcome!",
            text: "Your account has been created.",
            confirmButtonColor: "#16a34a",
          });
        }
      } catch (err) {
        if (err.response?.status === 409) {
          // User already exists — skip alert
          console.log("User already exists.");
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Something went wrong while saving user.",
            confirmButtonColor: "#dc2626",
          });
        }
      }
    }
  });

  return () => unsubscribe();
}, [axiosSecure]);


  const {
    data: role = "",
    isLoading: roleLoading,
    refetch: refetchRole,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${encodeURIComponent(user.email)}`);

      return res.data.role;
    },
  });

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  const signInWithGoogle = () => signInWithPopup(auth, provider);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (profile) =>
    updateProfile(auth.currentUser, profile);

  const authInfo = {
    user,
    role,
    loading: loading || roleLoading,
    signIn,
    logout,
    signInWithGoogle,
    createUser,
    updateUserProfile,
    refetchRole,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
