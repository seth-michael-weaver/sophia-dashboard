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
  id: number;
  caseName: string;
  difficulty: "Easy" | "Moderate" | "Hard";
  errorRate: number;
  avgScore: number;
  attempts: number;
  completions: number;
  topErrors: string[];
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
  { id: 1, caseName: "Patient 1: Robert Dawson", difficulty: "Easy", errorRate: 8, avgScore: 91, attempts: 142, completions: 131, topErrors: ["Guidewire Misplacement"] },
  { id: 2, caseName: "Patient 2: Maria Santos", difficulty: "Easy", errorRate: 10, avgScore: 88, attempts: 138, completions: 124, topErrors: ["Excessive Cannulation Attempts"] },
  { id: 3, caseName: "Patient 3: Helena Johnston", difficulty: "Moderate", errorRate: 22, avgScore: 74, attempts: 115, completions: 90, topErrors: ["Arterial Puncture", "Through-and-Through"] },
  { id: 4, caseName: "Patient 4: James Liu", difficulty: "Easy", errorRate: 12, avgScore: 85, attempts: 130, completions: 114, topErrors: ["Guidewire Misplacement"] },
  { id: 5, caseName: "Patient 5: Angela Freeman", difficulty: "Moderate", errorRate: 25, avgScore: 71, attempts: 108, completions: 81, topErrors: ["Arterial Puncture", "Prolonged Arrhythmia"] },
  { id: 6, caseName: "Patient 6: William Torres", difficulty: "Hard", errorRate: 42, avgScore: 58, attempts: 87, completions: 50, topErrors: ["Arterial Puncture", "Through-and-Through", "Failed Cannulation Attempts"] },
  { id: 7, caseName: "Patient 7: Diane Mitchell", difficulty: "Easy", errorRate: 9, avgScore: 90, attempts: 135, completions: 123, topErrors: ["Excessive Cannulation Attempts"] },
  { id: 8, caseName: "Patient 8: Carlos Mendez", difficulty: "Moderate", errorRate: 28, avgScore: 69, attempts: 102, completions: 73, topErrors: ["Through-and-Through", "Guidewire Misplacement"] },
  { id: 9, caseName: "Patient 9: Susan Park", difficulty: "Hard", errorRate: 38, avgScore: 61, attempts: 94, completions: 58, topErrors: ["Arterial Puncture", "Prolonged Arrhythmia", "Through-and-Through"] },
  { id: 10, caseName: "Patient 10: Kevin O'Brien", difficulty: "Easy", errorRate: 11, avgScore: 87, attempts: 128, completions: 114, topErrors: ["Guidewire Misplacement"] },
  { id: 11, caseName: "Patient 11: Priya Sharma", difficulty: "Moderate", errorRate: 20, avgScore: 76, attempts: 110, completions: 88, topErrors: ["Excessive Cannulation Attempts", "Arterial Puncture"] },
  { id: 12, caseName: "Patient 12: Thomas Wright", difficulty: "Hard", errorRate: 35, avgScore: 64, attempts: 92, completions: 60, topErrors: ["Failed Cannulation Attempts", "Through-and-Through"] },
  { id: 13, caseName: "Patient 13: Laura Chen", difficulty: "Easy", errorRate: 7, avgScore: 93, attempts: 145, completions: 135, topErrors: ["Guidewire Misplacement"] },
  { id: 14, caseName: "Patient 14: Marcus Johnson", difficulty: "Moderate", errorRate: 24, avgScore: 72, attempts: 105, completions: 80, topErrors: ["Arterial Puncture", "Excessive Cannulation Attempts"] },
  { id: 15, caseName: "Patient 15: Fatima Al-Rashid", difficulty: "Hard", errorRate: 40, avgScore: 59, attempts: 88, completions: 53, topErrors: ["Arterial Puncture", "Through-and-Through", "Prolonged Arrhythmia"] },
  { id: 16, caseName: "Patient 16: Brian Cooper", difficulty: "Easy", errorRate: 13, avgScore: 84, attempts: 125, completions: 109, topErrors: ["Excessive Cannulation Attempts"] },
  { id: 17, caseName: "Patient 17: Yuki Tanaka", difficulty: "Moderate", errorRate: 26, avgScore: 70, attempts: 100, completions: 74, topErrors: ["Through-and-Through", "Guidewire Misplacement"] },
];

export const summaryStats = {
  totalStudents: 148,
  activeToday: 34,
  completedCourse: 67,
  completedPercent: 45,
  licensesUsed: 142,
  licensesTotal: 200,
};
