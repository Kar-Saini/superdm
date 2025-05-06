"use client";
import { useState } from "react";
import Button from "../_components/Button";

const SuperDM = () => {
  const [activeNetwork, setActiveNetwork] = useState<"devnet" | "mainnet">(
    "devnet"
  );
  const [influencerAddress, setInfluencerAddress] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("0.05");

  return (
    <div className="min-h-screen flex flex-col relative w-full text-neutral-400 ">
      <div className="mt-[90px] w-full flex flex-col my-10 flex-1 px-4">
        <div className="w-full md:w-4/5 lg:w-full mx-auto flex flex-col justify-center gap-4">
          <div className="flex gap-2 justify-end">
            <div className="border border-neutral-800 bg-neutral-900/30 flex rounded-lg overflow-hidden mt-2">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeNetwork === "devnet"
                    ? "bg-emerald-600/20 text-emerald-400"
                    : "text-neutral-400 hover:bg-neutral-800/50"
                }`}
                onClick={() => setActiveNetwork("devnet")}
              >
                Devnet
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeNetwork === "mainnet"
                    ? "bg-emerald-600/20 text-emerald-400"
                    : "text-neutral-400 hover:bg-neutral-800/50"
                }`}
                onClick={() => setActiveNetwork("mainnet")}
              >
                Mainnet
              </button>
            </div>
          </div>

          <div className="border w-full border-neutral-800 rounded-2xl justify-center flex flex-col lg:flex-row py-10 px-6 bg-gradient-to-b from-neutral-900/70 to-black/70 gap-8 shadow-lg">
            <div className="w-5/6">
              <div className="flex flex-col items-center font-bold w-full justify-center">
                <h1 className="text-center text-2xl md:text-3xl text-white leading-tight">
                  Make your message count —{" "}
                  <span className="text-emerald-400">SuperDM</span> your
                  favorite creator and get heard!
                </h1>
                <div className="mt-8 w-full p-6 rounded-xl border border-neutral-700 bg-neutral-900/50 shadow-xl space-y-5 backdrop-blur-sm">
                  <div className="space-y-2">
                    <label className="text-sm text-neutral-400 font-medium ml-1 flex items-center gap-1">
                      Influencer Address
                      <span className="text-xs text-emerald-500">Required</span>
                    </label>
                    <input
                      type="text"
                      value={influencerAddress}
                      onChange={(e) => setInfluencerAddress(e.target.value)}
                      placeholder="Enter wallet address"
                      className="w-full px-4 rounded-lg outline-none border border-neutral-800 py-3 bg-neutral-800/50 focus:border-emerald-600 transition-colors text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-neutral-400 font-medium ml-1 flex items-center gap-1">
                      Message
                      <span className="text-xs text-emerald-500">Required</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What would you like to say?"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg outline-none border border-neutral-800 bg-neutral-800/50 focus:border-emerald-600 transition-colors resize-none text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-neutral-400 font-medium ml-1">
                      Amount (SOL)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.05"
                        className="w-full px-4 rounded-lg outline-none border border-neutral-800 py-3 bg-neutral-800/50 focus:border-emerald-600 transition-colors text-white"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-neutral-500 text-sm font-medium">
                          SOL
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    title="Send SuperDM"
                    className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-semibold text-base"
                  ></Button>

                  <div className="text-xs text-neutral-500 text-center mt-2">
                    By sending, you agree to our terms and conditions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #333;
          border-radius: 4px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #333 transparent;
        }
        .shadow-glow {
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
        }
      `}</style>
    </div>
  );
};

export default SuperDM;
