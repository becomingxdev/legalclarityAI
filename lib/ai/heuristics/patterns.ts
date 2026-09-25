import { RiskCategory } from "@/types/legal";

export interface LegalPattern {
  id: string;
  category: RiskCategory;
  patterns: RegExp[];
  severity: "High" | "Medium" | "Low";
  title: string;
  explanation: string;
  whyItMatters: string;
  recommendation: string;
}

export const LEGAL_PATTERNS: LegalPattern[] = [
  // ── 1. Renewal & Term ──────────────────────────────────────────────────────
  {
    id: "auto-renewal",
    category: "Renewal Clauses",
    patterns: [
      /automatically renew[s]?\s+for/i,
      /shall automatically renew/i,
      /successive\s+(?:one|1|two|2|three|3|twelve|12)?\s*(?:year|month|term)s?\s+periods?\s+unless/i,
      /auto-renewal/i,
    ],
    severity: "Medium",
    title: "Automatic Renewal Clause",
    explanation: "The agreement rolls over into a subsequent term automatically unless advance cancellation notice is served.",
    whyItMatters: "Missing the notice cutoff window locks the organization into ongoing billing and obligations for an extended term.",
    recommendation: "Track the notice deadline in calendar systems and negotiate for mutual 30-day non-renewal notice.",
  },
  {
    id: "renewal-price-increase",
    category: "Renewal Clauses",
    patterns: [
      /increase.*(?:fees|prices|rates).*(?:renewal|anniversary)/i,
      /fees\s+may\s+increase\s+by/i,
      /price\s+adjustment\s+upon\s+renewal/i,
    ],
    severity: "Medium",
    title: "Unilateral Renewal Price Escalation",
    explanation: "Permits the vendor to raise subscription fees or rates automatically at each renewal period.",
    whyItMatters: "Costs can compound without budget approval if annual caps or fixed indexation bounds are missing.",
    recommendation: "Cap annual increases to CPI or a maximum of 3-5% per renewal period.",
  },

  // ── 2. Termination ─────────────────────────────────────────────────────────
  {
    id: "termination-convenience",
    category: "Termination Clauses",
    patterns: [
      /terminate.*for convenience/i,
      /terminate.*at any time without cause/i,
      /terminate.*upon.*days.*written notice.*without cause/i,
      /either party may terminate.*without liability/i,
    ],
    severity: "Medium",
    title: "Termination for Convenience",
    explanation: "One or both parties can cancel the contract without having to prove a breach or cause.",
    whyItMatters: "Provides exit flexibility, but if one-sided, the counterparty can disrupt services without penalty.",
    recommendation: "Ensure the convenience termination right is bilateral and requires at least 30-60 days advance written notice.",
  },
  {
    id: "termination-cause-cure",
    category: "Termination Clauses",
    patterns: [
      /terminate.*material breach.*(?:cure|notice)/i,
      /fails to cure such breach within/i,
      /written notice of breach.*days/i,
    ],
    severity: "Medium",
    title: "Termination for Material Breach & Cure Window",
    explanation: "Specifies procedures, notice requirements, and cure windows before a contract can be terminated for breach.",
    whyItMatters: "Defines the exact timeframe to rectify operational or financial missteps before facing contract termination.",
    recommendation: "Ensure standard 30-day cure periods apply to non-monetary breaches.",
  },
  {
    id: "survival-clause",
    category: "Termination Clauses",
    patterns: [
      /shall survive.*(?:expiration|termination)/i,
      /survival of obligations/i,
      /sections?.*shall survive/i,
    ],
    severity: "Low",
    title: "Post-Termination Survival of Obligations",
    explanation: "Designates certain clauses (like confidentiality, indemnities, and liability limits) that persist after the contract ends.",
    whyItMatters: "Legal obligations continue to bind your organization even after business relationships conclude.",
    recommendation: "Review surviving sections to ensure operational commitments do not linger indefinitely.",
  },

  // ── 3. Payment & Financial ─────────────────────────────────────────────────
  {
    id: "late-payment-interest",
    category: "Payment Terms",
    patterns: [
      /interest at the rate of/i,
      /late payment.*charge/i,
      /past due.*accrue interest/i,
      /1\.5%.*per month/i,
      /2\.0%.*per month/i,
    ],
    severity: "Low",
    title: "Late Payment Penalties & Interest Accrual",
    explanation: "Past-due invoices accrue monthly interest penalties and administrative fees.",
    whyItMatters: "Accounts payable processing delays can inadvertently generate financial penalties.",
    recommendation: "Ensure interest rates are statutory/reasonable and require formal written notice before interest attaches.",
  },
  {
    id: "service-suspension-nonpayment",
    category: "Payment Terms",
    patterns: [
      /suspend.*service.*(?:unpaid|overdue|delinquent)/i,
      /right to suspend.*without liability.*payment/i,
      /suspension of access.*failure to pay/i,
    ],
    severity: "High",
    title: "Immediate Service Suspension for Unpaid Invoices",
    explanation: "Provider reserves the right to cut off service or access if invoices remain unpaid.",
    whyItMatters: "A billing disagreement or administrative oversight could lead to operational disruption without recourse.",
    recommendation: "Add a clause requiring 10-15 business days written cure notice before any service cutoff.",
  },
  {
    id: "non-refundable-fees",
    category: "Payment Terms",
    patterns: [
      /all fees are non-refundable/i,
      /fees paid.*non-refundable/i,
      /no refunds.*under any circumstances/i,
    ],
    severity: "Medium",
    title: "Strict Non-Refundable Fee Clause",
    explanation: "All prepaid fees are forfeited and cannot be reclaimed even upon early termination.",
    whyItMatters: "If the provider fails to perform or terminates early, recovering upfront capital is prohibited.",
    recommendation: "Insert a carve-out granting pro-rata refunds if termination is due to vendor material breach.",
  },

  // ── 4. Liability & Indemnification ─────────────────────────────────────────
  {
    id: "liability-cap",
    category: "Liability Clauses",
    patterns: [
      /liability shall not exceed/i,
      /aggregate liability.*limited to/i,
      /maximum liability.*amount paid/i,
      /total cumulative liability/i,
      /shall in no event exceed the fees paid/i,
    ],
    severity: "High",
    title: "Aggregate Liability Ceiling",
    explanation: "Limits the counterparty's total financial exposure, typically to fees paid in the prior 12 months.",
    whyItMatters: "In a catastrophic breach, service disruption, or data loss, your recovery cannot exceed this dollar amount.",
    recommendation: "Carve out gross negligence, willful misconduct, confidentiality breaches, and data security from the liability cap.",
  },
  {
    id: "consequential-damages-waiver",
    category: "Liability Clauses",
    patterns: [
      /consequential.*indirect.*special.*punitive/i,
      /loss of profits.*lost revenue.*data loss/i,
      /in no event shall.*incidental or consequential/i,
    ],
    severity: "Medium",
    title: "Waiver of Consequential & Indirect Damages",
    explanation: "Both parties waive rights to recover lost business profits, consequential damages, or indirect injury.",
    whyItMatters: "Bars recovery for secondary downstream commercial losses caused by a system outage or contract breach.",
    recommendation: "Ensure this waiver is strictly mutual and excludes unauthorized disclosure of confidential information.",
  },
  {
    id: "customer-indemnification",
    category: "Liability Clauses",
    patterns: [
      /customer shall defend, indemnify/i,
      /customer agrees to indemnify/i,
      /hold harmless from any and all claims/i,
      /indemnify.*against.*third-party claims/i,
    ],
    severity: "High",
    title: "Customer Indemnification Obligation",
    explanation: "Requires your organization to defend, indemnify, and pay legal fees for the provider against third-party claims.",
    whyItMatters: "Exposes your business to legal defense costs and settlement burdens generated by end-user disputes.",
    recommendation: "Demand reciprocal indemnification from the vendor for IP infringement and breaches of applicable law.",
  },
  {
    id: "ip-infringement-indemnity",
    category: "Liability Clauses",
    patterns: [
      /infringement of any.*patent|copyright|trademark/i,
      /intellectual property indemnification/i,
      /defend.*alleging that the service infringes/i,
    ],
    severity: "Medium",
    title: "Intellectual Property Indemnification",
    explanation: "Outlines which party defends and pays judgments if the licensed product infringes third-party IP rights.",
    whyItMatters: "Without vendor IP indemnity, you could be sued by patent or copyright holders for using their software.",
    recommendation: "Verify that the provider gives full defense and settlement coverage with no sub-caps.",
  },

  // ── 5. Confidentiality & IP ────────────────────────────────────────────────
  {
    id: "confidentiality-obligations",
    category: "Confidentiality",
    patterns: [
      /confidential information/i,
      /degree of care.*confidential/i,
      /duty of confidentiality/i,
      /non-disclosure.*obligations/i,
    ],
    severity: "Medium",
    title: "Confidentiality & Non-Disclosure Covenants",
    explanation: "Restricts how proprietary data, business processes, and trade secrets are handled and disclosed.",
    whyItMatters: "Breaching confidentiality covenants can lead to emergency injunctive relief and significant statutory liability.",
    recommendation: "Ensure standard carve-outs exist (public knowledge, court orders, independent development).",
  },
  {
    id: "confidentiality-duration",
    category: "Confidentiality",
    patterns: [
      /confidentiality.*period of.*years/i,
      /survive for a period of\s+\d+\s+years/i,
      /confidentiality.*in perpetuity/i,
    ],
    severity: "Low",
    title: "Fixed Confidentiality Sunset / Survival Window",
    explanation: "Sets the term during which nondisclosure obligations continue post-termination (e.g. 3-5 years or in perpetuity).",
    whyItMatters: "Determines how long you must securely archive and refrain from using counterparty confidential materials.",
    recommendation: "Confirm duration matches the commercial shelf-life of the shared information.",
  },
  {
    id: "ip-ownership-work-made-for-hire",
    category: "Restrictions",
    patterns: [
      /work made for hire/i,
      /all right, title and interest/i,
      /exclusive property of/i,
      /assigns all right, title/i,
      /customer retains all ownership/i,
    ],
    severity: "High",
    title: "Intellectual Property Ownership & Assignment",
    explanation: "Establishes which party owns newly created deliverables, modifications, algorithms, or client data.",
    whyItMatters: "Inadvertently assigning IP can surrender ownership of internal innovations or proprietary workflows.",
    recommendation: "Explicitly clarify that your organization retains 100% ownership of your pre-existing IP and customer data.",
  },

  // ── 6. Restrictive Covenants ───────────────────────────────────────────────
  {
    id: "non-solicitation",
    category: "Restrictions",
    patterns: [
      /shall not.*solicit.*(?:hire|employ).*employee/i,
      /non-solicitation of employees/i,
      /refrain from soliciting/i,
    ],
    severity: "Medium",
    title: "Employee Non-Solicitation Covenant",
    explanation: "Bars either party from recruiting or hiring employees or contractors of the other during and after the contract.",
    whyItMatters: "May impede recruiting efforts and trigger claims if an engineer applies through public listings.",
    recommendation: "Include standard carve-outs for general non-targeted public recruitment and job postings.",
  },
  {
    id: "non-compete",
    category: "Restrictions",
    patterns: [
      /non-competition/i,
      /shall not compete with/i,
      /engage in any business.*competing/i,
      /restrictive covenant/i,
    ],
    severity: "High",
    title: "Non-Compete & Business Exclusivity Restriction",
    explanation: "Prohibits entering certain business verticals, marketing competing products, or serving specific clients.",
    whyItMatters: "Significantly restrains commercial growth and strategic flexibility.",
    recommendation: "Narrow geographical, temporal, and market scopes, or strike out entirely if unnecessary.",
  },

  // ── 7. Data Protection & Compliance ────────────────────────────────────────
  {
    id: "data-breach-notification",
    category: "Obligations",
    patterns: [
      /notify.*security incident/i,
      /notice of data breach/i,
      /within.*hours.*security breach/i,
      /personal data breach.*notify/i,
    ],
    severity: "High",
    title: "Security Incident & Data Breach Notification Deadline",
    explanation: "Specifies how quickly the vendor must inform you if an unauthorized party accesses company data.",
    whyItMatters: "Crucial for statutory compliance with GDPR, CCPA, and industry incident reporting regulations.",
    recommendation: "Demand breach notification within 24 to 48 hours of confirmed compromise.",
  },
  {
    id: "data-deletion-return",
    category: "Obligations",
    patterns: [
      /return or destroy.*customer data/i,
      /deletion of personal data/i,
      /promptly return all confidential/i,
      /certify in writing.*destruction/i,
    ],
    severity: "Medium",
    title: "Obligation to Return or Destroy Data Upon Termination",
    explanation: "Requires returning or cryptographically erasing all customer datasets and backups at contract end.",
    whyItMatters: "Prevents residual cloud data storage, reducing ongoing compliance and leakage liabilities.",
    recommendation: "Request written certification of irreversible data destruction within 30 days of contract close.",
  },
  {
    id: "audit-rights",
    category: "Restrictions",
    patterns: [
      /right to audit/i,
      /permit provider to audit/i,
      /allow provider to inspect/i,
      /inspection of books and records/i,
    ],
    severity: "Medium",
    title: "Vendor License & Compliance Audit Rights",
    explanation: "Authorizes the vendor to inspect your infrastructure, records, or logs to verify compliance.",
    whyItMatters: "Can lead to disruptive onsite inspections and retroactively assessed shortfall fees.",
    recommendation: "Limit audits to once annually, upon 30 days written notice, during normal business hours.",
  },

  // ── 8. Governance & Dispute Resolution ─────────────────────────────────────
  {
    id: "governing-law-jurisdiction",
    category: "Obligations",
    patterns: [
      /governed by the laws of/i,
      /exclusive jurisdiction of/i,
      /venue shall lie in/i,
      /courts of.*shall have jurisdiction/i,
    ],
    severity: "Low",
    title: "Governing Law and Choice of Forum",
    explanation: "Designates the state or national legal framework and court jurisdiction governing disputes.",
    whyItMatters: "Litigating in distant or unfamiliar jurisdictions significantly increases legal expense.",
    recommendation: "Align governing law and venue with your primary operating jurisdiction or a neutral jurisdiction like Delaware.",
  },
  {
    id: "mandatory-arbitration",
    category: "Obligations",
    patterns: [
      /binding arbitration/i,
      /american arbitration association/i,
      /aaa rules/i,
      /arbitration.*jams/i,
      /waiver of jury trial/i,
      /class action waiver/i,
    ],
    severity: "Medium",
    title: "Mandatory Binding Arbitration & Jury Trial Waiver",
    explanation: "Requires disputes to be resolved by private arbitrators, waiving trial by jury and class actions.",
    whyItMatters: "Private arbitration is binding with very limited appeal rights and can carry high tribunal fees.",
    recommendation: "Ensure preliminary emergency injunctive relief is preserved in court for IP and confidentiality breaches.",
  },
  {
    id: "force-majeure",
    category: "Obligations",
    patterns: [
      /force majeure/i,
      /act of god/i,
      /beyond reasonable control.*delay/i,
      /epidemic|pandemic|war|strikes/i,
    ],
    severity: "Low",
    title: "Force Majeure Clause",
    explanation: "Excuses performance obligations during extraordinary unforeseen events (natural disasters, war, pandemics).",
    whyItMatters: "Shields parties from breach damages when external disasters make performance impossible.",
    recommendation: "Ensure payment obligations are not indefinitely excused and either party may terminate if event exceeds 60 days.",
  },
];
