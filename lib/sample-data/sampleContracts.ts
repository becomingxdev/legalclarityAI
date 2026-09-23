import { LegalDocument } from "@/types/legal";

export const SAMPLE_SAAS_CONTRACT: Partial<LegalDocument> = {
  id: "saas-master-services-agreement-v1",
  title: "CloudScale Enterprise SaaS Agreement (2025)",
  fileName: "CloudScale_Enterprise_SaaS_Agreement_Final.pdf",
  fileSize: 482910,
  pageCount: 5,
  uploadDate: "2025-01-15T10:30:00.000Z",
  status: "ready",
  rawText: `MASTER SERVICES & SUBSCRIPTION AGREEMENT
THIS MASTER SERVICES AGREEMENT (the "Agreement") is entered into as of January 15, 2025 ("Effective Date"), by and between CloudScale Systems Inc., a Delaware corporation with its principal office at 500 Market St, San Francisco, CA ("Provider"), and Acme Enterprises LLC, with offices at 120 Broadway, New York, NY ("Customer").

SECTION 1. SUBSCRIPTION AND ACCESS
1.1 Cloud Services. Provider hereby grants Customer a non-exclusive, non-transferable, non-sublicensable right during the Term to access and use the CloudScale Enterprise Platform solely for Customer's internal business operations.
1.2 Restrictions. Customer shall not: (a) reverse engineer, decompile, or disassemble any part of the Service; (b) share access credentials outside authorized personnel; (c) operate a service bureau; or (d) develop a competitive software product using benchmarks obtained from the Service.

SECTION 2. FEES, INVOICING & PAYMENT TERMS
2.1 Subscription Fees. Customer shall pay an Annual Base Subscription Fee of $75,000, payable in advance on an annual basis.
2.2 Payment Schedule & Late Penalties. All invoices are due Net 30 days from date of receipt. Late payments shall accrue interest at the rate of 1.5% per month or the highest rate permitted by law, whichever is less. In the event Customer fails to pay undisputed fees within forty-five (45) days of due date, Provider reserves the immediate right to suspend Customer's access to the Service without liability.
2.3 Taxes. Customer is responsible for all applicable sales, use, excise, or value-added taxes, excluding taxes based solely on Provider's net income.

SECTION 3. TERM, AUTO-RENEWAL & TERMINATION
3.1 Initial Term and Automatic Renewal. This Agreement commences on the Effective Date and continues for an initial period of twenty-four (24) months ("Initial Term"). UPON EXPIRATION OF THE INITIAL TERM, THIS AGREEMENT SHALL AUTOMATICALLY RENEW FOR SUCCESSIVE TWELVE (12) MONTH PERIODS, UNLESS EITHER PARTY PROVIDES WRITTEN NOTICE OF NON-RENEWAL AT LEAST SIXTY (60) DAYS PRIOR TO THE EXPIRATION OF THE THEN-CURRENT TERM.
3.2 Termination for Cause. Either party may terminate this Agreement immediately upon written notice if the other party: (a) materially breaches any provision of this Agreement and fails to cure such breach within thirty (30) days of receiving written notice; or (b) becomes insolvent or enters bankruptcy proceedings.
3.3 Effect of Termination. Upon termination, Customer shall immediately cease all use of the Service. Within thirty (30) days of termination, Customer may request data export in JSON format, after which Provider reserves the right to securely delete all Customer Content. Pre-paid fees are non-refundable.

SECTION 4. DATA SECURITY & CONFIDENTIALITY
4.1 Confidentiality Obligations. Each party agrees to protect the Confidential Information of the other party using the same degree of care it uses for its own confidential information, but in no event less than reasonable care. Confidential Information shall not be disclosed to any third party except to employees and contractors with a need to know under binding confidentiality covenants.
4.2 Data Breach Notification. In the event of confirmed unauthorized access to Customer Personal Data, Provider shall notify Customer within forty-eight (48) hours of becoming aware of the incident and cooperate reasonably in regulatory disclosures.

SECTION 5. INTELLECTUAL PROPERTY & INDEMNIFICATION
5.1 Proprietary Rights. Provider retains all right, title, and interest, including all Intellectual Property Rights, in and to the Service, documentation, and underlying software. Customer retains all ownership in Customer Data uploaded to the platform.
5.2 Customer Indemnification. Customer shall defend, indemnify, and hold harmless Provider, its officers, directors, and affiliates from and against any third-party claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to Customer Data violating third-party intellectual property rights or applicable privacy laws.
5.3 Provider Indemnification. Provider shall defend Customer against third-party claims alleging that Customer's authorized use of the Service infringes a registered patent or copyright.

SECTION 6. LIMITATION OF LIABILITY
6.1 DISCLAIMER OF INDIRECT DAMAGES. IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, PUNITIVE, OR CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS INTERRUPTION, REGARDLESS OF THE THEORY OF LIABILITY.
6.2 AGGREGATE LIABILITY CAP. EXCEPT FOR WILLFUL MISCONDUCT OR BREACH OF SECTION 4 (CONFIDENTIALITY), PROVIDER'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THIS AGREEMENT SHALL UNDER NO CIRCUMSTANCES EXCEED THE TOTAL FEES ACTUALLY PAID BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE INCIDENT GIVING RISE TO LIABILITY.

SECTION 7. GENERAL PROVISIONS
7.1 Governing Law & Dispute Resolution. This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict of law principles. Any dispute arising under this Agreement shall be resolved through binding arbitration in Wilmington, Delaware under the rules of the American Arbitration Association (AAA).
7.2 Non-Solicitation. During the Term and for twelve (12) months thereafter, Customer shall not directly solicit or hire any engineering or executive employee of Provider without Provider's prior written consent.`,
};

