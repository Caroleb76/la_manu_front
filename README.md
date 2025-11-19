🏫 Projet La Manu – 👁️ Frontend

Application frontend réalisée avec React + Vite.
Grilles de données, formulaires validés, PDF et calendrier intégrés.

🧰 Stack

⚛️ React (JS) + Vite
🗒️ AG Grid React (grilles de données)
❓ React Hook Form (formulaires)
✅ Zod (validation)
🎨 CSS Modules
📅 Day.js (dates)
🧾 jsPDF (génération de PDF)
📆 react-big-calendar (calendrier)

✅ Prérequis
Node.js ≥ 18
npm (par défaut du projet)

🔧 Installation
npm install

▶️ Démarrer en dev
npm run dev

Vite démarre généralement sur http://localhost:5173.

🗂️ Arborescence
.
├─ context/ # Context API (User, Auth, etc.)
├─ public/ # Fichiers statiques servis tels quels
├─ src/
│ ├─ assets/ # Images, logos, icônes
│ ├─ components/ # Composants UI réutilisables
│ ├─ helpers/ # Fonctions utilitaires métier
│ ├─ utils/ # Constantes, formats, wrappers API
│ └─ views/ # Pages/écrans (routing)
│ ├─ main.css # Styles globaux (CSS Modules ailleurs)
│ └─ main.jsx # Entrée Vite/React
├─ .env # Variables d'env (pref. .env.local)
├─ aboutus.jsx # (page/entrée spécifique au projet)
├─ eslint.config.js # ESLint (optionnel)
├─ index.html # Template Vite
├─ package.json
├─ vite.config.js
└─ README.md
