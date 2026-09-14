export type ClinicalRisk = 'A' | 'B' | 'C';
export type ToolStatus = 'validated' | 'review_due' | 'deprecated';
export interface ClinicalSource { title: string; citation: string; url: string; accessedAt: string }
export interface ClinicalTool {
  id: string; name: string; acronym: string; specialty: string; summary: string; keywords: string[];
  risk: ClinicalRisk; status: ToolStatus; version: string; reviewedAt: string; duration: string;
  icon: string; color: string; surfaceColor: string; available: boolean; indications: string[];
  limitations: string[]; sources: ClinicalSource[];
}
