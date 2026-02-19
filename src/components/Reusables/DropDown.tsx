import Styles from "@/components/layout/Components.module.css";

interface DropDownList {
  label: string;
  href: string | null;
  icon: React.ReactElement | null;
}

const DropDown = ({
  dropDownList: DropDownList,
}: {
  dropDownList: DropDownList;
}) => {
  return <div className={Styles.dropDown}></div>;
};

export default DropDown;
