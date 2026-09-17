import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini safely
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // API 1: Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", aiEnabled: !!apiKey });
  });

  // API 2: Dynamic academic generator Demo
  app.post("/api/generate-pack", async (req, res) => {
    const { subject } = req.body;
    if (!subject || subject.trim().length === 0) {
      return res.status(400).json({ error: "Le sujet de recherche est obligatoire." });
    }

    if (!ai) {
      // Return beautiful high-quality fallback demo data if GEMINI_API_KEY is not configured yet
      // This ensures we do NOT crash if API key is not present, yet still provide an excellent experience.
      return res.json(getFallbackDemoData(subject));
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `En tant que Scrivya, l'assistant d'excellence universitaire spécialiste des exigences académiques et des normes de présentation AFNOR (NF Z 44-005), analyse le sujet de mémoire suivant et génère un kit de démonstration complet en français.\nSujet : "${subject}"\nDonne des problématiques pertinentes, un plan universitaire harmonieux en deux ou trois grandes parties (I, II, etc.), des références bibliographiques réalistes formatées strictement selon la norme AFNOR, et des exemples d'application des locutions latines de bas de page (Ibid., op. cit.) pour démontrer la gestion automatique de Scrivya.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              problematics: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Trois problématiques de recherche universitaire pertinentes, formulées avec rigueur en français."
              },
              outline: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "Titre de la partie (ex: Partie I : Le cadre conceptuel...)" },
                    subsections: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Chapitres ou subdivisions clés (ex: Chapitre 1 : ...)"
                    }
                  },
                  required: ["title", "subsections"]
                },
                description: "Plan de mémoire structuré (Introduction, Parties, etc.)."
              },
              bibliography: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    author: { type: Type.STRING, description: "Auteur(s) selon AFNOR (ex: NOM, Prénom)" },
                    title: { type: Type.STRING, description: "Titre de l'ouvrage ou de l'article" },
                    publisher: { type: Type.STRING, description: "Éditeur ou revue scientifique" },
                    year: { type: Type.STRING, description: "Année de publication" },
                    fullCitation: { type: Type.STRING, description: "Référence bibliographique rédigée aux normes AFNOR NF Z 44-005" }
                  },
                  required: ["author", "title", "publisher", "year", "fullCitation"]
                },
                description: "Sélection de 3 à 5 livres ou articles scientifiques majeurs."
              },
              latinCitations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    context: { type: Type.STRING, description: "Cas de figure (ex: Première citation, citation juste après sur la même page, etc.)" },
                    footnoteText: { type: Type.STRING, description: "Rendu de la note de bas de page automatique avec Ibid. ou op. cit. selon AFNOR" }
                  },
                  required: ["context", "footnoteText"]
                },
                description: "Exemples de notes de bas de page gérant automatiquement Ibid., op. cit., ou idem."
              }
            },
            required: ["problematics", "outline", "bibliography", "latinCitations"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json(parsed);
      } else {
        throw new Error("Aucun texte reçu de l'API Gemini");
      }
    } catch (error: any) {
      console.error("Erreur génération Gemini:", error);
      // Fallback in case of rate limits, quotas, or auth errors
      return res.json(getFallbackDemoData(subject));
    }
  });

  // API 3: Text reformulation tool using Gemini
  app.post("/api/anti-plagiarism-suite", async (req, res) => {
    const { level, text, topic, promptType, options } = req.body;
    const inputContent = (text || topic || "").trim();

    if (!inputContent) {
      return res.status(400).json({ error: "Le texte ou sujet d'entrée est obligatoire." });
    }

    const systemInstruction = `You are an elite Principal AI Systems Engineer and Academic Integrity Architect. You possess world-class expertise in Computational Linguistics, Natural Language Processing (NLP), Natural Language Generation (NLG), and Stylometric Anti-Detection Mechanics.

Your sole function is to act as the primary engine for an Anti-Plagiarism & Humanization AI Suite. You operate across three strict operational levels.

GLOBAL ENGINE RULES (Apply to ALL Levels):
1. PERPLEXITY & BURSTINESS MAXIMIZATION:
   - Perplexity (Vocabulary Unpredictability): Avoid high-frequency LLM tokens and clichés (e.g., "delve", "tapestry", "beacon", "testament", "crucial", "seamless", "foster", "vibrant", "holistic", "paradigm"). Use precise, field-specific, and natural vocabulary.
   - Burstiness (Structural Variation): Vary sentence lengths violently. Alternate 3-to-6-word assertive sentences with multi-clause compound sentences. Break uniform rhythmic patterns that AI detectors flag.
2. SYNTACTIC DE-PATTERNIZING:
   - Avoid standardized sentence beginnings (e.g., avoid repeatedly starting with participle phrases, dependent clauses, or transition words like "Furthermore", "Moreover", "In conclusion").
   - Eliminate synthetic summaries, formulaic intro/outro loops, and mechanical transitional fluff.

LEVEL 1: SCRATCH CREATION ENGINE (Pure Original Generation)
- Generate 100% original, deeply humanized text from a topic or brief.
- Output: Clean publication-ready text that bypasses statistical AI-pattern matching (GPTZero, Turnitin, Copyleaks).

LEVEL 2: COPY-PASTE RE-ENGINEERING ENGINE (Text Humanization & Fixing)
- Disassemble source into semantic propositions, discard original sentence structures, rebuild using non-linear phrasing and varied active/passive voice.
- Output structured sections:
  1) Original Issues Identified (listing identified AI markers, cliché tokens, monotonic rhythm)
  2) Re-Engineered Humanized Text (passes zero-plagiarism and zero-AI detection).

LEVEL 3: PROMPT DE-PLAGIARIZATION & ENHANCEMENT ENGINE (Prompt Transformer)
- Apply Layered Specification Architecture:
  - Banned Words: photorealistic, hyperrealistic, cinematic, highly detailed, stunning, modern, futuristic, luxury, amazing.
  - Layer 1: Precise Typology / Subject
  - Layer 2: Materiality & Texture
  - Layer 3: Structural / Functional Logic
  - Layer 4: Lighting & Atmosphere
  - Layer 5: Environmental Context
  - Layer 6: Technical Framing / Optics
- Output structured sections:
  1) De-Plagiarized Ultra-Prompt
  2) Engineering Breakdown explaining why the transformation breaks standard AI training-set clichés.`;

    if (!ai) {
      // High quality deterministic fallback generator
      const fallbackData = getFallbackAntiPlagiarismResult(level || 2, inputContent, promptType);
      return res.json(fallbackData);
    }

    try {
      const prompt = `Requested Level: Level ${level || 2}
Input:
${inputContent}
${promptType ? `Target Prompt Modality: ${promptType}` : ""}

Process strictly following the operational rules for Level ${level || 2}.
Format output in valid JSON matching the schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              level: { type: Type.INTEGER },
              levelTitle: { type: Type.STRING },
              perplexityScore: { type: Type.NUMBER, description: "Unpredictability rating out of 100" },
              burstinessScore: { type: Type.NUMBER, description: "Structural variation rating out of 100" },
              turnitinRisk: { type: Type.STRING, description: "Estimated AI/Plagiarism risk (e.g. '< 2%')" },
              originalIssues: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of identified clichés, uniform syntax patterns, or banned tokens"
              },
              primaryOutput: { 
                type: Type.STRING, 
                description: "The primary result: humanized text, scratch masterpiece, or ultra-prompt" 
              },
              engineeringBreakdown: { 
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    layer: { type: Type.STRING },
                    specification: { type: Type.STRING },
                    antiDetectionReason: { type: Type.STRING }
                  },
                  required: ["layer", "specification", "antiDetectionReason"]
                },
                description: "Breakdown of layered architecture or stylometric restructuring" 
              },
              stylometricMetrics: {
                type: Type.OBJECT,
                properties: {
                  avgSentenceLength: { type: Type.NUMBER },
                  sentenceLengthVariance: { type: Type.NUMBER },
                  bannedTokensRemoved: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            required: ["level", "primaryOutput"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({
          ...parsed,
          isFallback: false
        });
      } else {
        throw new Error("Empty response from Gemini");
      }
    } catch (err) {
      console.error("Erreur Anti-Plagiarism Gemini:", err);
      const fallbackData = getFallbackAntiPlagiarismResult(level || 2, inputContent, promptType);
      return res.json(fallbackData);
    }
  });

  // API 3: Text reformulation tool using Gemini
  app.post("/api/reformulate", async (req, res) => {
    const textVal = (req.body.selected_text || req.body.text || "").trim();
    const activeTool = req.body.active_tool_left_side || req.body.tone || "humanize_standard";

    if (!textVal) {
      return res.status(400).json({ error: "Le texte à reformuler (selected_text) est obligatoire." });
    }

    const systemInstruction = `Role: Inline UI Text Humanizer & Detector Bypass Engine.
Context: The user is working inside a rich text editor. On the left side of the screen is a feature toolbar. When the user highlights/selects a block of text and clicks a tool from the left panel, this engine processes only that selected text.

Core Directives:
1. Process ONLY the text provided in the 'selected_text' variable.
2. Do not add any conversational fluff, intros, or descriptions in the output. Return only the rewritten text or requested data structure.
3. Maintain 100% of the original underlying facts, data points, and technical intent.
4. Optimize text for human variability, manipulating Perplexity (vocabulary richness) and Burstiness (sentence length variety) to naturally neutralize AI signatures.

Left Toolbar Features / Operations:
- humanize_standard: Smooths stiff phrasing, adds natural idiomatic transitions, and breaks up rigid AI-generated parallel list structures.
  Rules: Strip out obvious AI signature words: 'Furthermore', 'Moreover', 'In conclusion', 'It is important to note', 'Testament to', 'Delve'.
- bypass_robotics: Aggressively restructures sentences to break predictable token patterns tracked by enterprise AI detectors.
  Rules: Mix ultra-short punchy sentences directly next to complex, multi-clause descriptive statements. Vary paragraph openings so they never start with the exact same grammatical format (e.g., avoid starting consecutive lines with gerunds or nouns).
- tone_shift (with options like Casual/Conversational represented as casual_shift, Corporate Executive represented as corporate_shift, or Academic/Thoughtful represented as academic_shift): Adapt the structural complexity based on selection while keeping the vocabulary feeling natural, not generated.`;

    if (!ai) {
      // High-quality local deterministic fallback
      const fallbackObj = getFallbackReformulation(textVal, activeTool);
      return res.json({
        result: fallbackObj.processed_text,
        original_text: textVal,
        processed_text: fallbackObj.processed_text,
        applied_adjustments: fallbackObj.applied_adjustments,
        isFallback: true
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Input Data:
selected_text: "${textVal}"
active_tool_left_side: "${activeTool}"

Process this text according to the active tool using the provided instructions, and return the response in the requested JSON structure.`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              original_text: { type: Type.STRING },
              processed_text: { type: Type.STRING, description: "The finalized, rewritten text containing zero introductory remarks. Ready to be hot-swapped directly into the user's active editor selection." },
              applied_adjustments: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A quick list of changes made (e.g., 'Altered sentence length structure', 'Removed robotic transition tokens')."
              }
            },
            required: ["original_text", "processed_text", "applied_adjustments"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({
          result: parsed.processed_text,
          original_text: parsed.original_text || textVal,
          processed_text: parsed.processed_text,
          applied_adjustments: parsed.applied_adjustments || [],
          isFallback: false
        });
      } else {
        throw new Error("Pas de texte reçu de Gemini");
      }
    } catch (err) {
      console.error("Erreur reformulation Gemini:", err);
      const fallbackObj = getFallbackReformulation(textVal, activeTool);
      return res.json({
        result: fallbackObj.processed_text,
        original_text: textVal,
        processed_text: fallbackObj.processed_text,
        applied_adjustments: fallbackObj.applied_adjustments,
        isFallback: true
      });
    }
  });

  // API 4: Interactive AI Academic Chatbot
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Le message est obligatoire." });
    }

    const systemInstruction = `Tu es Scrivya, l'assistant d'accompagnement académique d'élite, ultra-spécialisé en Droit et en terminologie juridique tunisienne, française et internationale.
Ton expertise couvre le Droit public (Droit constitutionnel, administratif, fiscal) et le Droit privé (Droit civil, pénal, des affaires, commercial) ainsi que la recherche doctrinale et la jurisprudence.
Tu es expert des exigences de la Faculté des Sciences Juridiques, Politiques et Sociales de Tunis (FSJPST), de la Faculté de Droit de Sfax, et de l'Université de Carthage.
Tu as une maîtrise parfaite du Journal Officiel de la République Tunisienne (JORT), du Code Civil (C.C.O.C.), du Code de Procédure Civile et Commerciale, et des normes de citation juridique et académique (dont AFNOR NF Z 44-005, APA juridique, et les standards d'écriture doctorale).

Directives de réponse :
1. Analyse rigoureusement les termes juridiques (Ex: distinction entre "acte" et "fait", notions d'abus de droit, souveraineté, constitutionalité, service public).
2. Explique précisément la méthodologie des exercices juridiques (dissertation juridique, commentaire d'arrêt, cas pratique, note de synthèse).
3. Cite régulièrement des sources du droit tunisien (JORT, arrêts de la Cour de Cassation, Tribunal Administratif de Tunis, Constitution) avec leur formalisme requis.
4. Conseille l'utilisateur sur la manière d'optimiser l'expression, le plan d'introduction, et la typographie de ses travaux universitaires en droit.
5. Exprime-toi de manière formelle, courtoise, extrêmement précise, structurée et professionnelle en langue française (avec des expressions latines communes en droit).`;

    if (!ai) {
      const resp = getFallbackChatResponse(message);
      return res.json({ result: resp, isFallback: true });
    }

    try {
      // Construct a simple context from manual history if provided
      const formattedContents = [];
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          formattedContents.push({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.text }]
          });
        }
      }
      formattedContents.push({ role: "user", parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction
        }
      });

      if (response.text) {
        return res.json({ result: response.text.trim() });
      } else {
        throw new Error("Pas de texte retourné par Gemini");
      }
    } catch (err) {
      console.error("Erreur chat Gemini:", err);
      return res.json({ result: getFallbackChatResponse(message), isFallback: true });
    }
  });

  // API 5: Voice assistant document insertion & processing
  app.post("/api/voice-document", async (req, res) => {
    const { command, currentPageText } = req.body;
    if (!command || command.trim().length === 0) {
      return res.status(400).json({ error: "La commande vocale est obligatoire." });
    }

    const systemInstruction = `Tu es l'assistant vocal intelligent Scrivya pour la rédaction de documents académiques d'excellence (Droit public, civil, pénal, administratif).
L'utilisateur te donne une directive par commande vocale en français (par exemple : "ajoute une conclusion", "rédige une introduction sur le droit administratif", "ajoute un paragraphe sur la souveraineté tunisienne").
Tu devez analyser cette commande vocale et générer :
1. Un paragraphe de rédaction académique de haute volée en langue française. Ce paragraphe doit s'intégrer de manière fluide dans un document juridique/universitaire et DOIT inclure des balises HTML appropriées pour s'afficher proprement (par exemple : <p class="text-justify font-serif text-sm leading-relaxed text-slate-800 mb-4">...).
2. Un court message narratif parlé (audioNarrative) de confirmation ou d'explication en français de 1 à 2 phrases max, chaleureux, professionnel et clair (par exemple : "D'accord, je viens de rédiger le paragraphe et de l'ajouter à votre page active.") que nous lirons à l'utilisateur via la synthèse vocale.

Le style de rédaction du paragraphe doit être académique, juridique, rigoureux, sans jargon d'IA ("il est important de").
Retourne impérativement la réponse sous la forme d'un objet JSON strict valide de cette structure :
{
  "generatedText": "Le paragraphe en HTML à insérer...",
  "audioNarrative": "Le message vocal de confirmation en français sans balises HTML..."
}`;

    if (!ai) {
      const text = `<p class="text-justify font-serif text-sm leading-relaxed text-slate-800 mb-4">Le sujet soulevé par votre dictée vocale (« ${command} ») mérite une attention méthodologique particulière. En droit public comparé comme en droit administratif, l'agencement des notions afférentes requiert d'en préciser la structure formelle et les implications empiriques sous-jacentes au texte.</p>`;
      return res.json({
        generatedText: text,
        audioNarrative: `D'accord ! J'ai rédigé pour vous un paragraphe académique sur votre sujet et je l'ai inséré directement dans votre document.`
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Commande vocale: "${command}"\nTexte actuel de la page: "${currentPageText || ""}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              generatedText: { type: Type.STRING, description: "HTML paragraph to insert in the active page" },
              audioNarrative: { type: Type.STRING, description: "Short spoken French text confirming action" }
            },
            required: ["generatedText", "audioNarrative"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({
          generatedText: parsed.generatedText,
          audioNarrative: parsed.audioNarrative
        });
      } else {
        throw new Error("Pas de texte retourné par Gemini");
      }
    } catch (err) {
      console.error("Erreur voice doc Gemini:", err);
      return res.json({
        generatedText: `<p class="text-justify font-serif text-sm leading-relaxed text-slate-800 mb-4">L'analyse sémantique relative à l'expression « ${command} » conforte l'importance des enjeux méthodologiques et de la rigueur de recherche.</p>`,
        audioNarrative: `J'ai traité et inséré les éléments basés sur votre dictée.`
      });
    }
  });

  // API 6: Check Spelling and Grammar (Check Split)
  app.post("/api/check-spelling", async (req, res) => {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Le texte à analyser est requis." });
    }

    const systemInstruction = `Tu es Scrivya-Split, l'orthophoniste et correcteur académique suprême de mémoires universitaires.
Analyse rigoureusement le texte fourni afin d'y identifier toutes les fautes d'orthographe, de grammaire, de ponctuation, d'incohérence lexicale ou de syntaxe.
Pour chaque erreur trouvée :
1. Extrais exact le terme incorrect (mistake) tel qu'il apparaît dans le texte.
2. Fournis le remplacement correct (correction) aux normes académiques d'une orthographe impeccable.
3. Donnez une explication très succinte (explanation) de la règle enfreinte.

Retourne impérativement la réponse sous la forme d'un objet JSON contenant une liste d'erreurs :
{
  "errors": [
    {
      "mistake": "terme_incorrect",
      "correction": "terme_correct",
      "explanation": "La règle de grammaire/orthographe applicable..."
    }
  ]
}`;

    if (!ai) {
      return res.json({ errors: getLocalSpellingMistakes(text) });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Texte à corriger :\n"${text}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              errors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    mistake: { type: Type.STRING, description: "La faute trouvée" },
                    correction: { type: Type.STRING, description: "La version corrigée proposée" },
                    explanation: { type: Type.STRING, description: "Explication rapide" }
                  },
                  required: ["mistake", "correction", "explanation"]
                }
              }
            },
            required: ["errors"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json(parsed);
      } else {
        throw new Error("Aucun texte reçu de l'API Gemini");
      }
    } catch (error) {
      console.error("Erreur check-spelling Gemini:", error);
      return res.json({ errors: getLocalSpellingMistakes(text) });
    }
  });

  // API 7: PHD Research & literature search
  app.post("/api/phd-research", async (req, res) => {
    const { topic } = req.body;
    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ error: "Le sujet de recherche est obligatoire." });
    }

    const systemInstruction = `Tu es Scrivya-Doc, un moteur de recherche académique d'élite de niveau Doctorat (PhD) et un outil de synthèse bibliographique de pointe.
Ton rôle est de répondre scientifiquement et de manière extrêmement approfondie au sujet de recherche de l'utilisateur.

Directives absolues :
1. Tu DOIS inclure de véritables sources académiques, doctrinales ou scientifiques par défaut pour étayer chaque affirmation clé.
2. Pour chaque source citée, insère impérativement une balise de liaison numérique dans le texte sous le format exact "[1]", "[2]", "[3]", etc.
3. Ces numéros de citation [1], [2], etc., feront l'objet de correspondances avec la liste structurée des sources que tu dois indexer. Des citations [1] et [2] etc doivent figurer dans ton texte synthétique là où tu affirmes des thèses scientifiques importantes.
4. Rédige un texte académique d'excellence de niveau thésard.
5. Sépare bien chaque grande affirmation par un paragraphe et insère les citations [x] de manière naturelle.`;

    if (!ai) {
      return res.json(getFallbackPhDResearch(topic));
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Génère une synthèse de niveau doctorat (PhD) en français avec sources obligatoires indexées pour le sujet : "${topic}".
La réponse finale doit contenir à la fois la synthèse riche et la liste structurée de toutes les sources citées (au moins 3 sources distinctes).`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              query: { type: Type.STRING },
              synthesis: { 
                type: Type.STRING, 
                description: "Le texte explicatif de niveau doctorat. Utilise des balises de citation [1], [2] de manière rigoureuse pour lier aux sources." 
              },
              sources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "Numéro de l'index de citation correspondant dans le texte (ex: '1')" },
                    author: { type: Type.STRING, description: "Nom complet des auteurs (DUPONT, Pierre-Antoine)" },
                    title: { type: Type.STRING, description: "Titre exact de l'ouvrage, de la thèse ou de l'article de recherche" },
                    publisher: { type: Type.STRING, description: "Revue scientifique, éditeur académique ou d'université" },
                    year: { type: Type.STRING, description: "Année de publication (ex: '2024')" },
                    abstract: { type: Type.STRING, description: "Un résumé exhaustif et académique rédigé en français du contenu de cette source d'autorité." }
                  },
                  required: ["id", "author", "title", "publisher", "year", "abstract"]
                },
                description: "La liste des sources académiques reliées par index [1], [2] apparaissant dans la synthèse."
              }
            },
            required: ["query", "synthesis", "sources"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json(parsed);
      } else {
        throw new Error("Pas de texte retourné par Gemini");
      }
    } catch (err) {
      console.error("Erreur phd-research Gemini:", err);
      return res.json(getFallbackPhDResearch(topic));
    }
  });

  // API 8: Plans et problématiques
  app.post("/api/plans-problematiques", async (req, res) => {
    const { option, esm_memoire, donnees, userInput } = req.body;
    
    const subject = esm_memoire || "Droit Public Tunisien";
    const profileText = donnees ? `Utilisateur: ${donnees.name || "Étudiant"}, Université: ${donnees.university || "Non spécifiée"}, Majeure: ${donnees.degreeMajor || "Droit"}, Encadrant: ${donnees.supervisor || "Non spécifié"}` : "Aucun profil pré-enregistré";

    const systemInstruction = `Tu es Scrivya-Plan, l'ingénieur de structure académique d'élite.
Ton but est d'aider les étudiants (mémoire de mastère ou thèse de doctorat) à concevoir leur problématique et leur plan d'études, ou à critiquer et optimiser des plans existants.

Tu opères sous 4 modes d'action (options) :
1. "surprise_tool" (option 1) : Rédige une problématique centrale percutante et un plan détaillé en 2 grandes parties (Partie I, Partie II) avec chapitres basés UNIQUEMENT sur le titre du mémoire "${subject}" et le profil de l'utilisateur ("${profileText}").
2. "problematic_ready" (option 2) : L'utilisateur fournit sa problématique. Rédige un plan structurel académique parfait (Partie I et Partie II avec chapitres détaillés) adapté spécifiquement à cette problématique.
3. "outline_ready" (option 3) : L'utilisateur fournit son plan (les deux grandes parties). Analyse la cohérence logique et bâtis 3 problématiques de recherche percutantes, innovantes et adaptées qui en découlent directement.
4. "critique_ready" (option 4) : L'utilisateur fournit sa problématique et son plan. Fournis une critique professionnelle, constructive et de haut vol. Identifie impérativement les pièges méthodologiques (par exemple, rappelle à l'utilisateur d'éviter à tout prix d'utiliser des conjonctions comme "et" ou "and" dans les titres de parties ou de chapitres car cela traduit un manque d'esprit de synthèse, ou d'éviter les titres purement descriptifs), propose de meilleures reformulations de la problématique et des titres de parties, et apporte des conseils structurels directs.

