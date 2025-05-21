import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";

console.log("API 키 확인:", import.meta.env.VITE_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

export const sendEmailLink = async (email: string) => {
  const actionCodeSettings = {
    url: window.location.origin + "/myPage/Detail",
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(firebaseAuth, email, actionCodeSettings);
  window.localStorage.setItem("emailForSignIn", email);
};

export const completeEmailLinkSignin = async () => {
  const email = window.localStorage.getItem("emailForSignIn") || "";

  if (isSignInWithEmailLink(firebaseAuth, window.location.href)) {
    const result = await signInWithEmailLink(firebaseAuth, email, window.location.href);
    window.localStorage.removeItem("emailForSignIn");

    window.history.replaceState({}, document.title, "/myPage/Detail");

    return result.user;
  } else {
    throw new Error("잘못된 인증 링크입니다.");
  }
};