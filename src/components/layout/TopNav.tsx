"use client";

import { useState, useRef, useEffect } from "react";
import { User, ChevronDown } from "lucide-react";
import Styles from "./Components.module.css";

const TopNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={Styles.topNav}>
      <div className={Styles.topNavInner}>
        <div className={Styles.topNavSpacer} />
        <div className={Styles.topNavUserSection} ref={dropdownRef}>
          <button
            type="button"
            className={Styles.topNavUserTrigger}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <span className={Styles.topNavAvatar} aria-hidden>
              <User size={20} className={Styles.topNavAvatarIcon} />
            </span>
            <span className={Styles.topNavUserName}>Derrick</span>
            <ChevronDown
              size={18}
              className={`${Styles.topNavChevron} ${isOpen ? Styles.topNavChevronOpen : ""}`}
            />
          </button>
          {isOpen && (
            <div className={Styles.topNavDropdown} role="menu">
              <button
                type="button"
                className={Styles.topNavDropdownItem}
                role="menuitem"
              >
                Settings
              </button>
              <button
                type="button"
                className={Styles.topNavDropdownItem}
                role="menuitem"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
