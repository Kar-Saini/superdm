"use client";

import { useEffect, useState } from "react";
import { MessageSquare, DollarSign, Users, Menu, X } from "lucide-react";
import { cn } from "../utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { connection, PROGRAM_ID } from "../lib/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import useProgram from "../hooks/useProgram";
import { MdDashboard } from "react-icons/md";
const navItems = [
  {
    name: "DM",
    path: "/superdm",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <MdDashboard className="h-4 w-4" />,
  },
  {
    name: "Influencer",
    path: "/influencer",
    icon: <Users className="h-4 w-4" />,
  },
];
const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const wallet = useWallet();
  const program = useProgram();
  const [userProfileAccount, setuserProfileAccount] = useState<any>();
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    async function getBalanace() {
      if (!wallet.publicKey) return;
      const bal = await connection.getBalance(wallet.publicKey);
      setBalance(bal / LAMPORTS_PER_SOL);
    }
    async function getUserProfile() {
      if (!wallet.publicKey) return;
      const [userPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_profile"), wallet.publicKey?.toBuffer()],
        PROGRAM_ID,
      );
      const userProfile = await program.account.userProfile.fetch(userPda);
      setuserProfileAccount(userProfile);
    }
    getBalanace();
    getUserProfile();
  }, [wallet]);
  const pathname = usePathname();

  if (!mounted) return <></>;
  return (
    <nav className="w-5/6 py-2 px-4 fixed top-0 z-50">
      <div className="bg-linear-to-b from-neutral-900 to-neutral-800/95 backdrop-blur-md h-[70px] rounded-xl shadow-lg flex items-center justify-between px-6 w-full">
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
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/50",
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex gap-2 items-center text-neutral-500 text-sm">
            <p className="">Balance : {balance?.toFixed(4)}</p>
            {userProfileAccount && (
              <>
                <p>|</p>
                <p>DM Count : {userProfileAccount.dmCount.toNumber()}</p>
                <p>|</p>
              </>
            )}
            <WalletMultiButton className="bg-pink-500" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
