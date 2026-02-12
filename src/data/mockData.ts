export interface Student {
  id: string;
  name: string;
  avatar: string;
  unit: "Anesthesia" | "Surgery" | "Internal Medicine" | "Advanced Practice Providers";
  walkthroughComplete: number; // 0-100
  verificationStatus: "Not Started" | "In Progress" | "Verified";
  latestScore: number;
  lastActivity: string;
  deadline: string;
  daysRemaining: number;
  needsPractice: boolean;
  currentModule: string;
}

export interface ErrorType {
  name: string;
  count: number;
  severity: "critical" | "moderate" | "minor";
}

export interface PatientCase {
  caseName: string;
  errorRate: number;
  avgScore: number;
  attempts: number;
}

export const students: Student[] = [
  { id: "1", name: "Sarah Chen", avatar: "SC", unit: "Anesthesia", walkthroughComplete: 100, verificationStatus: "Verified", latestScore: 94, lastActivity: "2 hrs ago", deadline: "2026-02-20", daysRemaining: 9, needsPractice: false, currentModule: "Module 5: Advanced Lines" },
  { id: "2", name: "James Rodriguez", avatar: "JR", unit: "Surgery", walkthroughComplete: 72, verificationStatus: "In Progress", latestScore: 68, lastActivity: "1 day ago", deadline: "2026-02-14", daysRemaining: 3, needsPractice: true, currentModule: "Module 3: Femoral Access" },
  { id: "3", name: "Emily Thompson", avatar: "ET", unit: "Internal Medicine", walkthroughComplete: 45, verificationStatus: "Not Started", latestScore: 55, lastActivity: "3 days ago", deadline: "2026-02-12", daysRemaining: 1, needsPractice: true, currentModule: "Module 2: Ultrasound Guidance" },
  { id: "4", name: "Michael Park", avatar: "MP", unit: "Anesthesia", walkthroughComplete: 100, verificationStatus: "In Progress", latestScore: 82, lastActivity: "5 hrs ago", deadline: "2026-02-25", daysRemaining: 14, needsPractice: false, currentModule: "Module 5: Advanced Lines" },
  { id: "5", name: "Aisha Patel", avatar: "AP", unit: "Surgery", walkthroughComplete: 88, verificationStatus: "In Progress", latestScore: 76, lastActivity: "12 hrs ago", deadline: "2026-02-18", daysRemaining: 7, needsPractice: false, currentModule: "Module 4: Subclavian Access" },
  { id: "6", name: "David Kim", avatar: "DK", unit: "Internal Medicine", walkthroughComplete: 30, verificationStatus: "Not Started", latestScore: 42, lastActivity: "5 days ago", deadline: "2026-02-11", daysRemaining: 0, needsPractice: true, currentModule: "Module 1: Anatomy Review" },
  { id: "7", name: "Lisa Wang", avatar: "LW", unit: "Anesthesia", walkthroughComplete: 100, verificationStatus: "Verified", latestScore: 97, lastActivity: "1 hr ago", deadline: "2026-02-28", daysRemaining: 17, needsPractice: false, currentModule: "Module 5: Advanced Lines" },
  { id: "8", name: "Ryan Foster", avatar: "RF", unit: "Surgery", walkthroughComplete: 60, verificationStatus: "Not Started", latestScore: 61, lastActivity: "2 days ago", deadline: "2026-02-13", daysRemaining: 2, needsPractice: true, currentModule: "Module 3: Femoral Access" },
  { id: "9", name: "Maria Gonzalez", avatar: "MG", unit: "Internal Medicine", walkthroughComplete: 95, verificationStatus: "In Progress", latestScore: 88, lastActivity: "4 hrs ago", deadline: "2026-02-22", daysRemaining: 11, needsPractice: false, currentModule: "Module 5: Advanced Lines" },
  { id: "10", name: "Tom Bradley", avatar: "TB", unit: "Anesthesia", walkthroughComplete: 15, verificationStatus: "Not Started", latestScore: 38, lastActivity: "1 week ago", deadline: "2026-02-10", daysRemaining: -1, needsPractice: true, currentModule: "Module 1: Anatomy Review" },
  { id: "11", name: "Rachel Nguyen", avatar: "RN", unit: "Advanced Practice Providers", walkthroughComplete: 80, verificationStatus: "In Progress", latestScore: 79, lastActivity: "6 hrs ago", deadline: "2026-02-19", daysRemaining: 8, needsPractice: false, currentModule: "Module 4: Subclavian Access" },
  { id: "12", name: "Chris Howard", avatar: "CH", unit: "Advanced Practice Providers", walkthroughComplete: 55, verificationStatus: "Not Started", latestScore: 52, lastActivity: "2 days ago", deadline: "2026-02-15", daysRemaining: 4, needsPractice: true, currentModule: "Module 2: Ultrasound Guidance" },
];

export const errorTypes: ErrorType[] = [
  { name: "Arterial Puncture", count: 23, severity: "critical" },
  { name: "Through-and-Through", count: 18, severity: "critical" },
  { name: "Guidewire Misplacement", count: 15, severity: "moderate" },
  { name: "Prolonged Arrhythmia", count: 12, severity: "critical" },
  { name: "Excessive Cannulation Attempts", count: 9, severity: "moderate" },
  { name: "Failed Cannulation Attempts", count: 6, severity: "critical" },
];

export const patientCases: PatientCase[] = [
  { caseName: "CVC IJV Emergent", errorRate: 42, avgScore: 58, attempts: 87 },
  { caseName: "CVC Subclavian Elective", errorRate: 35, avgScore: 64, attempts: 62 },
  { caseName: "CVC Femoral Critical", errorRate: 28, avgScore: 71, attempts: 94 },
  { caseName: "PICC Line Insertion", errorRate: 18, avgScore: 78, attempts: 55 },
  { caseName: "Arterial Line Radial", errorRate: 22, avgScore: 74, attempts: 73 },
  { caseName: "Triple Lumen IJV", errorRate: 38, avgScore: 61, attempts: 48 },
];

export const summaryStats = {
  totalStudents: 148,
  activeToday: 34,
  completedCourse: 67,
  completedPercent: 45,
  licensesUsed: 142,
  licensesTotal: 200,
};
