import React from "react";

const NetworkToggle = ({
  activeNetwork,
  setActiveNetwork,
}: {
  activeNetwork: "devnet" | "mainnet";
  setActiveNetwork: (nw: "devnet" | "mainnet") => void;
}) => {
  return (
    <div className="flex justify-end py-2 ">
      <div className="border border-neutral-800 bg-neutral-900/30 flex rounded-lg overflow-hidden">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeNetwork === "devnet"
              ? "bg-emerald-600/20 text-emerald-400"
              : "hover:bg-neutral-800/50"
          }`}
          onClick={() => setActiveNetwork("devnet")}
        >
          Devnet
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeNetwork === "mainnet"
              ? "bg-emerald-600/20 text-emerald-400"
              : "hover:bg-neutral-800/50"
          }`}
          onClick={() => setActiveNetwork("mainnet")}
        >
          Mainnet
        </button>
      </div>
    </div>
  );
};

export default NetworkToggle;
