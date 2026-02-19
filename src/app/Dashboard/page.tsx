import DashboardTopSection from "./DashboardTopSection";
import DashboardBottomSection from "./DashboardBottomSection";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <DashboardTopSection />
      <DashboardBottomSection />
    </div>
  );
};

export default Dashboard;
