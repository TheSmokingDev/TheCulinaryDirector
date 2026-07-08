const FOOTER_COLUMNS = [
  {
    heading: "The Culinary Group",
    links: ["About", "Services", "Workshops & Courses", "Shop"],
  },
  {
    heading: "Tools",
    links: ["Food Cost Calculator", "Recipe Scaler", "All tools"],
  },
  {
    heading: "Help",
    links: ["Contact", "Privacy Policy", "Terms & Conditions"],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-maroon text-lg font-semibold text-white">
              G
            </span>
            <span className="brand-label text-sm">Tools</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream/60">
            Practical tools to transform kitchens — built for chefs, venue
            owners and hospitality teams.
          </p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="brand-label mb-4 text-xs text-cream/50">
              {col.heading}
            </p>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <span className="cursor-pointer text-sm text-cream/80 hover:text-white">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-cream/10 py-6 text-center">
        <p className="text-xs text-cream/50">
          © {new Date().getFullYear()} The Culinary Group. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
