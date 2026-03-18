"use client";

import useProgram from "@/app/hooks/useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

interface DM {
  account: {
    message: string;
    senderPubkey: PublicKey;
    solAttached: number;
    influencerPubkey: PublicKey;
  };
  publicKey: PublicKey;
}

const truncate = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

const Dashboard = () => {
  const wallet = useWallet();
  const program = useProgram();

  const [sent, setSent] = useState<DM[]>([]);
  const [received, setReceived] = useState<DM[]>([]);
  const [tab, setTab] = useState<"sent" | "received">("sent");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getAllDms() {
      if (!wallet.publicKey || !program) return;

      setLoading(true);
      try {
        const [sentDms, receivedDms] = await Promise.all([
          program.account.dm.all([
            {
              memcmp: {
                offset: 8,
                bytes: wallet.publicKey.toBase58(),
              },
            },
          ]),
          program.account.dm.all([
            {
              memcmp: {
                offset: 8 + 32,
                bytes: wallet.publicKey.toBase58(),
              },
            },
          ]),
        ]);

        setSent(sentDms);
        setReceived(receivedDms);
      } catch (e) {
        console.error("Failed to fetch DMs", e);
      } finally {
        setLoading(false);
      }
    }

    getAllDms();
  }, [wallet.publicKey, program]);

  if (!wallet.publicKey) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-neutral-400">Connect your wallet to see messages</p>
        <WalletMultiButton />
      </div>
    );
  }

  const dms = tab === "sent" ? sent : received;

  const totalSol = sent.reduce(
    (sum, dm) => sum + dm.account.solAttached / LAMPORTS_PER_SOL,
    0,
  );

  const uniqueCreators = new Set(
    sent.map((dm) => dm.account.influencerPubkey.toString()),
  ).size;

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-8 pt-28 pb-12">
      <div className="max-w-5xl w-full mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "DMs sent", value: sent.length, unit: "" },
            { label: "Total sent", value: totalSol.toFixed(3), unit: "SOL" },
            { label: "Unique creators", value: uniqueCreators, unit: "" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-neutral-950 border border-neutral-800 rounded-xl p-4"
            >
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                {s.label}
              </p>
              <p className="text-2xl font-bold text-white">
                {s.value}
                {s.unit && (
                  <span className="text-sm text-emerald-400 ml-1">
                    {s.unit}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-neutral-950 border border-neutral-800 rounded-lg p-1 w-fit mb-6">
          {(["sent", "received"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-neutral-800 text-emerald-400"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              <span className="ml-2 text-xs text-neutral-600">
                {t === "sent" ? sent.length : received.length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="h-10 w-10 border-4 border-neutral-800 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-neutral-500">Fetching messages...</p>
          </div>
        ) : dms.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-3xl">
            <p className="text-neutral-500">No {tab} messages yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dms.map((dm) => {
              const sol = (dm.account.solAttached / LAMPORTS_PER_SOL).toFixed(
                4,
              );

              const addr =
                tab === "sent"
                  ? dm.account.influencerPubkey.toString()
                  : dm.account.senderPubkey.toString();

              return (
                <div
                  key={dm.publicKey.toString()}
                  className="border border-neutral-800 rounded-2xl p-5 bg-neutral-950 hover:border-emerald-500/30 transition-all flex flex-col gap-3"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-500 uppercase mb-1">
                        {tab === "sent" ? "To" : "From"}
                      </p>

                      <a
                        href={`https://solscan.io/account/${addr}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-mono text-emerald-400 hover:underline"
                      >
                        {truncate(addr)}
                      </a>
                    </div>

                    <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-sm font-bold px-3 py-1 rounded-full">
                      {sol} SOL
                    </span>
                  </div>

                  {/* Message */}
                  <div className="flex-1">
                    <p className="text-xs text-neutral-600 uppercase mb-1">
                      Message
                    </p>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      {dm.account.message}
                    </p>
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
