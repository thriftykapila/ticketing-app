import "./sidebar.css";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
const Sidebar = ({ setCurrentPage }) => {
  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">Logo</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">Workflow</p>
          <li onClick={() => setCurrentPage("leads")}>
            <HomeIcon className="icon" />
            <span>Leads</span>
          </li>
          <li onClick={() => setCurrentPage("agents")}>
            <PeopleIcon className="icon" />
            <span>Agents</span>
          </li>
          <p className="title">Product List</p>
          <li>
            <InventoryIcon className="icon" />
            <span>Tickets</span>
          </li>
          <li>
            <CategoryIcon className="icon" />
            <span>Categories</span>
          </li>
          <p className="title">Controls</p>
          <li>
            <QueryStatsIcon className="icon" />
            <span>Stats</span>
          </li>
          <li>
            <NotificationsActiveIcon className="icon" />
            <span>Notifications</span>
          </li>
          <p className="title">System</p>
          <li>
            <SettingsIcon className="icon" />
            <span>User Settings</span>
          </li>
          <li>
            <LogoutIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>

      <div className="bottom">
        <div className="colorOptions"></div>
        <div className="colorOptions"></div>
      </div>
    </div>
  );
};

export default Sidebar;
