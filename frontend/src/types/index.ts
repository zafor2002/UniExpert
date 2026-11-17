// Core TypeScript types for UniExpert prototype

export type UserRole = 'student' | 'faculty' | 'mentor' | 'coordinator' | 'admin' | 'auditor';

export type VerificationTier = 1 | 2 | 3;

export type QuotaStatus = 'available' | 'nearing' | 'full' | 'blackout';

export type FSMState = 'draft' | 'submitted' | 'under_review' | 'negotiation' | 'accepted' | 'declined' | 'expired';

export type ProjectStage = 'problem_formulation' | 'advisor_matching' | 'active_supervision' | 'defense_ready' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  batch: number;
  section: string;
  degree: string;
  skills: string[];
  github?: string;
  linkedin?: string;
  profileCompletion: number;
}

export interface Expert extends User {
  role: 'faculty' | 'mentor';
  title: string;
  tier: VerificationTier;
  slotsUsed: number;
  slotsTotal: number;
  quotaStatus: QuotaStatus;
  researchAreas: string[];
  skills: string[];
  hIndex: number;
  publications: Publication[];
  rating: number;
  officeHours: OfficeHourSlot[];
  bio: string;
  orcid?: string;
  googleScholar?: string;
  linkedin?: string;
  github?: string;
  isIndustry?: boolean;
}

export interface Publication {
  id: string;
  title: string;
  venue: string;
  year: number;
  citations: number;
  abstract?: string;
}

export interface OfficeHourSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookedBy?: string;
}

export interface ExtractedDomain {
  name: string;
  confidence: number;
  color: string;
}

export interface ExtractedSkill {
  id: string;
  name: string;
  importance: number; // 0.3 (Low) to 1.0 (High)
  isRequired: boolean;
}

export interface MatchResult {
  expert: Expert;
  matchScore: number; // 0-100
  matchedSkills: string[];
  missingSkills: string[];
  semanticScore: number;
  skillOverlapScore: number;
  credentialScore: number;
  bandwidthScore: number;
  matchedPublications: Publication[];
  hint: string;
}

export interface AdvisoryProposal {
  id: string;
  studentId: string;
  expertId: string;
  projectTitle: string;
  synopsis: string;
  milestones: Milestone[];
  weeklyCommitment: number;
  meetingFrequency: string;
  motivation: string;
  scope: 'primary' | 'co_advisor';
  state: FSMState;
  createdAt: string;
  updatedAt: string;
  timeline: FSMEvent[];
  negotiationNote?: string;
  aiAlignmentScore: number;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  description: string;
}

export interface FSMEvent {
  id: string;
  state: FSMState;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface Consultation {
  id: string;
  expertId: string;
  studentId: string;
  slot: OfficeHourSlot;
  date: string;
  agenda: string;
  meetingLink?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  type: 'fsm_transition' | 'quota_change' | 'consultation' | 'system' | 'evaluation';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface SkillGap {
  required: string[];
  covered: string[];
  deficits: string[];
  teamReadiness: number; // 0-100
  criticalDeficit: boolean;
  criticalDomain?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userRole: UserRole;
  ip: string;
  eventType: string;
  payload: Record<string, unknown>;
  hash: string;
  previousHash: string;
  valid: boolean;
}

export interface SystemHealth {
  uptime: number;
  qdrantLatency: number;
  queueDepth: number;
  lastBackup: string;
  nlpFallbackEvents: number;
  vectorSearchOnline: boolean;
}

export interface ProjectWorkspace {
  id: string;
  projectTitle: string;
  studentIds: string[];
  advisorId: string;
  stage: ProjectStage;
  milestones: Milestone[];
  messages: WorkspaceMessage[];
  files: WorkspaceFile[];
}

export interface WorkspaceMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface WorkspaceFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