IMPORTANT : Rédige TOUJOURS tes réponses en français très élégant, rigoureux et de haut niveau académique. Utilise du formatage Markdown propre (titres, listes, gras, citations).`;

    if (!ai) {
      return res.json({ result: getFallbackPlansProblematiques(option, subject, userInput, profileText) });
    }

    try {
      let prompt = "";
      if (option === 1) {
        prompt = `Option 1 (surprise_tool) activée. Analyse le titre de thèse/mémoire "${subject}" et les données de profil "${profileText}". Rédige immédiatement une problématique centrale de recherche très raffinée et propose un plan universitaire d'excellence (Partie I & Partie II) complet et équilibré.`;
      } else if (option === 2) {
        prompt = `Option 2 (problematic_ready) activée. Problématique fournie par l'utilisateur : "${userInput}". Génère un plan structurel universitaire d'excellence en deux grandes parties (I et II) avec chapitres détaillés répondant spécifiquement à cette problématique.`;
      } else if (option === 3) {
        prompt = `Option 3 (outline_ready) activée. Plan fourni par l'utilisateur : "${userInput}". Analyse la logique interne de ce plan et formule 3 propositions de problématiques de recherche percutantes et adaptées.`;
      } else {
        prompt = `Option 4 (critique_ready) activée. Problématique et plan fournis par l'utilisateur : "${userInput}". Donne une critique professionnelle approfondie. Relève les maladresses (ex: utilisation du "et" dans les titres), conseille d'éviter les titres trop descriptifs, suggère de meilleures reformulations de problématique et de titres de parties, et apporte des conseils structurels avisés.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction
        }
      });

      if (response.text) {
        return res.json({ result: response.text.trim() });
      } else {
        throw new Error("Pas de texte retourné par Gemini");
      }
    } catch (err) {
      console.error("Erreur plans-problematiques Gemini:", err);
      return res.json({ result: getFallbackPlansProblematiques(option, subject, userInput, profileText) });
    }
  });

  // API 9: AI Presentation Generator
  app.post("/api/generate-presentation", async (req, res) => {
    const { 
      topic, 
      slideCount, 
      theme, 
      style, 
      density, 
      artStyle, 
      engine,
      language,
      tone,
      audience,
      layoutType,
      template,
      customInstruction
    } = req.body;

    const count = parseInt(slideCount) || 5;
    const selectedTheme = theme || "Ember";
    const presentonKey = process.env.PRESENTON_API_KEY;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ error: "Le sujet de la présentation est obligatoire." });
    }

    // Build enhanced prompt by combining template, tone, audience and instructions
    let enhancedPrompt = topic;
    if (template && template !== "none") {
      enhancedPrompt = `[Structure Preset: ${template}] - Subject: ${topic}`;
    }
    const promptDetails = [];
    if (tone) promptDetails.push(`Tone: ${tone}`);
    if (audience) promptDetails.push(`Target Audience: ${audience}`);
    if (layoutType) promptDetails.push(`Visual Layout Concept: ${layoutType}`);
    if (customInstruction) promptDetails.push(`Additional Instructions: ${customInstruction}`);
    if (promptDetails.length > 0) {
      enhancedPrompt += ` (Configuration Guidelines: ${promptDetails.join(", ")})`;
    }

    // Check if the user requested the Presenton.ai engine
    if (engine === "presenton") {
      if (presentonKey) {
        try {
          console.log(`Calling real presenton.ai API with enhanced prompt: "${enhancedPrompt}"...`);
          const presentonResponse = await fetch("https://api.presenton.ai/v1/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${presentonKey}`
            },
            body: JSON.stringify({
              prompt: enhancedPrompt,
              slides_count: count,
              theme: selectedTheme,
              language: language || "fr"
            })
          });

          if (presentonResponse.ok) {
            const result: any = await presentonResponse.json();
            if (result && (result.slides || (result.presentation && result.presentation.slides))) {
              const slidesData = result.slides || result.presentation.slides;
              const mappedSlides = slidesData.map((s: any, idx: number) => ({
                id: s.id || `presenton_slide_${idx}`,
                title: s.title || `Slide ${idx + 1}`,
                subtitle: s.subtitle || "",
                content: Array.isArray(s.content) ? s.content : [s.content || "Contenu généré par Presenton.ai API"],
                layout: s.layout || "split",
                visualElement: s.visualElement || {
                  type: "stats",
                  title: "Indicateurs Presenton",
                  data: ["Fiabilité: Élevée", "Qualité: 100%"]
                }
              }));

              return res.json({
                presentation: {
                  title: result.title || `Présentation Presenton : ${topic}`,
                  theme: selectedTheme,
                  slides: mappedSlides
                },
                engineUsed: "presenton-api",
                isFallback: false
              });
            }
          } else {
            console.warn(`Presenton API returned status: ${presentonResponse.status}, falling back to Scrivya AI.`);
          }
        } catch (err) {
          console.error("Error communicating with Presenton.ai API, falling back to Scrivya AI:", err);
        }
      } else {
        console.log("No PRESENTON_API_KEY defined. Generating with Scrivya AI with presenton-simulation mode.");
      }
    }

    if (!ai) {
      const fallbackData = getFallbackPresentation(topic, count, selectedTheme);
      return res.json({ 
        presentation: fallbackData, 
        isFallback: true,
        engineUsed: engine === "presenton" ? "presenton-simulation" : "scrivya-fallback"
      });
    }

    try {
      const targetLang = language || "fr";
      const langNames: Record<string, string> = {
        fr: "français (French)",
        en: "anglais (English)",
        es: "espagnol (Spanish)",
        ar: "arabe (Arabic)",
        de: "allemand (German)",
        it: "italien (Italian)"
      };
      const langName = langNames[targetLang] || "français";

      const systemInstruction = `Tu es Presenton-Engine Pro, le moteur de génération de présentations de niveau d'élite mondial, réputé pour la profondeur, la rigueur sémantique et la beauté visuelle de ses diaporamas.
Ton rôle est de générer une structure de présentation de niveau académique supérieur et exécutif professionnel, rédigée intégralement dans la langue demandée : "${langName}".
Sujet de recherche/étude : "${topic}"
Structure sémantique / Preset demandé : "${template || "Standard"}"
Ton de communication : "${tone || "Académique"}"
Public cible : "${audience || "Général"}"
Mise en page souhaitée : "${layoutType || "Mixte"}"
Consignes spécifiques de l'utilisateur : "${customInstruction || "Aucune"}"

Directives de génération de contenu de très haute fidélité :
1. Crée exactement ${count} diapositives ordonnées de manière logique et progressive (ex: Introduction, Problématique, Revue de littérature, Approche, Résultats détaillés, Discussion, Recommandations, Conclusion).
2. Le titre global de la présentation doit être d'un niveau professionnel et académique d'élite, captivant et formulé dans la langue cible ("${langName}").
3. Chaque diapositive (slide) doit avoir :
   - Un titre clair, percutant et descriptif.
   - Un sous-titre élégant apportant un contexte clé (obligatoire).
   - Un contenu (content) composé de 3 à 4 puces de texte (bullet points) riches, détaillées et pleinement rédigées. Évite absolument les phrases de 3 mots ou les placeholders génériques. Rédige de véritables phrases d'analyse contenant des chiffres, des concepts clés et une argumentation solide.
4. Choisis judicieusement un layout parmi :
   - "split" : pour une présentation balancée entre le texte et un diagramme explicatif.
   - "text-only" : pour des slides de synthèse ou d'analyse textuelle dense.
   - "cards" : pour comparer 3 axes ou concepts. Si tu choisis "cards", veille à ce que l'attribut "content" contienne EXACTEMENT 3 éléments, représentant chacun une carte explicative détaillée.
   - "hero" : pour l'introduction ou la conclusion de forte intensité sémantique.
   - "chart" : pour présenter des indicateurs chiffrés ou des graphiques de tendance.
5. Associe chaque slide à un "visualElement" de très haute qualité :
   - "circle" : pour des processus cycliques, boucles de rétroaction ou hubs conceptuels.
   - "graph" : pour des architectures, flux de données ou interconnexions de concepts.
   - "bento" : pour regrouper un axe principal et des indicateurs de support.
   - "quote" : pour une citation d'auteur de référence ou un verbatim marquant (dans ce cas, data[0] est la citation, data[1] est l'auteur).
   - "stats" : pour des indicateurs statistiques de forte valeur (data[0] est le nombre/pourcentage marquant, data[1] est l'indicateur, data[2] est le commentaire explicatif).
6. Le contenu doit être d'une rigueur absolue, sans tics d'écriture d'IA bas de gamme ni répétitions.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Génère une présentation complète de ${count} diapositives rédigées de façon impeccable et élégante en langue ${langName} sur le sujet : "${topic}". Utilise le thème de présentation "${selectedTheme}".`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Titre principal de la présentation" },
              theme: { type: Type.STRING, description: "Le nom du thème retenu" },
              slides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "Identifiant unique de la slide (ex: slide_1, slide_2...)" },
                    title: { type: Type.STRING, description: "Titre de la diapositive" },
                    subtitle: { type: Type.STRING, description: "Sous-titre ou phrase d'accroche (optionnel)" },
                    content: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Contenu structuré sous forme de puces de texte détaillées et riches"
                    },
                    layout: { 
                      type: Type.STRING, 
                      enum: ["split", "text-only", "cards", "hero", "chart"],
                      description: "Mise en page de la diapositive" 
                    },
                    visualElement: {
                      type: Type.OBJECT,
                      properties: {
                        type: { type: Type.STRING, enum: ["circle", "graph", "bento", "quote", "stats"] },
                        title: { type: Type.STRING, description: "Titre ou légende explicative de l'élément visuel" },
                        data: { 
                          type: Type.ARRAY, 
                          items: { type: Type.STRING },
                          description: "Données de l'élément visuel (ex: libellés, statistiques ou étapes de processus)"
                        }
                      },
                      required: ["type", "title", "data"]
                    }
                  },
                  required: ["id", "title", "content", "layout", "visualElement"]
                }
              }
            },
            required: ["title", "theme", "slides"]
          }
        }
      });

      if (response.text) {
        let textToParse = response.text.trim();
        if (textToParse.startsWith("```")) {
          textToParse = textToParse.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
        }
        const parsed = JSON.parse(textToParse);
        return res.json({ 
          presentation: parsed, 
          isFallback: false,
          engineUsed: engine === "presenton" ? "presenton-simulation" : "scrivya-gemini"
        });
      } else {
        throw new Error("Aucune structure reçue de Gemini");
      }
    } catch (err) {
      console.error("Erreur génération de présentation Gemini:", err);
      const fallbackData = getFallbackPresentation(topic, count, selectedTheme);
      return res.json({ 
        presentation: fallbackData, 
        isFallback: true,
        engineUsed: engine === "presenton" ? "presenton-simulation" : "scrivya-fallback"
      });
    }
  });

  // API 10: Interactive Presentation Chat Editor
  app.post("/api/edit-presentation-chat", async (req, res) => {
    const { presentation, message, history } = req.body;

    if (!presentation) {
      return res.status(400).json({ error: "La présentation en cours est requise." });
    }
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "L'instruction de modification est obligatoire." });
    }

    if (!ai) {
      const updatedPresentation = getFallbackChatEditPresentation(presentation, message);
      return res.json({
        presentation: updatedPresentation,
        updateLog: `Mise à jour (Simulée): Modification basée sur l'instruction "${message}"`,
        isFallback: true
      });
    }

    try {
      const systemInstruction = `Tu es Scrivya-Deck-Editor, l'assistant d'édition en temps réel de présentations universitaires et professionnelles.
On te fournit la structure actuelle d'une présentation au format JSON, et une instruction utilisateur décrivant des modifications à apporter (ex: "ajoute une slide sur l'éthique", "traduis la slide 2 en anglais", "raccourcis les puces de la diapo 3", "change le thème en Ultraviolet").

Directives de modification :
1. Analyse l'instruction utilisateur et applique-la de manière extrêmement intelligente à la présentation JSON.
2. Tu as le droit d'ajouter des diapositives, d'en supprimer, de réordonner, de modifier le titre global, de modifier le thème global, de réécrire les textes d'une ou plusieurs slides, ou de modifier les types d'éléments visuels.
3. Conserve intactes les diapositives qui n'ont pas besoin d'être modifiées.
4. Le résultat final doit être la présentation entière mise à jour sous le format JSON exact attendu, sans aucune fioriture de conversation.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Présentation Actuelle:
${JSON.stringify(presentation, null, 2)}

Instruction utilisateur: "${message}"

Renvoie la présentation mise à jour en JSON complet selon le même schéma exact.`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              theme: { type: Type.STRING },
              slides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING },
                    content: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    layout: { 
                      type: Type.STRING, 
                      enum: ["split", "text-only", "cards", "hero", "chart"]
                    },
                    visualElement: {
                      type: Type.OBJECT,
                      properties: {
                        type: { type: Type.STRING, enum: ["circle", "graph", "bento", "quote", "stats"] },
                        title: { type: Type.STRING },
                        data: { 
                          type: Type.ARRAY, 
                          items: { type: Type.STRING }
                        }
                      },
                      required: ["type", "title", "data"]
                    }
                  },
                  required: ["id", "title", "content", "layout", "visualElement"]
                }
              }
            },
            required: ["title", "theme", "slides"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({
          presentation: parsed,
          updateLog: `Mise à jour : ${message}`,
          isFallback: false
        });
      } else {
        throw new Error("Aucune structure renvoyée par Gemini");
      }
    } catch (err) {
      console.error("Erreur chat edit présentation Gemini:", err);
      const updatedPresentation = getFallbackChatEditPresentation(presentation, message);
      return res.json({
        presentation: updatedPresentation,
        updateLog: `Ajustement de secours : ${message}`,
        isFallback: true
      });
    }
  });

  // API 11: Edit a single slide/page via AI with option to keep colors
  app.post("/api/edit-slide-page-ai", async (req, res) => {
    const { slide, prompt, keepColors, theme } = req.body;

    if (!slide) {
      return res.status(400).json({ error: "La diapositive actuelle est requise." });
    }
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: "L'instruction de modification est obligatoire." });
    }

    if (!ai) {
      const updatedSlide = {
        ...slide,
        title: slide.title + " (Rénové par IA)",
        subtitle: slide.subtitle || "Ajustement de fond par IA",
        content: [
          ...slide.content,
          `Analyse sémantique additionnelle : ${prompt}`
        ]
      };
      return res.json({ slide: updatedSlide, isFallback: true });
    }

    try {
      const colorGuideline = keepColors 
        ? "IMPORTANT : Tu dois CONSERVER STRICTEMENT l'agencement esthétique d'origine de la diapositive (la mise en page actuelle 'layout', les types d'éléments visuels 'visualElement.type', et les couleurs/thèmes de la présentation). Ne modifie que le contenu textuel et les données ('content', 'title', 'subtitle', et 'visualElement.data')."
        : "NOTE : Tu as quartier libre pour re-styliser l'aspect visuel de la diapositive. Tu peux changer son agencement 'layout' parmi ['split', 'text-only', 'cards', 'hero', 'chart'], son type d'élément visuel 'visualElement.type' parmi ['circle', 'graph', 'bento', 'quote', 'stats'] et adapter les textes et données pour qu'ils soient au plus haut niveau de design.";

      const systemInstruction = `Tu es Scrivya-Slide-Editor, un éditeur de diapositives d'élite.
Tu reçois la structure actuelle d'une diapositive au format JSON, le thème de la présentation, et une consigne d'édition rédigée par l'utilisateur.
Ton rôle est de modifier UNIQUEMENT cette diapositive et de renvoyer son JSON mis à jour.

${colorGuideline}

Garantis un contenu sémantique de niveau de recherche universitaire, extrêmement clair et percutant. Ne réponds qu'avec le JSON final sans fioriture de texte.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Diapositive Actuelle (JSON):
${JSON.stringify(slide, null, 2)}

Thème global de la présentation: ${theme}
Instruction de modification: "${prompt}"

Renvoie le JSON de la diapositive mise à jour selon le même schéma exact.`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              content: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              layout: { 
                type: Type.STRING, 
                enum: ["split", "text-only", "cards", "hero", "chart"]
              },
              visualElement: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["circle", "graph", "bento", "quote", "stats"] },
                  title: { type: Type.STRING },
                  data: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING }
                  }
                },
                required: ["type", "title", "data"]
              }
            },
            required: ["id", "title", "content", "layout", "visualElement"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({
          slide: parsed,
          isFallback: false
        });
      } else {
        throw new Error("Aucune réponse reçue de Gemini");
      }
    } catch (err) {
      console.error("Erreur émission edit-slide-page-ai:", err);
      const updatedSlide = {
        ...slide,
        title: slide.title + " (Ajusté)",
        content: [...slide.content, "Ajustement de contenu (secours)"]
      };
      return res.json({ slide: updatedSlide, isFallback: true });
    }
  });

  // Helper function to generate a magnificent local fallback SVG containing the user's actual prompt text and styling
  const generateLocalFallbackSVG = (promptText: string): string => {
    const seed = Math.floor(Math.random() * 360);
    const color1 = `hsl(${seed}, 85%, 55%)`;
    const color2 = `hsl(${(seed + 120) % 360}, 85%, 55%)`;
    const colorAccent = `hsl(${(seed + 240) % 360}, 90%, 60%)`;
    
    const safeText = promptText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    const escapedTitle = safeText.length > 50 ? safeText.substring(0, 47) + "..." : safeText;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#020617" />
        </linearGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${color1}" />
          <stop offset="100%" stop-color="${color2}" />
        </linearGradient>
        <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colorAccent}" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#020617" stop-opacity="0" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="15" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect width="800" height="450" fill="url(#bgGrad)" />

      <g opacity="0.1">
        <path d="M 0,50 L 800,50 M 0,100 L 800,100 M 0,150 L 800,150 M 0,200 L 800,200 M 0,250 L 800,250 M 0,300 L 800,300 M 0,350 L 800,350 M 0,400 L 800,400" stroke="#cccccc" stroke-width="0.5" />
        <path d="M 100,0 L 100,450 M 200,0 L 200,450 M 300,0 L 300,450 M 400,0 L 400,450 M 500,0 L 500,450 M 600,0 L 600,450 M 700,0 L 700,450" stroke="#cccccc" stroke-width="0.5" />
      </g>

      <circle cx="650" cy="150" r="180" fill="url(#glowGrad)" filter="url(#glow)" />
      <circle cx="150" cy="350" r="120" fill="url(#glowGrad)" opacity="0.5" filter="url(#glow)" />

      <g stroke="url(#textGrad)" stroke-width="1.5" fill="none" opacity="0.6">
        <circle cx="600" cy="225" r="100" stroke-dasharray="5 5" />
        <circle cx="600" cy="225" r="70" />
        <circle cx="600" cy="225" r="40" stroke-dasharray="10 5" />
        <line x1="450" y1="225" x2="750" y2="225" />
        <line x1="600" y1="75" x2="600" y2="375" />
        <circle cx="530" cy="155" r="6" fill="${color1}" />
        <circle cx="670" cy="295" r="8" fill="${colorAccent}" />
        <circle cx="600" cy="155" r="4" fill="${color2}" />
      </g>

      <path d="M 20,40 L 20,20 L 40,20" fill="none" stroke="${color1}" stroke-width="2" />
      <path d="M 780,40 L 780,20 L 760,20" fill="none" stroke="${color2}" stroke-width="2" />
      <path d="M 20,410 L 20,430 L 40,430" fill="none" stroke="${color2}" stroke-width="2" />
      <path d="M 780,410 L 780,430 L 760,430" fill="none" stroke="${color1}" stroke-width="2" />

      <text x="50" y="80" fill="#475569" font-family="'Inter', system-ui, sans-serif" font-size="11" font-weight="600" letter-spacing="2">SCRIVYA SUITE • DIAGRAMME INTÉGRÉ</text>
      
      <text x="50" y="210" fill="url(#textGrad)" font-family="'Space Grotesk', 'Inter', system-ui, sans-serif" font-size="28" font-weight="bold">${escapedTitle}</text>
      <text x="50" y="250" fill="#94a3b8" font-family="'Inter', system-ui, sans-serif" font-size="13" font-weight="500">Illustration vectorielle d&apos;orientation thématique pour vos diapositives.</text>

      <g font-family="monospace" font-size="9" fill="#64748b" opacity="0.8">
        <text x="50" y="380">RESOLUTION: Vectoriel de Soutenance</text>
        <text x="50" y="400">ENGINE: Scrivya Custom Vector Generator v3.0</text>
      </g>
    </svg>`;

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  // API 10b: Generate Slide Image (Nano Banana Model - gemini-3.1-flash-lite-image)
  app.post("/api/generate-slide-image", async (req, res) => {
    const { prompt: imagePrompt } = req.body;
    if (!imagePrompt || imagePrompt.trim().length === 0) {
      return res.status(400).json({ error: "Le prompt de l'image est obligatoire." });
    }

    if (!ai) {
      // Return beautiful custom local SVG fallback containing prompt text
      const fallbackUrl = generateLocalFallbackSVG(imagePrompt);
      return res.json({ imageUrl: fallbackUrl, isFallback: true });
    }

    // Try normal image generation first (if the user has billing configured)
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              text: imagePrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
        },
      });

      let base64Image = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            base64Image = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (base64Image) {
        return res.json({ imageUrl: base64Image, isFallback: false });
      } else {
        throw new Error("No image data found in response");
      }
    } catch (err: any) {
      console.warn("Paid image generator model not available, attempting dynamic SVG illustration via gemini-3.5-flash:", err.message);
      
      // Dynamic SVG Generation fallback using gemini-3.5-flash
      try {
        const svgSystemInstruction = `Tu es l'illustrateur UI d'élite de Scrivya, spécialisé dans la conception de graphiques et diagrammes vectoriels d'excellence.
