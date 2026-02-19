import DoughnutChartCard from "@/components/Reusables/Charts/DoughnutChartCard";
import BarChartCard from "@/components/Reusables/Charts/BarChartCard";
import type { DoughnutChartDataItem } from "@/components/Reusables/Charts/DoughnutChartCard";
import type { BarChartDataItem } from "@/components/Reusables/Charts/BarChartCard";
import styles from "./Dashboard.module.css";

const WORKSPACE_STATUS_COLORS = {
  processed: "#22c55e",
  inProgress: "#6b7eeb",
  processedWithConflicts: "#f59e0b",
  conflict: "#dc2626",
};

const workspacesByStatusData: DoughnutChartDataItem[] = [
  { name: "Processed", value: 15, color: WORKSPACE_STATUS_COLORS.processed },
  { name: "In Progress", value: 10, color: WORKSPACE_STATUS_COLORS.inProgress },
  {
    name: "Processed With Some Conflicts",
    value: 5,
    color: WORKSPACE_STATUS_COLORS.processedWithConflicts,
  },
  { name: "Conflict", value: 30, color: WORKSPACE_STATUS_COLORS.conflict },
];

const migratedDataSizeData: BarChartDataItem[] = [
  { name: "Processed", value: 350, color: WORKSPACE_STATUS_COLORS.processed },
  {
    name: "In Progress",
    value: 500,
    color: WORKSPACE_STATUS_COLORS.inProgress,
  },
  { name: "Conflict", value: 50, color: WORKSPACE_STATUS_COLORS.conflict },
];

const DashboardBottomSection = () => {
  return (
    <section className={styles.bottomSection}>
      <div className={styles.chartRow}>
        <DoughnutChartCard
          title="Workspaces Based On Status"
          subtitle="Number of Workspaces By Status"
          data={workspacesByStatusData}
          showLegend={false}
        />
        <BarChartCard
          title="Migrated Data Size Summary"
          subtitle="Data volume by migration status"
          data={migratedDataSizeData}
          valueLabel=""
          valueUnit="GB"
        />
      </div>
    </section>
  );
};

export default DashboardBottomSection;
