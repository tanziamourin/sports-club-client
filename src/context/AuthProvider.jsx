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

const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // if (currentUser) {
      //   try {
      //     const userData = {
      //       name: currentUser.displayName || "Anonymous",
      //       email: currentUser.email,
      //       image: currentUser.photoURL || "",
      //     };

      //     await axiosSecure.post("/users", userData);
      //   } catch (error) {
      //     if (error.response?.status !== 409) {
      //       console.error("User insert failed:", error);
      //     }
      //   }
      // }
    });

    return () => unsubscribe();
  }, []);

  const {
    data: role = "",
    isLoading: roleLoading,
    refetch: refetchRole,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
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
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
