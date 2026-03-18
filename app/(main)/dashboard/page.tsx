"use client";
import useProgram from "@/app/hooks/useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
interface DM {
  account: {
    message: string;
    senderPubkey: PublicKey;
    solAttached: number;
    influencerPubkey: PublicKey;
  };
  publicKey: PublicKey;
}
const Dashboard = () => {
  const wallet = useWallet();
  const program = useProgram();
  const [dms, setDms] = useState<DM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAllDms() {
      if (!wallet.publicKey || !program) return;
      try {
        setLoading(true);
        const fetchedDms = await program.account.dm.all();
        const mydms = fetchedDms.filter(
          (dm) =>
            dm.account.senderPubkey.toString() === wallet.publicKey?.toString(),
        );
        setDms(mydms);
        console.log(mydms);
      } catch (e) {
        console.error("Failed to fetch DMs", e);
      } finally {
        setLoading(false);
      }
    }
    getAllDms();
  }, []);

  return (
    <div className="overflow-y-auto w-full flex flex-col items-center justify-center px-4 sm:px-8 pt-28 pb-12">
      <div className="max-w-7xl w-full mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 border-4 border-neutral-800 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-neutral-500 font-medium">Fetching messages...</p>
          </div>
        ) : dms.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-3xl">
            <p className="text-neutral-500 text-lg">
              No messages found on-chain.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dms.map((dm) => {
              const solAmount = (
                dm.account.solAttached / LAMPORTS_PER_SOL
              ).toFixed(3);
              const influencer = dm.account.influencerPubkey.toString();

              return (
                <div
                  key={dm.publicKey.toString()}
                  className="border border-neutral-800 rounded-2xl p-6 md:p-8 bg-neutral-900/40 backdrop-blur-sm shadow-lg hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-6">
                      <span className="text-3xl font-bold text-white">
                        {solAmount}
                      </span>
                      <span className="text-emerald-400 font-bold text-sm">
                        SOL
                      </span>
                    </div>

                    <div className="mb-8 min-h-[60px]">
                      <p className="text-neutral-300 text-[15px] leading-relaxed italic">
                        <span className="text-neutral-600 not-italic font-bold block text-xs uppercase mb-1">
                          Message
                        </span>
                        {dm.account.message}
                      </p>
                    </div>
                  </div>

                  <div className=" border-t border-neutral-800/60">
                    <span className="text-sm uppercase text-neutral-600 font-bold block mb-1 pt-2">
                      Influencer Address
                    </span>
                    <span className="text-xs font-mono text-neutral-400 bg-black/40 py-1 rounded block truncate">
                      {influencer}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