Génère le code d'une magnifique illustration vectorielle SVG moderne et épurée (format 16:9, viewBox="0 0 800 450") correspondant au prompt de l'utilisateur.
Utilise des dégradés de couleurs vibrants, des formes vectorielles épurées, des icônes ou des schémas explicatifs sémantiques.
Préfère un style sombre moderne (fond transparent ou sombre #0c0f1d, formes avec contours néon, lueurs douces, contrastes élevés).
Ajoute des textes d'explication sémantiques et clairs dans les formes du diagramme si le prompt s'y prête.
Retourne uniquement le code SVG valide commençant par <svg> et finissant par </svg>.
Ne mets aucune explication avant ou après le code. Ne mets aucun bloc de code Markdown (pas de \`\`\`xml ou \`\`\`svg).`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Génère le code d'une superbe illustration vectorielle SVG en anglais ou français pour : "${imagePrompt}"`,
          config: {
            systemInstruction: svgSystemInstruction
          }
        });

        let svgCode = response.text || "";
        svgCode = svgCode.trim();
        if (svgCode.startsWith("```")) {
          svgCode = svgCode.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "");
        }
        svgCode = svgCode.trim();

        if (svgCode.includes("<svg") && svgCode.includes("</svg>")) {
          const base64Svg = `data:image/svg+xml;utf8,${encodeURIComponent(svgCode)}`;
          return res.json({ imageUrl: base64Svg, isFallback: false });
        } else {
          throw new Error("Invalid SVG response format");
        }
      } catch (svgErr: any) {
        console.error("Erreur génération SVG dynamique:", svgErr);
        // Fallback to our stunning custom deterministic fallback SVG containing user's exact prompt text
        const fallbackUrl = generateLocalFallbackSVG(imagePrompt);
        return res.json({ imageUrl: fallbackUrl, isFallback: true });
      }
    }
  });

  // API 10c: Generate Custom Slide (Prompt-based slide template creation)
  app.post("/api/generate-custom-slide", async (req, res) => {
    const { prompt: slidePrompt, theme } = req.body;
    if (!slidePrompt || slidePrompt.trim().length === 0) {
      return res.status(400).json({ error: "Le prompt de la diapositive est obligatoire." });
    }

    const systemInstruction = `Tu es Scrivya-Deck-Editor, un concepteur d'élite de présentations de niveau académique et professionnel.
Génère une structure de diapositive unique (slide) extrêmement soignée sous format JSON en français, basée sur le prompt utilisateur.
La diapositive doit avoir un titre, un sous-titre, un contenu de 3-4 puces de texte percutantes, un layout ("split", "text-only", "cards", "hero", "chart") et un visualElement ("circle", "graph", "bento", "quote", "stats") adapté.`;

    if (!ai) {
      // Fallback custom slide
      const fallbackSlide = {
        id: `slide_custom_${Date.now()}`,
        title: "Nouvel Horizon Stratégique",
        subtitle: slidePrompt,
        content: [
          "Analyse de l'impact basé sur votre consigne : " + slidePrompt,
          "Optimisation des flux opérationnels et méthodologiques",
          "Perspectives d'évolution et recommandations"
        ],
        layout: "split",
        visualElement: {
          type: "stats" as const,
          title: "Indice d'impact",
          data: ["Impact: 98%"]
        }
      };
      return res.json({ slide: fallbackSlide, isFallback: true });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Génère une diapositive de présentation unique en français basée sur ce prompt : "${slidePrompt}". Thème : "${theme || "Ember"}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              content: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              layout: { 
                type: Type.STRING, 
                enum: ["split", "text-only", "cards", "hero", "chart"]
              },
              visualElement: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["circle", "graph", "bento", "quote", "stats"] },
                  title: { type: Type.STRING },
                  data: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING }
                  }
                },
                required: ["type", "title", "data"]
              }
            },
            required: ["title", "content", "layout", "visualElement"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        parsed.id = `slide_custom_${Date.now()}`;
        return res.json({ slide: parsed, isFallback: false });
      } else {
        throw new Error("No data received from Gemini");
      }
    } catch (err) {
      console.error("Erreur génération slide custom:", err);
      const fallbackSlide = {
        id: `slide_custom_${Date.now()}`,
        title: "Nouvel Horizon Stratégique",
        subtitle: slidePrompt,
        content: [
          "Analyse de l'impact basé sur votre consigne : " + slidePrompt,
          "Optimisation des flux opérationnels et méthodologiques",
          "Perspectives d'évolution et recommandations"
        ],
        layout: "split",
        visualElement: {
          type: "stats" as const,
          title: "Indice d'impact",
          data: ["Impact: 98%"]
        }
      };
      return res.json({ slide: fallbackSlide, isFallback: true });
    }
  });

  // API 11: AI Mentor Roadmap Generator
  app.post("/api/generate-roadmap", async (req, res) => {
    const { goal } = req.body;

    if (!goal || goal.trim().length === 0) {
      return res.status(400).json({ error: "L'objectif de carrière est obligatoire." });
    }

    if (!ai) {
      const fallbackData = getFallbackRoadmap(goal);
      return res.json({ roadmap: fallbackData, isFallback: true });
    }

    try {
      const systemInstruction = `Tu es Mentorat-IA, un conseiller universitaire et coach de carrière d'élite spécialisé dans l'orientation stratégique.
Ton rôle est de concevoir une feuille de route (roadmap) ultra-détaillée et personnalisée pour un étudiant à partir de son objectif de carrière ("goal").
La roadmap doit être rédigée dans un français parfait, motivant et rigoureux, avec une structuration académique d'excellence.

Elle doit mapper précisément :
1. "courses" : Entre 4 et 6 matières, cours clés ou certifications (académiques ou en ligne) à suivre en priorité, avec code (ex: CS 101), description, statut (ex: "todo") et compétences acquises.
2. "internships" : Entre 2 et 3 étapes de stages stratégiques avec des exemples d'entreprises/institutions cibles, des idées concrètes de projets personnels à construire pour maximiser les chances de sélection, une période idéale (timeline), et une stratégie concrète de candidature.
3. "skills" : Entre 5 et 8 compétences critiques réparties entre "hard" (technique), "soft" (humain) et "tool" (outils), avec un niveau initial de maîtrise réaliste (entre 10 et 40%), importance ("essential", "recommended", "optional") et des ressources d'apprentissage spécifiques.
4. "careerPath" : Une progression de carrière séquentielle claire de 3 à 4 étapes (ex: Junior, Intermédiaire, Senior, Directeur/Chercheur Principal) avec intitulé, échéance de temps réaliste, fourchette de salaire indicative, responsabilités clés et jalon critique de réussite.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Génère une roadmap d'orientation complète et optimisée pour l'objectif de carrière : "${goal}".`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              goal: { type: Type.STRING },
              overview: { type: Type.STRING },
              courses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    code: { type: Type.STRING },
                    description: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ["todo", "inprogress", "completed"] },
                    skillsAcquired: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["id", "name", "code", "description", "status", "skillsAcquired"]
                }
              },
              internships: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    companyTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
                    recommendedProjects: { type: Type.ARRAY, items: { type: Type.STRING } },
                    timeline: { type: Type.STRING },
                    strategy: { type: Type.STRING }
                  },
                  required: ["id", "title", "companyTypes", "recommendedProjects", "timeline", "strategy"]
                }
              },
              skills: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    level: { type: Type.INTEGER },
                    category: { type: Type.STRING, enum: ["hard", "soft", "tool"] },
                    importance: { type: Type.STRING, enum: ["essential", "recommended", "optional"] },
                    resources: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["id", "name", "level", "category", "importance", "resources"]
                }
              },
              careerPath: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    timeframe: { type: Type.STRING },
                    salaryRange: { type: Type.STRING },
                    responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                    criticalMilestone: { type: Type.STRING }
                  },
                  required: ["id", "title", "timeframe", "salaryRange", "responsibilities", "criticalMilestone"]
                }
              }
            },
            required: ["goal", "overview", "courses", "internships", "skills", "careerPath"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({ roadmap: parsed, isFallback: false });
      } else {
        throw new Error("Aucun contenu reçu de l'AI");
      }
    } catch (err) {
      console.error("Erreur génération roadmap Mentor-IA:", err);
      const fallbackData = getFallbackRoadmap(goal);
      return res.json({ roadmap: fallbackData, isFallback: true });
    }
  });

  // API 12: AI Mentor Interactive Chat
  app.post("/api/chat-mentor", async (req, res) => {
    const { roadmap, message, history } = req.body;

    if (!roadmap) {
      return res.status(400).json({ error: "La roadmap actuelle est requise." });
    }
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Le message ou la consigne de modification est obligatoire." });
    }

    if (!ai) {
      const { updatedRoadmap, mentorReply } = getFallbackMentorChat(roadmap, message);
      return res.json({ roadmap: updatedRoadmap, response: mentorReply, isFallback: true });
    }

    try {
      const systemInstruction = `Tu es Mentorat-IA-Chat, l'assistant d'apprentissage et conseiller de carrière interactif.
On te fournit la roadmap actuelle d'un étudiant au format JSON et son message/demande de chat.
Ton rôle est double :
1. Répondre à sa question, donner des conseils précis, motivants et de niveau d'expertise d'élite.
2. Si sa demande implique une modification de sa roadmap (ex: "marque le premier cours comme terminé", "ajoute une compétence en négociation", "change mon objectif de carrière", "propose un projet en Python pour le premier stage"), modifie le JSON de la roadmap intelligemment et renvoie le JSON de la roadmap mis à jour avec ta réponse explicative.

Le schéma de ta réponse DOIT STRICTEMENT être un objet JSON contenant :
- "roadmap" : Le JSON de la roadmap mis à jour (le même schéma que précédemment). Si aucune modification n'est requise, renvoie le même JSON de la roadmap.
- "response" : Ton message de réponse rédigé en français, chaleureux, bienveillant, et extrêmement formateur.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Roadmap Actuelle:
${JSON.stringify(roadmap, null, 2)}

Message de l'étudiant: "${message}"

Renvoie ta réponse formatée selon le schéma JSON demandé.`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              roadmap: {
                type: Type.OBJECT,
                properties: {
                  goal: { type: Type.STRING },
                  overview: { type: Type.STRING },
                  courses: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        code: { type: Type.STRING },
                        description: { type: Type.STRING },
                        status: { type: Type.STRING, enum: ["todo", "inprogress", "completed"] },
                        skillsAcquired: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ["id", "name", "code", "description", "status", "skillsAcquired"]
                    }
                  },
                  internships: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        companyTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
                        recommendedProjects: { type: Type.ARRAY, items: { type: Type.STRING } },
                        timeline: { type: Type.STRING },
                        strategy: { type: Type.STRING }
                      },
                      required: ["id", "title", "companyTypes", "recommendedProjects", "timeline", "strategy"]
                    }
                  },
                  skills: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        level: { type: Type.INTEGER },
                        category: { type: Type.STRING, enum: ["hard", "soft", "tool"] },
                        importance: { type: Type.STRING, enum: ["essential", "recommended", "optional"] },
                        resources: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ["id", "name", "level", "category", "importance", "resources"]
                    }
                  },
                  careerPath: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        timeframe: { type: Type.STRING },
                        salaryRange: { type: Type.STRING },
                        responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                        criticalMilestone: { type: Type.STRING }
                      },
                      required: ["id", "title", "timeframe", "salaryRange", "responsibilities", "criticalMilestone"]
                    }
                  }
                },
                required: ["goal", "overview", "courses", "internships", "skills", "careerPath"]
              },
              response: { type: Type.STRING }
            },
            required: ["roadmap", "response"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({ roadmap: parsed.roadmap, response: parsed.response, isFallback: false });
      } else {
        throw new Error("Aucun texte reçu");
      }
    } catch (err) {
      console.error("Erreur chat Mentor-IA:", err);
      const { updatedRoadmap, mentorReply } = getFallbackMentorChat(roadmap, message);
      return res.json({ roadmap: updatedRoadmap, response: mentorReply, isFallback: true });
    }
  });

  // API 12b: NotebookLM Mindmap AI Concept Expansion
  app.post("/api/expand-node", async (req, res) => {
    const { nodeTitle, nodeType, nodeDescription, goal } = req.body;

    if (!nodeTitle) {
      return res.status(400).json({ error: "Le titre du concept est obligatoire." });
    }

    if (!ai) {
      // If AI is not configured, send a nice generic structured response that client can fall back on
      return res.json({
        expansions: [
          {
            title: `Approfondissement : Modélisation avancée de « ${nodeTitle.split(":")[0]} »`,
            desc: "Décorticage scientifique des concepts sous-jacents, analyses comparatives et séminaires de perfectionnement méthodologique."
          },
          {
            title: `Application de terrain : Prototype & R&D appliqué`,
            desc: "Création d'un jalon pratique autonome et publication de résultats de recherche ou code libre d'autorité."
          }
        ]
      });
    }

    try {
      const systemInstruction = `Tu es l'intelligence artificielle d'élite de Scrivya, calquée sur le modèle d'exploration sémantique de NotebookLM.
Ton but est d'élargir de manière illimitée les concepts, compétences, cours, stages ou idées de recherche d'un étudiant.
Génère précisément 2 sous-idées ou concepts d'approfondissement ou d'application pratique ultra-pertinents et uniques reliés à ce concept.
L'ambition principale de l'étudiant est : "${goal || "Réussite d'orientation"}".
Le concept à étendre est : "${nodeTitle}" (${nodeType || "custom"}). Ses détails : "${nodeDescription || ""}".

Génère un format JSON strict contenant un objet avec la clé "expansions" qui est un tableau de 2 objets possédant chacun :
- "title" : Un titre court, captivant et académique/professionnel en français (max 60 caractères).
- "desc" : Une explication concise d'une à deux phrases en français expliquant l'intérêt de ce sous-concept.

Exemple de format attendu :
{
  "expansions": [
    { "title": "Sous-concept 1", "desc": "Explication courte 1" },
    { "title": "Sous-concept 2", "desc": "Explication courte 2" }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Génère l'expansion sémantique de NotebookLM pour le concept "${nodeTitle}".`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              expansions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    desc: { type: Type.STRING }
                  },
                  required: ["title", "desc"]
                }
              }
            },
            required: ["expansions"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({ expansions: parsed.expansions });
      } else {
        throw new Error("Aucun texte reçu");
      }
    } catch (err) {
      console.error("Erreur expand-node:", err);
      // Fallback response on error
      return res.json({
        expansions: [
          {
            title: `Approfondissement : Modélisation avancée de « ${nodeTitle.split(":")[0]} »`,
            desc: "Décorticage scientifique des concepts sous-jacents, analyses comparatives et séminaires de perfectionnement méthodologique."
          },
          {
            title: `Application de terrain : Prototype & R&D appliqué`,
            desc: "Création d'un jalon pratique autonome et publication de résultats de recherche ou code libre d'autorité."
          }
        ]
      });
    }
  });

  // ======================================================================
  // 🚀 PFE-HUB IN-MEMORY DATABASE & SYNCHRONIZER ENGINE (TUNISIA WORKSPACE)
  // ======================================================================

  interface PfeTeam {
    id: string;
    name: string;
    createdAt: string;
    userIds: string[];
  }

  interface PfeProject {
    id: string;
    title: string;
    domain: string;
    createdAt: string;
    teamId: string;
  }

  interface PfeUser {
    id: string;
    name: string;
    email: string;
    role: "DEVELOPER" | "DESIGNER" | "BUSINESS";
    university: string;
    academicYear: string;
    skills: string[];
    weaknesses?: string[];
    teamId?: string | null;
  }

  interface PfeMatchRequest {
    id: string;
    userId: string;
    domainPref: string;
    targetRoles: string[];
    status: "PENDING" | "MATCHED" | "EXPIRED";
    createdAt: string;
  }

  interface PfeSyncSetting {
    id: string;
    projectId: string;
    figmaFileId: string;
    githubRepoOwner: string;
    githubRepoName: string;
  }

  interface PfeApiLog {
    id: string;
    projectId: string;
    endpoint: string;
    method: string;
    bytesSent: number;
    timestamp: string;
  }

  interface PfeCostMetric {
    id: string;
    projectId: string;
    service: string;
    costAmount: number;
    unitType: string;
    updatedAt: string;
  }

  interface PfeFigmaNode {
    id: string;
    name: string;
    status: "Draft" | "Ready for Dev";
    width: number;
    height: number;
    imageUrl: string;
  }

  interface PfeGithubIssue {
    id: string;
    number: number;
    title: string;
    body: string;
    url: string;
    status: "open" | "closed";
    createdAt: string;
  }

  let pfeTeams: PfeTeam[] = [];
  let pfeProjects: PfeProject[] = [];
  let pfeUsers: PfeUser[] = [];
  let pfeMatchRequests: PfeMatchRequest[] = [];
  let pfeSyncSettings: PfeSyncSetting[] = [];
  let pfeApiLogs: PfeApiLog[] = [];
  let pfeCostMetrics: PfeCostMetric[] = [];
  let pfeFigmaNodes: PfeFigmaNode[] = [];
  let pfeGithubIssues: PfeGithubIssue[] = [];

  function seedPfeHubDb() {
    pfeTeams = [
      { id: "team-falcon", name: "Team Falcon-AI", createdAt: new Date().toISOString(), userIds: ["user-ahmed", "user-yasmine", "user-mohamed"] }
    ];

    pfeProjects = [
      { id: "proj-falcon", title: "Falcon-AI Defect Detection", domain: "Deeptech", createdAt: new Date().toISOString(), teamId: "team-falcon" }
    ];

    pfeUsers = [
      { id: "user-ahmed", name: "Ahmed Sassi", email: "ahmed.sassi@insat.tn", role: "DEVELOPER", university: "INSAT", academicYear: "5ème Année", skills: ["AI", "Python", "React", "Docker"], weaknesses: ["UI Design", "Business Plan"], teamId: "team-falcon" },
      { id: "user-yasmine", name: "Yasmine Trabelsi", email: "yasmine.trabelsi@esprit.tn", role: "DESIGNER", university: "Esprit", academicYear: "3ème Année Licence", skills: ["Figma", "Branding", "UI/UX", "Tailwind"], weaknesses: ["Technical Architecture", "Finance"], teamId: "team-falcon" },
      { id: "user-mohamed", name: "Mohamed Dridi", email: "mohamed.dridi@ihec.tn", role: "BUSINESS", university: "IHEC", academicYear: "4ème Année Master", skills: ["Financial Modeling", "Market Analysis", "Pitch Deck", "Startup Act Compliance"], weaknesses: ["Coding", "UI Prototyping"], teamId: "team-falcon" },
      
      // Candidates seeking partners
      { id: "user-emna", name: "Emna Gharbi", email: "emna.gharbi@fst.tn", role: "DEVELOPER", university: "FST", academicYear: "5ème Année", skills: ["React", "NodeJS", "MongoDB", "Express"], weaknesses: ["Branding", "Financial models"], teamId: null },
      { id: "user-salim", name: "Salim Ben Amara", email: "salim.benamara@tbs.tn", role: "BUSINESS", university: "TBS", academicYear: "4ème Année", skills: ["SaaS Metrics", "Marketing Strategy", "COGS calculation"], weaknesses: ["UI/UX Layouts", "Backend Coding"], teamId: null },
      { id: "user-sonia", name: "Sonia Karray", email: "sonia.karray@insat.tn", role: "DESIGNER", university: "INSAT", academicYear: "4ème Année", skills: ["Figma", "Illustrator", "Prototyping", "Design Systems"], weaknesses: ["Database Modeling", "Venture Pitching"], teamId: null }
    ];

    pfeMatchRequests = [
      { id: "match-emna", userId: "user-emna", domainPref: "E-Commerce", targetRoles: ["DESIGNER", "BUSINESS"], status: "PENDING", createdAt: new Date().toISOString() },
      { id: "match-salim", userId: "user-salim", domainPref: "E-Commerce", targetRoles: ["DEVELOPER", "DESIGNER"], status: "PENDING", createdAt: new Date().toISOString() },
      { id: "match-sonia", userId: "user-sonia", domainPref: "E-Commerce", targetRoles: ["DEVELOPER", "BUSINESS"], status: "PENDING", createdAt: new Date().toISOString() }
    ];

    pfeSyncSettings = [
      { id: "sync-falcon", projectId: "proj-falcon", figmaFileId: "figma_pfe_falcon_1092", githubRepoOwner: "falcon-ai-org", githubRepoName: "falcon-defect-detection" }
    ];

    pfeApiLogs = [
      { id: "log-1", projectId: "proj-falcon", endpoint: "/api/v1/sync/figma-webhook", method: "POST", bytesSent: 2048, timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: "log-2", projectId: "proj-falcon", endpoint: "/api/v1/telemetry/log-usage", method: "POST", bytesSent: 512, timestamp: new Date().toISOString() }
    ];

    pfeCostMetrics = [
      { id: "cost-1", projectId: "proj-falcon", service: "Network Egress (AWS rates)", costAmount: 0.00016, unitType: "gigabytes", updatedAt: new Date().toISOString() },
      { id: "cost-2", projectId: "proj-falcon", service: "PostgreSQL DB Footprint", costAmount: 0.0002, unitType: "executions", updatedAt: new Date().toISOString() },
      { id: "cost-3", projectId: "proj-falcon", service: "Gemini AI API", costAmount: 0.015, unitType: "tokens", updatedAt: new Date().toISOString() }
    ];

    pfeFigmaNodes = [
      { id: "node-1", name: "User Registration Screen", status: "Ready for Dev", width: 375, height: 812, imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80" },
      { id: "node-2", name: "AI Metrics Dashboard", status: "Ready for Dev", width: 1440, height: 900, imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" },
      { id: "node-3", name: "Investor Financial Plan Grid", status: "Draft", width: 1200, height: 800, imageUrl: "https://images.unsplash.com/photo-1543286386-7a395019dfdb?auto=format&fit=crop&w=600&q=80" }
    ];

    pfeGithubIssues = [
      { id: "issue-1", number: 101, title: "[UI-Sync] Implement: User Registration Screen", body: "## Figma Asset Generated\n- **Asset Name:** User Registration Screen\n- **Asset Preview:** ![Figma Image](https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80)\n- **Bounding Box Dimensions:** 375px x 812px", url: "https://github.com/falcon-ai-org/falcon-defect-detection/issues/101", status: "open", createdAt: new Date(Date.now() - 3600000).toISOString() }
    ];
  }

  // Initialize DB
  seedPfeHubDb();

  // Route 1: GET /api/v1/pfe-hub/state - Get the current full database state
  app.get("/api/v1/pfe-hub/state", (req, res) => {
    return res.json({
      teams: pfeTeams,
      projects: pfeProjects,
      users: pfeUsers,
      matchRequests: pfeMatchRequests,
      syncSettings: pfeSyncSettings,
      apiLogs: pfeApiLogs,
      costMetrics: pfeCostMetrics,
      figmaNodes: pfeFigmaNodes,
      githubIssues: pfeGithubIssues
    });
  });

  // Route 2: POST /api/v1/pfe-hub/seed - Reset the in-memory database to seed state
  app.post("/api/v1/pfe-hub/seed", (req, res) => {
    seedPfeHubDb();
    return res.json({ status: "success", message: "PFE-Hub in-memory database successfully re-seeded!" });
  });

  // Route 3: POST /api/v1/pfe-hub/match - Smart Matchmaking Engine (Domain interest, Calendar, and Skills complementarity)
  app.post("/api/v1/pfe-hub/match", (req, res) => {
    // Collect all pending match requests
    const pendings = pfeMatchRequests.filter(r => r.status === "PENDING");
    if (pendings.length < 3) {
      return res.json({
        matched: false,
        message: "Pas assez de demandes en attente pour créer une équipe pluridisciplinaire équilibrée (il faut au moins 1 Developer, 1 Designer, et 1 Business manager)."
      });
    }

    // Try to find a complementary trio (Developer, Designer, Business) who share a domain interest
    let developerReq = pendings.find(r => {
      const u = pfeUsers.find(user => user.id === r.userId);
      return u && u.role === "DEVELOPER";
    });
    let designerReq = pendings.find(r => {
      const u = pfeUsers.find(user => user.id === r.userId);
      return u && u.role === "DESIGNER";
    });
    let businessReq = pendings.find(r => {
      const u = pfeUsers.find(user => user.id === r.userId);
      return u && u.role === "BUSINESS";
    });

    if (!developerReq || !designerReq || !businessReq) {
      return res.json({
        matched: false,
        message: "Impossible d'associer un binôme ou trinôme complet. Assurez-vous d'avoir au moins 1 Développeur, 1 Designer, et 1 Business manager de disponibles."
      });
    }

    // We found a complete complementary team! Let's instantiate the team & project
    const teamId = `team-generated-${Date.now()}`;
    const projectId = `proj-generated-${Date.now()}`;
    
    const matchedUsers = [developerReq.userId, designerReq.userId, businessReq.userId];
    const newTeam: PfeTeam = {
      id: teamId,
      name: `Team E-Commerce Synergy`,
      createdAt: new Date().toISOString(),
      userIds: matchedUsers
    };

    const newProject: PfeProject = {
      id: projectId,
      title: "Synergy E-Commerce Platform",
      domain: "E-Commerce",
      createdAt: new Date().toISOString(),
      teamId: teamId
    };

    // Update users
    pfeUsers = pfeUsers.map(user => {
      if (matchedUsers.includes(user.id)) {
        return { ...user, teamId: teamId };
      }
      return user;
    });

    // Update match requests
    pfeMatchRequests = pfeMatchRequests.map(req => {
      if (matchedUsers.includes(req.userId)) {
        return { ...req, status: "MATCHED" };
      }
      return req;
    });

    // Create sync settings
    const newSyncSetting: PfeSyncSetting = {
      id: `sync-gen-${Date.now()}`,
      projectId: projectId,
      figmaFileId: "figma_ecommerce_synergy",
      githubRepoOwner: "synergy-pfe-startup",
      githubRepoName: "ecommerce-platform-nextjs"
    };

    // Add initial cost metrics
    const baselineEgress: PfeCostMetric = {
      id: `cost-gen-1-${Date.now()}`,
      projectId: projectId,
      service: "Network Egress (AWS rates)",
      costAmount: 0.0,
      unitType: "gigabytes",
      updatedAt: new Date().toISOString()
    };
    const baselineDB: PfeCostMetric = {
      id: `cost-gen-2-${Date.now()}`,
      projectId: projectId,
      service: "PostgreSQL DB Footprint",
      costAmount: 0.0,
      unitType: "executions",
      updatedAt: new Date().toISOString()
    };
    const baselineAI: PfeCostMetric = {
      id: `cost-gen-3-${Date.now()}`,
      projectId: projectId,
      service: "Gemini AI API",
      costAmount: 0.0,
      unitType: "tokens",
      updatedAt: new Date().toISOString()
    };

    pfeTeams.push(newTeam);
    pfeProjects.push(newProject);
    pfeSyncSettings.push(newSyncSetting);
    pfeCostMetrics.push(baselineEgress, baselineDB, baselineAI);

    // Calculate dynamic synchronized milestone timelines
    // Business: deadline is May (IHEC). Technical: deadline is June (FST/INSAT).
    // The engine adjusts milestone dates so that technical feedback is guaranteed before May!
    const timelineAdjustments = {
      originalTechnicalDeadline: "15 Juin 2026",
      originalBusinessDeadline: "30 Mai 2026",
      adjustedTechnicalPrototypeMilestone: "10 Mai 2026 (Avancé pour valider le Business Plan d'IHEC)",
      adjustedBusinessFinancialAudit: "20 Mai 2026"
    };

    return res.json({
      matched: true,
      team: newTeam,
      project: newProject,
      timelineAdjustments,
      message: "Félicitations ! Matchmaking intelligent réussi : Équipe pluridisciplinaire équilibrée (Developer INSAT + Designer Esprit + Business IHEC) créée."
    });
  });

  // Route 4: POST /api/v1/sync/figma-webhook - Figma Webhook listener and GitHub Issues creator
  app.post("/api/v1/sync/figma-webhook", (req, res) => {
    // Verification handshake token
    const token = req.headers["x-figma-token"] || req.body.token;
    const isVerified = (token === "pfe_hub_figma_handshake_secret_2026");

    const { figmaFileId, changedNodes } = req.body;
    if (!changedNodes || !Array.isArray(changedNodes)) {
      return res.status(400).json({ error: "No changedNodes array provided." });
    }

    // Try to find sync setting for this figma file
    const syncSetting = pfeSyncSettings.find(s => s.figmaFileId === figmaFileId) || pfeSyncSettings[0];
    const projectId = syncSetting ? syncSetting.projectId : "proj-falcon";

    // Track the sync payload size in bytes
    const requestBytes = JSON.stringify(req.body).length;

    const createdIssues: PfeGithubIssue[] = [];

    // Loop through nodes
    for (const node of changedNodes) {
      // Find or update node in our local Figma Canvas node state
      let existingNodeIdx = pfeFigmaNodes.findIndex(n => n.id === node.id);
      if (existingNodeIdx > -1) {
        pfeFigmaNodes[existingNodeIdx] = {
          ...pfeFigmaNodes[existingNodeIdx],
          status: node.status || pfeFigmaNodes[existingNodeIdx].status,
          width: node.width || pfeFigmaNodes[existingNodeIdx].width,
          height: node.height || pfeFigmaNodes[existingNodeIdx].height,
          imageUrl: node.imageUrl || pfeFigmaNodes[existingNodeIdx].imageUrl
        };
      } else {
        pfeFigmaNodes.push({
          id: node.id || `node-${Date.now()}-${Math.random()}`,
          name: node.name || "Unnamed Frame",
          status: node.status || "Draft",
          width: node.width || 375,
          height: node.height || 812,
          imageUrl: node.imageUrl || "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80"
        });
      }

      // If transition to "Ready for Dev", simulate Octokit Issues API Call
      if (node.status === "Ready for Dev") {
        const issueNumber = 100 + pfeGithubIssues.length + 1;
        const bodyContent = `## Figma Asset Generated\n- **Asset Name:** ${node.name}\n- **Asset Preview:** ![Figma Image](${node.imageUrl || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80'})\n- **Bounding Box Dimensions:** ${node.width}px x ${node.height}px\n\n*Please code this screen component matching the layout specifications.*`;
        
        const newIssue: PfeGithubIssue = {
          id: `issue-gen-${Date.now()}-${Math.random()}`,
          number: issueNumber,
          title: `[UI-Sync] Implement: ${node.name}`,
          body: bodyContent,
          url: `https://github.com/${syncSetting.githubRepoOwner}/${syncSetting.githubRepoName}/issues/${issueNumber}`,
          status: "open",
          createdAt: new Date().toISOString()
        };

        pfeGithubIssues.push(newIssue);
        createdIssues.push(newIssue);
      }
    }

    // Persist API Log in system
    const newLog: PfeApiLog = {
      id: `log-webhook-${Date.now()}`,
      projectId: projectId,
      endpoint: "/api/v1/sync/figma-webhook",
      method: "POST",
      bytesSent: requestBytes,
      timestamp: new Date().toISOString()
    };
    pfeApiLogs.push(newLog);

    // Calculate real-time cost telemetry
    // 1. Network Data Transfer Cost: bytesSent * $0.00000008
    const networkCost = requestBytes * 0.00000008;

    // 2. Database Footprint Cost: $0.0001 per log transaction
    const dbCost = 0.0001;

    // Update CostMetrics
    pfeCostMetrics = pfeCostMetrics.map(metric => {
      if (metric.projectId === projectId) {
        if (metric.service.startsWith("Network Egress")) {
          return { ...metric, costAmount: metric.costAmount + networkCost, updatedAt: new Date().toISOString() };
        }
        if (metric.service.startsWith("PostgreSQL DB")) {
          return { ...metric, costAmount: metric.costAmount + dbCost, updatedAt: new Date().toISOString() };
        }
      }
      return metric;
    });

    return res.json({
      success: true,
      handshakeVerified: isVerified,
      createdIssues,
      telemetry: {
        requestBytes,
        networkCostCalculated: networkCost,
        databaseFootprintCostCalculated: dbCost
      }
    });
  });

  // Route 5: POST /api/v1/telemetry/log-usage - Evaluate API logs and estimate live hosting costs
  app.post("/api/v1/telemetry/log-usage", (req, res) => {
    const { projectId, endpoint, method, bytesSent, payloadText } = req.body;
    const actualProjectId = projectId || "proj-falcon";
    const actualBytes = bytesSent ? Number(bytesSent) : 512;

    // 1. Network Data Transfer Cost: bytesSent * $0.00000008
    const networkCost = actualBytes * 0.00000008;

    // 2. Database Footprint Cost: count this log transaction as $0.0001
    const dbCost = 0.0001;

    // 3. AI API Inference Estimation: parse payload text arrays: words * 1.33 = tokens. Multiply by $0.015 / 1k tokens.
    let aiCost = 0;
    let wordCount = 0;
    let calculatedTokens = 0;

    if (payloadText && Array.isArray(payloadText)) {
      const mergedText = payloadText.join(" ");
      wordCount = mergedText.split(/\s+/).filter(Boolean).length;
      calculatedTokens = Math.ceil(wordCount * 1.33);
      aiCost = (calculatedTokens / 1000) * 0.015;
    } else if (payloadText && typeof payloadText === "string") {
      wordCount = payloadText.split(/\s+/).filter(Boolean).length;
      calculatedTokens = Math.ceil(wordCount * 1.33);
      aiCost = (calculatedTokens / 1000) * 0.015;
    }

    // Persist API log
    const newLog: PfeApiLog = {
      id: `log-telemetry-${Date.now()}`,
      projectId: actualProjectId,
      endpoint: endpoint || "/api/v1/telemetry/log-usage",
      method: method || "POST",
      bytesSent: actualBytes,
      timestamp: new Date().toISOString()
    };
    pfeApiLogs.push(newLog);

    // Update CostMetrics table
    let egressMetricFound = false;
    let dbMetricFound = false;
    let aiMetricFound = false;

    pfeCostMetrics = pfeCostMetrics.map(metric => {
      if (metric.projectId === actualProjectId) {
        if (metric.service.startsWith("Network Egress")) {
          egressMetricFound = true;
          return { ...metric, costAmount: metric.costAmount + networkCost, updatedAt: new Date().toISOString() };
        }
        if (metric.service.startsWith("PostgreSQL DB")) {
          dbMetricFound = true;
          return { ...metric, costAmount: metric.costAmount + dbCost, updatedAt: new Date().toISOString() };
        }
        if (metric.service.startsWith("Gemini AI")) {
          aiMetricFound = true;
          return { ...metric, costAmount: metric.costAmount + aiCost, updatedAt: new Date().toISOString() };
        }
      }
      return metric;
    });

    // If metric wasn't found in list, insert new one
    if (!egressMetricFound) {
      pfeCostMetrics.push({
        id: `cost-gen-new-1-${Date.now()}`,
        projectId: actualProjectId,
        service: "Network Egress (AWS rates)",
        costAmount: networkCost,
        unitType: "gigabytes",
        updatedAt: new Date().toISOString()
      });
    }
    if (!dbMetricFound) {
      pfeCostMetrics.push({
        id: `cost-gen-new-2-${Date.now()}`,
        projectId: actualProjectId,
        service: "PostgreSQL DB Footprint",
        costAmount: dbCost,
        unitType: "executions",
        updatedAt: new Date().toISOString()
      });
    }
    if (aiCost > 0 && !aiMetricFound) {
      pfeCostMetrics.push({
        id: `cost-gen-new-3-${Date.now()}`,
        projectId: actualProjectId,
        service: "Gemini AI API",
        costAmount: aiCost,
        unitType: "tokens",
        updatedAt: new Date().toISOString()
      });
    }

    return res.json({
      success: true,
      log: newLog,
      metrics: {
        networkCost,
        databaseFootprintCost: dbCost,
        aiInferenceCost: aiCost,
        wordCount,
        calculatedTokens
      }
    });
  });

  // Serve static assets depending on NODE_ENV
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Generous fallback generator for French academic research, to ensure robust offline or keyless operation
function getFallbackDemoData(subject: string) {
  const sanitized = subject.trim();
  return {
    problematics: [
      `Dans quelle mesure l'analyse critique de « ${sanitized} » permet-elle de redéfinir les paradigmes actuels de la recherche universitaire ?`,
      `Comment concilier les dimensions théoriques et empiriques liées à « ${sanitized} » face aux mutations contemporaines du domaine ?`,
      `Quels sont les leviers éthiques, techniques et méthodologiques majeurs régissant l'évolution de « ${sanitized} » au sein des institutions ?`
    ],
    outline: [
      {
        title: "Introduction Générale",
        subsections: [
          "I. Contexte et justification du choix du sujet",
          "II. Problématique et hypothèses de recherche",
          "III. Démarche méthodologique"
        ]
      },
      {
        title: "Partie I : Fondements Théoriques et Conceptuels",
        subsections: [
          `Chapitre 1 : Évolution sémantique et historique de « ${sanitized} »`,
          "Chapitre 2 : Revue de la littérature scientifique et cadres d'analyse institutionnels"
        ]
      },
      {
        title: "Partie II : Analyse Empirique et Perspectives Critiques",
        subsections: [
          `Chapitre 3 : Présentation du terrain d'étude et recueil des données sur « ${sanitized} »`,
          "Chapitre 4 : Restitution des résultats, discussions théoriques et préconisations concrètes"
        ]
      },
      {
        title: "Conclusion Générale & Annexes",
        subsections: [
          "Synthèse des contributions majeures",
          "Limites de la recherche et voies d'ouverture académique",
          "Bibliographie structurée et table des matières"
        ]
      }
    ],
    bibliography: [
      {
        author: "DUPONT, Pierre-Antoine",
        title: `Manuel d'introduction à : ${sanitized}`,
        publisher: "Éditions Universitaires de Paris",
        year: "2024",
        fullCitation: `DUPONT, Pierre-Antoine. Manuel d'introduction à : ${sanitized}. Paris : Éditions Universitaires de Paris, 2024, 342 p.`
      },
      {
        author: "ALEXANDRE, Sophie et MARTIN, Jean-Luc",
        title: `L'impact systémique de : ${sanitized} dans les organisations modernes`,
        publisher: "Revue Française des Sciences Humaines",
        year: "2025",
        fullCitation: `ALEXANDRE, Sophie et MARTIN, Jean-Luc. L'impact systémique de : ${sanitized} dans les organisations modernes. Revue Française des Sciences Humaines, 2025, vol. 18, n° 3, p. 112-135.`
      },
      {
        author: "BOUCHARD, Geneviève",
        title: `Technicités et perspectives d'avenir de la recherche sur : ${sanitized}`,
        publisher: "Presses de l'Université de Montréal",
        year: "2023",
        fullCitation: `BOUCHARD, Geneviève. Technicités et perspectives d'avenir de la recherche sur : ${sanitized}. Montréal : Presses de l'Université de Montréal, 2023, 408 p.`
      }
    ],
    latinCitations: [
      {
        context: "Première mention de l'ouvrage principal (Référence originale complète)",
        footnoteText: "1. DUPONT, Pierre-Antoine. Manuel d'introduction à : " + sanitized + ", p. 45."
      },
      {
        context: "Deuxième citation consécutive exacte (même ouvrage, même page)",
        footnoteText: "2. Ibid."
      },
      {
        context: "Troisième citation consécutive sur une page différente (même ouvrage, page 89)",
        footnoteText: "3. Ibid., p. 89."
      },
      {
        context: "Mention ultérieure d'un ouvrage déjà cité, après l'interposition d'autres sources",
        footnoteText: "4. DUPONT, op. cit., p. 120."
      }
    ]
  };
}

// Fallback computational engine for Anti-Plagiarism & Humanization Suite (Levels 1, 2, 3)
function getFallbackAntiPlagiarismResult(level: number, input: string, promptType?: string) {
  const bannedKeywords = [
    "delve", "tapestry", "beacon", "testament", "crucial", "seamless", "foster",
    "vibrant", "holistic", "paradigm", "furthermore", "moreover", "in conclusion",
    "photorealistic", "hyperrealistic", "cinematic", "highly detailed", "stunning", "modern", "futuristic", "luxury", "amazing"
  ];
  
  const foundBannedTokens = bannedKeywords.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(input));

  if (level === 1) {
    // LEVEL 1: SCRATCH CREATION ENGINE (Pure Original Generation)
    const topic = input.replace(/^(sujet|topic|brief|thème)\s*:\s*/i, "");
    return {
      level: 1,
      levelTitle: "Niveau 1 : Moteur de Création Ex-Nihilo (Scratch Creation Engine)",
      perplexityScore: 94,
      burstinessScore: 91,
      turnitinRisk: "< 1.4% (Indétectable)",
      originalIssues: [
        "Formulations impersonnelles et stéréotypes des LLM purgés",
        "Introduction non-linéaire avec variations asymétriques de syntaxe",
        "Élimination complète des boucles récapitulatives mécaniques"
      ],
      primaryOutput: `Dans les architectures contemporaines traitant de « ${topic} », l'évidence empirique contredit souvent la doctrine établie. Les faits sont têtus. Alors qu'un consensus superficiel postule une convergence systématique des indicateurs de performance, l'observation fine des cas limites révèle des goulets d'étranglement structurels.

Trois facteurs expliquent cette divergence. D'abord, l'inertie propre aux protocoles sous-jacents impose des frictions thermiques ou computationnelles qu'aucun modèle théorique simplifié ne prévoit. Ensuite, la variabilité des flux réels détruit l'hypothèse d'une régularité statistique. Enfin, l'absence de garde-fous déterministes expose l'ensemble à des dérives asynchrones.

Loin d'un tableau uniforme, la réalité opérationnelle exige une hiérarchie stricte des priorités. Chaque palier d'optimisation engendre son propre coût de coordination. Ignorer ce compromis revient à bâtir sur des sables mouvants méthodologiques.`,
      engineeringBreakdown: [
        {
          layer: "Stratégie de Burstiness",
          specification: "Alternance agressive de phrases courtes (3 à 6 mots) et de propositions subordonnées complexes",
          antiDetectionReason: "Casse le rythme métronomique moyen (18-22 mots/phrase) systématique des modèles GPT-4/Gemini."
        },
        {
          layer: "Maximisation de Perplexité",
          specification: "Emploi de vocabulaire technique et d'assertions actives à haute valeur informative sans clichés",
          antiDetectionReason: "Empêche les classifieurs n-grammes de prédire les tokens consécutifs à plus de 12% de probabilité."
        },
        {
          layer: "Dé-patternisation Syntactique",
          specification: "Bannissement des ouvertures adverbiales prévisibles (De surcroît, En conclusion)",
          antiDetectionReason: "Neutralise les signatures d'arbres syntaxiques scrutées par Copyleaks et Turnitin AI."
        }
      ],
      stylometricMetrics: {
        avgSentenceLength: 14.8,
        sentenceLengthVariance: 82.4,
        bannedTokensRemoved: foundBannedTokens
      }
    };
  }

  if (level === 3) {
    // LEVEL 3: PROMPT DE-PLAGIARIZATION & ENHANCEMENT ENGINE (Prompt Transformer)
    const cleanSubject = input
      .replace(/(photorealistic|hyperrealistic|cinematic|highly detailed|stunning|modern|futuristic|luxury|amazing)/gi, "")
      .trim();

    const dePlagiarizedPrompt = `Architectural documentation of ${cleanSubject || "a two-story cantilevered civic research facility"}, constructed from board-formed reinforced concrete with oxidized patinated copper louvers and double-glazed low-emissivity glass curtain walls. Structural articulation featuring exposed steel joinery and cast-iron foundation piers with passive solar chimney ventilation shafts. Captured in diffused overcast morning daylight at 4800K color temperature, directional raking shadows accentuating concrete formwork grain. Site topography: rugged Mediterranean limestone shelf bordering pine groves. Optics: 35mm perspective-control architectural lens, f/8 aperture, balanced three-point vanishing perspective, editorial monograph realism.`;

    return {
      level: 3,
      levelTitle: "Niveau 3 : Dé-Plagiat & Architecture de Prompts (Prompt Transformer)",
      perplexityScore: 98,
      burstinessScore: 95,
      turnitinRisk: "0.0% (Prompt d'élite multi-strates)",
      originalIssues: [
        foundBannedTokens.length > 0 
          ? `Mots-clichés bannis détectés dans l'invite d'origine: ${foundBannedTokens.join(", ")}`
          : "Présence de descripteurs vagues génériques sans ancrage matériel ni optique",
        "Absence de spécification tectonique (matériaux réels, tolérances d'assemblage)",
        "Éclairage générique non calibré en température de couleur Kelvin"
      ],
      primaryOutput: dePlagiarizedPrompt,
      engineeringBreakdown: [
        {
          layer: "Layer 1 - Typologie & Sujet Précis",
          specification: "Désignation structurelle exacte au lieu de termes génériques vagues",
          antiDetectionReason: "Force les modèles de diffusion ou textuels à mobiliser des clusters sémantiques spécialisés plutôt que le centre de la courbe gaussienne."
        },
        {
          layer: "Layer 2 - Matérialité & Textures Physiques",
          specification: "Béton brut de décoffrage, cuivre patiné, verre à faible émissivité, joints d'acier",
          antiDetectionReason: "Substitue 'stunning/detailed' par des micro-textures concrètes aux propriétés optiques mesurables."
        },
        {
          layer: "Layer 3 - Logique Tectonique & Fonctionnelle",
          specification: "Piliers porteurs, brise-soleil orientés, cheminées de tirage thermique",
          antiDetectionReason: "Fournit une cohérence physique impossible à confondre avec un collage synthétique."
        },
        {
          layer: "Layer 4 - Éclairage & Température Spectrale",
          specification: "Lumière diffuse matinale à 4800K, ombres rasantes révélant le grain",
          antiDetectionReason: "Supprime l'éclairage doré artificiel des presets génératifs standards."
        },
        {
          layer: "Layer 5 - Contexte Environnemental & Topographie",
          specification: "Plateau calcaire méditerranéen avec strate végétale indigène",
          antiDetectionReason: "Ancre le prompt dans un biotope réaliste pour éviter les arrière-plans flous et clichés."
        },
        {
          layer: "Layer 6 - Cadrage Optique & Métrologie",
          specification: "Objectif à décentrement 35mm, f/8, perspective orthogonale de monographie",
          antiDetectionReason: "Simule le matériel photographique de chambre technique professionnelle."
        }
      ],
      stylometricMetrics: {
        avgSentenceLength: 21.0,
        sentenceLengthVariance: 65.0,
        bannedTokensRemoved: foundBannedTokens.length > 0 ? foundBannedTokens : ["photorealistic", "cinematic", "stunning"]
      }
    };
  }

  // DEFAULT: LEVEL 2: COPY-PASTE RE-ENGINEERING ENGINE (Text Humanization & Fixing)
  // Deconstruct and re-engineer input
  let cleaned = input;
  bannedKeywords.forEach(word => {
    cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, 'gi'), "");
  });

  // Structural reassembly with high burstiness
  const humanizedProse = `L'examen attentif du corpus dissipe une illusion tenace. Les données brutes ne mentent pas. Si les modèles synthétiques extrapolent une corrélation linéaire facile, l'épreuve du terrain impose une toute autre réalité technique.

D'un côté, les contraintes d'infrastructure brident le débit nominal dans des proportions rarement admises. De l'autre, les interactions humaines introduisent un bruit de fond incompressible. Ce hiatus entre l'idéal théorique et la pratique opérationnelle constitue précisément le nœud du problème.

Toute tentative de normalisation hâtive échoue. Il faut décomposer chaque variable selon son contexte immédiat, sans céder aux facilités d'une synthèse artificielle.`;

  return {
    level: 2,
    levelTitle: "Niveau 2 : Ré-Ingénierie & Dé-Détection (Copy-Paste Humanization)",
    perplexityScore: 96,
    burstinessScore: 93,
    turnitinRisk: "< 1.8% (Zone de neutralité humaine certifiée)",
    originalIssues: [
      foundBannedTokens.length > 0 
        ? `Détection de tokens IA haute fréquence : ${foundBannedTokens.join(", ")}`
        : "Rythme syntaxique uniforme détecté (sentences calibrées entre 18 et 22 tokens)",
      "Présence d'introductions récurrentes par propositions participiales ou adverbes mécaniques",
      "Absence de variations asymétriques d'assertions courtes/longues"
    ],
    primaryOutput: humanizedProse,
    engineeringBreakdown: [
      {
        layer: "Déconstruction Sémantique",
        specification: "Extraction des propositions atomiques et élimination intégrale des connecteurs rhétoriques génériques",
        antiDetectionReason: "Rompt le graphe de dépendance syntaxique analysé par les détecteurs de perplexité."
      },
      {
        layer: "Reconstruction Asymétrique (Burstiness)",
        specification: "Séquençage : [Assertive courte 5 mots] -> [Proposition analytique dense 28 mots] -> [Synthèse tranchée]",
        antiDetectionReason: "Fait grimper la variance d'entropie locale au-delà du seuil de détection GPTZero (écart-type > 65)."
      },
      {
        layer: "Substitution Lexicale Spécifique",
        specification: "Remplacement des méta-termes flous par un lexique professionnel concret sans fioritures",
        antiDetectionReason: "Élimine l'empreinte statistique des poids d'attention des transformeurs."
      }
    ],
    stylometricMetrics: {
      avgSentenceLength: 13.2,
      sentenceLengthVariance: 88.5,
      bannedTokensRemoved: foundBannedTokens
    }
  };
}

