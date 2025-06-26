export interface RouteRole {
  pattern: RegExp;
  href: string;
  roles: string[];
  title: string;
  icon?: any;
}

export const routeRoles: RouteRole[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    pattern: /^\/dashboard$/,
    roles: ["everybody"],
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    pattern: /^\/dashboard\/orders(\/.*)?$/,
    roles: ["everybody"],
  },
  {
    title: "Distributors",
    href: "/dashboard/distributors",
    pattern: /^\/dashboard\/distributors(\/.*)?$/,
    roles: ["super-admin", "operations", "sales-admin"],
  },
  {
    title: "IME/VSS",
    href: "/dashboard/ime-vss",
    pattern: /^\/dashboard\/ime-vss(\/.*)?$/,
    roles: ["super-admin", "operations", "sales-admin"],
  },
  {
    title: "Users",
    href: "/dashboard/users",
    pattern: /^\/dashboard\/users(\/.*)?$/,
    roles: ["super-admin"],
  },
  {
    title: "Brands",
    href: "/dashboard/brands",
    pattern: /^\/dashboard\/brands(\/.*)?$/,
    roles: ["super-admin", "operations"],
  },
  {
    title: "Markets",
    href: "/dashboard/markets",
    pattern: /^\/dashboard\/markets(\/.*)?$/,
    roles: ["super-admin", "operations", "sales-admin"],
  },
  {
    title: "Locations",
    href: "/dashboard/locations",
    pattern: /^\/dashboard\/locations(\/.*)?$/,
    roles: ["super-admin", "operations"],
  },
  {
    title: "Roles & Permissions",
    href: "/dashboard/roles",
    pattern: /^\/dashboard\/roles(\/.*)?$/,
    roles: ["super-admin"],
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    pattern: /^\/dashboard\/reports(\/.*)?$/,
    roles: ["everybody"],
  },
  // {
  //   title: "Settings",
  //   href: "/dashboard/settings",
  //   pattern: /^\/dashboard\/settings(\/.*)?$/,
  //   roles: ["everybody"],
  // },
];
