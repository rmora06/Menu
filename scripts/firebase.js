// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuracion de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyCz_wE2NSLxus4xK1zOSNoEbge7tuStQec",
  authDomain: "menu-demo-5cd5e.firebaseapp.com",
  projectId: "menu-demo-5cd5e",
  storageBucket: "menu-demo-5cd5e.firebasestorage.app",
  messagingSenderId: "729842425180",
  appId: "1:729842425180:web:7535e31c4090cc70cff599"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Base de datos
export const db = getFirestore(app);