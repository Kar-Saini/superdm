"use client";

import { useState, useEffect } from "react";
import Button from "../../_components/Button";
import Influencers, { Influencer } from "./components/Influencer";
import useProgram from "@/app/hooks/useProgram";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection, PROGRAM_ID } from "@/app/lib/constants";
import toast from "react-hot-toast";
import { BN } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
const SuperDM = () => {
  const [influencerAddress, setInfluencerAddress] = useState<string>("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<Influencer | null>(null);

  const [userProfilePda, setUserProfilePda] = useState<PublicKey | null>(null);
  const [userProfilePdaAccount, setUserProfilePdaAccount] = useState<any>(null);

  const program = useProgram();
  const wallet = useWallet();

  useEffect(() => {
    if (selectedInfluencer)
      setInfluencerAddress(selectedInfluencer.publicKey.toBase58());
    else setInfluencerAddress("");

    async function getUserProfile() {
      if (!wallet.publicKey) return;
      const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_profile"), wallet.publicKey.toBuffer()],
        PROGRAM_ID,
      );
      setUserProfilePda(pda);
      try {
        const account = await program.account.userProfile.fetchNullable(pda);
        setUserProfilePdaAccount(account);
      } catch {
        setUserProfilePdaAccount(null);
      }
    }
    getUserProfile();
  }, [wallet.publicKey, program, selectedInfluencer]);

  async function handleOnClick() {
    if (!wallet.publicKey || !program) return;

    // 1. Basic Validation
    if (!influencerAddress || !amount || !message || !selectedInfluencer) {
      toast.error("Invalid fields");
      return;
    }

    const balance = await connection.getBalance(wallet.publicKey);
    if (Number(amount) * LAMPORTS_PER_SOL > balance) {
      toast.error("Insufficient Balance");
      return;
    }

    // 2. Ensure User Profile exists and is fetched
    let currentProfile = userProfilePdaAccount;

    if (!currentProfile) {
      const loadingToast = toast.loading("Initializing User Profile...");
      try {
        await program.methods
          .initUserProfile()
          .accounts({
            user: wallet.publicKey,
            // userProfile is usually derived automatically by Anchor if seeds are in IDL
          })
          .rpc();

        // Fetch the newly created account immediately
        currentProfile = await program.account.userProfile.fetch(
          userProfilePda as PublicKey,
        );
        setUserProfilePdaAccount(currentProfile);
        toast.dismiss(loadingToast);
        toast.success("User Profile Created");
      } catch (err) {
        console.error("Profile Init Error:", err);
        toast.dismiss(loadingToast);
        toast.error("Profile creation failed");
        return;
      }
    }

    try {
      const dmCount = currentProfile.dmCount; // This is a BN

      // 3. Manually derive DM PDA with STRICT 8-byte padding
      // Rust's .to_le_bytes() for u64 ALWAYS produces 8 bytes.
      // JS's .toArrayLike(Buffer, "le", 8) ensures we match that exactly.
      const [dmPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("dm"),
          wallet.publicKey.toBuffer(),
          dmCount.toArrayLike(Buffer, "le", 8),
        ],
        program.programId,
      );

      // 4. Manually derive Influencer Profile PDA
      const [influencerProfilePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("influencer"),
          selectedInfluencer.account.publicKey.toBuffer(),
        ],
        program.programId,
      );

      // 5. Execute Transaction
      const tx = await program.methods
        .initDm(
          new BN(Number(amount) * LAMPORTS_PER_SOL),
          message,
          dmCount, // Pass the count as the u64 argument
        )
        .accounts({
          sender: wallet.publicKey,
          userProfile: userProfilePda,
          dm: dmPda,
          influencer: selectedInfluencer.account.publicKey,
          influencerProfile: influencerProfilePda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log("Transaction Signature:", tx);
      toast.success("SuperDM sent!");

      // Optional: Refresh local state so the next DM uses dmCount + 1
      const updatedProfile = await program.account.userProfile.fetch(
        userProfilePda as PublicKey,
      );
      setUserProfilePdaAccount(updatedProfile);
    } catch (err) {
      console.error("DM Error:", err);
      // If you see "Seed constraint violated" now, log the seeds to compare
      toast.error("Failed to send DM");
    }
  }
  return (
    <div className="w-full text-neutral-400 md:flex flex-col pt-[85px] h-screen justify-center">
      <div className="max-w-7xl mx-auto w-full flex lg:flex-row gap-8 px-4">
        <div className="flex-2 flex flex-col gap-4">
          <div className="border border-neutral-800 rounded-2xl p-8 bg-linear-to-b from-neutral-900/70 to-black/10 shadow-lg">
            <h1 className="text-4xl md:text-3xl text-white font-bold text-left">
              Make your message count —{" "}
              <span className="text-emerald-400">SuperDM</span> your favorite
              creator
            </h1>

            <div className="mt-8 space-y-5">
              <div>
                <label className="text-sm mb-1 block">
                  Influencer Address{" "}
                  <span className="text-emerald-500 text-xs">Required</span>
                </label>

                <input
                  value={influencerAddress}
                  onChange={(e) => setInfluencerAddress(e.target.value)}
                  placeholder="Wallet address"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800/50 border border-neutral-800 focus:border-emerald-600 outline-none text-white"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block">
                  Message{" "}
                  <span className="text-emerald-500 text-xs">
                    Required ({200 - message.length})
                  </span>
                </label>

                <textarea
                  rows={3}
                  maxLength={200}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What would you like to say?"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800/50 border border-neutral-800 focus:border-emerald-600 outline-none resize-none text-white"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block">Amount (SOL)</label>

                <div className="relative">
                  <input
                    value={amount}
                    type="text"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!/^\d*\.?\d*$/.test(value)) return;
                      setAmount(value);
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800/50 border border-neutral-800 focus:border-emerald-600 outline-none text-white"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
                    SOL
                  </span>
                </div>
              </div>

              <Button
                title="Send SuperDM"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-semibold cursor-pointer"
                onClick={handleOnClick}
              />
            </div>
          </div>
        </div>

        <div className="md:flex-1">
          <Influencers
            selectedInfluencer={selectedInfluencer}
            setSelectedInfluencer={setSelectedInfluencer}
          />
        </div>
      </div>
    </div>
  );
};

export default SuperDM;