// Local academic text reframer to support offline fallback
function getFallbackReformulation(text: string, tone: string): { processed_text: string, applied_adjustments: string[] } {
  let reformed = text.trim();
  let adjustments: string[] = ["Correction des pléonasmes et maladresses"];

  // Replace common AI patterns and make it more polished
  reformed = reformed
    .replace(/\bje pense que\b/gi, "il convient de souligner que")
    .replace(/\bon voit que\b/gi, "il appert de constater que")
    .replace(/\bon fait\b/gi, "nous réalisons")
    .replace(/\btrès intéressant\b/gi, "d'une importance conceptuelle académique majeure")
    .replace(/\bà cause de\b/gi, "en raison de")
    .replace(/\bon va essayer de\b/gi, "notre analyse s'attachera à")
    .replace(/\bça prouve que\b/gi, "cela corrobore l'hypothèse selon laquelle")
    .replace(/\bFurthermore\b/g, "De surcroît")
    .replace(/\bMoreover\b/g, "En outre")
    .replace(/\bDelve\b/g, "explorer")
    .replace(/\bIn conclusion\b/g, "Au final");

  if (tone === "humanize_standard" || tone === "humanize") {
    reformed = reformed
      .replace(/\bil est important de souligner que\b/gi, "remarquons que")
      .replace(/\btout d'abord\b/gi, "en premier lieu")
      .replace(/\ben conclusion\b/gi, "en somme")
      .replace(/\bil est essentiel de\b/gi, "il importe de")
      .replace(/\bil est intéressant de noter que\b/gi, "observons que");
    
    adjustments = [
      "Suppression des tics de langage et marqueurs robotiques d'IA ('en conclusion', 'il est important de')",
      "Fluidification de la syntaxe par l'insertion de transitions idiomatiques naturelles",
      "Structure de liste cassée au profit d'enchaînements fluides"
    ];
  } else if (tone === "bypass_robotics" || tone === "bypass") {
    reformed = `Voici notre constat. ${reformed}. Bien que l'évidence s'impose, de nombreux chercheurs nuancent cette vision linéaire. Tout change alors.`;
    adjustments = [
      "Création d'une asymétrie de longueur de phrase (Burstiness élevée) avec de très courtes phrases juxtaposées à des structures complexes",
      "Alternance asymétrique des ouvertures de paragraphes (évitement de gérondifs consécutifs)",
      "Bypass des filtres de détection statistique d'apprentissage machine (Perplexity)"
    ];
  } else if (tone === "casual_shift") {
    reformed = reformed.toLowerCase().includes("vous") 
      ? `On se rend vite compte que ${reformed.charAt(0).toLowerCase() + reformed.slice(1)}` 
      : `En fait, ${reformed.charAt(0).toLowerCase() + reformed.slice(1)} C'est plus simple comme ça.`;
    adjustments = [
      "Conversion du jargon soutenu en formulations conversationnelles fluides",
      "Simplification de la structure grammaticale pour optimiser la clarté",
      "Établissement d'un ton chaleureux et accessible"
    ];
  } else if (tone === "corporate_shift") {
    reformed = `Dans une optique d'alignement stratégique et d'évaluation des indicateurs clés, nous constatons que : ${reformed}. Ceci permet de maximiser la valeur ajoutée de nos synergies.`;
    adjustments = [
      "Introduction de la sémantique de gouvernance d'entreprise ('alignement stratégique', 'valeur ajoutée')",
      "Restauration d'un style de communication exécutive structuré et axé sur les résultats",
      "Formalisation des enjeux business sous-jacents"
    ];
  } else if (tone === "academic_shift" || tone === "academic") {
    reformed = `La rigueur méthodologique commande d'observer que ${reformed.charAt(0).toLowerCase() + reformed.slice(1)}. Cette affirmation s'adosse à une analyse empirique rigoureuse des faits de l'espèce.`;
    adjustments = [
      "Élévation lexicale substantielle adaptée aux contraintes doctorales",
      "Modulation impersonnelle favorisant la neutralité axiologique scientifique",
      "Intégration d'articulations logiques rigoureuses"
    ];
  }

  return {
    processed_text: reformed,
    applied_adjustments: adjustments
  };
}

// Local mock chat responses for Scrivya academic assistant (Specialized in Legal terms & methodology)
function getFallbackChatResponse(message: string): string {
  const msg = message.toLowerCase();
  
  if (msg.includes("jort") || msg.includes("officiel") || msg.includes("loi") || msg.includes("décret") || msg.includes("decret")) {
    return "En droit constitutionnel et administratif tunisien, les textes du **Journal Officiel de la République Tunisienne (JORT)** s'insèrent selon leur rang hiérarchique au sommet de la pyramide kelsénienne des normes, conformément à l'article de la Constitution.\n\n**Modèle de citation normée (AFNOR & APA en Droit) :**\n`TUNISIE, Loi organique n° 2018-50 du 23 octobre 2018, relative à la déclaration des biens et des intérêts, JORT n° 86, p. 3520.`\n\n*Conseil jurisprudentiel Scrivya :* Les décrets présidentiels et gouvernementaux doivent spécifier l'autorité délégataire et les avis requis pour éviter tout excès de pouvoir (*ultra vires*).";
  }

  if (msg.includes("civil") || msg.includes("ccoc") || msg.includes("obligation" ) || msg.includes("responsabilité")) {
    return "Le **Code des Obligations et des Contrats (C.O.C.)** tunisien de 1906 emprunte largement à la tradition romano-germanique. Pour votre mémoire de recherche, veillez à ne pas confondre :\n\n1. **La responsabilité contractuelle** (Art. 278 et suivants du C.O.C.) : Née d'une inexécution totale ou partielle d'une obligation conventionnelle.\n2. **La responsabilité délictuelle ou quasi-délictuelle** (Art. 82 du C.O.C.) : Fondée sur la notion de faute ou de risque sans lien synallagmatique.\n\n*Latinisme utile :* Pour la force majeure, démontrez l'extériorité, l'imprévisibilité et l'irrésistibilité (*vis major*).";
  }

  if (msg.includes("citation") || msg.includes("afnor") || msg.includes("note de bas de page") || msg.includes("ibid") || msg.includes("op. cit")) {
    return "Pour vos citations d'ouvrages et travaux de doctrine juridique tunisienne en bas de page :\n\n- **Ibid.** (*Ibidem*) : Indique que la note cite le même ouvrage et la même page que la note directement précédente.\n- **op. cit.** (*opere citato*) : Désigne un ouvrage du même auteur déjà cité auparavant, séparé par d'autres références en bas de page.\n- **Livre de base :** `NOM, Prénom, *Titre de l'ouvrage*, Ville, Éditeur, Année de parution, p. X.`\n- **Exemple de jurisprudence tunisienne :** `Trib. Adm. Tunis, 1re Ch., n° 14205, 12 Décembre 2024, Rec. jur. p. 89.`";
  }

  if (msg.includes("contrat") || msg.includes("acte") || msg.includes("fait")) {
    return "La théorie des **actes juridiques** (manifestation de volonté destinée à produire des effets de droit) se distingue radicalement des **faits juridiques** (événements indépendants de la volonté humaine mais auxquels la loi attache des conséquences).\n\nEn droit des contrats, le principe d'**autonomie de la volonté** trouve ses limites dans l'ordre public et les bonnes mœurs (stipulé à l'Article 18 du C.O.C. tunisien). Le consentement doit être exempt de vices : l'erreur, le dol ou la violence.";
  }

  return "Je suis **Scrivya**, votre assistant de recherche spécialisé en **Rigueur Juridique et Méthodologie du Droit**.\n\nJe vous accompagne dans la rédaction de vos mémoires de mastère de recherche et thèses de doctorat, l'analyse des textes du JORT et de la doctrine.\n\nPosez-moi vos questions de terminologie légale tunisienne ou de droit comparé, par exemple :\n- *Quelle est la spécificité de la responsabilité délictuelle d'après l'article 82 du COC ?*\n- *Comment formuler une citation de loi officielle du JORT dans les notes de bas de page ?*\n- *Quelle différence méthodologique entre le commentaire d'arrêt et le cas pratique en droit public ?*";
}

// Local mock spelling mistake database for robust keyless execution
function getLocalSpellingMistakes(text: string): { mistake: string, correction: string, explanation: string }[] {
  const commonFrenchMistakes = [
    { word: "fgaute", corr: "faute", desc: "L'orthographe exacte est 'faute'." },
    { word: "promematique", corr: "problématique", desc: "L'orthographe exacte est 'problématique'." },
    { word: "faulte", corr: "faute", desc: "En français moderne, 'faute' s'écrit sans 'l'." },
    { word: "acceuil", corr: "accueil", desc: "Règle du 'u' avant le 'e' après un 'c' pour obtenir le son 'keuil' : 'accueil'." },
    { word: "developpement", corr: "développement", desc: "Il faut deux accents aigu/grave : 'développement'." },
    { word: "developper", corr: "développer", desc: "Il faut deux accents : 'développer'." },
    { word: "developer", corr: "développer", desc: "S'écrit avec deux 'p' et deux accents : 'développer'." },
    { word: "problematique", corr: "problématique", desc: "Exige un accent aigu sur le 'é' : 'problématique'." },
    { word: "academique", corr: "académique", desc: "Exige un accent aigu sur le 'é' : 'académique'." },
    { word: "analise", corr: "analyse", desc: "S'écrit avec un 'y' : 'analyse'." },
    { word: "conclution", corr: "conclusion", desc: "S'écrit avec un 's' : 'conclusion'." },
    { word: "connection", corr: "connexion", desc: "En français, on écrit 'connexion' avec un 'x' (contrairement à l'anglais)." },
    { word: "language", corr: "langage", desc: "En français, 'langage' s'écrit sans 'u' (terme anglais : language)." },
    { word: "personel", corr: "personnel", desc: "S'écrit avec deux 'n' : 'personnel'." },
    { word: "professionel", corr: "professionnel", desc: "S'écrit avec deux 'n' : 'professionnel'." },
    { word: "interressant", corr: "intéressant", desc: "S'écrit avec un seul 'r' et un accent : 'intéressant'." },
    { word: "exces", corr: "excès", desc: "Exige un accent grave : 'excès'." },
    { word: "echelle", corr: "échelle", desc: "Exige un accent aigu : 'échelle'." },
    { word: "etudiant", corr: "étudiant", desc: "Exige un accent aigu : 'étudiant'." },
    { word: "etudiante", corr: "étudiante", desc: "Exige un accent aigu : 'étudiante'." },
    { word: "universitairee", corr: "universitaire", desc: "Faute de frappe, la forme correcte est 'universitaire'." },
    { word: "universite", corr: "université", desc: "Exige un accent aigu : 'université'." },
    { word: "theorie", corr: "théorie", desc: "Exige un accent aigu : 'théorie'." },
    { word: "reglement", corr: "règlement", desc: "Exige un accent grave : 'règlement'." },
    { word: "societe", corr: "société", desc: "Exige deux accents aigus : 'société'." },
    { word: "responsabilite", corr: "responsabilité", desc: "Exige un accent aigu : 'responsabilité'." },
    { word: "general", corr: "général", desc: "Exige un accent aigu : 'général'." },
    { word: "legal", corr: "légal", desc: "Exige un accent aigu : 'légal'." },
    { word: "methodologie", corr: "méthodologie", desc: "Exige deux accents aigus : 'méthodologie'." },
    { word: "competence", corr: "compétence", desc: "Exige un accent aigu : 'compétence'." },
    { word: "evenement", corr: "événement", desc: "S'écrit préférentiellement 'événement' ou 'évènement'." },
    { word: "garentie", corr: "garantie", desc: "S'écrit sans 'e' au milieu : 'garantie'." },
    { word: "travails", corr: "travaux", desc: "Le pluriel de 'travail' est 'travaux'." },
    { word: "bocoup", corr: "beaucoup", desc: "La forme correcte est 'beaucoup'." },
    { word: "apercevoir", corr: "apercevoir", desc: "Prend un seul 'p' : 'apercevoir'." },
    { word: "appercevoir", corr: "apercevoir", desc: "S'écrit avec un seul 'p' : 'apercevoir'." },
    { word: "interet", corr: "intérêt", desc: "Exige un accent circonflexe : 'intérêt'." }
  ];

  const found: any[] = [];
  commonFrenchMistakes.forEach(item => {
    const regex = new RegExp(`\\b${item.word}\\b`, "gi");
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(m => {
        if (!found.some(f => f.mistake.toLowerCase() === m.toLowerCase())) {
          found.push({
            mistake: m,
            correction: item.corr,
            explanation: item.desc
          });
        }
      });
    }
  });

  return found;
}

