import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  const loginWithGoogle = async () => {
    setSigningIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Sync with Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      const isAdminEmail = user.email === 'eriane.adsfecap@gmail.com';

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: isAdminEmail ? 'admin' : 'student',
          createdAt: new Date().toISOString()
        });
      }

      return result;
    } catch (error) {
      if (error.code === 'auth/cancelled-popup-request') {
        console.log("Login popup was cancelled or closed.");
      } else {
        console.error("Error during Google Login:", error);
      }
      setSigningIn(false);
      return null;
    } finally {
      // In case of success, onAuthStateChanged will handle the transition
      // but we set signingIn to false just in case of immediate handling
      setSigningIn(false);
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.exists() ? userSnap.data() : {};

          const isAdminEmail = firebaseUser.email === 'eriane.adsfecap@gmail.com';

          setUser({
            ...firebaseUser,
            role: isAdminEmail ? 'admin' : (userData.role || 'student')
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth status change error:", error);
        if (firebaseUser) {
          const isAdminEmail = firebaseUser.email === 'eriane.adsfecap@gmail.com';
          setUser({
            ...firebaseUser,
            role: isAdminEmail ? 'admin' : 'student'
          });
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
        setSigningIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loginWithGoogle,
    logout,
    loading,
    signingIn
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

