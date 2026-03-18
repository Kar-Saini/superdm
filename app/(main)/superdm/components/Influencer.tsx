import useAllInfluencers from "@/app/hooks/useAllInfluencers";
import { ProgramAccount } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export type Influencer = ProgramAccount<{
  name: string;
  categories: string;
  publicKey: PublicKey;
  minPrice?: number;
}>;

const Influencers = ({
  selectedInfluencer,
  setSelectedInfluencer,
}: {
  selectedInfluencer: Influencer | null;
  setSelectedInfluencer: (influencer: Influencer | null) => void;
}) => {
  const allInfluencers = useAllInfluencers();
  const wallet = useWallet();
  const isSelected = (influencer: Influencer) =>
    selectedInfluencer?.account.publicKey.toString() ===
    influencer.account.publicKey.toString();

  return (
    <div
      className="hidden md:flex flex-col gap-4 border border-neutral-800
        rounded-2xl p-6 bg-gradient-to-b from-neutral-900/70 to-black/70 shadow-lg"
    >
      <h2 className="text-2xl font-extrabold text-emerald-400">Influencers</h2>

      <div className="max-h-[500px] overflow-y-auto pr-2">
        {!allInfluencers ? (
          <div className="flex justify-center py-10">
            <div
              className="h-7 w-7 border-4 border-neutral-800
              border-t-emerald-500 rounded-full animate-spin"
            />
          </div>
        ) : allInfluencers.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center py-10">
            No influencers registered yet.
          </p>
        ) : (
          allInfluencers
            .filter(
              (i) =>
                i.account.publicKey.toString() !== wallet.publicKey?.toString(),
            )
            .map((influencer) => (
              <div
                key={influencer.publicKey.toString()}
                onClick={() => {
                  if (isSelected(influencer)) setSelectedInfluencer(null);
                  else setSelectedInfluencer(influencer);
                }}
                className={`
                border rounded-xl p-4 mb-3 flex gap-3 items-center
                cursor-pointer transition-all duration-150
                ${
                  isSelected(influencer)
                    ? "border-emerald-500 bg-emerald-950/40"
                    : "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/30"
                }
              `}
              >
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0
                bg-gradient-to-br from-emerald-400 to-blue-600
                flex items-center justify-center
                text-white text-base font-bold shadow"
                >
                  {influencer.account.name[0].toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex  gap-2 mb-0.5 flex-col">
                    <p className="text-white font-semibold text-sm truncate">
                      {influencer.account.name}
                    </p>
                    <p className="text-xs text-neutral-600">
                      {influencer.account.publicKey.toString()}
                    </p>
                  </div>
                </div>

                {isSelected(influencer) && (
                  <div
                    className="w-2 h-2 rounded-full bg-emerald-400
                  flex-shrink-0"
                  />
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Influencers;
