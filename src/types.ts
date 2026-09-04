export interface BibliographyEntry {
  author: string;
  title: string;
  publisher: string;
  year: string;
  fullCitation: string;
}

export interface OutlineSection {
  title: string;
  subsections: string[];
}

export interface LatinCitation {
  context: string;
  footnoteText: string;
}

export interface AcademicPack {
  problematics: string[];
  outline: OutlineSection[];
  bibliography: BibliographyEntry[];
  latinCitations: LatinCitation[];
}
