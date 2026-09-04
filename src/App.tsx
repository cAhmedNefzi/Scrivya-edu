import React, { useState } from "react";
import AcademicWorkspace from "./components/AcademicWorkspace";
import MinimalistLandingPage from "./components/MinimalistLandingPage";

export interface UserProfile {
  name: string;
  email: string;
  university?: string;
  avatar?: string;
  isGoogle?: boolean;
}

export default function App() {
  const [lang, setLang] = useState<"fr" | "en" | "ar">("fr");
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  if (currentUser) {
    return (
      <AcademicWorkspace 
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        lang={lang}
        theme={theme}
        setTheme={setTheme}
      />
    );
  }

  return (
    <MinimalistLandingPage
      lang={lang}
      setLang={setLang}
      onOpenWorkspace={(user) => {
        setCurrentUser(
          user || {
            name: "Ahmed Sassi",
            email: "ahmed.sassi@insat.u-carthage.tn",
            university: "INSAT Tunis - Génie Logiciel",
            isGoogle: false,
          }
        );
      }}
    />
  );
}
