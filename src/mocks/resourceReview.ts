export type ReviewStatus =
  | "Pending"
  | "Awaiting Approval"
  | "RM Approved"
  | "RM Rejected"
  | "PMO Approved"
  | "PMO Rejected"
  | "Approved"
  | "Rejected";

export interface ApprovalRecord {
  approver: string;
  role: "Resource Manager" | "PMO";
  decision: "Approved" | "Rejected";
  comment: string;
  decidedOn: string;
}

export interface ReviewRequest {
  id: string;
  demandId: string;
  requestedBy: string;
  requestedOn: string;
  project: string;
  resourceName: string;
  projectRole: string;
  portfolio: string;
  pillar: string;
  startDate: string;
  endDate: string;
  type: "Internal" | "External";
  vendorName: string;
  allocationPercent: number;
  estimatedRate: number;
  currentYearForecast: number;
  country: string;
  status: ReviewStatus;
  approvalHistory: ApprovalRecord[];
  mailSubject: string;
  mailBody: string;
}

export const mockReviewRequests: ReviewRequest[] = [
  {
    id: "rev-001",
    demandId: "dem-2",
    requestedBy: "Anurag Vaishy",
    requestedOn: "05/12/2027",
    project: "Data Modernization - ASPAC",
    resourceName: "Karthik Dontula",
    projectRole: "Technical Lead",
    portfolio: "Hi-tech",
    pillar: "Hi-tech",
    startDate: "2027-01-01",
    endDate: "2028-12-31",
    type: "Internal",
    vendorName: "",
    allocationPercent: 100,
    estimatedRate: 130,
    currentYearForecast: 270400,
    country: "Australia",
    status: "Pending",
    approvalHistory: [],
    mailSubject:
      "Resource Review Required: Technical Lead – Data Modernization ASPAC",
    mailBody:
      "Hi Manager,\n\nA resource request has been submitted for your review and approval.\n\nProject: Data Modernization - ASPAC\nRole: Technical Lead\nResource: Karthik Dontula\nAllocation: 100%\nPeriod: Jan 2027 – Dec 2028\nEstimated Rate: $130/hr\nForecast (Current Year): $270,400\n\nPlease review the details and approve or decline the request at your earliest convenience.\n\nThank you,\nResource Management System",
  },
  {
    id: "rev-002",
    demandId: "dem-5",
    requestedBy: "Karthik Dontula",
    requestedOn: "05/13/2027",
    project: "QE Automation",
    resourceName: "Ian Lee",
    projectRole: "QA Engineer",
    portfolio: "Retail",
    pillar: "Retail",
    startDate: "2027-03-01",
    endDate: "2027-12-31",
    type: "External",
    vendorName: "Hyqoo",
    allocationPercent: 75,
    estimatedRate: 95,
    currentYearForecast: 148200,
    country: "Germany",
    status: "RM Approved",
    approvalHistory: [
      {
        approver: "Sarah Mitchell",
        role: "Resource Manager",
        decision: "Approved",
        comment: "Resource availability confirmed. Good fit for the role.",
        decidedOn: "05/14/2027",
      },
    ],
    mailSubject: "Resource Review Required: QA Engineer – QE Automation",
    mailBody:
      "Hi Manager,\n\nA resource request has been submitted for your review and approval.\n\nProject: QE Automation\nRole: QA Engineer\nResource: Ian Lee (External – Hyqoo)\nAllocation: 75%\nPeriod: Mar 2027 – Dec 2027\nEstimated Rate: $95/hr\nForecast (Current Year): $148,200\n\nPlease review and take action.\n\nThank you,\nResource Management System",
  },
  {
    id: "rev-003",
    demandId: "dem-10",
    requestedBy: "Adnan Siddiqui",
    requestedOn: "05/14/2027",
    project: "Cloud Enablement",
    resourceName: "Rich Bowers",
    projectRole: "DevOps Engineer",
    portfolio: "Banking",
    pillar: "Banking",
    startDate: "2027-02-01",
    endDate: "2028-06-30",
    type: "Internal",
    vendorName: "",
    allocationPercent: 50,
    estimatedRate: 110,
    currentYearForecast: 114400,
    country: "Sydney",
    status: "PMO Approved",
    approvalHistory: [
      {
        approver: "Sarah Mitchell",
        role: "Resource Manager",
        decision: "Approved",
        comment: "Capacity confirmed for the allocation period.",
        decidedOn: "05/15/2027",
      },
      {
        approver: "James Thornton",
        role: "PMO",
        decision: "Approved",
        comment: "Budget cleared. Approved for project onboarding.",
        decidedOn: "05/16/2027",
      },
    ],
    mailSubject: "Resource Review Required: DevOps Engineer – Cloud Enablement",
    mailBody:
      "Hi Manager,\n\nA resource request has been submitted for your review and approval.\n\nProject: Cloud Enablement\nRole: DevOps Engineer\nResource: Rich Bowers\nAllocation: 50%\nPeriod: Feb 2027 – Jun 2028\nEstimated Rate: $110/hr\nForecast (Current Year): $114,400\n\nPlease review and take action.\n\nThank you,\nResource Management System",
  },
  {
    id: "rev-004",
    demandId: "dem-15",
    requestedBy: "Matthew Truelove",
    requestedOn: "05/10/2027",
    project: "Application Support",
    resourceName: "Lindsey Lord",
    projectRole: "Business Analyst",
    portfolio: "Healthcare",
    pillar: "Healthcare",
    startDate: "2027-01-15",
    endDate: "2027-09-30",
    type: "External",
    vendorName: "Collabera",
    allocationPercent: 100,
    estimatedRate: 85,
    currentYearForecast: 176800,
    country: "Poland",
    status: "Approved",
    approvalHistory: [
      {
        approver: "Sarah Mitchell",
        role: "Resource Manager",
        decision: "Approved",
        comment: "Resource approved. Fits project requirements well.",
        decidedOn: "05/11/2027",
      },
    ],
    mailSubject:
      "Resource Review Required: Business Analyst – Application Support",
    mailBody:
      "Hi Manager,\n\nA resource request has been submitted for your review.\n\nProject: Application Support\nRole: Business Analyst\nResource: Lindsey Lord (External – Collabera)\nAllocation: 100%\nPeriod: Jan 2027 – Sep 2027\n\nThank you,\nResource Management System",
  },
  {
    id: "rev-005",
    demandId: "dem-20",
    requestedBy: "Jamison Ducey",
    requestedOn: "05/09/2027",
    project: "Data Modernization - ASPAC",
    resourceName: "Kristie Shirkavand",
    projectRole: "Project Manager",
    portfolio: "Life Sciences",
    pillar: "Life Sciences",
    startDate: "2027-04-01",
    endDate: "2028-03-31",
    type: "Internal",
    vendorName: "",
    allocationPercent: 100,
    estimatedRate: 120,
    currentYearForecast: 249600,
    country: "Sydney",
    status: "RM Rejected",
    approvalHistory: [
      {
        approver: "Sarah Mitchell",
        role: "Resource Manager",
        decision: "Rejected",
        comment: "Budget constraints — please resubmit for Q3.",
        decidedOn: "05/10/2027",
      },
    ],
    mailSubject:
      "Resource Review Required: Project Manager – Data Modernization ASPAC",
    mailBody:
      "Hi Manager,\n\nA resource request has been submitted for your review.\n\nProject: Data Modernization - ASPAC\nRole: Project Manager\nResource: Kristie Shirkavand\nAllocation: 100%\n\nThank you,\nResource Management System",
  },
];
