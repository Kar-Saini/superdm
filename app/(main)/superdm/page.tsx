"use client";

import { useState } from "react";
import Button from "../../_components/Button";
import Influencers, { Influencer } from "./components/Influencer";
import useProgram from "@/app/hooks/useProgram";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection, PROGRAM_ID } from "@/app/lib/constants";
import toast from "react-hot-toast";
import { BN } from "@coral-xyz/anchor";
import { useRouter } from "next/navigation";

const SuperDM = () => {
  const program = useProgram();
  const wallet = useWallet();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<Influencer | null>(null);

  async function handleOnClick() {
    if (
      !wallet.publicKey ||
      !program ||
      !selectedInfluencer ||
      !amount ||
      !message
    ) {
      toast.error("Invalid fields");
      return;
    }

    const influencerPk = selectedInfluencer.account.publicKey;

    const balance = await connection.getBalance(wallet.publicKey);
    if (Number(amount) * LAMPORTS_PER_SOL > balance) {
      toast.error("Insufficient Balance");
      return;
    }

    try {
      const [userInfluencerInboxPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("inbox"),
          wallet.publicKey.toBuffer(),
          influencerPk.toBuffer(),
        ],
        PROGRAM_ID,
      );

      let inboxAccount =
        await program.account.userInfluencerInbox.fetchNullable(
          userInfluencerInboxPda,
        );

      if (!inboxAccount) {
        toast.success("Sign the trxn to create inbox first.");
        const tx = await program.methods
          .initUserInflucencerInbox()
          .accounts({
            influencerProfile: (
              await PublicKey.findProgramAddressSync(
                [Buffer.from("influencer"), influencerPk.toBuffer()],
                PROGRAM_ID,
              )
            )[0],
            user: wallet.publicKey,
          })
          .rpc();

        await connection.confirmTransaction(tx, "confirmed");

        inboxAccount = await program.account.userInfluencerInbox.fetchNullable(
          userInfluencerInboxPda,
        );
      }
      toast.success("Sign the trxn to send DM.");
      const tx = await program.methods
        .initDm(new BN(Number(amount) * LAMPORTS_PER_SOL), message)
        .accounts({
          user: wallet.publicKey,
          influencer: influencerPk,
        })
        .rpc();
      await connection.confirmTransaction(tx, "confirmed");
      console.log("Transaction Signature:", tx);
      toast.success("SuperDM sent!");
    } catch (err) {
      console.error("DM Error:", err);
      toast.error("Failed to send DM");
    } finally {
      setAmount("");
      setMessage("");
      setSelectedInfluencer(null);
      router.push("/dashboard");
    }
  }

  return (
    <div className="w-full text-neutral-400 md:flex flex-col pt-[85px] h-screen justify-center">
      <div className="max-w-7xl mx-auto w-full flex lg:flex-row gap-8 px-4">
        {/* LEFT */}
        <div className="flex-[2] flex flex-col gap-4">
          <div className="border border-neutral-800 rounded-2xl p-8 bg-linear-to-b from-neutral-900/70 to-black/10 shadow-lg">
            <h1 className="text-3xl text-white font-bold">
              Make your message count —{" "}
              <span className="text-emerald-400">SuperDM</span>
            </h1>

            <div className="mt-8 space-y-5">
              <div>
                <label className="text-sm mb-1 block">
                  Message{" "}
                  <span className="text-emerald-500 text-xs">
                    ({200 - message.length})
                  </span>
                </label>

                <textarea
                  rows={3}
                  maxLength={200}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-800 focus:border-emerald-600 outline-none text-white"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block">Amount (SOL)</label>

                <input
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/^\d*\.?\d*$/.test(value)) return;
                    setAmount(value);
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-800 text-white"
                />
              </div>

              <Button
                title="Send SuperDM"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleOnClick}
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
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
