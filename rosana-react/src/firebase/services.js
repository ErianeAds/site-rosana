import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './config';

// User Services
export const getUserProfile = async (uid) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? userDoc.data() : null;
};

export const createUserProfile = async (uid, data) => {
  await updateDoc(doc(db, 'users', uid), data, { merge: true });
};

// Mentorship Services
export const getMentorships = async () => {
  const q = collection(db, 'mentorships');
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getStudentMentorships = async (studentId) => {
  const q = query(collection(db, 'mentorships'), where('studentId', '==', studentId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Sessions Services
export const getSessions = async (userId) => {
  const q = query(collection(db, 'sessions'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createSession = async (sessionData) => {
  return await addDoc(collection(db, 'sessions'), {
    ...sessionData,
    createdAt: new Date().toISOString()
  });
};
