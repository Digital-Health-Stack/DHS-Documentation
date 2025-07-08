import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-7 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Documentation Links */}
        <div>
          <h3 className="text-white font-semibold mb-2">Documentation</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/docs/quick-start/getting-started"
                className="hover:text-white transition-colors"
              >
                Quick Start
              </Link>
            </li>
            <li>
              <Link
                to="/docs/api"
                className="hover:text-white transition-colors"
              >
                API Reference
              </Link>
            </li>
            <li>
              <Link
                to="/docs/troubleshooting"
                className="hover:text-white transition-colors"
              >
                Troubleshooting
              </Link>
            </li>
          </ul>
        </div>

        {/* Community Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Community</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/Prashu7487/DHS-Documentation"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Forum
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Twitter
              </a>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
            </li>
          </ul>
        </div>

        {/* Logo */}
        <div className="md:text-right mt-4 md:mt-0">
          <Link href="https://your-dhs-website.com">
            <img
              src={useBaseUrl("img/logo-dhs.svg")}
              alt="DHS Logo"
              className="h-40 w-auto inline-block"
            />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 text-center md:text-left">
        <p className="text-sm text-gray-500">
          Copyright © {new Date().getFullYear()} DHS Project. Built with
          Docusaurus.
        </p>
      </div>
    </footer>
  );
}
