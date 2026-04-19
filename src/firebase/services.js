import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  setDoc,
  deleteDoc,
  query, 
  where 
} from 'firebase/firestore';
import { db, storage } from './config';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

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

// Product/Course Services
export const getCourses = async () => {
  try {
    const q = collection(db, 'courses');
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting courses:", error);
    return [];
  }
};

export const updateCourse = async (courseId, data) => {
  const courseRef = doc(db, 'courses', courseId);
  await setDoc(courseRef, {
    ...data,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

export const addCourse = async (courseData) => {
  const newDocRef = doc(collection(db, 'courses'));
  await setDoc(newDocRef, {
    ...courseData,
    id: newDocRef.id,
    createdAt: new Date().toISOString()
  });
  return newDocRef.id;
};

export const deleteCourse = async (courseId) => {
  const courseRef = doc(db, 'courses', courseId);
  await deleteDoc(courseRef);
};

// Site Content Management (CMS)
export const getSiteContent = async () => {
  const q = collection(db, 'site_content');
  const querySnapshot = await getDocs(q);
  const content = {};
  querySnapshot.docs.forEach(doc => {
    content[doc.id] = doc.data();
  });
  return content;
};

export const updateSiteSection = async (sectionId, data) => {
  const sectionRef = doc(db, 'site_content', sectionId);
  await setDoc(sectionRef, {
    ...data,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

// Mentorship Progress Services
export const getStudentProgress = async (studentId) => {
  const docRef = doc(db, 'mentorship_progress', studentId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateStudentProgress = async (studentId, data) => {
  const docRef = doc(db, 'mentorship_progress', studentId);
  await setDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

export const deleteMentorship = async (id) => {
  await deleteDoc(doc(db, 'mentorships', id));
};

export const updateMentorship = async (id, data) => {
  await updateDoc(doc(db, 'mentorships', id), data);
};

// Storage Helpers
export const uploadFile = async (file, path, onProgress) => {
  return new Promise((resolve, reject) => {
    const fileRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      }, 
      (error) => reject(error), 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export const deleteFile = async (path) => {
  const fileRef = ref(storage, path);
  await deleteObject(fileRef);
};
