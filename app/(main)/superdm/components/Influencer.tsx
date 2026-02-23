import Button from "@/app/_components/Button";
import { PROGRAM_ID } from "@/app/action/program";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { useState } from "react";
export interface Influencer {
  name: string;
  address: string;
}
const INFLUENCERS: Influencer[] = [
  {
    name: "Harkirat",
    address: "nfjdsnfjdsnfjdsnfjdsnfjds",
  },
  {
    name: "Sarah",
    address: "3j4n5k3j4n5k3j4n5k3j4n5k3j",
  },
  {
    name: "Michael",
    address: "87v6b5nm87v6b5nm87v6b5nm87v",
  },
  {
    name: "Olivia",
    address: "p098o7i6up098o7i6up098o7i6u",
  },
];

const Influencers = ({
  selectedInfluencer,
  setSelectedInfluencer,
}: {
  selectedInfluencer: Influencer | null;
  setSelectedInfluencer: (influencer: Influencer | null) => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  async function handleRegister() {
    if (!publicKey) {
      alert("Connect Wallet");
      return;
    }

    const influencerPda = PublicKey.findProgramAddressSync(
      [Buffer.from("influencer"), publicKey.toBuffer()],
      PROGRAM_ID
    );
    connection
      .getBalance(publicKey!)
      .then((data) => console.log("Blanace " + data));
    const ix = new TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: influencerPda[0],
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: Buffer.from([0]),
    });
    const trxn = new Transaction().add(ix);
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    trxn.recentBlockhash = blockhash;
    trxn.lastValidBlockHeight = lastValidBlockHeight;
    trxn.feePayer = publicKey;
    console.log(trxn);
    const sig = await sendTransaction(trxn, connection);
    console.log(sig);
    const confirmation = await connection.confirmTransaction({
      signature: sig,
      blockhash,
      lastValidBlockHeight,
    });
    console.log(confirmation);
  }

  return (
    <div
      className="flex-1 hidden md:flex flex-col gap-4 borders border-neutral-800 rounded-2xl p-8 
          bg-linear-to-b from-neutral-900/70 to-black/70 shadow-lg"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-emerald-400">
          Influencers
        </h2>
        <Button
          title="Register"
          variant="outline"
          size="sm"
          onClick={handleRegister}
        />
      </div>

      <div className="max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
        {INFLUENCERS.map((i, idx) => (
          <div
            key={idx}
            className={`border  rounded-lg p-4 mb-3 flex gap-4  transition cursor-pointer ${
              selectedInfluencer?.address === i.address
                ? "border-blue-500 border-4"
                : " border-neutral-800 hover:bg-neutral-800/30"
            }`}
            onClick={() => {
              if (selectedInfluencer?.address === i.address)
                setSelectedInfluencer(null);
              else setSelectedInfluencer(i);
            }}
          >
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-400 to-blue-600 flex items-center justify-center text-white text-lg font-bold shadow">
              {i.name[0]}
            </div>

            <div className="flex-1">
              <div className="flex justify-between flex-wrap">
                <p className="text-white font-semibold">{i.name}</p>
              </div>
              <p className="text-xs text-neutral-500 truncate">{i.address}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-xl text-white hover:text-emerald-400"
            >
              ×
            </button>
            <h3 className="text-xl font-bold text-white mb-4">
              Register as Influencer
            </h3>
            <div className="flex flex-col gap-3">
              <input
                className="bg-neutral-800 p-2 rounded text-white"
                placeholder="Name"
              />
              <input
                className="bg-neutral-800 p-2 rounded text-white"
                placeholder="Wallet Address"
              />
              <input
                className="bg-neutral-800 p-2 rounded text-white"
                placeholder="Categories"
              />
              <Button title="Submit" variant="outline" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Influencers;
