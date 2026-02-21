"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={false}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
    >
      <div className="max-w-5xl mx-auto">
        <nav className="relative backdrop-blur-[30px] backdrop-saturate-[180%] bg-background/90 dark:bg-background/90 border border-foreground/10 dark:border-white/15 rounded-full px-5 py-2.5 supports-[backdrop-filter]:bg-background/75 supports-[backdrop-filter]:dark:bg-background/75">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/FAZ_LIGHT.svg"
                  alt="FAZ Logo"
                  width={36}
                  height={36}
                  className="dark:hidden"
                  priority
                />
                <Image
                  src="/FAZ_DARK.svg"
                  alt="FAZ Logo"
                  width={36}
                  height={36}
                  className="hidden dark:block"
                  priority
                />
              </motion.div>
            </Link>

            {/* Center Navigation Pills */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <motion.div
                    key={item.href}
                    whileHover={!isActive ? { scale: 1.05 } : {}}
                    whileTap={!isActive ? { scale: 0.95 } : {}}
                    transition={{ duration: 0.2 }}
                    className="group"
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "relative block px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-300",
                        isActive
                          ? "text-primary-foreground"
                          : "text-foreground/70 hover:text-foreground",
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="navbar-active"
                          className="absolute inset-0 bg-primary rounded-full -z-10"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      {!isActive && (
                        <span className="absolute inset-0 bg-secondary/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                      )}
                      <span className="relative">{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Theme Toggle */}
            <div className="shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
