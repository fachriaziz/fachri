"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, FolderKanban, Wrench, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Tools", href: "/tools", icon: Wrench },
  { label: "About", href: "/about", icon: User },
];

const glassStyles = 
  "backdrop-blur-[48px] backdrop-saturate-[200%] bg-white/25 dark:bg-[#151515]/40 border border-white/40 dark:border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] rounded-full";

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* ========================================================= */}
      {/* DESKTOP NAVBAR (Hidden on Mobile)                         */}
      {/* ========================================================= */}
      <motion.header
        initial={false}
        className="hidden md:block fixed top-0 left-0 right-0 z-50 px-4 py-3"
      >
        <div className="max-w-5xl mx-auto">
          <nav className={cn("relative px-5 py-2.5", glassStyles)}>
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
                    className="dark:hidden opacity-90"
                    priority
                  />
                  <Image
                    src="/FAZ_DARK.svg"
                    alt="FAZ Logo"
                    width={36}
                    height={36}
                    className="hidden dark:block opacity-90"
                    priority
                  />
                </motion.div>
              </Link>

              {/* Desktop Center Navigation Pills */}
              <div className="flex absolute left-1/2 -translate-x-1/2 items-center gap-2">
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
                            ? "text-primary-foreground drop-shadow-sm"
                            : "text-foreground/70 hover:text-foreground",
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="navbar-active-desktop"
                            className="absolute inset-0 bg-primary/90 dark:bg-primary shadow-sm rounded-full -z-10"
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

              {/* Right: Theme Toggle */}
              <div className="flex items-center gap-2 shrink-0">
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* ========================================================= */}
      {/* MOBILE LAYOUT (Hidden on Desktop)                         */}
      {/* ========================================================= */}

      {/* Floating Theme Toggle Top Right (Mobile) */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <div className={glassStyles}>
          <ThemeToggle />
        </div>
      </div>

      {/* Floating Bottom Navbar (Mobile) - Text Only */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <nav className={cn("pointer-events-auto flex items-center justify-center gap-1 sm:gap-2 px-5 py-2.5", glassStyles)}>
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
                      ? "text-primary-foreground drop-shadow-sm"
                      : "text-foreground/70 hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-mobile"
                      className="absolute inset-0 bg-primary/90 dark:bg-primary shadow-sm rounded-full -z-10"
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
        </nav>
      </div>
    </>
  );
}
