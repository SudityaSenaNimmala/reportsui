import React from "react";
import { Settings, Users, Clock, AlertTriangle } from "lucide-react";
import StatCard from "@/components/Reusables/StatCard";
import styles from "./Dashboard.module.css";

const CARD_ICON_SIZE = 20;

interface Card {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  iconBgColor: string;
  showArrow?: boolean;
  href?: string | null;
}

const DashboardTopSection = () => {
  const cards: Card[] = [
    {
      title: "Total Jobs",
      value: 50,
      subtitle: "Initiated Jobs",
      icon: <Settings size={CARD_ICON_SIZE} />,
      iconBgColor: "#6b7eeb",
      showArrow: true,
      href: "#",
    },
    {
      title: "Completed Jobs",
      value: 25,
      subtitle: "Completed Jobs",
      icon: <Users size={CARD_ICON_SIZE} />,
      iconBgColor: "#22c55e",
      showArrow: true,
      href: "#",
    },
    {
      title: "In Progress Jobs",
      value: 15,
      subtitle: "Jobs Currently Running",
      icon: <Clock size={CARD_ICON_SIZE} />,
      iconBgColor: "#f59e0b",
      showArrow: true,
      href: "#",
    },
    {
      title: "Conflict Jobs",
      value: 10,
      subtitle: "Jobs Went To Conflict",
      icon: <AlertTriangle size={CARD_ICON_SIZE} />,
      iconBgColor: "#ef4444",
      showArrow: true,
      href: "#",
    },
  ];

  return (
    <section className={styles.topSection}>
      <div className={styles.cardGrid}>
        {cards.map((card: Card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            iconBgColor={card.iconBgColor}
            showArrow={card.showArrow}
            href={card.href}
          />
        ))}
      </div>
    </section>
  );
};

export default DashboardTopSection;
