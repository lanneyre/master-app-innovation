
export enum BloomLevel {
  SeSouvenir = "Se Souvenir (Remember)",
  Comprendre = "Comprendre (Understand)",
  Appliquer = "Appliquer (Apply)",
  Analyser = "Analyser (Analyze)",
  Evaluer = "Évaluer (Evaluate)",
  Creer = "Créer (Create)",
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

export interface CaseStudy {
  title: string;
  scenario: string;
  questions: string[];
}

export interface VideoScene {
  sceneNumber: number;
  visuals: string;
  narration: string;
}

export interface VideoScript {
  title: string;
  scenes: VideoScene[];
}

export interface InfographicPoint {
  point: string;
  visualSuggestion: string;
}

export interface Infographic {
  title: string;
  keyPoints: InfographicPoint[];
}

export interface Activity {
  title: string;
  description: string;
  steps: string[];
  materials: string[];
}

export interface EducationalResources {
  quiz: Quiz;
  caseStudy: CaseStudy;
  videoScript: VideoScript;
  infographic: Infographic;
  activity: Activity;
}
