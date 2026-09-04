export interface PageData {
  id: string;
  type: "cover" | "remerciements" | "approval" | "abbreviations" | "sommaire" | "introduction" | "part1" | "part2" | "conclusion" | "bibliographie" | "kteb" | "table_matieres" | "sommaire_p" | "custom_blank" | "content";
  title: string;
  isCustom?: boolean;
  content: string;
  hasKtebFootnote?: boolean;
}

export const initialPages: PageData[] = [
  {
    id: "cover_page",
    type: "cover",
    title: "Page de Garde (Couverture)",
    content: ""
  },
  {
    id: "remerciements",
    type: "remerciements",
    title: "Remerciements",
    content: `<div class="text-center mt-32 w-full">
      <h2 class="text-2xl font-bold tracking-widest text-slate-800 uppercase mb-12">REMERCIEMENTS</h2>
      <p class="text-base text-slate-600 italic max-w-xl mx-auto text-center leading-relaxed font-serif mt-16">
        Je tiens à exprimer ma gratitude éternelle à tous ceux qui ont contribué à l'élaboration de ce mémoire, en particulier mon directeur de recherche pour ses orientations éclairées et son dévouement constant.
      </p>
    </div>`
  },
  {
    id: "approbation",
    type: "approval",
    title: "Avis d'Improbation (Disclaimers)",
    content: `<div class="text-center my-auto flex flex-col justify-center h-[550px]">
      <p class="text-sm md:text-base leading-loose text-slate-700 italic max-w-xl mx-auto mb-6 text-center font-serif">
        La faculté n’entend donner aucune approbation ni improbation aux opinions émises dans la présente thèse.
      </p>
      <p class="text-sm md:text-base leading-loose text-slate-700 italic max-w-xl mx-auto text-center font-serif">
        Ces opinions doivent être considérées comme propres à leur auteur.
      </p>
    </div>`
  },
  {
    id: "abbreviations",
    type: "abbreviations",
    title: "Liste des Abréviations",
    content: `<div class="w-full mt-10">
      <h2 class="text-xl font-bold tracking-wider text-slate-800 text-center uppercase mb-12">LISTE DES PRINCIPALES ABRÉVIATIONS</h2>
      <div class="max-w-md mx-auto space-y-4 font-serif text-sm text-slate-700 mt-16">
        <div class="flex border-b border-dashed border-slate-200 pb-2">
          <span class="w-24 font-bold text-blue-600 font-mono">al.</span>
          <span class="flex-1">alinéa</span>
        </div>
        <div class="flex border-b border-dashed border-slate-200 pb-2">
          <span class="w-24 font-bold text-blue-600 font-mono">art.</span>
          <span class="flex-1">article</span>
        </div>
        <div class="flex border-b border-dashed border-slate-200 pb-2">
          <span class="w-24 font-bold text-blue-600 font-mono">Cass.</span>
          <span class="flex-1">Cour de cassation</span>
        </div>
        <div class="flex border-b border-dashed border-slate-200 pb-2">
          <span class="w-24 font-bold text-blue-600 font-mono">JO RT</span>
          <span class="flex-1">Journal Officiel de la République Tunisienne</span>
        </div>
        <div class="flex border-b border-dashed border-slate-200 pb-2">
          <span class="w-24 font-bold text-blue-600 font-mono">op. cit.</span>
          <span class="flex-1">opere citato (ouvrage cité précédemment)</span>
        </div>
        <div class="flex border-b border-dashed border-slate-200 pb-2">
          <span class="w-24 font-bold text-blue-600 font-mono">p.</span>
          <span class="flex-1">page</span>
        </div>
      </div>
    </div>`
  },
  {
    id: "sommaire",
    type: "sommaire",
    title: "Sommaire",
    content: `<div class="w-full">
      <h2 class="text-xl font-bold tracking-wider text-slate-800 text-center uppercase mb-10 font-serif">SOMMAIRE</h2>
      <div class="max-w-xl mx-auto space-y-4 font-serif text-sm text-slate-700">
        <p class="font-bold text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">Première partie :</p>
        <div class="pl-4 space-y-1">
          <p class="font-semibold text-slate-805">Chapitre I : L'impact des normes de rédaction juridique de Tunis</p>
          <div class="pl-4 text-xs text-slate-600 space-y-0.5">
            <p>Section 1 : La rigueur constitutionnelle</p>
            <p>Section 2 : La standardisation de la présentation universitaire</p>
          </div>
          <p class="font-semibold text-slate-805 mt-2">Chapitre II : L'automatisation sémantique</p>
          <div class="pl-4 text-xs text-slate-600 space-y-0.5">
            <p>Section 1 : Indexation des citations</p>
            <p>Section 2 : Génie logiciel et recherche légale</p>
          </div>
        </div>
        <p class="font-bold text-slate-900 border-b border-slate-300 pb-1 mt-6 uppercase tracking-wide">Deuxième partie :</p>
        <div class="pl-4 space-y-1">
          <p class="font-semibold text-slate-805">Chapitre I : L'analyse critique de la jurisprudence</p>
          <div class="pl-4 text-xs text-slate-600 space-y-0.5">
            <p>Section 1 : Les tribunaux administratifs tunisiens</p>
            <p>Section 2 : Impact doctrinal national</p>
          </div>
          <p class="font-semibold text-slate-850 mt-2">Chapitre II : Perspectives d'évolution</p>
          <div class="pl-4 text-xs text-slate-600 space-y-0.5">
            <p>Section 1 : Intégration de l'intelligence artificielle sous pavillon Scrivya</p>
            <p>Section 2 : Souveraineté informationnelle académique</p>
          </div>
        </div>
      </div>
    </div>`
  },
  {
    id: "introduction",
    type: "introduction",
    title: "Introduction Générale",
    content: `<div class="w-full">
      <h2 class="text-xl font-bold tracking-wider text-slate-800 text-center uppercase mb-12">INTRODUCTION GÉNÉRALE</h2>
      <p class="text-justify font-serif text-sm leading-relaxed mb-4 text-slate-800">
        L'analyse critique des structures universitaires démontre l'importance capitale de la rigueur documentaire dans les publications contemporaines en Tunisie. Dans cette perspective, la mise en place d'outils automatisés facilite l'interconnexion sémantique des données de recherche légale.
      </p>
      <p class="text-justify font-serif text-sm leading-relaxed text-slate-800">
        Au coeur de la Faculté des Sciences Juridiques, Politiques et Sociales de Tunis, de nouveaux paradigmes de l'évaluation du droit émergent de manière continue.
      </p>
    </div>`
  },
  {
    id: "intro_cont",
    type: "content",
    title: "Introduction (Suite)",
    content: `<p class="mb-4 text-justify font-serif text-sm leading-relaxed text-slate-800 font-serif">
      La présente recherche entend ainsi proposer une relecture dynamique des cadres réglementaires tunisiens. Nous dresserons l'inventaire des influences réciproques entre les doctrines locales et les mutations sémantiques internationales, un enjeu clé de l'Université.
    </p>
    <p class="text-justify font-serif text-sm leading-relaxed text-slate-800 font-serif">
      Notre but est de modéliser une nouvelle rigueur sans alourdir le fardeau matériel des doctorants en droit de Tunis.
    </p>`
  },
  {
    id: "partie1",
    type: "part1",
    title: "Première Partie : Cover",
    content: `<div class="text-center mt-48 w-full">
      <h2 class="text-2xl font-bold tracking-widest text-slate-800 uppercase mb-6 font-serif">PREMIÈRE PARTIE :</h2>
      <p class="text-sm font-semibold tracking-wider text-slate-500 uppercase font-serif">
        CADRE THÉORIQUE ET FONDEMENTS JURIDIQUES DE L'ADAPTATION NATIONALE
      </p>
    </div>`
  },
  {
    id: "p1_content",
    type: "content",
    title: "Développement Partie I",
    content: `<h3 class="text-sm font-bold uppercase mb-4 text-left font-serif text-slate-800">Chapitre I : L'analyse des textes institutionnels</h3>
    <p class="mb-4 text-justify font-serif text-sm leading-relaxed text-slate-800">
      L'examen des compétences constitutionnelles de l'État tunisien exige au préalable d'étudier la hiérarchie des lois de la transition démocratique. Chaque arrêté ministériel doit s'intégrer de façon ordonnée dans l'arsenal public.
    </p>
    <p class="text-justify font-serif text-sm leading-relaxed text-slate-800">
      Le rôle des commissions législatives nationales demeure d'une importance doctrinale critique pour harmoniser les pratiques de rédaction.
    </p>`
  },
  {
    id: "partie2",
    type: "part2",
    title: "Deuxième Partie : Cover",
    content: `<div class="text-center mt-48 w-full">
      <h2 class="text-2xl font-bold tracking-widest text-slate-805 uppercase mb-6 font-serif">DEUXIÈME PARTIE :</h2>
      <p class="text-sm font-semibold tracking-wider text-slate-500 uppercase font-serif">
        L'APPLICATION PRATIQUE ET PERSPECTIVES MÉTHODOLOGIQUES CONTEMPORAINES
      </p>
    </div>`
  },
  {
    id: "p2_content",
    type: "content",
    title: "Développement Partie II",
    content: `<h3 class="text-sm font-bold uppercase mb-4 text-left font-serif text-slate-800">Chapitre II : L'impact de la numérisation étatique</h3>
    <p class="mb-4 text-justify font-serif text-sm leading-relaxed text-slate-800">
      L'introduction de bases de données intégrées pour la recherche juridique tunisienne révolutionne l'accès aux archives de la Faculté de Tunis. Les chercheurs et les étudiants de master peuvent désormais croiser les jurisprudences locales avec des bases de données internationales de manière dynamique.
    </p>
    <p class="text-justify font-serif text-sm leading-relaxed text-slate-800">
      Cette mutation profonde redéfinit les critères de production bibliographique et exige d'incorporer des outils logiciels adaptatifs dans le processus de validation universitaire tunisienne.
    </p>`
  },
  {
    id: "conclusion",
    type: "conclusion",
    title: "Conclusion Générale",
    content: `<div class="w-full">
      <h2 class="text-xl font-bold tracking-wider text-slate-800 text-center uppercase mb-12">CONCLUSION GÉNÉRALE</h2>
      <p class="text-justify font-serif text-sm leading-relaxed mb-4 text-slate-800 font-serif">
        En somme, cette étude met en exergue l'interdépendance croissante de la rigueur doctorale et des innovations technologiques en Tunisie.
      </p>
      <p class="text-justify font-serif text-sm leading-relaxed text-slate-800 font-serif">
        Les réformes en cours au sein de l'Université soulignent la nécessité de démocratiser le savoir scientifique tout en consolidant l'intégrité intellectuelle des étudiants chercheurs.
      </p>
    </div>`
  },
  {
    id: "conclusion_cont",
    type: "content",
    title: "Conclusion (Suite)",
    content: `<p class="mb-4 text-justify font-serif text-sm leading-relaxed text-slate-800 font-serif">
      La perspective ultime reste l'émergence d'une souveraineté numérique académique capable de cataloguer l'histoire juridique tunisienne sous des formats durables et standardisés.
    </p>`
  },
  {
    id: "bibliographie",
    type: "bibliographie",
    title: "Bibliographie (Titre)",
    content: `<div class="w-full">
      <h2 class="text-xl font-bold tracking-wider text-slate-800 text-center uppercase mb-12 font-serif">BIBLIOGRAPHIE</h2>
      <p class="text-sm text-slate-400 italic text-center mb-8 font-serif">Liste sélective des ouvrages consultés au cours des recherches</p>
    </div>`
  },
  {
    id: "kteb",
    type: "kteb",
    title: "Espace Citation (Kteb)",
    content: `<div class="w-full">
      <p class="mb-4 text-justify font-serif text-sm leading-relaxed text-slate-800">
        L'ouvrage de base de cette étude démontre la pertinence des outils d'assistance sémantique de Scrivya.
      </p>
      <p class="text-justify font-serif text-sm leading-relaxed text-slate-800">
        Comme indiqué ci-dessous, la citation d'un ouvrage national constitue la pierre d'assise de l'argumentation juridique développée ici :
      </p>
      
      <div class="p-4 bg-slate-50 border-l-4 border-emerald-500 italic font-serif text-xs my-6 select-text flex items-center justify-between">
        <span>Kteb<sup><span class="footnote-link cursor-pointer font-serif font-semibold select-none text-[10px] align-super text-slate-900 hover:text-blue-600 transition-colors ml-0.5 inline" data-footnote-id="1" title="Note de bas de page 1">1</span></sup></span>
        <span class="footnote-link text-[10px] uppercase font-serif font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors border border-slate-200 cursor-pointer" data-footnote-id="1">Consulter Bibliographie →</span>
      </div>
      
      <p class="text-justify font-serif text-sm leading-relaxed text-slate-800 mt-4">
        Ce modèle prouve l'efficacité de l'interconnexion sémantique des documents universitaires tunisiens.
      </p>
    </div>`,
    hasKtebFootnote: true
  },
  {
    id: "table_matieres",
    type: "table_matieres",
    title: "Table des Matières",
    content: `<div class="w-full">
      <h2 class="text-xl font-bold tracking-wider text-slate-800 text-center uppercase mb-12 font-serif">TABLE DES MATIÈRES</h2>
      <p class="text-sm text-slate-400 italic text-center mb-8 font-serif">Plan détaillé du mémoire et pagination associée</p>
    </div>`
  },
  {
    id: "sommaire_p",
    type: "sommaire_p",
    title: "Sommaire P",
    content: `<div class="w-full text-slate-800 font-serif text-sm mt-8">
      <div class="flex items-center justify-between border-b pb-2">
        <span class="font-bold">Sommaire</span>
        <span class="text-slate-400 flex-1 mx-2 overflow-hidden select-none">...........................................................................................</span>
        <span class="font-mono">p. iv</span>
      </div>
      <div class="flex items-center justify-between border-b py-2 mt-2">
        <span class="font-semibold">Introduction Générale</span>
        <span class="text-slate-400 flex-1 mx-2 overflow-hidden select-none">..................................................................................</span>
        <span class="font-mono">p. 1</span>
      </div>
      <div class="flex items-center justify-between border-b py-2 mt-2">
        <span class="font-semibold">Première Partie</span>
        <span class="text-slate-400 flex-1 mx-2 overflow-hidden select-none">...........................................................................................</span>
        <span class="font-mono">p. 3</span>
      </div>
      <div class="flex items-center justify-between border-b py-2 mt-2">
        <span class="font-semibold">Deuxième Partie</span>
        <span class="text-slate-400 flex-1 mx-2 overflow-hidden select-none">...........................................................................................</span>
        <span class="font-mono">p. 5</span>
      </div>
      <div class="flex items-center justify-between border-b py-2 mt-2">
        <span class="font-semibold">Conclusion Générale</span>
        <span class="text-slate-400 flex-1 mx-2 overflow-hidden select-none">..................................................................................</span>
        <span class="font-mono">p. 7</span>
      </div>
      <div class="flex items-center justify-between border-b py-2 mt-2">
        <span class="font-semibold">Bibliographie</span>
        <span class="text-slate-400 flex-1 mx-2 overflow-hidden select-none">.........................................................................................</span>
        <span class="font-mono">p. 9</span>
      </div>
    </div>`
  }
];
