import { Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import BrandButton from "./BrandButton";

const NAV_LINKS = [
  { label: "Tools", to: "/" },
  { label: "Workshops & Courses", href: "https://www.theculinarygroup.com.au/the-culinary-director/workshops-courses" },
  { label: "Contact", href: "https://www.theculinarygroup.com.au/contact" },
];

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-sand bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center bg-maroon text-lg font-semibold text-white">
            G
          </span>
          <span className="brand-label text-sm text-ink">
            The Culinary Group
            <span className="ml-2 text-maroon">Tools</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className="brand-label text-xs text-ink hover:text-maroon"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="brand-label text-xs text-ink hover:text-maroon"
              >
                {link.label}
              </a>
            ),
          )}

          {isAuthenticated ? (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "logout",
                    label: "Log out",
                    onClick: () => {
                      logout();
                      navigate("/");
                    },
                  },
                ],
              }}
            >
              <button className="brand-label flex cursor-pointer items-center gap-2 border-none bg-transparent text-xs text-maroon">
                <UserOutlined />
                {user?.first_name || user?.email}
              </button>
            </Dropdown>
          ) : (
            <Link to="/login">
              <BrandButton size="small" className="!h-9 !px-5 !text-xs">
                Log in
              </BrandButton>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
