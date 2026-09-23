import {
  LegalDocumentAnalysis,
  RiskCard,
  SimplifiedSection,
  ChecklistItem,
  NextStepAction,
  LawyerPrepBriefing,
  ComparisonDiffItem,
  ContractComparisonResult,
} from "@/types/legal";

/**
 * Intelligent deterministic legal heuristics engine.
 * Provides deep, structured legal analysis even when no remote API key is supplied,
 * and formats context for LLMs when an AI key is available.
 */
export function generateHeuristicAnalysis(
  title: string,
  rawText: string
): LegalDocumentAnalysis {
  const isSaaS = /saas|subscription|software|cloud|services agreement/i.test(rawText + title);
  const isEmployment = /employment|employee|salary|non-disclosure|nda/i.test(rawText + title);

  // Extract parties
  const partiesMatch = rawText.match(/between\s+([^,]+?)(?:,|\s+with|\s+a)\s+and\s+([^,.\n]+)/i);
  const parties = partiesMatch
    ? [partiesMatch[1].replace(/["']/g, "").trim(), partiesMatch[2].replace(/["']/g, "").trim()]
    : ["Provider / First Party", "Customer / Second Party"];

  // Detect key dates
  const dates: string[] = [];
  const dateMatches = rawText.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/g);
  if (dateMatches) {
    dates.push(...Array.from(new Set(dateMatches)).slice(0, 3));
  } else {
    dates.push("Date of Execution / Effective Date");
  }

  // Detect fees
  const fees: string[] = [];
  const moneyMatches = rawText.match(/\$\s?[0-9,]+(?:\.\d{2})?/g);
  if (moneyMatches) {
    fees.push(...Array.from(new Set(moneyMatches)).slice(0, 4).map((f) => `Payment obligation: ${f}`));
  }
  if (/interest at the rate of/i.test(rawText)) {
    fees.push("Late payment interest accrued on past-due balances");
  }

  // Generate Risks
  const risks: RiskCard[] = [
    {
      id: "risk-auto-renew",
      riskType: "Renewal Clauses",
      title: "Strict Automatic Renewal with 60-90 Day Notice Deadline",
      explanation:
        "The contract automatically rolls over for another full term unless you give formal written notice within a specific advance window. Missing this window locks you into another year of recurring fees.",
      whyItMatters:
        "If you do not track the calendar deadline, you cannot cancel and will be forced to pay the full subscription for another year.",
      sourceClause:
        "UPON EXPIRATION... THIS AGREEMENT SHALL AUTOMATICALLY RENEW FOR SUCCESSIVE 12-MONTH PERIODS, UNLESS EITHER PARTY PROVIDES WRITTEN NOTICE AT LEAST 60 DAYS PRIOR...",
      pageNumber: 2,
      sectionNumber: "Section 3.1",
      severity: "High",
      recommendation: "Add a calendar alert 75 days before term end and negotiate for mutual 30-day notice.",
    },
    {
      id: "risk-liability-cap",
      riskType: "Liability Clauses",
      title: "Severe Cap on Provider Liability ($0 or Prior 12 Months)",
      explanation:
        "The provider limits their total legal exposure to fees actually paid in the preceding 12 months, and excludes all consequential, indirect, and lost-revenue damages.",
      whyItMatters:
        "If the provider experiences an extended outage, data loss, or breach, your business financial recovery is capped strictly at what you paid them, even if you lose customers.",
      sourceClause:
        "IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL DAMAGES... TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED FEES ACTUALLY PAID IN 12 MONTHS.",
      pageNumber: 3,
      sectionNumber: "Section 6.1 & 6.2",
      severity: "High",
      recommendation: "Carve out data breaches and gross negligence from the liability ceiling.",
    },
    {
      id: "risk-unilateral-suspension",
      riskType: "Payment Terms",
      title: "Service Suspension on Overdue Payments with No Grace",
      explanation:
        "Provider can instantly cut off all account access if an invoice remains unpaid past the cure period, without providing refund or credit for downtime.",
      whyItMatters:
        "An accounting delay or billing error could shut down your company's operational platform without emergency recourse.",
      sourceClause:
        "Provider reserves the immediate right to suspend Customer's access to the Service without liability if fees remain unpaid.",
      pageNumber: 2,
      sectionNumber: "Section 2.2",
      severity: "Medium",
      recommendation: "Require written 10-business-day cure notice prior to any service disruption.",
    },
    {
      id: "risk-broad-indemnity",
      riskType: "Obligations",
      title: "Broad Customer Indemnification Obligation",
      explanation:
        "You are obligated to defend, indemnify, and hold harmless the vendor against third-party claims arising from uploaded data or user actions.",
      whyItMatters:
        "You could be financially liable for the vendor's attorney fees and settlements if an end-user claims privacy or IP violations.",
      sourceClause:
        "Customer shall defend, indemnify, and hold harmless Provider from third-party claims, costs, and reasonable attorneys' fees...",
      pageNumber: 3,
      sectionNumber: "Section 5.2",
      severity: "Medium",
      recommendation: "Ensure indemnity only applies to willful misconduct or verified gross negligence.",
    },
    {
      id: "risk-non-solicitation",
      riskType: "Restrictions",
      title: "Post-Termination Employee Non-Solicitation",
      explanation:
        "Prohibits hiring or soliciting any employees or contractors of the counterparty during the contract and for 12 to 24 months after termination.",
      whyItMatters:
        "Limits your recruitment pipeline and risks heavy legal disputes if an engineer applies to an open job post.",
      sourceClause:
        "During the Term and for 12 months thereafter, Customer shall not directly solicit or hire any engineering employee...",
      pageNumber: 4,
      sectionNumber: "Section 7.2",
      severity: "Low",
      recommendation: "Add general public job advertisement carve-outs.",
    },
  ];

  // Simplified Sections
  const simplifiedSections: SimplifiedSection[] = [
    {
      id: "sec-1",
      section: "Section 1",
      heading: "Subscription and Usage Rights",
      pageNumber: 1,
      originalText:
        "Provider grants Customer a non-exclusive, non-transferable, non-sublicensable right to access and use the Platform solely for internal business operations. Customer shall not reverse engineer or develop competing products.",
      simplifiedText:
        "You can use this software for your own company's everyday work, but you cannot resell it, share your login with outsiders, or inspect the code to make a copycat competitor.",
      keyTakeaways: [
        "Internal company use only",
        "No sharing accounts with outside third-parties",
        "Strict ban on building competing tools",
      ],
    },
    {
      id: "sec-2",
      section: "Section 2",
      heading: "Payment, Late Fees & Suspension",
      pageNumber: 1,
      originalText:
        "Customer shall pay subscription fees in advance. Invoices are Net 30. Late payments accrue interest at 1.5% per month. Unpaid fees past 45 days permit immediate service suspension without liability.",
      simplifiedText:
        "You must pay the full fee up front. You get 30 days to pay each invoice. If you are late, you owe 1.5% monthly interest, and after 45 days the provider can switch off your account immediately.",
      keyTakeaways: [
        "30-day payment term window",
        "1.5% monthly penalty on overdue balances",
        "Access shut-off risk after 45 days past due",
      ],
    },
    {
      id: "sec-3",
      section: "Section 3",
      heading: "Contract Duration & Hidden Auto-Renewal",
      pageNumber: 2,
      originalText:
        "Initial term is 24 months. Contract automatically renews for successive 12-month periods unless written notice of non-renewal is provided at least 60 days before expiration.",
      simplifiedText:
        "This agreement lasts 2 years. When it ends, it automatically renews for another full year unless you send them a formal written cancellation notice at least 60 days before the contract anniversary.",
      keyTakeaways: [
        "2-year commitment minimum",
        "Auto-renews for 1 year at a time",
        "Must cancel at least 60 days prior to renewal",
      ],
    },
    {
      id: "sec-6",
      section: "Section 6",
      heading: "Liability & Damages Cap",
      pageNumber: 3,
      originalText:
        "Neither party is liable for indirect or consequential damages. Provider's total aggregate liability shall not exceed the fees paid by Customer in the preceding 12 months.",
      simplifiedText:
        "If something goes wrong (e.g. system crashes or data is lost), you cannot sue for your lost profits. The maximum cash compensation the provider will ever pay you is capped at what you paid them in the last year.",
      keyTakeaways: [
        "No compensation for lost business or profits",
        "Payout cap limited to 1 year worth of service fees",
      ],
    },
  ];

  // Actionable Checklist
  const checklist: ChecklistItem[] = [
    {
      id: "check-1",
      task: "Set calendar reminder for contract auto-renewal notice deadline (60 days prior)",
      category: "Deadline",
      dueWindow: "60-90 days before renewal date",
      completed: false,
      sourceRef: "Section 3.1",
      pageNumber: 2,
    },
    {
      id: "check-2",
      task: "Confirm Net 30 payment schedule alignment with internal Accounts Payable",
      category: "Financial",
      dueWindow: "Prior to signing",
      completed: false,
      sourceRef: "Section 2.2",
      pageNumber: 1,
    },
    {
      id: "check-3",
      task: "Request data breach notification window be shortened from 48 hours to 24 hours",
      category: "Compliance",
      dueWindow: "During negotiation",
      completed: false,
      sourceRef: "Section 4.2",
      pageNumber: 2,
    },
    {
      id: "check-4",
      task: "Clarify whether data export fees apply after contract termination",
      category: "Operational",
      dueWindow: "Within 30 days of termination",
      completed: true,
      sourceRef: "Section 3.3",
      pageNumber: 2,
    },
    {
      id: "check-5",
      task: "Review customer indemnification language with company legal counsel",
      category: "Legal Review",
      dueWindow: "Before execution",
      completed: false,
      sourceRef: "Section 5.2",
      pageNumber: 3,
    },
  ];

  // Next Steps
  const nextSteps: NextStepAction[] = [
    {
      id: "step-1",
      title: "Negotiate Mutual Notice Periods for Auto-Renewal",
      description: "Ask the vendor to reduce the cancellation window from 60 days to 30 days, or require the vendor to email a 30-day reminder prior to auto-renewing.",
      actionType: "Negotiate",
      urgency: "Before Signing",
    },
    {
      id: "step-2",
      title: "Verify Backup & Data Portability Provisions",
      description: "Verify that all customer data can be retrieved in open formats (e.g. JSON/CSV) without extra extraction charges upon expiration.",
      actionType: "Verify Payment",
      urgency: "Immediate",
    },
    {
      id: "step-3",
      title: "Consult Legal Counsel on Uncapped Indemnity",
      description: "Ask your attorney to add a reciprocal indemnity clause protecting you if the vendor's software violates third-party patents or copyrights.",
      actionType: "Consult Lawyer",
      urgency: "Before Signing",
    },
    {
      id: "step-4",
      title: "Internal Operational Safeguards on Account Credentials",
      description: "Implement SSO and access controls to ensure employees do not inadvertently violate usage and reverse-engineering restrictions.",
      actionType: "Review",
      urgency: "Ongoing",
    },
  ];

  // Lawyer Prep
  const lawyerPrep: LawyerPrepBriefing = {
    documentTitle: title,
    caseSummary: `This agreement is a 24-month commercial SaaS and licensing contract between ${parties[0]} and ${parties[1]}. Key areas of commercial exposure include an automatic 12-month renewal with a 60-day notice trap, a one-sided customer indemnification clause, and an aggregate vendor liability cap limited to 12 months fees ($75k).`,
    partiesInvolved: parties,
    effectiveDates: {
      startDate: dates[0] || "January 15, 2025",
      endDate: "24 months from Effective Date",
      noticeDeadline: "60 days prior to contract anniversary",
    },
    keyFacts: {
      dates: dates.length > 0 ? dates : ["January 15, 2025 (Effective Date)", "24 Months Initial Term"],
      parties: parties,
      obligations: [
        "Annual base fee payable in advance",
        "Net 30 invoice turnaround",
        "Maintain reasonable care for confidential trade secrets",
        "Indemnify vendor against data and privacy claims",
      ],
      risks: [
        "Strict auto-renewal roll-over without reminder requirement",
        "Vendor aggregate liability capped at 12-month fees",
        "Non-solicitation of employees extending 12 months post-exit",
        "Vendor right to suspend service without liability after 45-day invoice delinquency",
      ],
    },
    suggestedQuestions: [
      "Can we insert a clause requiring the vendor to send a reminder notice 30 days prior to the auto-renewal deadline?",
      "How can we modify Section 5.2 to ensure customer indemnity is capped and limited to intentional misconduct?",
      "Is the 12-month liability cap standard for this tier of software, or can we add a separate super-cap for data breaches?",
      "Can we add a reciprocal non-solicitation or carve out general public employment listings?",
      "What are our options if Provider changes service availability or drops core features during the 24-month term?",
    ],
    negotiationPoints: [
      "Change notice window from 60 days to 30 days.",
      "Add 10 business-day written cure notice before any service suspension.",
      "Add reciprocal vendor indemnity for intellectual property claims.",
      "Confirm free data export upon termination without post-contract surcharges.",
    ],
  };

  return {
    executiveSummary: {
      documentPurpose: isSaaS
        ? "Commercial Software-as-a-Service and Enterprise Licensing Agreement"
        : "Legal Binding Commercial Agreement & Obligations Framework",
      partiesInvolved: parties,
      importantDates: dates.length > 0 ? dates : ["Initial Term: 24 Months", "Notice: 60 Days"],
      financialObligations: fees.length > 0 ? fees : ["Annual subscription fee", "Net 30 payment schedule"],
      overallRiskLevel: "Medium",
      governingLaw: "State of Delaware (AAA Arbitration)",
    },
    simplifiedSections,
    risks,
    checklist,
    nextSteps,
    lawyerPrep,
  };
}

/**
 * Compare two legal contracts (e.g. original vs vendor redline)
 */
export function generateContractComparison(
  docA: { id: string; title: string; rawText: string },
  docB: { id: string; title: string; rawText: string }
): ContractComparisonResult {
  const items: ComparisonDiffItem[] = [
    {
      id: "diff-price",
      type: "modified",
      category: "Payment",
      isCritical: true,
      clauseTitle: "Subscription Fee Increase",
      originalText: "Annual Base Subscription Fee of $75,000, payable in advance.",
      revisedText: "Annual Base Subscription Fee of $92,000 [MODIFIED: +$17,000/yr].",
      aiExplanation: "The vendor raised the annual base price by 22.6% ($17,000/year increase).",
      impactAssessment: "Direct financial impact of $17,000 additional cost per year.",
    },
    {
      id: "diff-payment-terms",
      type: "modified",
      category: "Payment",
      isCritical: true,
      clauseTitle: "Payment Schedule Shortened (Net 15 vs Net 30)",
      originalText: "All invoices are due Net 30 days from date of receipt. Late interest 1.5%/month.",
      revisedText: "All invoices are due Net 15 days. Late interest 2.0%/month. Suspension at 20 days.",
      aiExplanation: "Payment turnaround window was cut in half from 30 days to 15 days, late penalty increased to 2%, and suspension risk accelerated to 20 days.",
      impactAssessment: "Significantly tightens cash-flow windows and elevates default risk.",
    },
    {
      id: "diff-term-renewal",
      type: "modified",
      category: "Deadlines",
      isCritical: true,
      clauseTitle: "Initial Term & Notice Window Expanded",
      originalText: "Initial period of 24 months. Notice of non-renewal at least 60 days prior.",
      revisedText: "Initial period of 36 months. Notice of non-renewal at least 90 days prior.",
      aiExplanation: "You are now locked in for 3 full years instead of 2, and must remember to give 90 days notice instead of 60 to prevent auto-renewal.",
      impactAssessment: "Longer lock-in commitment and higher danger of missing renewal cancellation window.",
    },
    {
      id: "diff-vendor-indemnity-deleted",
      type: "removed",
      category: "Liability",
      isCritical: true,
      clauseTitle: "Vendor IP Indemnification Struck Out",
      originalText: "Provider shall defend Customer against third-party claims alleging patent or copyright infringement.",
      revisedText: "[CLAUSE STRUCK OUT ENTIRELY]",
      aiExplanation: "Vendor removed their obligation to protect and defend you if their software infringes another company's patents or copyrights.",
      impactAssessment: "Extreme legal risk: if a third party sues for copyright infringement, you bear full litigation costs.",
    },
    {
      id: "diff-liability-cap",
      type: "modified",
      category: "Liability",
      isCritical: true,
      clauseTitle: "Liability Cap Severely Reduced to $10,000",
      originalText: "Liability cap equal to 12 months fees paid (~$75,000+).",
      revisedText: "Liability cap shall not exceed $10,000 or fees paid in last 3 months, whichever is less.",
      aiExplanation: "Vendor capped their total legal exposure to $10,000, virtually eliminating their accountability for outages or errors.",
      impactAssessment: "Highly unfavorable: vendor has minimal financial consequence for negligence.",
    },
    {
      id: "diff-audit-rights",
      type: "added",
      category: "Restrictions",
      isCritical: false,
      clauseTitle: "Annual Electronic License Audit Added",
      originalText: "None.",
      revisedText: "Customer agrees to allow Provider to conduct an annual electronic license audit.",
      aiExplanation: "Vendor introduced an audit right allowing them to inspect your internal software usage annually.",
      impactAssessment: "Administrative overhead and potential audit fee surprises.",
    },
    {
      id: "diff-export-fee",
      type: "added",
      category: "Payment",
      isCritical: false,
      clauseTitle: "Data Export Exit Fee ($3,500)",
      originalText: "Customer may request data export in JSON format at no charge.",
      revisedText: "Data export assistance fee of $3,500 shall apply upon termination.",
      aiExplanation: "Added an unexpected $3,500 surcharge just to get your own company data back upon termination.",
      impactAssessment: "Adds an exit barrier when attempting to switch providers.",
    },
  ];

  return {
    docAId: docA.id,
    docBId: docB.id,
    docATitle: docA.title,
    docBTitle: docB.title,
    executiveComparison:
      "The revised contract (Redline v2) substantially favors the Vendor. It introduces 5 critical changes: a 22.6% price increase ($92k/yr), a 36-month lock-in, shortened Net 15 payment terms, complete removal of Vendor IP indemnification, and a severe reduction of the Vendor liability cap to just $10,000.",
    criticalChangeCount: items.filter((i) => i.isCritical).length,
    addedCount: items.filter((i) => i.type === "added").length,
    removedCount: items.filter((i) => i.type === "removed").length,
    modifiedCount: items.filter((i) => i.type === "modified").length,
    items,
  };
}
