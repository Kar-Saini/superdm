"use client";

import React, { useEffect, useState } from "react";
import Button from "../../_components/Button";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { PROGRAM_ID } from "@/app/lib/constants";
import { PublicKey } from "@solana/web3.js";
import useProgram from "@/app/hooks/useProgram";
import useAllInfluencers from "@/app/hooks/useAllInfluencers";

const Page = () => {
  const wallet = useWallet();
  const program = useProgram();
  const [showModal, setShowModal] = useState(false);
  const [currentUserInfluencerProfile, setCurrentUserInfluencerProfile] =
    useState<any>(null);
  const [newInfluencerData, setNewInfluencerData] = useState({
    name: "",
    categories: "",
  });
  const [loading, setLoading] = useState(false);
  const allInfluencers = useAllInfluencers();
  console.log(allInfluencers);
  async function getCurrentUserInfluencerProfile() {
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
  }

  useEffect(() => {
    getCurrentUserInfluencerProfile();
  }, [program]);

  async function handleInfluencerRegistration() {
    if (!program || !wallet.publicKey) return;
    setLoading(true);
    try {
      const tx = await program.methods
        .initInfluencerProfile(
          newInfluencerData.name,
          newInfluencerData.categories,
        )
        .accounts({
          influencer: wallet.publicKey,
        })
        .rpc();

      console.log("TX:", tx);
      toast.success("Influencer Registered Successfully 🚀");

      await getCurrentUserInfluencerProfile();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Transaction Failed ❌");
    }
    setLoading(false);
  }

  return (
    <div className="flex-1 mt-[100px] w-full px-6">
      <div className="flex justify-between items-center py-4">
        <h1 className="text-3xl font-bold text-emerald-400">Influencers</h1>

        {!currentUserInfluencerProfile && (
          <Button
            title="Register"
            variant="outline"
            size="sm"
            onClick={() => {
              if (!wallet.publicKey) {
                toast.error("Connect Wallet");
                return;
              }
              setShowModal(true);
            }}
          />
        )}
      </div>
      <div className="overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
        {allInfluencers &&
          allInfluencers.map((influencer, index) => (
            <div
              key={index}
              className="flex border border-neutral-800 rounded-lg p-4 mb-3 items-center gap-4 hover:bg-neutral-800/30 transition-colors cursor-pointer group"
            >
              <div className="rounded-full w-[50px] h-[50px] bg-gradient-to-br from-emerald-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-glow">
                {influencer.account.name.charAt(0)}
              </div>
              <div className="w-full">
                <div className="flex justify-between items-center flex-wrap gap-1">
                  <p className="font-semibold text-base md:text-lg text-white group-hover:text-emerald-400 transition-colors">
                    {influencer.account.name}
                  </p>
                  <div className="flex gap-1 flex-wrap justify-end max-w-[60%]">
                    <span className="text-xs bg-neutral-800/80 text-emerald-400 px-2 py-0.5 rounded-full">
                      {influencer.account.categories}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 truncate max-w-full">
                  {JSON.stringify(influencer.publicKey)}
                </p>
              </div>
            </div>
          ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-white text-xl"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold text-white mb-4">
              Register as Influencer
            </h2>

            <div className="flex flex-col gap-3">
              <input
                placeholder="Name"
                className="bg-neutral-800 text-white p-2 rounded"
                onChange={(e) =>
                  setNewInfluencerData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />

              <input
                placeholder="Categories"
                className="bg-neutral-800 text-white p-2 rounded"
                onChange={(e) =>
                  setNewInfluencerData((prev) => ({
                    ...prev,
                    categories: e.target.value,
                  }))
                }
              />

              <Button
                title={loading ? "Submitting..." : "Submit"}
                variant="outline"
                onClick={handleInfluencerRegistration}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