export const SAMPLE_REVISED_SAAS_CONTRACT: Partial<LegalDocument> = {
  id: "saas-master-services-agreement-v2",
  title: "CloudScale Enterprise SaaS Agreement (Vendor Redline v2)",
  fileName: "CloudScale_Enterprise_SaaS_Agreement_Redline_v2.pdf",
  fileSize: 504120,
  pageCount: 5,
  uploadDate: "2025-02-01T14:15:00.000Z",
  status: "ready",
  rawText: `MASTER SERVICES & SUBSCRIPTION AGREEMENT (REDLINE V2)
THIS MASTER SERVICES AGREEMENT is entered into as of January 15, 2025 ("Effective Date"), by and between CloudScale Systems Inc. ("Provider") and Acme Enterprises LLC ("Customer").

SECTION 1. SUBSCRIPTION AND ACCESS
1.1 Cloud Services. Provider hereby grants Customer a non-exclusive, non-transferable right during the Term to access the Service solely for internal business operations.
1.2 Restrictions. Customer shall not reverse engineer, share access credentials, or develop competing tools. [ADDED] Customer agrees to allow Provider to conduct an annual electronic license audit to verify user seat compliance.

SECTION 2. FEES, INVOICING & PAYMENT TERMS
2.1 Subscription Fees. Customer shall pay an Annual Base Subscription Fee of $92,000 [MODIFIED: Increased from $75,000], payable in advance.
2.2 Payment Schedule & Late Penalties. All invoices are due Net 15 days from date of receipt [MODIFIED: Reduced from Net 30]. Late payments shall accrue interest at the rate of 2.0% per month [MODIFIED: Increased from 1.5%]. In the event Customer fails to pay undisputed fees within twenty (20) days of due date [MODIFIED: Shortened from 45 days], Provider reserves the right to immediately suspend Service.
2.3 Taxes. Customer is responsible for all applicable taxes.

SECTION 3. TERM, AUTO-RENEWAL & TERMINATION
3.1 Initial Term and Automatic Renewal. This Agreement commences on the Effective Date and continues for an initial period of thirty-six (36) months [MODIFIED: Extended from 24 months]. UPON EXPIRATION, THIS AGREEMENT SHALL AUTOMATICALLY RENEW FOR SUCCESSIVE TWELVE (12) MONTH PERIODS, UNLESS EITHER PARTY PROVIDES WRITTEN NOTICE OF NON-RENEWAL AT LEAST NINETY (90) DAYS PRIOR TO EXPIRATION [MODIFIED: Notice window widened from 60 to 90 days].
3.2 Termination for Cause. Either party may terminate if the other party breaches and fails to cure within fifteen (15) days [MODIFIED: Shortened cure period from 30 to 15 days].
3.3 Effect of Termination. Upon termination, Customer shall cease use. Data export assistance fee of $3,500 shall apply [ADDED]. Pre-paid fees are non-refundable under any circumstance.

SECTION 4. DATA SECURITY & CONFIDENTIALITY
4.1 Confidentiality. Protected under reasonable care for 3 years post-termination.
4.2 Data Breach Notification. Provider shall notify Customer within five (5) business days [MODIFIED: Slowed from 48 hours to 5 business days] of confirmed security incidents.

SECTION 5. INTELLECTUAL PROPERTY & INDEMNIFICATION
5.1 Proprietary Rights. Provider retains all IP rights. Customer retains data ownership.
5.2 Customer Indemnification. Customer shall defend and indemnify Provider against all third-party claims, without monetary limitation.
5.3 Provider Indemnification. [REMOVED: Provider has struck out its obligation to indemnify Customer against patent or copyright infringement claims].

SECTION 6. LIMITATION OF LIABILITY
6.1 DISCLAIMER OF INDIRECT DAMAGES. Mutual disclaimer of indirect, special, or consequential damages.
6.2 AGGREGATE LIABILITY CAP. PROVIDER'S TOTAL AGGREGATE LIABILITY SHALL UNDER NO CIRCUMSTANCES EXCEED $10,000 OR THE FEES PAID IN THE LAST 3 MONTHS, WHICHEVER IS LESS [MODIFIED: Severely decreased liability cap from 12 months fees ($75k+) to $10,000].

SECTION 7. GENERAL PROVISIONS
7.1 Governing Law. State of Delaware. Mandatory binding arbitration.
7.2 Non-Solicitation. 24 months post-termination [MODIFIED: Extended from 12 months] with liquidated damages of $100,000 per solicited employee [ADDED].`,
};
