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

export const SAMPLE_EMPLOYMENT_AGREEMENT: Partial<LegalDocument> = {
  id: "executive-employment-agreement-v1",
  title: "Executive Employment Agreement (TechCorp)",
  fileName: "Executive_Employment_Agreement_Final.pdf",
  fileSize: 624510,
  pageCount: 8,
  uploadDate: "2025-01-10T09:00:00.000Z",
  status: "ready",
  rawText: `EXECUTIVE EMPLOYMENT & CONFIDENTIALITY AGREEMENT
THIS EMPLOYMENT AGREEMENT (the "Agreement") is dated as of January 10, 2025 (the "Effective Date"), by and between TechCorp Solutions Inc., a Delaware corporation (the "Company"), and Alex Mercer ("Executive" or "Employee").

SECTION 1. POSITION, DUTIES & RESPONSIBILITIES
1.1 Position. The Company hereby employs Executive as Senior Director of Engineering, reporting directly to the Chief Technology Officer (CTO). Executive shall devote full business time, attention, and effort to the business affairs and operations of the Company.
1.2 Standard of Conduct. Executive shall faithfully comply with all corporate governance policies, codes of ethics, and security guidelines established by the Board of Directors.

SECTION 2. COMPENSATION, BONUS & EQUITY VESTING
2.1 Base Salary. The Company shall pay Executive an initial annual base salary of $210,000, payable in semi-monthly installments in accordance with standard payroll practices, subject to statutory withholdings.
2.2 Discretionary Incentive Bonus. Executive shall be eligible for an annual target performance bonus of up to 25% of Base Salary, contingent upon achievement of departmental objectives approved by the Board.
2.3 Stock Option Grant. Subject to Board approval, Executive shall receive an option to purchase 45,000 shares of Common Stock, vesting over a four (4) year schedule with a one (1) year cliff (25% vesting after 12 months, followed by monthly equal increments).

SECTION 3. EMPLOYEE BENEFITS & REIMBURSEMENT
3.1 Benefits. Executive shall be eligible to participate in group health insurance, 401(k) matching up to 4%, dental, vision, and disability insurance plans.
3.2 Paid Time Off. Executive shall accrue twenty (20) days of paid vacation per calendar year. Accrued unused vacation may not roll over more than five (5) days into the subsequent calendar year.
3.3 Expense Reimbursement. The Company shall reimburse reasonable and documented business travel expenses within thirty (30) days of submission.

SECTION 4. PROPRIETARY INFORMATION, INVENTIONS & IP ASSIGNMENT
4.1 Confidential Information. Executive acknowledges that the Company's proprietary software architectures, algorithmic trade secrets, customer pricing, and unreleased product roadmaps constitute Confidential Information. Executive agrees to hold all such information in strict trust and confidence during employment and perpetually thereafter.
4.2 Assignment of Inventions. All patents, copyrights, algorithms, trademarks, and technological discoveries conceived, authored, or reduced to practice by Executive during the term of employment that relate directly to the Company's current or prospective business shall belong exclusively to the Company as "works made for hire."

SECTION 5. RESTRICTIVE COVENANTS: NON-COMPETITION & NON-SOLICITATION
5.1 Non-Competition. During Executive's employment and for a period of eighteen (18) months following the termination of employment for any reason, Executive shall not, directly or indirectly, engage in, consult for, or hold an equity interest in any business enterprise that develops competing enterprise document processing software within North America.
5.2 Non-Solicitation of Employees. For twenty-four (24) months post-termination, Executive shall not encourage, solicit, or recruit any employee, engineer, or contractor of the Company to leave their employment.
5.3 Non-Solicitation of Customers. For eighteen (18) months post-termination, Executive shall not solicit or divert any customer or prospective client with whom Executive had material business interaction during the preceding twelve months.

SECTION 6. SEVERANCE & CHANGE IN CONTROL
6.1 Involuntary Termination Without Cause. If the Company terminates Executive's employment without Cause, the Company shall pay severance equal to three (3) months Base Salary and three months of COBRA premiums, conditioned upon Executive executing a general release of claims in favor of the Company within forty-five (45) days.
6.2 Termination for Cause. If terminated for Cause (defined as material fraud, felony conviction, gross negligence, or unexcused material breach of Section 4 or 5), all salary and benefit accruals cease immediately, and no severance shall be payable.

SECTION 7. DISPUTE RESOLUTION & ARBITRATION
7.1 Mandatory Binding Arbitration. Any controversy or legal claim arising out of or relating to this Agreement, including breach or enforceability, shall be resolved through binding confidential arbitration administered by JAMS in San Francisco, California, under its Employment Arbitration Rules. Executive explicitly waives the right to trial by jury or participation in a class action lawsuit.

SECTION 8. TERM & TERMINATION
8.1 At-Will Employment. Executive's employment is at-will, meaning either party may terminate the employment relationship at any time, with or without cause.
8.2 Notice of Termination. In the event of voluntary resignation by Executive, Executive shall provide thirty (30) days' prior written notice to the Company. In the event of termination by the Company without Cause, the Company shall provide thirty (30) days' written notice or pay base salary in lieu thereof.
8.3 Return of Company Property. Upon termination, Executive shall promptly return all laptops, hardware, source code repositories, access tokens, and confidential files within forty-eight (48) hours.

SECTION 9. GOVERNING LAW & MISCELLANEOUS
9.1 Governing Law. This Agreement shall be governed by and interpreted under the laws of the State of California, except that enforceability of restrictive covenants shall be construed to the fullest extent permitted under applicable labor codes.
9.2 Entire Agreement. This Agreement constitutes the complete understanding between the parties and supersedes all prior verbal or written understandings.`,
};