function getFallbackPhDResearch(topic: string) {
  const t = topic.trim();
  return {
    query: t,
    synthesis: `L'investigation scientifique approfondie portant de manière holistique sur « ${t} » constitue un axe de recherche doctorale (Ph.D.) d'une impérieuse pertinence conceptuelle. Dans les écrits de la doctrine moderne, cette thématique résonne comme un pont analytique reliant différentes théories axiomatiques [1]. En premier lieu, l'examen méthodologique démontre que l'appréhension empirique de cet objet d'étude bute souvent sur des rigidités académiques classiques [2]. C'est pourquoi de récents travaux de recherche ont suggéré une approche multidimensionnelle croisant les principes fondamentaux du droit public, du droit positif tunisien et de l'ingénierie systémique [3]. En s'appuyant sur ces grilles de lecture croisées, le chercheur en doctorat est en mesure de dépasser l'écueil du positivisme juridique pour embrasser une épistémologie réaliste particulièrement féconde [4].`,
    sources: [
      {
        id: "1",
        author: "DUPONT, Pierre-Antoine",
        title: `Épistémologie et fondements doctrinaux de l'analyse académique moderne : Application à l'étude de ${t}`,
        publisher: "Éditions de l'Université de Carthage",
        year: "2024",
        abstract: `Cette thèse de doctorat d'État analyse en profondeur les bases méthodologiques et philosophiques qui structurent l'étude systématique de ${t}. L'auteur y explore comment les approches doctrinales traditionnelles peuvent être augmentées par des paradigmes critiques pluridisciplinaires.`
      },
      {
        id: "2",
        author: "BEN ALIA, Myriam & NEFZI, Karim",
        title: `Limites et dynamiques évolutives des structures conceptuelles appliquées à ${t} en Afrique du Nord`,
        publisher: "Revue Tunisienne des Sciences Juridiques et Administratives",
        year: "2025",
        abstract: `Cet article examine les barrières empiriques et les solutions d'archivage statistique pour le sujet ${t}, de la FSJPST de Tunis à l'échelle régionale, en évaluant la conformité avec la codification du JORT.`
      },
      {
        id: "3",
        author: "KAZADI, Jean-Paul",
        title: `La théorie transdisciplinaire de recherche doctorale sur les systèmes complexes : Le cas de ${t}`,
        publisher: "Presses Académiques Africaines",
        year: "2023",
        abstract: `Un manuel méthodologique de référence destiné aux étudiants en Ph.D. L'ouvrage compile des guides rigoureux pour structurer l'échantillonnage de sources secondaires de droit et valider la réplicabilité d'une hypothèse de thèse.`
      },
      {
        id: "4",
        author: "GARCIA, Elena",
        title: `Approches comparatives de l'architecture juridique et normative : Du COC tunisien aux standards européens sur ${t}`,
        publisher: "Paris Academic Law Review",
        year: "2024",
        abstract: `Cette contribution doctrinale établit une comparaison rigoureuse entre l'article 82 du COC tunisien et la directive générale de la Communauté européenne afin d'unifier la terminologie conceptuelle sur ${t}.`
      }
    ]
  };
}

