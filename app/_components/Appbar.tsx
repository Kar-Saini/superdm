"use client";
import { useState } from "react";
import { MessageSquare, DollarSign, Users, Menu, X } from "lucide-react";
import Button from "./Button";
import { cn } from "../utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      name: "DM",
      path: "/superdm",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      name: "Fundraise",
      path: "/fundraise",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      name: "Influencer",
      path: "/influencer",
      icon: <Users className="h-4 w-4" />,
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-5/6 py-4 px-4 fixed top-0 z-50">
      <div className="container mx-auto w-full">
        <div className="bg-gradient-to-b from-neutral-900 to-neutral-800/95 backdrop-blur-md h-[70px] rounded-xl shadow-lg flex items-center justify-between px-6 w-full">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="mr-8">
              <h1 className="font-extrabold text-4xl tracking-widest text-emerald-400">
                super<span className="text-white">DM</span>
              </h1>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={cn(
                    "px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",
                    pathname === item.path
                      ? "bg-neutral-800 text-emerald-400"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden absolute left-4 right-4 top-[90px] bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg p-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={cn(
                    "px-4 py-3 rounded-lg flex items-center gap-3",
                    pathname === item.path
                      ? "bg-neutral-800 text-emerald-400"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-neutral-800 my-2 pt-2">
                <Button
                  title="Connect Wallet"
                  variant="outline"
                  className="w-full border-emerald-600 text-emerald-400 hover:bg-emerald-900/20"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
