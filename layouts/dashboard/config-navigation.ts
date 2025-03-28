"use client";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import TocIcon from "@mui/icons-material/Toc";
import PersonIcon from "@mui/icons-material/Person";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArchiveIcon from "@mui/icons-material/Archive";
import FolderIcon from "@mui/icons-material/Folder";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import RuleFolderIcon from "@mui/icons-material/RuleFolder";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SegmentIcon from "@mui/icons-material/Segment";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import UpdateIcon from "@mui/icons-material/Update";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { getRole } from "@/lib/functions/_helpers.lib";
import { getCookie } from "@/lib/functions/storage.lib";

export interface NavItem {
  title: string;
  path: string | null;
  icon: React.ElementType | null; // Use React.ElementType to represent the type of the icon
  children: NavItem[];
  hasChild: boolean;
}

// const role = getRole();
// const userrole = getCookie("user_role");
const role =
  typeof window !== "undefined" ? sessionStorage.getItem("user_role") : null;

console.log(
  ":::::::::::::::::::::::::================= USER ROLE from Session ========================:::::::::::::::::",
  role
);
const navConfig: NavItem[] = (() => {
  if (role === "ROLE_CARER") {
    return [
      {
        title: "Roster",
        path: "/staff-roster",
        icon: DashboardIcon,
        children: [],
        hasChild: false,
        default: true // Adding this property to indicate it's the default
      },
      {
        title: "Job for Pickup",
        path: "/job-for-pickup",
        icon: DashboardIcon,
        children: [],
        hasChild: false
      },
      {
        title: "Client",
        path: "/clients/list",
        icon: PeopleAltIcon,
        children: [
          {
            title: "List",
            path: "/clients/list",
            icon: TocIcon,
            children: [],
            hasChild: false
          }
        ],
        hasChild: true
      }
    ];
  } else if (role === "ROLE_ADMIN") {
    return [
      {
        title: "Scheduler",
        path: "/",
        icon: DashboardIcon,
        children: [],
        hasChild: false
      },
      {
        title: "Staff",
        path: "/staff/list",
        icon: PersonIcon,
        children: [
          {
            title: "List",
            path: "/staff/list",
            icon: TocIcon,
            children: [],
            hasChild: false
          },
          {
            title: "Teams",
            path: "/staff/teams",
            icon: GroupsIcon,
            children: [],
            hasChild: false
          },
          {
            title: "Archived ",
            path: "/staff/archived",
            icon: ArchiveIcon,
            children: [],
            hasChild: false
          },
          {
            title: "Document Hub",
            path: "/staff/document-hub",
            icon: FolderIcon,
            children: [],
            hasChild: false
          },
          {
            title: "New",
            path: "/staff/new",
            icon: PersonAddIcon,
            children: [],
            hasChild: false
          }
        ],
        hasChild: true
      },
      {
        title: "Clients",
        path: "/clients/list",
        icon: PeopleAltIcon,
        children: [
          {
            title: "List",
            path: "/clients/list",
            icon: TocIcon,
            children: [],
            hasChild: false
          },
          {
            title: "Temporary List",
            path: "/clients/temporarylist",
            icon: TocIcon,
            children: [],
            hasChild: false
          },
          {
            title: "Archived",
            path: "/clients/archived",
            icon: ArchiveIcon,
            children: [],
            hasChild: false
          },
          // {
          //   title: "Expired Documents",
          //   path: "/clients/expired-documents",
          //   icon: RuleFolderIcon,
          //   children: [],
          //   hasChild: false
          // },
          {
            title: "Documents Templates",
            path: "/clients/document-templates",
            icon: RuleFolderIcon,
            children: [],
            hasChild: false
          },
          {
            title: "New",
            path: "/clients/new",
            icon: PersonAddIcon,
            children: [],
            hasChild: false
          },
          {
            title: "Client Notes",
            path: "/client-notes",
            icon: TocIcon,
            children: [],
            hasChild: false
          }
        ],
        hasChild: true
      },
      {
        title: "Invoices",
        path: "/invoices/list",
        icon: ReceiptIcon,
        children: [
          {
            title: "List",
            path: "/invoices/list",
            icon: TocIcon,
            children: [],
            hasChild: false
          },
          {
            title: "List void",
            path: "/invoices/list-void",
            icon: SegmentIcon,
            children: [],
            hasChild: false
          },
          {
            title: "Generate",
            path: "/invoices/generate",
            icon: PlaylistAddIcon,
            children: [],
            hasChild: false
          }
        ],
        hasChild: true
      },
      {
        title: "Reports",
        path: "/reports/activity",
        icon: TocIcon,
        children: [
          // {
          //   title: "Activity",
          //   path: "/reports/activity",
          //   icon: SettingsIcon,
          //   children: [],
          //   hasChild: false
          // },
          // {
          //   title: "Billing",
          //   path: "/reports/billing",
          //   icon: SettingsIcon,
          //   children: [],
          //   hasChild: false
          // },
          // {
          //   title: "Fund Balances",
          //   path: "/reports/fund-balances",
          //   icon: SettingsIcon,
          //   children: [],
          //   hasChild: false
          // },
          {
            title: "Geolocation",
            path: "/reports/geolocation",
            icon: SettingsIcon,
            children: [],
            hasChild: false
          },
          // {
          //   title: "Performance",
          //   path: "/reports/performances",
          //   icon: SettingsIcon,
          //   children: [],
          //   hasChild: false
          // },
          // {
          //   title: "Exception report",
          //   path: "/reports/exception-reports",
          //   icon: SettingsIcon,
          //   children: [],
          //   hasChild: false
          // },
          // {
          //   title: "Timesheet",
          //   path: "/reports/timesheet",
          //   icon: SettingsIcon,
          //   children: [],
          //   hasChild: false
          // },
          {
            title: "KPI",
            path: "/reports/kpi",
            icon: SettingsIcon,
            children: [],
            hasChild: false
          },
          {
            title: "Competencies",
            path: "/reports/competencies",
            icon: SettingsIcon,
            children: [],
            hasChild: false
          },
          {
            title: "Compliance",
            path: "/reports/compliance",
            icon: SettingsIcon,
            children: [],
            hasChild: false
          },
          {
            title: "Qualifications",
            path: "/reports/qualifications",
            icon: SettingsIcon,
            children: [],
            hasChild: false
          },
          {
            title: "Other",
            path: "/reports/other",
            icon: SettingsIcon,
            children: [],
            hasChild: false
          }
          // {
          //   title: "Events",
          //   path: "/reports/events",
          //   icon: SettingsIcon,
          //   children: [],
          //   hasChild: false
          // }
        ],
        hasChild: true
      },
      {
        title: "Shift Notes",
        path: "/shift-notes",
        icon: TocIcon,
        children: [],
        hasChild: false
      },
      {
        title: "Account",
        path: "/account/settings",
        icon: ManageAccountsIcon,
        children: [
          // {
          //   title: "Settings",
          //   path: "/account/settings",
          //   icon: SettingsIcon,
          //   children: [],
          //   hasChild: false
          // },
          // {
          //   title: "Invoice Settings",
          //   path: "/account/invoice-settings",
          //   icon: ContentPasteGoIcon,
          //   children: [],
          //   hasChild: false
          // },
          {
            title: "Prices",
            path: "/account/prices",
            icon: AttachMoneyIcon,
            children: [],
            hasChild: false
          },
          {
            title: "Pay Groups",
            path: "/account/pay-groups",
            icon: PersonAddIcon,
            children: [],
            hasChild: false
          },
          {
            title: "Allowances",
            path: "/account/allowances",
            icon: PersonAddIcon,
            children: [],
            hasChild: false
          }
          // {
          //   title: "Reminders",
          //   path: "/account/reminders",
          //   icon: UpdateIcon,
          //   children: [],
          //   hasChild: false
          // },
          // {
          //   title: "Subscription",
          //   path: "/account/subscription",
          //   icon: SubscriptionsIcon,
          //   children: [],
          //   hasChild: false
          // }
        ],
        hasChild: true
      }
    ];
  } else {
    return [
      // {
      //   title: "Roster",
      //   path: "/staff-roster",
      //   icon: DashboardIcon,
      //   children: [],
      //   hasChild: false,
      //   default: true
      // },
      {
        title: "Client",
        path: "/clients/list",
        icon: PeopleAltIcon,
        children: [
          {
            title: "List",
            path: "/clients/list",
            icon: TocIcon,
            children: [],
            hasChild: false
          }
        ],
        hasChild: true
      }
    ];
  }
})();

export default navConfig;