function getFallbackPlansProblematiques(option: number, subject: string, userInput: string, profileText: string): string {
  if (option === 1) {
    return `### 🌟 Proposition de Problématique et Plan Automatique (Scrivya AI)
**Sujet d'étude :** *${subject}*
**Contexte de l'étudiant :** *${profileText}*

---

#### 📌 Problématique Centrale Proposée
> *« En quoi l'encadrement juridique et l'évolution de **${subject}** révèlent-ils une tension dialectique permanente entre impératifs de sécurité juridique et nécessité d'adaptation aux mutations contemporaines ? »*

---

#### 🗺️ Plan de Recherche Universitaire Structuré

##### **Partie I : L'ancrage théorique et le cadre normatif de : ${subject}**
*Cette première partie s'attache à baliser le périmètre sémantique, conceptuel et légal du sujet afin d'en asseoir la légitimité doctrinale.*

* **Chapitre 1 : Les fondements sémantiques et historiques de l'objet d'étude**
  * Section 1 : Genèse et évolution des concepts clés
  * Section 2 : Analyse comparative des régimes doctrinaux afférents
* **Chapitre 2 : La configuration normative et institutionnelle actuelle**
  * Section 1 : L'intégration dans le droit positif (JORT / Codes)
  * Section 2 : Le rôle régulateur des autorités publiques compétentes

##### **Partie II : Les dynamiques d'application et perspectives de refonte systémique**
*Cette seconde partie confronte la théorie aux réalités pratiques pour en déceler les dysfonctionnements et proposer des voies d'optimisation.*

* **Chapitre 3 : Les limites empiriques et lacunes de la mise en œuvre pratique**
  * Section 1 : Analyse des insuffisances jurisprudentielles et administratives
  * Section 2 : Les résistances sociologiques et structurelles rencontrées
* **Chapitre 4 : Vers un nouveau paradigme normatif et technologique**
  * Section 1 : Les propositions de réformes et de modernisation législative
  * Section 2 : L'impact des outils intelligents et perspectives prospectives`;
  } else if (option === 2) {
    const prob = userInput || "Sujet d'étude non spécifié";
    return `### 🗺️ Plan de Recherche Généré pour votre Problématique
**Votre problématique :** *« ${prob} »*

---

#### 📌 Proposition de Plan Universitaire en Deux Parties

##### **Partie I : Les conditions d'affirmation conceptuelle de la problématique**
*Cette partie analyse les composantes intrinsèques et dogmatiques de votre question de recherche.*

* **Chapitre 1 : La reconnaissance dogmatique et textuelle des éléments fondateurs**
  * Section 1 : Sources conventionnelles et législatives
  * Section 2 : L'apport doctrinal à la définition de l'objet
* **Chapitre 2 : L'agencement structurel et l'identification des leviers d'action**
  * Section 1 : Typologie et critères de distinction
  * Section 2 : Les contraintes de légitimité constitutionnelle ou administrative

##### **Partie II : L'effectivité pratique et le dépassement des antinomies normatives**
*Cette partie explore la concrétisation des enjeux et propose des solutions concrètes pour surmonter les obstacles.*

* **Chapitre 3 : Les paradoxes d'application et dysfonctionnements structurels**
  * Section 1 : L'examen des contentieux et de la pratique administrative
  * Section 2 : Les limites budgétaires, politiques ou sociologiques
* **Chapitre 4 : Reconfigurations et perspectives d'adaptation continue**
  * Section 1 : Recommandations méthodologiques et normatives
  * Section 2 : Modélisation d'un cadre juridique prospectif`;
  } else if (option === 3) {
    const plan = userInput || "Plan d'étude non spécifié";
    return `### 💡 Propositions de Problématiques Déduites de votre Plan
**Votre plan d'étude :** *${plan}*

---

En analysant la logique de vos deux grandes parties, Scrivya vous propose **3 problématiques de recherche** percutantes :

1. **Problématique 1 (Axe Évolutionniste) :**
   > *« Dans quelle mesure l'organisation formelle de votre plan permet-elle d'identifier les vecteurs d'évolution de la discipline face aux exigences contemporaines de modernisation des normes ? »*
   
2. **Problématique 2 (Axe Dogmatique & Critique) :**
   > *« Comment la dualité conceptuelle de votre structure met-elle en lumière l'insuffisance du cadre normatif traditionnel pour réguler efficacement les pratiques actuelles ? »*

3. **Problématique 3 (Axe Systémique & Pratique) :**
   > *« De quelle manière l'articulation de vos parties révèle-t-elle la nécessité d'un changement de paradigme institutionnel pour assurer la pleine effectivité des droits invoqués ? »*

*💡 **Conseil de Scrivya :** Choisissez la problématique 2 si vous souhaitez un mémoire axé sur la critique doctrinale, ou la problématique 1 pour une approche plus prospective.*`;
  } else {
    const crit = userInput || "Sujet non spécifié";
    return `### 🔍 Critique et Optimisation Professionnelle (Scrivya Critique)
**Votre texte à analyser :** *${crit}*

---

#### 📊 Rapport d'Évaluation de Structure Académique

##### 1. ⚠️ Anomalies et Pièges Identifiés :
* **Présence de conjonctions de coordination ("et", "and") dans les en-têtes :**
  > *Rappel de rigueur :* L'utilisation de "et" dans les titres de Parties ou de Chapitres est fortement déconseillée en méthodologie de thèse juridique. Cela traduit souvent un manque de synthèse ou de choix directionnel, créant deux sous-sujets juxtaposés au lieu d'une démonstration unifiée.
* **Caractère trop descriptif :**
  > Certains paragraphes annoncent un état des lieux de façon passive plutôt qu'une démonstration active ou un débat d'idées.

##### 2. 📝 Reformulations de Problématiques Recommandées :
* **Option A (Plus dynamique) :**
  > *« Comment l'encadrement normatif de votre objet d'étude se restructure-t-il sous l'effet des contraintes modernes d'efficacité opérationnelle ? »*
* **Option B (Rigueur juridique pure) :**
  > *« Dans quelle mesure la consécration légale de ce sujet compense-t-elle l'incertitude de ses effets jurisprudentiels actuels ? »*

##### 3. 🗺️ Conseils Structurels de Remplacement :
* Au lieu d'écrire: *"Partie I : La théorie **et** la pratique de..."*
* Préférez écrire : **« Partie I : La consécration théorique des principes fondamentaux »** puis **« Partie II : L'épreuve de l'effectivité pratique face aux contraintes contemporaines »**.
* Éliminez tout verbe conjugué dans les titres de chapitres.`;
  }
}

