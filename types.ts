

export type AiProvider = 'gemini' | 'openai';

export interface DailyWord {
  word: string;
  image?: string;
  date: string;
}

export interface Submission {
  id: string;
  text: string;
  username: string;
  likes: number;
}

export interface ArchivedWord extends DailyWord {
  winningDefinitions: string[];
}