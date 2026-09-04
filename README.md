# 🎓 Scrivya - Assistant Académique AFNOR d'Élite

**Scrivya** est une plateforme web d'accompagnement académique et d'intelligence artificielle hautement sophistiquée. Elle est conçue pour simplifier la vie des chercheurs, doctorants et étudiants en prenant en charge l'intégralité de la mise en page universitaire aux normes rigoureuses (notamment les normes françaises **AFNOR NF Z 44-005**), la gestion automatisée des notes de bas de page et des citations chronologiques, la planification de la soutenance et la création de cartes mentales sémantiques basées sur l'approche innovante de NotebookLM.

La plateforme est entièrement internationale et propose une interface trilingue fluide (**Français, Anglais et Arabe**), accompagnée d'une adaptation aux guides de mise en page des plus grandes universités tunisiennes (ENIT, INSAT, IHEC, SUP'COM, etc.) et internationales.

---

## 🌟 Fonctionnalités Majeures

### 1. ✍️ Workspace Académique Réactif
Un éditeur de texte wysiwyg complet et segmenté en pages A4 réalistes qui respecte scrupuleusement la mise en forme requise pour les thèses et mémoires :
- **Notes de bas de page intelligentes** : Gestion automatisée des indicateurs séquentiels et des abréviations académiques d'usage (`Ibid.`, `Op. cit.`, `Idem`) selon l'enchaînement des citations.
- **Vérificateur sémantique & anti-plagiat** : Détection en temps réel des risques de répétition, erreurs typographiques ou fautes de style avec suggestions de corrections en un clic.
- **Dictée vocale intégrée** : Module de transcription de notes par microphone pour faciliter la rédaction continue.
- **Exportateur PDF d'autorité** : Générateur de rapports PDF fidèles multi-pages à l'aide de la bibliothèque `jsPDF` permettant de contourner les contraintes de sandbox des navigateurs.

### 2. 🧠 AIMentorMap - Carte Mentale d'Orientation
Un espace interactif alliant un canevas graphique de visualisation et la puissance du traitement sémantique :
- **Canevas interactif (`AIMentorMindMapCanvas`)** : Représentation dynamique de la feuille de route universitaire, des compétences requises, des cours à valider et des jalons de carrière.
- **Expansion sémantique par IA (Modèle NotebookLM)** : Intégration d'un endpoint serveur `/api/expand-node` propulsé par Gemini 3.5-Flash pour décomposer n'importe quel concept académique en sous-pistes de recherche concrètes ou projets appliqués de terrain.
- **Exportateur de Roadmap** : Génération de documents d'orientation officiels exportables au format PDF.

### 3. 📊 PresentationMaker - Concepteur de Soutenance
Un créateur de diaporamas intégré spécialement calibré pour les épreuves de soutenance de projets (PFE, PFA, Thèses) :
- **Sélecteur de Thèmes Visuels** : Choix instantané parmi des templates premium (Blank, Ember, Ultraviolet, Coral, Retrowave) avec gestion des palettes contrastées.
- **Générateur d'illustrations vectorielles par IA** : Connexion à un endpoint intelligent `/api/generate-slide-image`. En cas de limites de quotas d'images, le système bascule intelligemment sur un micro-générateur de schémas vectoriels SVG dynamiques en s'appuyant sur l'IA (Gemini 3.5-Flash) ou sur un modèle géométrique déterministe texturé.
- **Guidage de Soutenance** : Intégration de notes de présentation, minutage précis et script de défense vocale pour préparer au mieux la prise de parole le jour J.
- **Gestion des Pièces Jointes** : Téléchargement et intégration de rapports complémentaires au format `.pdf`, `.docx` ou `.xlsx`.

### 4. 🧭 Générateur Académique Assisté
- Accompagnement à l'élaboration de plans de recherche détaillés.
- Aide à l'écriture de bibliographies conformes et triées.
- Traducteur contextuel de terminologies spécialisées respectant les nuances propres aux disciplines scientifiques et littéraires.

---

## 🛠️ Architecture Technique

### Client-Side (SPA React)
- **Framework** : React 18+ avec TypeScript (structuré de manière modulaire).
- **Styling** : Tailwind CSS avec prise en charge du thème sombre/clair adaptatif, gestion des directions de lecture (LTR/RTL) pour la langue arabe, et police de caractères d'élite (**Space Grotesk** pour les titres et **Inter** pour le corps de texte).
- **Animations** : Transitions élégantes avec `motion` (issu de `motion/react`).
- **Graphiques & Visualisations** : Intégration d'icônes vectorielles homogènes via `lucide-react`.

### Server-Side (Node.js / Express)
- **Framework Serveur** : Express avec compilation unifiée via `esbuild` pour former un bundle autonome `dist/server.cjs` à haute performance de démarrage.
- **Intégration IA** : Utilisation du SDK officiel `@google/genai` pour communiquer de manière sécurisée avec les modèles Gemini (Gemini 3.5-Flash).
- **Endpoints clés** :
  - `POST /api/generate-roadmap` : Analyse le profil de l'étudiant et génère une feuille de route structurée complète.
  - `POST /api/generate-slide-image` : Génère des illustrations 16:9 haute fidélité pour le diaporama (avec fallback SVG dynamique si les quotas de génération d'images standards sont épuisés).
  - `POST /api/expand-node` : Gère l'expansion conceptuelle de la carte mentale selon l'approche NotebookLM.

---

## 📦 Installation & Démarrage

### Dépendances requises
Le projet requiert des dépendances systèmes modernes telles que :
- `@google/genai` (SDK d'intégration IA)
- `jspdf` (génération de documents PDF)
- `lucide-react` (bibliothèque d'icônes)
- `motion/react` (moteur d'animations UI)

### Démarrage en développement
```bash
# Installation des paquets
npm install

# Lancement du serveur de développement hybride (Vite + Express)
npm run dev
```
Le serveur écoute par défaut sur le port **3000** et est accessible via l'hôte `0.0.0.0` conformément aux directives d'orchestration de conteneurs.

### Compilation et Production
```bash
# Compilation de l'interface et du serveur Express unifié
npm run build

# Démarrage de l'application en production
npm run start
```

---

## ⚖️ Conformité et Normes
Scrivya intègre un moteur de règles typographiques strictes :
- Espaces insécables avant les ponctuations doubles en français (`:`, `?`, `!`, `;`).
- Formatage des citations de livres, articles de revues scientifiques, thèses de doctorat, textes de loi et ressources web.
- Application rigoureuse des polices académiques standardisées et des marges réglementaires.

*Scrivya — L'excellence de la recherche, la simplicité de la forme.*
