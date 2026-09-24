/**
 * COREBIQ Firebase bridge
 * Firebase is loaded from the official Firebase CDN so the existing
 * application dependency tree and UI remain unchanged.
 */

const FIREBASE_VERSION = '10.8.1';

const firebaseConfig = {
  apiKey: 'AIzaSyDShAm9FNnIj7sodlfzQFZ727pc9WhU-fc',
  authDomain: 'corebic--inspirego.firebaseapp.com',
  projectId: 'corebic--inspirego',
  storageBucket: 'corebic--inspirego.firebasestorage.app',
  messagingSenderId: '1091888608027',
  appId: '1:1091888608027:web:6d4b56472871e3c48299be',
  measurementId: 'G-FTT83137BO'
};

type FirebaseModules = {
  auth: any;
  db: any;
  signInAnonymously: (auth: any) => Promise<any>;
  collection: (...args: any[]) => any;
  doc: (...args: any[]) => any;
  getDocs: (ref: any) => Promise<any>;
  setDoc: (ref: any, data: any, options?: any) => Promise<void>;
  deleteDoc: (ref: any) => Promise<void>;
};

let modules: FirebaseModules | null = null;
let readyPromise: Promise<FirebaseModules | null> | null = null;
const pendingWrites = new Map<string, unknown>();

const appModuleUrl = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`;
const authModuleUrl = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`;
const firestoreModuleUrl = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-firestore.js`;

async function loadFirebase(): Promise<FirebaseModules | null> {
  if (modules) return modules;
  if (readyPromise) return readyPromise;

  readyPromise = (async () => {
    try {
      const [{ initializeApp }, authApi, firestoreApi] = await Promise.all([
        import(/* @vite-ignore */ appModuleUrl),
        import(/* @vite-ignore */ authModuleUrl),
        import(/* @vite-ignore */ firestoreModuleUrl)
      ]);

      const app = initializeApp(firebaseConfig);
      const auth = authApi.getAuth(app);
      const db = firestoreApi.getFirestore(app);

      // Anonymous authentication keeps the existing UI unchanged while
      // giving every browser installation an authenticated Firestore scope.
      if (!auth.currentUser) {
        await authApi.signInAnonymously(auth);
      }

      modules = {
        auth,
        db,
        signInAnonymously: authApi.signInAnonymously,
        collection: firestoreApi.collection,
        doc: firestoreApi.doc,
        getDocs: firestoreApi.getDocs,
        setDoc: firestoreApi.setDoc,
        deleteDoc: firestoreApi.deleteDoc
      };

      await hydrateFromFirestore();
      await flushPendingWrites();

      console.info('[COREBIQ] Firebase connected:', firebaseConfig.projectId);
      return modules;
    } catch (error) {
      console.error('[COREBIQ] Firebase connection failed. Local storage remains active.', error);
      modules = null;
      return null;
    }
  })();

  return readyPromise;
}

function dataCollection() {
  if (!modules?.auth.currentUser) return null;
  return modules.collection(
    modules.db,
    'users',
    modules.auth.currentUser.uid,
    'appData'
  );
}

export async function initializeFirebaseData(): Promise<void> {
  await loadFirebase();
}

export function queueFirebaseWrite(key: string, value: unknown): void {
  pendingWrites.set(key, value);
  if (modules) {
    void flushPendingWrites();
  }
}

async function flushPendingWrites(): Promise<void> {
  if (!modules || pendingWrites.size === 0) return;
  const collectionRef = dataCollection();
  if (!collectionRef) return;

  const writes = Array.from(pendingWrites.entries());
  pendingWrites.clear();

  await Promise.all(
    writes.map(async ([key, value]) => {
      try {
        await modules!.setDoc(
          modules!.doc(collectionRef, key),
          {
            key,
            data: value,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch (error) {
        console.error(`[COREBIQ] Firebase write failed for ${key}:`, error);
        pendingWrites.set(key, value);
      }
    })
  );
}

async function hydrateFromFirestore(): Promise<void> {
  if (!modules) return;
  const collectionRef = dataCollection();
  if (!collectionRef) return;

  const snapshot = await modules.getDocs(collectionRef);
  if (snapshot.empty) return;

  snapshot.forEach((item: any) => {
    const payload = item.data();
    if (!payload || !payload.key) return;
    try {
      localStorage.setItem(payload.key, JSON.stringify(payload.data));
    } catch (error) {
      console.error(`[COREBIQ] Failed to hydrate ${payload.key}:`, error);
    }
  });
}

export async function clearFirebaseData(): Promise<void> {
  if (!modules) return;
  const collectionRef = dataCollection();
  if (!collectionRef) return;

  const snapshot = await modules.getDocs(collectionRef);
  await Promise.all(
    snapshot.docs.map((item: any) => modules!.deleteDoc(item.ref))
  );
}

export { firebaseConfig };
