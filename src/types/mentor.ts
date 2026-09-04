export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  status: "todo" | "inprogress" | "completed";
  skillsAcquired: string[];
}

export interface Internship {
  id: string;
  title: string;
  companyTypes: string[];
  recommendedProjects: string[];
  timeline: string;
  strategy: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0 to 100 percentage
  category: "hard" | "soft" | "tool";
  importance: "essential" | "recommended" | "optional";
  resources: string[];
}

export interface CareerStep {
  id: string;
  title: string;
  timeframe: string;
  salaryRange?: string;
  responsibilities: string[];
  criticalMilestone: string;
}

export interface CustomIdeaNode {
  id: string;
  parentId: string; // ID of Course, Skill, Internship, CareerStep or another CustomIdeaNode
  title: string;
  description: string;
  category: "idea" | "ai_expansion" | "milestone";
  skillsAcquired?: string[];
}

export interface MentorRoadmap {
  goal: string;
  overview: string;
  courses: Course[];
  internships: Internship[];
  skills: Skill[];
  careerPath: CareerStep[];
}
