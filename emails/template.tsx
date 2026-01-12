import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

// 1. Define Types for Type Safety
interface MonthlyReportData {
  month: string;
  stats: {
    totalIncome: number;
    totalExpenses: number;
    byCategory: Record<string, number>;
  };
  insights: string[];
}

interface BudgetAlertData {
  percentageUsed: number;
  budgetAmount: number;
  totalExpenses: number;
}

interface EmailTemplateProps {
  userName?: string;
  type?: "monthly-report" | "budget-alert";
  data?: MonthlyReportData | BudgetAlertData;
}

export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data,
}: EmailTemplateProps) {
  // 2. Render Monthly Report
  if (type === "monthly-report" && data) {
    const reportData = data as MonthlyReportData;

    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Monthly Financial Report</Heading>

            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              Here&rsquo;s your financial summary for {reportData.month}:
            </Text>

            {/* Main Stats */}
            <Section style={styles.statsContainer}>
              <Section style={styles.stat}>
                <Text style={styles.text}>Total Income</Text>
                <Text style={styles.heading}>${reportData.stats.totalIncome}</Text>
              </Section>
              <Section style={styles.stat}>
                <Text style={styles.text}>Total Expenses</Text>
                <Text style={styles.heading}>${reportData.stats.totalExpenses}</Text>
              </Section>
              <Section style={styles.stat}>
                <Text style={styles.text}>Net</Text>
                <Text style={styles.heading}>
                  ${reportData.stats.totalIncome - reportData.stats.totalExpenses}
                </Text>
              </Section>
            </Section>

            {/* Category Breakdown - FIXED: Using Row/Column instead of Flexbox */}
            {reportData.stats?.byCategory && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Expenses by Category</Heading>
                {Object.entries(reportData.stats.byCategory).map(
                  ([category, amount]) => (
                    <Row key={category} style={styles.row}>
                      <Column style={styles.colLeft}>
                        <Text style={styles.text}>{category}</Text>
                      </Column>
                      <Column style={styles.colRight}>
                        <Text style={styles.text}>${amount}</Text>
                      </Column>
                    </Row>
                  )
                )}
              </Section>
            )}

            {/* AI Insights */}
            {reportData.insights && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Welth Insights</Heading>
                {reportData.insights.map((insight, index) => (
                  <Text key={index} style={styles.text}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Text style={styles.footer}>
              Thank you for using Welth. Keep tracking your finances for better
              financial health!
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  // 3. Render Budget Alert
  if (type === "budget-alert" && data) {
    const alertData = data as BudgetAlertData;

    return (
      <Html>
        <Head />
        <Preview>Budget Alert</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Budget Alert</Heading>
            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              You&rsquo;ve used {alertData.percentageUsed.toFixed(1)}% of your
              monthly budget.
            </Text>
            <Section style={styles.statsContainer}>
              <Section style={styles.stat}>
                <Text style={styles.text}>Budget Amount</Text>
                <Text style={styles.heading}>${alertData.budgetAmount}</Text>
              </Section>
              <Section style={styles.stat}>
                <Text style={styles.text}>Spent So Far</Text>
                <Text style={styles.heading}>${alertData.totalExpenses}</Text>
              </Section>
              <Section style={styles.stat}>
                <Text style={styles.text}>Remaining</Text>
                <Text style={styles.heading}>
                  ${alertData.budgetAmount - alertData.totalExpenses}
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  return null;
}

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#1f2937",
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "0 0 20px",
  },
  heading: {
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 16px",
  },
  text: {
    color: "#4b5563",
    fontSize: "16px",
    margin: "0 0 16px",
  },
  section: {
    marginTop: "32px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
  },
  statsContainer: {
    margin: "32px 0",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
  },
  stat: {
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  // Fixed: Removed Flexbox styles
  row: {
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  // Added column alignment styles
  colLeft: {
    textAlign: "left" as const,
  },
  colRight: {
    textAlign: "right" as const,
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center" as const,
    marginTop: "32px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
};