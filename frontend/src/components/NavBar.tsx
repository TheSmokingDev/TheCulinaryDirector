import { Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const NAV_LINKS = [
  { label: "Tools", to: "/" },
  { label: "Workshops & Courses", href: "https://www.theculinarygroup.com.au/the-culinary-director/workshops-courses" },
  { label: "Contact", href: "https://www.theculinarygroup.com.au/contact" },
];

const linkClass =
  "brand-label text-xs text-cream/90 transition-colors hover:text-green-light";

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-cream/10 bg-green">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo-mark-cream.png"
            alt="The Culinary Group logo"
            className="h-9 w-auto"
          />
          <span className="brand-label text-sm text-cream">
            The Culinary Group
            <span className="ml-2 text-green-light">Tools</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) =>
            link.to ? (
              <Link key={link.label} to={link.to} className={linkClass}>
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} className={linkClass}>
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
              <button className="brand-label flex cursor-pointer items-center gap-2 border-none bg-transparent text-xs text-green-light">
                <UserOutlined />
                {user?.first_name || user?.email}
              </button>
            </Dropdown>
          ) : (
            <Link
              to="/login"
              className="brand-label border border-cream/70 px-5 py-2 text-xs !text-cream transition-colors hover:border-green-light hover:!text-green-light"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
