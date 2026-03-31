// auth context - wraps entire app and provides user state everywhere
import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, googleProvider, db } from '../firebase'

const AuthContext = createContext(null)

// useAuth hook - call this in any component to get auth state
export function useAuth() {
  var ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export function AuthProvider({ children }) {
  var [user, setUser]       = useState(null)
  var [loading, setLoading] = useState(true)
  var [error, setError]     = useState(null)

  // listen to firebase auth state changes
  useEffect(function () {
    var unsubscribe = onAuthStateChanged(auth, async function (firebaseUser) {
      if (firebaseUser) {
        var snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        setUser({
          uid:         firebaseUser.uid,
          email:       firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL:    firebaseUser.photoURL,
          ...(snap.exists() ? snap.data() : {}),
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return function () { unsubscribe() }
  }, [])

  // create firestore user document on first sign up
  async function createUserDoc(firebaseUser, extra) {
    var ref  = doc(db, 'users', firebaseUser.uid)
    var snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        uid:         firebaseUser.uid,
        email:       firebaseUser.email,
        displayName: firebaseUser.displayName || extra.displayName || '',
        photoURL:    firebaseUser.photoURL    || '',
        createdAt:   serverTimestamp(),
        bio:         '',
        skillCount:  0,
      })
    }
  }

  async function signup(email, password, displayName) {
    setError(null)
    var cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })
    await createUserDoc(cred.user, { displayName })
    return cred
  }

  async function login(email, password) {
    setError(null)
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function loginWithGoogle() {
    setError(null)
    var cred = await signInWithPopup(auth, googleProvider)
    await createUserDoc(cred.user, {})
    return cred
  }

  async function logout() {
    await signOut(auth)
    setUser(null)
  }

  var value = { user, loading, error, setError, signup, login, loginWithGoogle, logout }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}