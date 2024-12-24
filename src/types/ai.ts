export interface StudyPlanRequest {
  grade: string;
  subjects: string[];
  dailyHours: number;
  durationWeeks: number;
  excludedDays: string[];
  preferredTopics?: string;
}

export interface ConceptExplainerRequest {
  topic: string;
}