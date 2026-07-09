export type GradingType = "letter" | "percentage";

export interface GradeMapping {
  grade: string;
  point: number;
  minPercent?: number;
  maxPercent?: number;
}

export type GradeRule = GradeMapping;

export interface University {
  id: string;
  name: string;
  country: string;
  division: string;
  scale: number;
  gradingType: "letter" | "percentage";
  passingGrade?: string;
  passingPercent?: number;
  grades: GradeRule[];
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
