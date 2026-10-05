// ============================================================
// CONFIGURAÇÃO — DISTRIBUIDORA CAMPOS
// ============================================================
// Importado por app.js e admin.js. Não usa Firebase Storage:
// as fotos são salvas em Base64 (comprimidas) no Firestore.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA0HynHsZnRZp66iiIgTQe6FX9jvvIEHRI",
  authDomain: "distribuidora-campos.firebaseapp.com",
  projectId: "distribuidora-campos",
  storageBucket: "distribuidora-campos.firebasestorage.app",
  messagingSenderId: "34342424077",
  appId: "1:34342424077:web:460227bd9794ff125c8f44"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// WhatsApp da loja (55 + DDD + número, só dígitos)
export const WHATSAPP_LOJA_PADRAO = "5561999123044"; // CONFIRME: (61) 99912-3044

// Senha do painel do dono (trava simples, não é segurança real)
export const ADMIN_SENHA = "Campos@2026"; // <-- TROQUE AQUI

export const COL_PRODUTOS = "produtos";
export const COL_CATEGORIAS = "categorias";
export const COL_PEDIDOS = "pedidos";
export const DOC_CONFIG_LOJA = "config/loja";
