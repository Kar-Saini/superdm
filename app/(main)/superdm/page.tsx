"use client";

import { useState, useEffect } from "react";
import Button from "../../_components/Button";
import Influencers, { Influencer } from "./components/Influencer";

const SuperDM = () => {
  const [influencerAddress, setInfluencerAddress] = useState<string>("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("0.05");
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<Influencer | null>(null);

  useEffect(() => {
    if (selectedInfluencer) setInfluencerAddress(selectedInfluencer.address);
    else setInfluencerAddress("");
  }, [selectedInfluencer]);

  async function handleOnClick() {
    if (influencerAddress === "" || amount === "" || message === "") {
      alert("Invalid fields");
      return;
    }
  }

  return (
    <div className=" w-full text-neutral-400 flex flex-col pt-[85px] h-screen justify-center">
      <div className=" max-w-7xl mx-auto w-full flex lg:flex-row gap-8 px-4">
        <div className="flex-2 flex flex-col gap-4">
          <div
            className="borders border-neutral-800 rounded-2xl p-8 
          bg-linear-to-b from-neutral-900/70 to-black/10 shadow-lg"
          >
            <h1
              className="text-4xl
             md:text-3xl text-white font-bold text-left"
            >
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
                  <span className="text-emerald-500 text-xs">Required</span>
                </label>
                <textarea
                  rows={3}
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
                    onChange={(e) => setAmount(e.target.value)}
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

        <Influencers
          selectedInfluencer={selectedInfluencer}
          setSelectedInfluencer={setSelectedInfluencer}
        />
      </div>
    </div>
  );
};

export default SuperDM;