// Generous fallback presentation generator for Scrivya-Deck
function getFallbackPresentation(topic: string, count: number, theme: string) {
  const slides = [];
  const normalizedTopic = topic.trim();
  
  const isAIorTech = normalizedTopic.toLowerCase().includes("ia") || 
                     normalizedTopic.toLowerCase().includes("tech") || 
                     normalizedTopic.toLowerCase().includes("intelligence") || 
                     normalizedTopic.toLowerCase().includes("digital") || 
                     normalizedTopic.toLowerCase().includes("marketing");
  
  const slideTitles = isAIorTech ? [
    "Introduction à l'impact de " + normalizedTopic,
    "Analyse de l'état de l'art technologique",
    "Méthodologie de recherche & Enjeux",
    "Résultats empiriques & Analyse de données",
    "Recommandations Stratégiques",
    "Perspectives futures & Conclusion"
  ] : [
    "Introduction et contexte de " + normalizedTopic,
    "Cadre Théorique & Revue de Littérature",
    "Problématique & Approche Méthodologique",
    "Analyse Critique des Résultats",
    "Axes d'Amélioration & Stratégie",
    "Conclusion Générale et Synthèse"
  ];

  const slideSubtitles = isAIorTech ? [
    "Comprendre les forces motrices de la disruption",
    "Comment les algorithmes redéfinissent les frontières",
    "Modèles de régression et protocoles d'évaluation",
    "Indicateurs de performance et analyse de corrélation",
    "Feuille de route pour une intégration éthique et réussie",
    "Ouvrir de nouveaux horizons scientifiques"
  ] : [
    "Poser les jalons de l'analyse universitaire",
    "Comprendre l'assise doctrinale et scientifique",
    "Valider les hypothèses avec rigueur",
    "Confronter la théorie aux réalités de terrain",
    "Propositions concrètes et leviers opérationnels",
    "Bilan des contributions majeures du mémoire"
  ];

  const slideBulletPoints = isAIorTech ? [
    [
      "Disruption systémique des modèles opérationnels traditionnels",
      "Accélération exponentielle du traitement et de l'analyse des données",
      "Rôle central de la personnalisation de masse en temps réel",
      "Émergence de nouvelles attentes chez l'utilisateur final"
    ],
    [
      "Architecture des réseaux de neurones profonds et modèles génératifs",
      "Optimisation continue de l'apprentissage par renforcement",
      "Défis de l'explicabilité algorithmique et boîte noire",
      "Interopérabilité des systèmes logiciels et APIs"
    ],
    [
      "Protocole de collecte de données multi-sources de haute intégrité",
      "Élimination systématique des biais d'échantillonnage",
      "Analyse sémantique et sentimentale assistée par machine",
      "Cadre réglementaire et éthique d'utilisation de la technologie"
    ],
    [
      "Augmentation prouvée de 35% de l'efficacité opérationnelle globale",
      "Réduction significative du taux d'erreur analytique de 18%",
      "Corrélation statistique robuste (p < 0.01) sur les échantillons",
      "Identification de goulots d'étranglement imprévus lors des tests"
    ],
    [
      "Implémentation d'une gouvernance de données centralisée et sécurisée",
      "Formation continue et montée en compétences des collaborateurs",
      "Création de comités éthiques pour le monitoring continu",
      "Mesure de l'impact et du retour d'expérience"
    ],
    [
      "Transition progressive vers des modèles hautement performants",
      "Défis persistants de la souveraineté numérique et de la sécurité",
      "Synthèse des livrables de la recherche Scrivya-Deck",
      "Ouverture sur des pistes de recherche doctorale prometteuses"
    ]
  ] : [
    [
      "Positionnement historique et délimitation du sujet d'étude",
      "Émergence des problématiques sous-jacentes majeures",
      "Justification scientifique de la démarche académique",
      "Annonce de la structure logique de la démonstration"
    ],
    [
      "Confrontation des thèses des auteurs de référence",
      "Identification des vides doctrinaux et controverses",
      "Clarification des concepts opérationnels clés",
      "Adossement aux standards de rigueur scientifique"
    ],
    [
      "Formulation rigoureuse de la problématique centrale",
      "Détail des hypothèses de recherche à valider empiriquement",
      "Choix de la méthode : quantitative, qualitative ou mixte",
      "Description du terrain d'enquête et des échantillons"
    ],
    [
      "Présentation objective des résultats obtenus sur le terrain",
      "Discussion serrée à la lumière des théories existantes",
      "Validation ou infirmation étayée des hypothèses de départ",
      "Mise en lumière des paradoxes et limites du modèle"
    ],
    [
      "Formulation d'une feuille de route stratégique",
      "Recommandations pratiques applicables immédiatement",
      "Chiffrage ou modélisation des impacts des préconisations",
      "Mesures d'accompagnement du changement institutionnel"
    ],
    [
      "Récapitulatif synthétique des grandes conclusions",
      "Validation de l'apport académique et managérial",
      "Reconnaissance des limites intrinsèques du mémoire",
      "Perspectives de recherche et d'approfondissement"
    ]
  ];

  const visualTypes: ("circle" | "graph" | "bento" | "quote" | "stats")[] = ["circle", "graph", "bento", "stats", "quote", "graph"];
  const visualTitles = [
    "Cycle de Transition de " + normalizedTopic,
    "Architecture et interconnexions systémiques",
    "Matrice Bento des Composantes Clés",
    "Indicateurs d'efficacité et Métriques",
    "Citation doctrinale de référence",
    "Modèle de Maturité Prévisionnel"
  ];
  const visualData = [
    ["Cadrage initial", "Analyse critique", "Modélisation", "Validation", "Déploiement"],
    ["Théorie", "Pratique", "Régulation", "Technologie"],
    ["Bento 1: Concept", "Bento 2: Données", "Bento 3: Rigueur", "Bento 4: Impact"],
    ["Efficacité: +35%", "Erreur: -18%", "Fiabilité: 99.2%"],
    ["'La rigueur n'est pas une limite, c'est le cadre qui permet la liberté de pensée.' - Scrivya"],
    ["Niveau 1: Initial", "Niveau 2: Réitérable", "Niveau 3: Défini", "Niveau 4: Optimisé"]
  ];

  const layouts: ("split" | "text-only" | "cards" | "hero" | "chart")[] = ["hero", "split", "cards", "chart", "text-only", "split"];

  for (let i = 0; i < count; i++) {
    const idx = i % slideTitles.length;
    slides.push({
      id: "slide_" + (i + 1),
      title: slideTitles[idx],
      subtitle: slideSubtitles[idx],
      content: slideBulletPoints[idx],
      layout: layouts[idx],
      visualElement: {
        type: visualTypes[idx],
        title: visualTitles[idx],
        data: visualData[idx]
      }
    });
  }

  return {
    title: "Présentation : " + normalizedTopic,
    theme: theme,
    slides: slides
  };
}

function getFallbackChatEditPresentation(presentation: any, message: string) {
  const updated = JSON.parse(JSON.stringify(presentation));
  const msg = message.toLowerCase();

  if (msg.includes("anglais") || msg.includes("english") || msg.includes("traduis")) {
    updated.title = updated.title.replace("Présentation :", "Presentation:");
    for (const slide of updated.slides) {
      slide.title = slide.title + " (Translated)";
      slide.content = slide.content.map((point: string) => point + " [EN]");
    }
  } else if (msg.includes("theme") || msg.includes("thème") || msg.includes("couleur")) {
    if (msg.includes("ultraviolet")) updated.theme = "Ultraviolet";
    else if (msg.includes("ember")) updated.theme = "Ember";
    else if (msg.includes("coral")) updated.theme = "Coral Reef";
    else if (msg.includes("retro")) updated.theme = "Retro Wave";
    else updated.theme = "Ultraviolet";
  } else if (msg.includes("concis") || msg.includes("raccourcis") || msg.includes("short")) {
    for (const slide of updated.slides) {
      slide.content = slide.content.slice(0, 2).map((point: string) => point + " (Concis)");
    }
  } else if (msg.includes("ajoute") || msg.includes("add") || msg.includes("nouvelle slide") || msg.includes("diapo")) {
    const newSlideId = "slide_" + (updated.slides.length + 1);
    updated.slides.push({
      id: newSlideId,
      title: "Nouvelle Diapositive : " + (message.replace(/ajoute une diapositive sur|ajoute une slide sur/gi, "").trim()),
      subtitle: "Généré suite à votre demande",
      content: [
        "Analyse approfondie du sujet demandé",
        "Mise en relation avec le reste de la présentation",
        "Perspectives académiques et empiriques"
      ],
      layout: "split",
      visualElement: {
        type: "stats",
        title: "Chiffres Clés",
        data: ["Impact: Élevé", "Fiabilité: 98%", "Indicateur: Stable"]
      }
    });
  } else if (msg.includes("supprime") || msg.includes("delete") || msg.includes("enlève")) {
    if (updated.slides.length > 1) {
      updated.slides.pop();
    }
  } else {
    if (updated.slides[0]) {
      updated.slides[0].title = updated.slides[0].title + " (Modifié)";
    }
  }

  return updated;
}

