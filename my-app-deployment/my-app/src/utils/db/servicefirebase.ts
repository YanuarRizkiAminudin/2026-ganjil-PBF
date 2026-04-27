import {
  getFirestore,
  collection,
  getDocs,
  Firestore,
  getDoc,
  doc,
  query,
  addDoc,
  setDoc,
  where,
} from "firebase/firestore";
import app from "./firebase";
import bcrypt from "bcrypt";

const db: Firestore = getFirestore(app);

// ─── Reusable helpers ────────────────────────────────────────────────────────

/** Cari user berdasarkan email, return null jika tidak ditemukan */
async function findUserByEmail(email: string) {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...(docSnap.data() as any) };
}

/** Simpan atau update user OAuth (Google/GitHub) ke Firestore */
async function saveOrUpdateOAuthUser(userData: {
  email: string;
  name: string;
  image: string;
}) {
  const existing = await findUserByEmail(userData.email);

  if (existing) {
    await setDoc(
      doc(db, "users", existing.id),
      {
        email: userData.email,
        fullname: userData.name,
        image: userData.image,
        role: existing.role ?? "member",
      },
      { merge: true }
    );
    return { id: existing.id, role: existing.role ?? "member" };
  } else {
    const newUser = {
      email: userData.email,
      fullname: userData.name,
      image: userData.image,
      role: "member",
      password: "",
    };
    const docRef = await addDoc(collection(db, "users"), newUser);
    return { id: docRef.id, role: "member" };
  }
}

// ─── Public services ─────────────────────────────────────────────────────────

export async function retrieveProducts(collectionName: string) {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function retrieveDataByID(collectionName: string, id: string) {
  const snapshot = await getDoc(doc(db, collectionName, id));
  return snapshot.data();
}

export async function signIn(email: string) {
  return await findUserByEmail(email);
}

export async function signInWithGoogle(userData: {
  email: string;
  name: string;
  image: string;
}) {
  return await saveOrUpdateOAuthUser(userData);
}

export async function signUp(
  userData: {
    email: string;
    fullname: string;
    password: string;
    role?: string;
  },
  callback: Function
) {
  const existing = await findUserByEmail(userData.email);

  if (existing) {
    callback({ status: "error", message: "User already exists" });
  } else {
    userData.password = await bcrypt.hash(userData.password, 10);
    userData.role = "member";
    await addDoc(collection(db, "users"), userData)
      .then(() => callback({ status: "success", message: "User registered successfully" }))
      .catch((error) => callback({ status: "error", message: error.message }));
  }
}
