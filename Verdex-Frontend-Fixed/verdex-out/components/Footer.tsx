"use client";

import Link from "next/link";
import { Scale, Linkedin, Twitter, Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-neutral-900 border-t border-white/5 py-3 text-neutral-50/60">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
          {/* Brand */}
          <div className="md:col-span-2 space-y-2">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-7 w-7 border border-secondary flex items-center justify-center rounded-sm">
                <Scale className="text-secondary h-3.5 w-3.5" />
              </div>
              <span
                className="text-sm font-black uppercase text-neutral-50"
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.2em" }}
              >
                VERDEX
              </span>
            </Link>
            <p
              className="max-w-md leading-relaxed text-xs text-neutral-400"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            >
              {t("foot.desc")}
            </p>
            <div className="bg-white/5 border border-white/10 border-l-2 border-l-secondary p-2 rounded-sm inline-block">
              <p className="text-xs text-secondary/80" style={{ fontFamily: "'Inter', sans-serif" }}>
                <strong className="font-semibold">{t("foot.l.disc")}:</strong>{" "}
                {t("foot.disc")}
              </p>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4
              className="text-neutral-300 font-semibold uppercase text-[10px] mb-2 pb-1 border-b border-white/10 inline-block"
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.15em" }}
            >
              {t("foot.c1")}
            </h4>
            <ul className="space-y-1.5">
              {[
                { href: "/about", label: t("foot.l.about") },
                { href: "/features", label: t("foot.l.feat") },
                { href: "/cases", label: t("foot.l.cases") },
                { href: "/contact", label: t("foot.l.contact") },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs text-neutral-400 hover:text-secondary transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4
              className="text-neutral-300 font-semibold uppercase text-[10px] mb-2 pb-1 border-b border-white/10 inline-block"
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.15em" }}
            >
              {t("foot.c2")}
            </h4>
            <ul className="space-y-1.5">
              {[
                { href: "/privacy", label: t("foot.l.privacy") },
                { href: "/terms", label: t("foot.l.terms") },
                { href: "/disclaimer", label: t("foot.l.disc") },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs text-neutral-400 hover:text-secondary transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-2 border-t border-white/5 flex flex-col md:flex-row items-center justify-between">
          <p
            className="text-[11px] text-neutral-500"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            &copy; {new Date().getFullYear()} {t("foot.copy")}
          </p>
          <div className="flex space-x-4 mt-1 md:mt-0 opacity-40 hover:opacity-80 transition-opacity">
            <Link href="#" className="hover:text-secondary transition-colors"><Linkedin size={14} /></Link>
            <Link href="#" className="hover:text-secondary transition-colors"><Twitter size={14} /></Link>
            <Link href="#" className="hover:text-secondary transition-colors"><Instagram size={14} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}