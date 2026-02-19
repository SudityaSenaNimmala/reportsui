import SideNav from "./SideNav";
import TopNav from "./TopNav";
import Styles from "./Components.module.css";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={Styles.layoutWithSideNav}>
      <SideNav />
      <div className={Styles.contentColumn}>
        <TopNav />
        <main className={Styles.mainContent}>{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
