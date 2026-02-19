import React from "react";
import { ArrowRight } from "lucide-react";
import styles from "./StatCard.module.css";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconBgColor: string;
  showArrow?: boolean;
  href?: string | null;
  onClick?: () => void;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor,
  showArrow = false,
  href,
  onClick,
}: StatCardProps) => {
  const isInteractive = Boolean(href || onClick);
  const cardClassName = [
    styles.card,
    isInteractive ? styles.cardClickable : "",
    showArrow ? styles.cardWithArrow : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <span
          className={styles.iconBox}
          style={{ backgroundColor: iconBgColor }}
          aria-hidden
        >
          {icon}
        </span>
      </div>
      <div className={styles.cardBottom}>
        <div className={styles.cardMetrics}>
          <p className={styles.cardValue}>{value}</p>
          <p className={styles.cardSubtitle}>{subtitle}</p>
        </div>
        {showArrow && (
          <span className={styles.arrowLink} aria-hidden>
            <ArrowRight size={20} style={{ color: iconBgColor }} />
          </span>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} className={cardClassName} onClick={onClick}>
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button type="button" className={cardClassName} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className={cardClassName}>{content}</div>;
};

export default StatCard;