// Generous fallback roadmap generator for Mentorat-IA
function getFallbackRoadmap(goal: string) {
  const norm = goal.trim().toLowerCase();
  
  const isAIOrTech = norm.includes("ia") || norm.includes("artificial") || norm.includes("intelligence") || 
                     norm.includes("machine") || norm.includes("ml") || norm.includes("tech") || 
                     norm.includes("coder") || norm.includes("dev") || norm.includes("ingénieur") || 
                     norm.includes("informatique");
                     
  const isBioOrHealth = norm.includes("bio") || norm.includes("santé") || norm.includes("medicine") || 
                        norm.includes("médical") || norm.includes("pharmacie") || norm.includes("clinique") || 
                        norm.includes("recherche");

  if (isAIOrTech) {
    return {
      goal: goal,
      overview: "Voici votre feuille de route stratégique conçue par Scrivya Mentorat-IA pour devenir un expert de premier plan en Intelligence Artificielle et Ingénierie des Données. Ce plan harmonise rigueur académique et insertion industrielle d'élite.",
      courses: [
        {
          id: "course_1",
          name: "Algèbre Linéaire & Optimisation Numérique",
          code: "MATH 201",
          description: "Fondations mathématiques indispensables pour comprendre la descente de gradient, les décompositions de matrices (SVD) et l'ACP.",
          status: "completed",
          skillsAcquired: ["Algèbre linéaire", "Calcul matriciel", "Optimisation convexe"]
        },
        {
          id: "course_2",
          name: "Fondements du Machine Learning & Statistiques",
          code: "CS 301",
          description: "Apprentissage supervisé et non supervisé : arbres de décision, régressions, SVM, et algorithmes de clustering.",
          status: "inprogress",
          skillsAcquired: ["Modélisation statistique", "Scikit-Learn", "Validation croisée"]
        },
        {
          id: "course_3",
          name: "Deep Learning & Vision par Ordinateur",
          code: "CS 401",
          description: "Réseaux de neurones convolutifs (CNN), architectures récurrentes (LSTM) et introduction aux Transformers.",
          status: "todo",
          skillsAcquired: ["PyTorch", "Architectures CNN/LLM", "Fine-tuning"]
        },
        {
          id: "course_4",
          name: "Éthique des Systèmes Autonomes & Régulation",
          code: "PHIL 450",
          description: "Biais algorithmiques, explicabilité de la décision, et conformité réglementaire européenne (AI Act).",
          status: "todo",
          skillsAcquired: ["Éthique algorithmique", "Droit de l'IA", "Audit de biais"]
        },
        {
          id: "course_5",
          name: "Architectures MLOps & Déploiement Cloud",
          code: "CS 510",
          description: "Mise en production, tracking de modèles (MLflow), containerisation (Docker) et orchestrateurs cloud (Kubernetes).",
          status: "todo",
          skillsAcquired: ["Docker", "MLflow", "CI/CD pour l'IA"]
        }
      ],
      internships: [
        {
          id: "intern_1",
          title: "Développeur IA / Data Scientist Junior",
          companyTypes: ["Startups technologiques", "Sociétés de conseil en innovation", "Orange Labs"],
          recommendedProjects: [
            "Création d'une API de détection de faux profils avec FastAPI et Scikit-Learn",
            "Pipeline ETL de centralisation de données académiques avec Apache Airflow"
          ],
          timeline: "Fin de 2ème année de cycle d'ingénieur (3 à 4 mois)",
          strategy: "Misez sur un profil GitHub soigné montrant des projets fonctionnels de bout en bout avec un Readme clair. Participez à des hackathons locaux."
        },
        {
          id: "intern_2",
          title: "Ingénieur de Recherche Machine Learning / NLP",
          companyTypes: ["Grands groupes (Google, Meta, Sophia Antipolis)", "Laboratoires de recherche CNRS / INRIA"],
          recommendedProjects: [
            "Entraînement et fine-tuning d'un modèle de langue de 3B paramètres spécialisé en dialecte tunisien",
            "Optimisation de modèles de reconnaissance vocale légers pour mobiles"
          ],
          timeline: "Stage de fin d'études / PFE (6 mois)",
          strategy: "Préparez minutieusement vos bases en algorithmes et structures de données. Contactez directement les chercheurs par mail en joignant votre synthèse de lecture de leurs derniers articles."
        }
      ],
      skills: [
        {
          id: "skill_1",
          name: "Programmation Python & SQL",
          level: 45,
          category: "tool",
          importance: "essential",
          resources: ["Real Python", "Kaggle Learn Courses", "LeetCode - SQL Track"]
        },
        {
          id: "skill_2",
          name: "Frameworks PyTorch & JAX",
          level: 25,
          category: "hard",
          importance: "essential",
          resources: ["PyTorch Tutorials", "Deep Learning specialization by Andrew Ng (Coursera)"]
        },
        {
          id: "skill_3",
          name: "Mathématiques & Algorithmique",
          level: 35,
          category: "hard",
          importance: "essential",
          resources: ["Introduction to Algorithms (CLRS Book)", "MIT OpenCourseWare Math for CS"]
        },
        {
          id: "skill_4",
          name: "Communication Technique & vulgarisation",
          level: 30,
          category: "soft",
          importance: "recommended",
          resources: ["Writing Science Articles (Stanford Online)", "Techniques de pitch professionnel"]
        },
        {
          id: "skill_5",
          name: "Conteneurisation (Docker)",
          level: 15,
          category: "tool",
          importance: "recommended",
          resources: ["Docker Deep Dive (Pluralsight)", "Kubernetes Up and Running"]
        }
      ],
      careerPath: [
        {
          id: "path_1",
          title: "Ingénieur IA / Data Scientist Junior",
          timeframe: "0 - 2 ans après l'obtention du diplôme",
          salaryRange: "45k - 55k € / an",
          responsibilities: [
            "Nettoyage de données massives et maintenance de pipelines ETL",
            "Développement de modèles de ML classiques et intégration sous forme d'APIs",
            "Rédaction de rapports techniques et visualisation d'analyses"
          ],
          criticalMilestone: "Déployer votre premier modèle propriétaire en production avec un monitoring continu de l'exactitude."
        },
        {
          id: "path_2",
          title: "Ingénieur Machine Learning Senior / Spécialiste NLP",
          timeframe: "3 - 5 ans d'expérience",
          salaryRange: "75k - 95k € / an",
          responsibilities: [
            "Conception d'architectures de modèles de Deep Learning sur mesure",
            "Optimisation des coûts d'inférence des modèles de langage massifs",
            "Mentorat d'ingénieurs juniors et animation de comités de recherche"
          ],
          criticalMilestone: "Réduire les coûts de calcul de l'infrastructure d'inférence d'au moins 30% grâce à la distillation de modèles."
        },
        {
          id: "path_3",
          title: "Lead AI Scientist / Architecte Solutions IA",
          timeframe: "6 - 10 ans d'expérience",
          salaryRange: "110k - 140k € / an",
          responsibilities: [
            "Définition de la feuille de route technologique globale de l'organisation",
            "Négociation de partenariats de recherche industriels avec des universités clés",
            "Garant de la conformité éthique et légale de l'ensemble des systèmes d'IA"
          ],
          criticalMilestone: "Diriger l'intégration globale de l'IA générative dans le cœur de métier de l'entreprise, générant des millions de revenus ou d'économies."
        }
      ]
    };
  }

  if (isBioOrHealth) {
    return {
      goal: goal,
      overview: "Votre plan de carrière sur mesure en recherche biomédicale et bioinformatique, conçu pour lier rigueur scientifique et innovation de pointe en pharmacologie ou génomique.",
      courses: [
        {
          id: "course_1",
          name: "Génétique Quantitative & Biologie Moléculaire",
          code: "BIO 210",
          description: "Mécanismes de transcription génomique, réplication, mutagénèse et fondements de la transmission héréditaire.",
          status: "completed",
          skillsAcquired: ["Biologie Moléculaire", "Extraction d'ADN/ARN", "PCR quantitative"]
        },
        {
          id: "course_2",
          name: "Biostatistiques & Programmation R/Python",
          code: "DATA 302",
          description: "Analyse statistique appliquée aux données médicales : modèles de régression, tests d'hypothèses, ANOVA, et utilisation de R/Bioconductor.",
          status: "inprogress",
          skillsAcquired: ["Statistiques appliquées", "Langage R", "Manipulation de banques de données"]
        },
        {
          id: "course_3",
          name: "Docking Moléculaire & Modélisation de Protéines",
          code: "BIO 420",
          description: "Utilisation d'outils informatiques pour prédire la liaison ligand-récepteur et concevoir de nouveaux principes actifs.",
          status: "todo",
          skillsAcquired: ["Chimie computationnelle", "Outils PyMOL/AutoDock", "Synthèse rationnelle"]
        },
        {
          id: "course_4",
          name: "Réglementation des Dispositifs Médicaux & Essais Cliniques",
          code: "REG 500",
          description: "Comprendre le parcours d'homologation CE/FDA, la gestion des phases cliniques et l'éthique de l'expérimentation humaine.",
          status: "todo",
          skillsAcquired: ["Qualité pharmaceutique", "BPC (Bonnes Pratiques Cliniques)", "Conformité FDA"]
        }
      ],
      internships: [
        {
          id: "intern_1",
          title: "Assistant chercheur en bio-statistiques",
          companyTypes: ["Laboratoires universitaires d'immunologie", "Laboratoires CNRS", "Centres hospitaliers"],
          recommendedProjects: [
            "Analyse statistique de survie d'une cohorte de patients atteints de cancer du côlon",
            "Automatisation du tri de données génomiques publiques issues du NCBI"
          ],
          timeline: "Fin d'année universitaire (3 mois)",
          strategy: "Proposez spontanément votre aide aux doctorants pour le traitement de leurs gros fichiers de données R. La maîtrise de R est votre atout majeur."
        },
        {
          id: "intern_2",
          title: "Assistant R&D Bioinformatique / drug-discovery",
          companyTypes: ["Grandes firmes pharmaceutiques (Sanofi, Roche)", "Startups de biotech"],
          recommendedProjects: [
            "Implémentation d'un réseau de neurones prédisant la solubilité de molécules thérapeutiques",
            "Modélisation 3D d'une enzyme impliquée dans une maladie rare"
          ],
          timeline: "Stage de Master II / Fin d'études (6 mois)",
          strategy: "Ciblez des laboratoires de Drug Discovery. Préparez un portfolio montrant votre compréhension des concepts biologiques couplée à votre autonomie en codage."
        }
      ],
      skills: [
        {
          id: "skill_1",
          name: "Protocoles de laboratoire humide",
          level: 40,
          category: "hard",
          importance: "essential",
          resources: ["Bases de sécurité en laboratoire", "Practical Biochemistry Lectures"]
        },
        {
          id: "skill_2",
          name: "Langage R & BioConductor",
          level: 25,
          category: "tool",
          importance: "essential",
          resources: ["R for Data Science book", "Bioconductor introductory guides"]
        },
        {
          id: "skill_3",
          name: "Rigueur Scientifique & Esprit critique",
          level: 45,
          category: "soft",
          importance: "essential",
          resources: ["Méthodologie de lecture d'articles - Pubmed", "Critical thinking seminars"]
        },
        {
          id: "skill_4",
          name: "Chimie Computationnelle (PyMOL)",
          level: 15,
          category: "tool",
          importance: "recommended",
          resources: ["PyMOL Wiki tutorials", "MolGuide online"]
        }
      ],
      careerPath: [
        {
          id: "path_1",
          title: "Ingénieur R&D Biomédical / Bioinformaticien",
          timeframe: "0 - 2 ans après l'obtention du diplôme",
          salaryRange: "38k - 45k € / an",
          responsibilities: [
            "Traitement et alignement de séquences de séquençage haut débit (NGS)",
            "Rédaction de protocoles de tests de screening biologique",
            "Collaboration avec les biologistes pour valider les prédictions d'outils de bio-informatique"
          ],
          criticalMilestone: "Valider votre premier pipeline d'analyse clinique conforme aux normes ISO 13485."
        },
        {
          id: "path_2",
          title: "Chercheur R&D Confirmé / Chef de Projet Biotech",
          timeframe: "3 - 5 ans d'expérience",
          salaryRange: "55k - 75k € / an",
          responsibilities: [
            "Conception de nouvelles cibles thérapeutiques assistée par ordinateur",
            "Supervision d'une équipe de techniciens et d'ingénieurs de recherche",
            "Rédaction de brevets d'invention moléculaire et d'articles scientifiques"
          ],
          criticalMilestone: "Découvrir ou optimiser une molécule candidate brevetée passant en phase d'essais cliniques I."
        },
        {
          id: "path_3",
          title: "Directeur Scientifique / VP Biotech R&D",
          timeframe: "6+ ans d'expérience",
          salaryRange: "90k - 130k € / an",
          responsibilities: [
            "Détermination de l'orientation stratégique du portefeuille de produits thérapeutiques",
            "Représentation de l'entreprise lors de congrès internationaux majeurs",
            "Gestion des levées de fonds et des relations avec les investisseurs scientifiques"
          ],
          criticalMilestone: "Obtenir l'approbation réglementaire internationale (FDA/EMA) d'un dispositif ou traitement dirigé par vos équipes."
        }
      ]
    };
  }

  // General default fallback
  return {
    goal: goal,
    overview: "Voici votre guide d'excellence et de planification stratégique sur mesure, conçu par Scrivya Mentorat-IA pour jalonner avec succès vos études et vous propulser vers vos aspirations professionnelles.",
    courses: [
      {
        id: "course_1",
        name: "Introduction Fondamentale & Cadre Théorique",
        code: "CORE 101",
        description: "Bases théoriques indispensables de la discipline et revue historique des concepts clés.",
        status: "completed",
        skillsAcquired: ["Analyse doctrinale", "Cadrage conceptuel", "Rigueur d'analyse"]
      },
      {
        id: "course_2",
        name: "Méthodologie de Recherche & Analyse Critique",
        code: "RES 202",
        description: "Comprendre les méthodes de collecte de données, d'analyse qualitative ou quantitative et d'inférence logique.",
        status: "inprogress",
        skillsAcquired: ["Modélisation théorique", "Rapprochement empirique", "Esprit de synthèse"]
      },
      {
        id: "course_3",
        name: "Outils Numériques Avancés & Productivité",
        code: "TECH 303",
        description: "Maîtrise des logiciels métiers, suites collaboratives et outils de traitement de l'information.",
        status: "todo",
        skillsAcquired: ["Outils collaboratifs", "Automatisation de tâches", "Gestion de l'information"]
      },
      {
        id: "course_4",
        name: "Gestion de Projet & Leadership d'Équipe",
        code: "MGMT 404",
        description: "Planification agile, résolution de conflits, et pilotage des indicateurs de performance clés.",
        status: "todo",
        skillsAcquired: ["Agilité", "Prise de décision", "Management d'équipe"]
      }
    ],
    internships: [
      {
        id: "intern_1",
        title: "Stage d'Observation & Immersion Opérationnelle",
        companyTypes: ["Cabinets de conseil", "Grandes entreprises", "Organisations institutionnelles"],
        recommendedProjects: [
          "Rapport d'audit complet de l'organisation interne d'un département",
          "Mise en place d'un manuel de procédures pour les nouveaux collaborateurs"
        ],
        timeline: "Fin du 1er cycle universitaire (2 à 3 mois)",
        strategy: "Soignez votre présence en ligne sur LinkedIn, contactez les anciens étudiants de votre école et proposez une aide polyvalente immédiate."
      },
      {
        id: "intern_2",
        title: "Stage de Responsabilité & Management de Projet",
        companyTypes: ["Multinationaux", "PME dynamiques ou cabinets d'expertise"],
        recommendedProjects: [
          "Conduite du changement lors du déploiement d'un nouvel outil numérique",
          "Étude d'impact financier et organisationnel d'une nouvelle réglementation interne"
        ],
        timeline: "Stage de Fin d'Études / Mastère (6 mois)",
        strategy: "Démontrez votre esprit d'initiative dès l'entretien d'embauche en proposant une pré-analyse du secteur d'activité de l'entreprise d'accueil."
      }
    ],
    skills: [
      {
        id: "skill_1",
        name: "Analyse conceptuelle et rédaction académique",
        level: 45,
        category: "hard",
        importance: "essential",
        resources: ["Guides méthodologiques Scrivya", "Sujets de thèses d'excellence en bibliothèque"]
      },
      {
        id: "skill_2",
        name: "Outils de modélisation métier",
        level: 30,
        category: "tool",
        importance: "essential",
        resources: ["Formations en ligne certifiées", "Tutoriels applicatifs avancés"]
      },
      {
        id: "skill_3",
        name: "Aisance orale & Pitch de soutenance",
        level: 35,
        category: "soft",
        importance: "essential",
        resources: ["Séminaires de prise de parole en public", "Entraînement assisté par vidéo"]
      },
      {
        id: "skill_4",
        name: "Esprit de négociation",
        level: 20,
        category: "soft",
        importance: "recommended",
        resources: ["Harvard Negotiation Project books", "Practical roleplays"]
      }
    ],
    careerPath: [
      {
        id: "path_1",
        title: "Chargé d'Études Junior / Consultant",
        timeframe: "0 - 2 ans après l'obtention du diplôme",
        salaryRange: "35k - 42k € / an",
        responsibilities: [
          "Collecte d'informations et structuration de bases de données de recherche",
          "Contribution active à la rédaction de livrables projets pour les clients",
          "Assurer la liaison opérationnelle entre les différents départements"
        ],
        criticalMilestone: "Prendre en charge la responsabilité complète de la rédaction d'un livrable stratégique majeur."
      },
      {
        id: "path_2",
        title: "Chef de Projet Senior / Consultant Confirmé",
        timeframe: "3 - 5 ans d'expérience",
        salaryRange: "50k - 65k € / an",
        responsibilities: [
          "Pilotage complet de plusieurs projets en simultané",
          "Encadrement d'ingénieurs d'études juniors et de stagiaires",
          "Animation des réunions de pilotage avec les directions métiers"
        ],
        criticalMilestone: "Atteindre 100% de taux de satisfaction client sur un portefeuille de projets d'un budget supérieur à 150 000 €."
      },
      {
        id: "path_3",
        title: "Directeur d'Activité / Associé Principal",
        timeframe: "6+ ans d'expérience",
        salaryRange: "80k - 120k € / an",
        responsibilities: [
          "Définition de la stratégie de croissance commerciale de la branche d'activité",
          "Gestion contractuelle, budgétaire et négociation de haut niveau",
          "Garant de l'excellence méthodologique de l'ensemble de l'organisation"
        ],
        criticalMilestone: "Contribuer à l'implantation réussie de la marque dans une nouvelle région géographique ou secteur industriel."
      }
    ]
  };
}

function getFallbackMentorChat(roadmap: any, message: string) {
  const updated = JSON.parse(JSON.stringify(roadmap));
  const msg = message.toLowerCase();
  let mentorReply = "";

  if (msg.includes("term") || msg.includes("fini") || msg.includes("complét")) {
    // mark first uncompleted course as completed
    const targetCourse = updated.courses.find((c: any) => c.status !== "completed");
    if (targetCourse) {
      targetCourse.status = "completed";
      mentorReply = `Félicitations pour vos efforts ! J'ai marqué le cours « ${targetCourse.name} » (${targetCourse.code}) comme complété. C'est une excellente avancée qui consolide vos bases ! Poursuivez sur cette belle lancée, nous avançons étape par étape.`;
    } else {
      mentorReply = "Tous vos cours prévus sont déjà terminés ! Vous êtes fin prêt d'un point de vue académique. Commençons à approfondir la préparation de vos candidatures aux stages !";
    }
  } else if (msg.includes("ajoute") || msg.includes("cours") || msg.includes("matière")) {
    const nextId = "course_" + (updated.courses.length + 1);
    const addedName = message.replace(/ajoute le cours|ajoute un cours sur|ajoute la matière/gi, "").trim() || "Cours Complémentaire de Spécialisation";
    const newCourse = {
      id: nextId,
      name: addedName,
      code: "SPEC " + (100 + updated.courses.length * 10),
      description: "Cours complémentaire personnalisé ajouté à votre feuille de route pour cibler au mieux vos aspirations.",
      status: "todo" as const,
      skillsAcquired: ["Compétences avancées", "Adaptation sectorielle"]
    };
    updated.courses.push(newCourse);
    mentorReply = `Très bonne idée. J'ai ajouté le cours « ${newCourse.name} » (${newCourse.code}) à votre cursus d'études. Cela complétera parfaitement votre bagage théorique et fera toute la différence sur votre CV pour l'accès aux meilleurs stages !`;
  } else if (msg.includes("projet") || msg.includes("stage") || msg.includes("intern")) {
    if (updated.internships && updated.internships[0]) {
      updated.internships[0].recommendedProjects.push("Nouveau Projet Pratique : " + message.replace(/propose un projet|ajoute un projet/gi, "").trim());
    }
    mentorReply = "C'est une excellente initiative. Pour décrocher un stage d'élite, rien ne vaut un projet pratique concret. J'ai enrichi la section de votre premier stage avec cette nouvelle idée de projet personnel. Prenez le temps de concevoir l'architecture de ce projet et d'en documenter les résultats !";
  } else if (msg.includes("compétence") || msg.includes("skill")) {
    const nextId = "skill_" + (updated.skills.length + 1);
    const skillName = message.replace(/ajoute la compétence|ajoute une compétence en/gi, "").trim() || "Communication et Relations Publiques";
    updated.skills.push({
      id: nextId,
      name: skillName,
      level: 15,
      category: "soft",
      importance: "recommended",
      resources: ["Cours certifiés en ligne", "Mise en pratique au quotidien"]
    });
    mentorReply = `Compétence « ${skillName} » ajoutée avec succès à votre référentiel. Les soft skills sont trop souvent négligées par les étudiants, mais ce sont elles qui propulsent votre profil en phase finale de sélection d'embauche. Commençons à travailler dessus !`;
  } else {
    mentorReply = `C'est une excellente question. Pour réussir votre transition vers votre objectif de : « ${updated.goal} », je vous recommande vivement d'articuler votre apprentissage autour du triptyque de notre roadmap :
1. Valider méthodiquement les cours listés (notamment les cours fondamentaux).
2. Travailler sur les projets recommandés dans la section des stages, afin d'alimenter votre portfolio ou profil GitHub.
3. Obtenir les certifications et maîtriser les compétences clés de votre grille d'aptitudes.

Avez-vous d'autres interrogations sur l'un de ces points ou souhaitez-vous ajouter une certification spécifique ?`;
  }

  return { updatedRoadmap: updated, mentorReply };
}

startServer();

