"use client";
import { useState } from "react";
import Button from "../_components/Button";

const Fundraise = () => {
  const [fundraiserName, setFundraiserName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [causeDescription, setCauseDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("1");
  const [showModal, setShowModal] = useState(false);

  const dummyFundraisers = [
    {
      name: "Help a Dog Shelter",
      description: "Raising funds for rescued dogs’ food and treatment.",
      goal: "5 SOL",
    },
    {
      name: "Medical Aid for Ana",
      description: "Support Ana’s post-surgery recovery.",
      goal: "10 SOL",
    },
  ];

  return (
    <div className="mt-[100px] min-h-screen px-4 py-8 bg-black text-white">
      {/* Top-right button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-lg text-white font-semibold"
        >
          Start Fundraiser
        </button>
      </div>

      {/* Dummy Fund Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {dummyFundraisers.map((fund, idx) => (
          <div
            key={idx}
            className="border border-neutral-800 bg-neutral-900/50 p-6 rounded-xl space-y-2 shadow-lg flex flex-col justify-between  "
          >
            <h2 className="text-xl font-semibold text-emerald-400">
              {fund.name}
            </h2>
            <p className="text-sm text-neutral-300">{fund.description}</p>
            <p className="text-lg    text-neutral-400">
              <strong>Goal:</strong> {fund.goal}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black opacity-100 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-white hover:text-emerald-400 text-xl"
            >
              &times;
            </button>

            <form method="dialog" className="space-y-5">
              <h2 className="text-2xl font-bold text-white text-center">
                Start Your Fundraiser
              </h2>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">
                  Fundraiser Name
                </label>
                <input
                  type="text"
                  value={fundraiserName}
                  onChange={(e) => setFundraiserName(e.target.value)}
                  placeholder="Give a name for the fund"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800/50 border border-neutral-700 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">
                  Your Wallet Address
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter your wallet address"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800/50 border border-neutral-700 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">
                  Cause Description
                </label>
                <textarea
                  rows={3}
                  value={causeDescription}
                  onChange={(e) => setCauseDescription(e.target.value)}
                  placeholder="Describe the reason you're raising funds"
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800/50 border border-neutral-700 text-white outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">
                  Goal Amount (SOL)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    placeholder="e.g., 1"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800/50 border border-neutral-700 text-white outline-none focus:border-emerald-500"
                  />
                  <span className="absolute right-3 top-3 text-sm text-neutral-500">
                    SOL
                  </span>
                </div>
              </div>

              <Button
                title="Start Fundraiser"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-semibold"
              />

              <div className="text-xs text-neutral-500 text-center">
                By starting a fundraiser, you agree to our terms and conditions.
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fundraise;
