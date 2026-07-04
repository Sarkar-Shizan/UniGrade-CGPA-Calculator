export type GradingType = "letter" | "percentage";

export interface GradeMapping {
  grade: string;
  point: number;
  minPercent?: number;
  maxPercent?: number;
}

export interface University {
  id: string;
  name: string;
  country: string;
  scale: number; // 4.0 or 5.0
  gradingType: GradingType;
  passingGrade?: string;
  passingPercent?: number;
  grades: GradeMapping[];
  notes?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  grade?: string; // letter
  marks?: number; // percentage
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
}

export interface CalculationRecord {
  id: string;
  universityId: string;
  universityName: string;
  scale: number;
  cgpa: number;
  totalCredits: number;
  semesters: Semester[];
  createdAt: number;
}
