"use client";

import { useEffect, useState } from "react";
import Button from "../../_components/Button";
import Influencers, { Influencer } from "./components/Influencer";
import useProgram from "@/app/hooks/useProgram";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { connection, PROGRAM_ID } from "@/app/lib/constants";
import toast from "react-hot-toast";
import { BN } from "@coral-xyz/anchor";
import { useRouter, useSearchParams } from "next/navigation";
import useAllInfluencers from "@/app/hooks/useAllInfluencers";

const SuperDM = () => {
  const program = useProgram();
  const wallet = useWallet();
  const router = useRouter();
  const searchParams = useSearchParams();
  const allInfluencers = useAllInfluencers();

  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<Influencer | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const toAddr = searchParams.get("to");
    if (!toAddr || !allInfluencers) return;
    const match = allInfluencers.find(
      (inf) => inf.account.publicKey.toString() === toAddr,
    );
    if (match) setSelectedInfluencer(match);
  }, [searchParams, allInfluencers]);

  if (!wallet.publicKey) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-neutral-400 text-lg">
          Connect your wallet to send a SuperDM
        </p>
        <WalletMultiButton />
      </div>
    );
  }

  async function handleOnClick() {
    if (!selectedInfluencer) {
      toast.error("Select an influencer first");
      return;
    }
    if (!message.trim()) {
      toast.error("Write a message");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast.error("Enter an amount");
      return;
    }

    const amountLamports = Number(amount) * LAMPORTS_PER_SOL;

    const balance = await connection.getBalance(wallet.publicKey!);
    if (amountLamports > balance) {
      toast.error("Insufficient balance");
      return;
    }

    const influencerPk = selectedInfluencer.account.publicKey;
    setSending(true);

    try {
      const [userInfluencerInboxPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("inbox"),
          wallet.publicKey!.toBuffer(),
          influencerPk.toBuffer(),
        ],
        PROGRAM_ID,
      );

      const inboxAccount =
        await program!.account.userInfluencerInbox.fetchNullable(
          userInfluencerInboxPda,
        );

      if (!inboxAccount) {
        toast("Creating your inbox — sign to continue", { icon: "📬" });
        const tx = await program!.methods
          .initUserInflucencerInbox()
          .accounts({
            influencerProfile: PublicKey.findProgramAddressSync(
              [Buffer.from("influencer"), influencerPk.toBuffer()],
              PROGRAM_ID,
            )[0],
            user: wallet.publicKey!,
          })
          .rpc();
        await connection.confirmTransaction(tx, "confirmed");
      }

      toast("Sign to send your DM", { icon: "✉️" });
      const tx = await program!.methods
        .initDm(new BN(amountLamports), message)
        .accounts({
          user: wallet.publicKey!,
          influencer: influencerPk,
        })
        .rpc();

      await connection.confirmTransaction(tx, "confirmed");
      toast.success("SuperDM sent! 🚀");

      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg.includes("User rejected")) {
        toast.error("Transaction cancelled");
      } else {
        toast.error("Failed to send DM");
      }
    } finally {
      setSending(false);
      setAmount("");
      setMessage("");
    }
  }

  return (
    <div className="w-full text-neutral-400 flex flex-col pt-[85px] min-h-screen justify-center">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 px-4">
        <div className="flex-[2] flex flex-col gap-4">
          <div
            className="border border-neutral-800 rounded-2xl p-8
            bg-gradient-to-b from-neutral-900/70 to-black/10 shadow-lg"
          >
            <h1 className="text-3xl text-white font-bold">
              Make your message count —{" "}
              <span className="text-emerald-400">SuperDM</span>
            </h1>

            {selectedInfluencer ? (
              <div
                className="mt-4 flex items-center gap-3 bg-emerald-950/40
                border border-emerald-800 rounded-xl px-4 py-3"
              >
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-br
                  from-emerald-400 to-blue-600 flex items-center justify-center
                  text-white text-sm font-bold flex-shrink-0"
                >
                  {selectedInfluencer.account.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-emerald-400 font-semibold text-sm">
                    {selectedInfluencer.account.name}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInfluencer(null)}
                  className="text-neutral-600 hover:text-neutral-400
                    transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-neutral-600">
                ← Select an influencer from the list
              </p>
            )}

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-sm mb-1 flex justify-between">
                  <span>Message</span>
                  <span
                    className={`text-xs ${
                      200 - message.length < 20
                        ? "text-red-400"
                        : "text-emerald-500"
                    }`}
                  >
                    {200 - message.length} remaining
                  </span>
                </label>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={message}
                  placeholder="Write your message..."
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900
                    border border-neutral-800 focus:border-emerald-600
                    outline-none text-white resize-none transition-colors
                    placeholder:text-neutral-700"
                />
              </div>

              <div>
                <label className="text-sm mb-2 block">Amount (SOL)</label>

                <div className="relative">
                  <input
                    value={amount}
                    placeholder="0.00"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!/^\d*\.?\d*$/.test(value)) return;
                      setAmount(value);
                    }}
                    className="w-full px-4 py-3 pr-14 rounded-xl bg-neutral-900
                      border border-neutral-800 focus:border-emerald-600
                      outline-none text-white transition-colors
                      placeholder:text-neutral-700"
                  />
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2
                    text-emerald-400 text-sm font-semibold pointer-events-none"
                  >
                    SOL
                  </span>
                </div>
              </div>

              <Button
                title={sending ? "Sending..." : "Send SuperDM →"}
                className={`w-full py-4 text-white transition-colors ${
                  sending
                    ? "bg-emerald-800 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500"
                }`}
                onClick={sending ? undefined : handleOnClick}
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
