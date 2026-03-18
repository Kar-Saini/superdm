"use client";
import React, { useCallback, useEffect, useState } from "react";
import Button from "../../_components/Button";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { PROGRAM_ID } from "@/app/lib/constants";
import { PublicKey } from "@solana/web3.js";
import useProgram from "@/app/hooks/useProgram";
import useAllInfluencers from "@/app/hooks/useAllInfluencers";
import { useRouter } from "next/navigation";

interface InfluencerType {
  name: string;
  categories: string;
  publicKey: PublicKey;
}

const Page = () => {
  const wallet = useWallet();
  const program = useProgram();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [currentUserInfluencerProfile, setCurrentUserInfluencerProfile] =
    useState<InfluencerType | null>(null);
  const [newInfluencerData, setNewInfluencerData] = useState({
    name: "",
    categories: "",
  });
  const [loading, setLoading] = useState(false);
  const allInfluencers = useAllInfluencers();

  const getCurrentUserInfluencerProfile = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("influencer"), wallet.publicKey.toBuffer()],
      PROGRAM_ID,
    );
    try {
      const account = await program.account.influencerProfile.fetch(pda);
      setCurrentUserInfluencerProfile(account);
    } catch {
      setCurrentUserInfluencerProfile(null);
    }
  }, [program, wallet.publicKey]);

  useEffect(() => {
    getCurrentUserInfluencerProfile();
  }, [getCurrentUserInfluencerProfile]);

  async function handleInfluencerRegistration() {
    if (!program || !wallet.publicKey) return;

    if (!newInfluencerData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!newInfluencerData.categories.trim()) {
      toast.error("Add at least one category");
      return;
    }

    setLoading(true);
    try {
      await program.methods
        .initInfluencerProfile(
          newInfluencerData.name,
          newInfluencerData.categories,
        )
        .accounts({ influencer: wallet.publicKey })
        .rpc();

      toast.success("Registered as influencer 🚀");
      await getCurrentUserInfluencerProfile();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-[100px] w-full px-6 flex flex-col">
      <div className="flex justify-between items-center py-4">
        <h1 className="text-3xl font-bold text-emerald-400">Influencers</h1>
        {!currentUserInfluencerProfile ? (
          <Button
            title="+ Register"
            variant="outline"
            size="sm"
            onClick={() => {
              if (!wallet.publicKey) {
                toast.error("Connect your wallet first");
                return;
              }
              setShowModal(true);
            }}
          />
        ) : (
          <p className=" text-xs text-neutral-500">
            This address is registered as an influencer.
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {!allInfluencers ? (
          <div className="flex justify-center pt-20">
            <div className="h-8 w-8 border-4 border-neutral-800 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : allInfluencers.length === 0 ? (
          <p className="text-neutral-500 text-center pt-20">
            No influencers registered yet.
          </p>
        ) : (
          allInfluencers
            .filter(
              (i) =>
                i.account.publicKey.toString() !== wallet.publicKey?.toString(),
            )
            .map((influencer) => {
              const walletAddr = influencer.account.publicKey?.toString() ?? "";

              return (
                <div
                  key={influencer.publicKey.toString()}
                  className="flex border border-neutral-800 rounded-xl p-4 mb-3
                  items-center gap-4 hover:border-emerald-500/30 
                  bg-neutral-950 transition-colors group"
                >
                  <div
                    className="rounded-full w-[46px] h-[46px] flex-shrink-0
                  bg-gradient-to-br from-emerald-400 to-blue-600
                  flex items-center justify-center text-white font-bold text-lg"
                  >
                    {influencer.account.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {influencer.account.name}
                      </p>
                    </div>
                    <p className="text-xs text-neutral-500 py-1">
                      {influencer.account.publicKey.toString()}
                    </p>

                    <div className="flex gap-1 flex-wrap py-2">
                      {influencer.account.categories
                        .split(",")
                        .map((cat: string) => (
                          <span
                            key={cat}
                            className="text-xs bg-neutral-800 text-neutral-400
                        px-2 py-0.5 rounded-full"
                          >
                            {cat.trim()}
                          </span>
                        ))}
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/superdm?to=${walletAddr}`)}
                    className="text-sm font-semibold px-4 py-2 bg-emerald-600
                    hover:bg-emerald-500 text-white rounded-lg transition-colors
                    whitespace-nowrap flex-shrink-0"
                  >
                    Send DM →
                  </button>
                </div>
              );
            })
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm
          flex items-center justify-center z-50"
        >
          <div
            className="bg-neutral-900 border border-neutral-800
            rounded-xl p-6 w-full max-w-md relative shadow-xl"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-neutral-500
                hover:text-white text-xl transition-colors"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold text-white mb-6">
              Register as influencer
            </h2>

            <div className="flex flex-col gap-3">
              <input
                placeholder="Name"
                value={newInfluencerData.name}
                className="bg-neutral-800 border border-neutral-700 text-white
                  p-3 rounded-lg text-sm outline-none
                  focus:border-emerald-500 transition-colors"
                onChange={(e) =>
                  setNewInfluencerData((p) => ({ ...p, name: e.target.value }))
                }
              />
              <input
                placeholder="Categories (e.g. Web3, Gaming)"
                value={newInfluencerData.categories}
                className="bg-neutral-800 border border-neutral-700 text-white
                  p-3 rounded-lg text-sm outline-none
                  focus:border-emerald-500 transition-colors"
                onChange={(e) =>
                  setNewInfluencerData((p) => ({
                    ...p,
                    categories: e.target.value,
                  }))
                }
              />

              <Button
                title={loading ? "Submitting..." : "Register"}
                variant="outline"
                onClick={handleInfluencerRegistration}
                className="cursor-pointer py-2 mt-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
