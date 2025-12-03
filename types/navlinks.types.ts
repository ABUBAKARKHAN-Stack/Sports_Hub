export type NavSubLink = {
  label: string;
  href: string;
};

export type NavLink = {
  label: string;
  href: string;
  submenu?: NavSubLink[];
};
