import { createContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, isConfigured } from '../firebase/config';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Synchronize authentication session listener
  useEffect(() => {
    if (isConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: userData.name || firebaseUser.email.split('@')[0],
                role: userData.role || 'user'
              });
            } else {
              const defaultName = firebaseUser.displayName || firebaseUser.email.split('@')[0];
              const assignedRole = firebaseUser.email.includes('admin') ? 'admin' : 'user';
              const defaultProfile = {
                uid: firebaseUser.uid,
                name: defaultName,
                email: firebaseUser.email,
                role: assignedRole,
                createdAt: serverTimestamp()
              };
              await setDoc(userDocRef, defaultProfile);
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: defaultName,
                role: assignedRole
              });
            }
          } catch (error) {
            console.error("Error reading user profile from Firestore:", error);
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.email.split('@')[0],
              role: firebaseUser.email.includes('admin') ? 'admin' : 'user'
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      const savedUser = localStorage.getItem('naye_pankh_user');
      if (savedUser) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (isConfigured) {
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        return !!credential.user;
      } catch (error) {
        console.error("Firebase Login Error:", error);
        throw error;
      }
    } else {
      const assignedRole = email.includes('admin') ? 'admin' : 'user';
      const mockUser = { id: 'mock-123', email, name: email.split('@')[0], role: assignedRole };
      setUser(mockUser);
      localStorage.setItem('naye_pankh_user', JSON.stringify(mockUser));
      return true;
    }
  };

  const register = async (email, password, name) => {
    if (isConfigured) {
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = credential.user;
        const assignedRole = email.includes('admin') ? 'admin' : 'user';

        try {
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            uid: firebaseUser.uid,
            name,
            email,
            role: assignedRole,
            createdAt: serverTimestamp()
          });
        } catch (dbError) {
          console.warn("Firestore user document creation skipped due to permissions, falling back to local Auth credentials:", dbError);
        }

        return !!firebaseUser;
      } catch (error) {
        console.error("Firebase Registration Error:", error);
        throw error;
      }
    } else {
      const assignedRole = email.includes('admin') ? 'admin' : 'user';
      const mockUser = { id: 'mock-123', email, name, role: assignedRole };
      setUser(mockUser);
      localStorage.setItem('naye_pankh_user', JSON.stringify(mockUser));
      return true;
    }
  };

  const logout = async () => {
    if (isConfigured) {
      try {
        if (user && user.uid) {
          try {
            await updateDoc(doc(db, 'users', user.uid), {
              email: user.email,
              name: user.name,
              role: user.role,
              lastLogout: serverTimestamp()
            });
          } catch (dbError) {
            console.error("Firestore user status update failed:", dbError);
          }
        }
        await signOut(auth);
        setUser(null);
      } catch (error) {
        console.error("Firebase Signout Error:", error);
      }
    } else {
      setUser(null);
      localStorage.removeItem('naye_pankh_user');
    }
  };

  const resetPassword = async (email) => {
    if (isConfigured) {
      try {
        await sendPasswordResetEmail(auth, email);
        return true;
      } catch (error) {
        console.error("Firebase Password Reset Error:", error);
        throw error;
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 800));
      return true;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
