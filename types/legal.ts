export interface DocumentChunk {
  documentId: string;
  chunkId: string;
  pageNumber: number;
  section: string;
  heading: string;
  content: string;
}

export type RiskCategory =
  | "Obligations"
  | "Payment Terms"
  | "Termination Clauses"
  | "Liability Clauses"
  | "Confidentiality"
  | "Renewal Clauses"
  | "Restrictions";

export type RiskSeverity = "High" | "Medium" | "Low";

export interface RiskCard {
  id: string;
  riskType: RiskCategory;
  title: string;
  explanation: string;
  whyItMatters: string;
  sourceClause: string;
  pageNumber: number;
  sectionNumber?: string;
  severity: RiskSeverity;
  recommendation?: string;
}

export interface SimplifiedSection {
  id: string;
  originalText: string;
  simplifiedText: string;
  section: string;
  heading: string;
  pageNumber: number;
  keyTakeaways: string[];
}

export interface ChecklistItem {
  id: string;
  task: string;
  category: "Compliance" | "Financial" | "Operational" | "Legal Review" | "Deadline";
  dueWindow?: string;
  responsibleParty?: string;
  completed: boolean;
  sourceRef?: string;
  pageNumber?: number;
}

export interface SourceReference {
  pageNumber: number;
  section: string;
  clause: string;
  quote: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "system";
  text: string;
  timestamp: string;
  sources?: SourceReference[];
  suggestedFollowUps?: string[];
}

export interface LawyerPrepBriefing {
  documentTitle: string;
  caseSummary: string;
  partiesInvolved: string[];
  effectiveDates: {
    startDate?: string;
    endDate?: string;
    noticeDeadline?: string;
  };
  keyFacts: {
    dates: string[];
    parties: string[];
    obligations: string[];
    risks: string[];
  };
  suggestedQuestions: string[];
  negotiationPoints: string[];
}

export interface ExecutiveSummary {
  documentPurpose: string;
  partiesInvolved: string[];
  importantDates: string[];
  financialObligations: string[];
  overallRiskLevel: "High" | "Medium" | "Low";
  governingLaw?: string;
}

export interface NextStepAction {
  id: string;
  title: string;
  description: string;
  actionType: "Review" | "Gather Documents" | "Negotiate" | "Verify Payment" | "Consult Lawyer" | "Sign/Reject";
  urgency: "Immediate" | "Before Signing" | "Ongoing";
}

export interface LegalDocumentAnalysis {
  executiveSummary: ExecutiveSummary;
  simplifiedSections: SimplifiedSection[];
  risks: RiskCard[];
  checklist: ChecklistItem[];
  nextSteps: NextStepAction[];
  lawyerPrep: LawyerPrepBriefing;
}

export interface LegalDocument {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  rawText: string;
  pageCount: number;
  chunks: DocumentChunk[];
  analysis?: LegalDocumentAnalysis;
  chatHistory: ChatMessage[];
  status: "processing" | "ready" | "error";
}

export interface ComparisonDiffItem {
  id: string;
  type: "added" | "removed" | "modified";
  category: "Payment" | "Liability" | "Deadlines" | "Rights" | "Restrictions" | "General";
  isCritical: boolean;
  clauseTitle: string;
  originalText?: string;
  revisedText?: string;
  aiExplanation: string;
  impactAssessment: string;
}

export interface ContractComparisonResult {
  docAId: string;
  docBId: string;
  docATitle: string;
  docBTitle: string;
  executiveComparison: string;
  criticalChangeCount: number;
  addedCount: number;
  removedCount: number;
  modifiedCount: number;
  items: ComparisonDiffItem[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isGuest?: boolean;
}