export const SAMPLE_COMMERCIAL_LEASE: Partial<LegalDocument> = {
  id: "commercial-office-lease-v1",
  title: "Commercial Office Building Lease (Triple Net)",
  fileName: "Commercial_Property_Lease_2025.pdf",
  fileSize: 589200,
  pageCount: 6,
  uploadDate: "2025-01-20T11:00:00.000Z",
  status: "ready",
  rawText: `COMMERCIAL REAL ESTATE LEASE AGREEMENT (TRIPLE NET / NNN)
THIS COMMERCIAL LEASE AGREEMENT (the "Lease") is entered into as of January 20, 2025, by and between Beacon Commercial Properties LP ("Landlord"), and Apex Media Group Inc. ("Tenant").

SECTION 1. PREMISES & LEASE TERM
1.1 Leased Premises. Landlord leases to Tenant Suite 400 comprising approximately 4,200 rentable square feet located at 750 Montgomery Street, San Francisco, CA.
1.2 Term. The Lease term shall be for sixty (60) full calendar months commencing on March 1, 2025 (Commencement Date) and terminating on February 28, 2030 (Expiration Date).

SECTION 2. RENT, ESCALATION & SECURITY DEPOSIT
2.1 Monthly Base Rent. Tenant shall pay Base Rent in the initial amount of $18,500.00 per month, due on the first (1st) day of each calendar month.
2.2 Annual Escalation. On each anniversary of the Commencement Date, Base Rent shall increase by three and one-half percent (3.5%) over the preceding year's Base Rent.
2.3 Security Deposit. Upon execution of this Lease, Tenant shall deposit with Landlord the sum of $37,000.00 (two months' rent) as security for faithful performance.
2.4 Late Charges. Rent received after the fifth (5th) calendar day of the month shall incur a late charge of 5% of the delinquent amount plus 1.5% interest per month.

SECTION 3. TRIPLE NET (NNN) OPERATING EXPENSES & TAXES
3.1 Additional Rent. Tenant shall pay its Pro Rata Share (14.2%) of all Real Property Taxes, Building Insurance premiums, and Common Area Maintenance (CAM) operational costs incurred by Landlord.

SECTION 4. USE & MAINTENANCE OBLIGATIONS
4.1 Permitted Use. The Premises shall be used solely for general corporate offices and digital content production.
4.2 Tenant Maintenance. Tenant shall, at its sole cost, maintain the interior non-structural portions of the Premises, including HVAC interior filters, plumbing fixtures, and lighting.
4.3 Landlord Maintenance. Landlord shall maintain the structural foundations, roof, exterior walls, and central building utility risers.

SECTION 5. INDEMNIFICATION, INSURANCE & CASUALTY
5.1 Tenant Indemnification. Tenant shall defend, indemnify, and hold Landlord harmless against any and all claims, liabilities, damages, or costs (including reasonable legal fees) resulting from Tenant's operations or any accident occurring within the Premises.
5.2 Required Insurance. Tenant shall maintain Commercial General Liability insurance with limits of not less than $2,000,000 per occurrence and $4,000,000 aggregate, naming Landlord as additional insured.

SECTION 6. DEFAULT & SURRENDER
6.1 Monetary Default. If Tenant fails to pay any installment of Rent within five (5) days after written notice, Landlord may immediately declare a default and exercise eviction or lease termination remedies.
6.2 Surrender Condition. Upon expiration or termination, Tenant shall surrender the Premises in broom-clean condition, ordinary wear and tear excepted, and remove all trade fixtures.`,
};

export const ALL_SAMPLE_CONTRACTS = [
  SAMPLE_SAAS_CONTRACT,
  SAMPLE_REVISED_SAAS_CONTRACT,
  SAMPLE_EMPLOYMENT_AGREEMENT,
  SAMPLE_COMMERCIAL_LEASE,
];
