

import { Link } from "react-router-dom";
import Container from "../container/Container";
import Logo from "../Logo";

function Footer() {
  return (
    <footer className="border-2 border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
        {/* Top section */}
        <Container className="pt-5">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 p-5 max-auto text-gray-700 dark:text-slate-400">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <Logo width="48px" />
              <span className="text-xl font-bold dark:text-gray-200 text-blue-600">
                BlogApp
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-xs">
              A modern blog platform to share thoughts, stories, and ideas with
              the world.
            </p>
          </div>

          {/* Company */}
          <FooterColumn
            title="Company"
            links={[
              "Features",
              "Pricing",
              "Affiliate Program",
              "Press Kit",
            ]}
          />

          {/* Support */}
          <FooterColumn
            title="Support"
            links={[
              "Account",
              "Help",
              "Contact Us",
              "Customer Support",
            ]}
          />

          {/* Legal */}
          <FooterColumn
            title="Legal"
            links={[
              "Terms & Conditions",
              "Privacy Policy",
              "Licensing",
            ]}
          />
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-gray-200 dark:border-slate-800 pt-6">
          <p className="text-sm text-gray-500 dark:text-slate-400 text-center">
            © {new Date().getFullYear()} SSKUI. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
          )
}

export default Footer;


function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link}>
            <Link
              to="/"
              className="text-sm text-gray-700 hover:text-blue-600
                         dark:text-gray-300 dark:hover:text-blue-400
                         transition-colors"
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
