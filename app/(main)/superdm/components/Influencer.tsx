import useAllInfluencers from "@/app/hooks/useAllInfluencers";
import { ProgramAccount } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export type Influencer = ProgramAccount<{
  name: string;
  categories: string;
  publicKey: PublicKey;
}>;

const Influencers = ({
  selectedInfluencer,
  setSelectedInfluencer,
}: {
  selectedInfluencer: Influencer | null;
  setSelectedInfluencer: (influencer: Influencer | null) => void;
}) => {
  const allInfluencers = useAllInfluencers();
  console.log(allInfluencers);
  return (
    <div
      className=" hidden md:flex flex-col gap-4 borders border-neutral-800 rounded-2xl p-8 
          bg-linear-to-b from-neutral-900/70 to-black/70 shadow-lg"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-emerald-400">
          Influencers
        </h2>
      </div>

      <div className="max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
        {allInfluencers &&
          allInfluencers.map((influencer, idx) => (
            <div
              key={idx}
              className={`border  rounded-lg p-4 mb-3 flex gap-4  transition cursor-pointer ${
                selectedInfluencer?.publicKey === influencer.publicKey
                  ? "border-blue-500 border-4"
                  : " border-neutral-800 hover:bg-neutral-800/30"
              }`}
              onClick={() => {
                if (selectedInfluencer?.publicKey === influencer.publicKey)
                  setSelectedInfluencer(null);
                else setSelectedInfluencer(influencer);
              }}
            >
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-400 to-blue-600 flex items-center justify-center text-white text-lg font-bold shadow">
                {influencer.account.name}
              </div>

              <div className="flex-1">
                <div className="flex justify-between flex-wrap">
                  <p className="text-white font-semibold">
                    {influencer.account.name}
                  </p>
                </div>
                <p className="text-xs text-neutral-500 truncate">
                  Influencer PDA : {influencer.publicKey.toBase58()}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  Influencer Public Key :{" "}
                  {influencer.account.publicKey.toBase58()}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Influencers;
