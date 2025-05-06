"use client";

import React, { useState } from "react";
import Button from "../_components/Button";

const INFLUENCERS = [
  {
    name: "Harkirat",
    joinedAt: "12 Jun 2024",
    address: "nfjdsnfjdsnfjdsnfjdsnfjds",
    categories: ["Tech", "Web3"],
  },
  {
    name: "Sarah",
    joinedAt: "15 Apr 2024",
    address: "3j4n5k3j4n5k3j4n5k3j4n5k3j",
    categories: ["Fashion", "Lifestyle"],
  },
  {
    name: "Michael",
    joinedAt: "03 May 2024",
    address: "87v6b5nm87v6b5nm87v6b5nm87v",
    categories: ["Gaming", "NFTs"],
  },
  {
    name: "Olivia",
    joinedAt: "21 Jun 2024",
    address: "p098o7i6up098o7i6up098o7i6u",
    categories: ["Tech", "Web3", "Art", "Design", "NFTs", "DeFi"],
  },
];

const Page = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex-1 mt-[100px] w-full">
      <div className="flex justify-center flex-col h-full px-4">
        <div className="flex justify-between items-center py-4">
          <h1 className="font-extrabold text-2xl md:text-4xl tracking-widest w-full text-emerald-400">
            Influencers
          </h1>
          <Button
            title="Register"
            variant="outline"
            size="sm"
            className="mx-2"
            onClick={() => setShowModal(true)}
          />
        </div>

        <div className="overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
          {INFLUENCERS.map((influencer, index) => (
            <div
              key={index}
              className="flex border border-neutral-800 rounded-lg p-4 mb-3 items-center gap-4 hover:bg-neutral-800/30 transition-colors cursor-pointer group"
            >
              <div className="rounded-full w-[50px] h-[50px] bg-gradient-to-br from-emerald-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-glow">
                {influencer.name.charAt(0)}
              </div>
              <div className="w-full">
                <div className="flex justify-between items-center flex-wrap gap-1">
                  <p className="font-semibold text-base md:text-lg text-white group-hover:text-emerald-400 transition-colors">
                    {influencer.name}
                  </p>
                  <div className="flex gap-1 flex-wrap justify-end max-w-[60%]">
                    {influencer.categories.slice(0, 2).map((category, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-neutral-800/80 text-emerald-400 px-2 py-0.5 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                    {influencer.categories.length > 2 && (
                      <span className="text-xs bg-neutral-800/80 text-neutral-500 px-2 py-0.5 rounded-full">
                        +{influencer.categories.length - 2}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-neutral-500 truncate max-w-full">
                  {influencer.address}
                </p>
                <p className="text-xs text-neutral-600">
                  Joined: {influencer.joinedAt}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button
          title="View All Influencers"
          variant="outline"
          size="lg"
          className="mt-4"
        />

        {showModal && (
          <div className="fixed inset-0 bg-black opacity-100 flex items-center justify-center z-50">
            <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md shadow-lg relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-3 text-white hover:text-emerald-400 text-xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold text-white mb-4">
                Register as Influencer
              </h2>
              <form className="flex flex-col gap-3">
                <input
                  placeholder="Name"
                  className="bg-neutral-800 text-white p-2 rounded"
                />
                <input
                  placeholder="Wallet Address"
                  className="bg-neutral-800 text-white p-2 rounded"
                />
                <input
                  placeholder="Categories (comma-separated)"
                  className="bg-neutral-800 text-white p-2 rounded"
                />
                <Button title="Submit" variant="outline" />
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
