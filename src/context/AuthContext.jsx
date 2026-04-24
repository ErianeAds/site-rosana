import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  OAuthProvider
} from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase/config';
const appleProvider = new OAuthProvider('apple.com');
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  const loginWithGoogle = async () => {
    setSigningIn(true);
    
    // Configurações customizadas para o provedor do Google
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      // Detecta se é um dispositivo móvel para decidir entre Popup ou Redirect
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      console.error("Erro no login:", error);
      setSigningIn(false);
      return null;
    }
  };

  const loginWithApple = async () => {
    setSigningIn(true);
    try {
      const result = await signInWithPopup(auth, appleProvider);
      return result;
    } catch (e) {
      console.error("Erro Apple Login:", e);
      setSigningIn(false);
    }
  };

  const loginWithEmail = async (email, password) => {
    setSigningIn(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (e) {
      console.error("Erro Email Login:", e);
      setSigningIn(false);
      throw e;
    }
  };

  const registerWithEmail = async (email, password, name) => {
    setSigningIn(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Update Firebase Auth Profile with Name
      const { updateProfile } = await import('firebase/auth');
      await updateProfile(result.user, { displayName: name });
      
      // Force sync with local Firestore
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
          uid: result.user.uid,
          displayName: name,
          email: email,
          role: 'student',
          createdAt: new Date().toISOString()
      });

      return result;
    } catch (e) {
      console.error("Erro Registro Email:", e);
      setSigningIn(false);
      throw e;
    }
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    // Processa o resultado do redirecionamento (muito importante para mobile)
    getRedirectResult(auth).catch((error) => {
        console.error("Erro no retorno do redirecionamento:", error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.exists() ? userSnap.data() : {};
          
          const isAdminEmail = firebaseUser.email === 'eriane.adsfecap@gmail.com' || firebaseUser.email === 'carreiras@rosanalbrito.com.br';

          setUser({
            ...firebaseUser,
            role: isAdminEmail ? 'admin' : (userData.role || 'student')
          });

          // Sincroniza dados básicos se for novo usuário
          if (!userSnap.exists()) {
             await setDoc(userRef, {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                role: isAdminEmail ? 'admin' : 'student',
                createdAt: new Date().toISOString()
             });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Erro de sincronização de perfil:", error);
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
    loginWithApple, 
    loginWithEmail, 
    registerWithEmail, 
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


