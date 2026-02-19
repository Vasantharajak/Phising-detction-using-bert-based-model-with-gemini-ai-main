
export enum PredictionLabel {
  PHISHING = 'PHISHING',
  LEGITIMATE = 'LEGITIMATE'
}

export interface ShapToken {
  token: string;
  score: number; // Positive = Phishing, Negative = Legitimate
}

export interface AnalysisResult {
  id: string;
  text: string;
  label: PredictionLabel;
  confidence: number;
  shapTokens: ShapToken[];
  reasoning: string;
  timestamp: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
