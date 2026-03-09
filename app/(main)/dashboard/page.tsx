"use client";
import useProgram from "@/app/hooks/useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const Dashboard = () => {
  const wallet = useWallet();
  const program = useProgram();
  const [dms, setDms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function getAllDms() {
    if (!wallet.publicKey || !program) return;
    try {
      setLoading(true);
      const fetchedDms = await program.account.dm.all();
      setDms(fetchedDms);
    } catch (e) {
      console.error("Failed to fetch DMs", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllDms();
  }, [wallet.publicKey, program]);

  return (
    <div className="h-screen px-8 pb-2 pt-20 justify-center items-center ">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center mt-32">
            <div className="h-10 w-10 border-2 border-neutral-800 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dms.map((dm) => {
              const solAmount = (
                dm.account.solAttached.toNumber() / LAMPORTS_PER_SOL
              ).toFixed(3);
              const sender = dm.account.senderPubkey.toString();

              return (
                <div
                  key={dm.publicKey.toString()}
                  className="border border-neutral-800 rounded-2xl p-8 bg-linear-to-b from-neutral-900/70 to-black/10 shadow-lg hover:border-emerald-500/30 transition-all duration-300 relative group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-3xl font-bold text-white">
                          {solAmount}
                        </span>
                        <span className="text-emerald-400 font-bold text-sm">
                          SOL
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8 min-h-[60px]">
                    <p className="text-neutral-300 text-[15px] leading-relaxed italic">
                      Message : {dm.account.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-800/60 mt-4">
                    <div className="flex flex-col">
                      <span className="text-sm  uppercase text-neutral-600 font-bold">
                        From Sender
                      </span>
                      <span className="text-xs font-mono text-neutral-400 bg-neutral-800/30 py-1 rounded">
                        {sender}
                      </span>
                    </div>
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
