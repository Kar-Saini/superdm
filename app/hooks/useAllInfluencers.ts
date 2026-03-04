import { useEffect, useState } from "react";
import useProgram from "./useProgram";
import { PublicKey } from "@solana/web3.js";
import { ProgramAccount } from "@anchor-lang/core";

export default function useAllInfluencers() {
  const [allinfluencers, setAllInfluencers] = useState<
    | ProgramAccount<{
        name: string;
        categories: string;
        publicKey: PublicKey;
      }>[]
    | null
  >(null);
  const program = useProgram();
  useEffect(() => {
    async function fetchAllInfluencers() {
      const influencers = await program?.account.influencerProfile.all();
      setAllInfluencers(influencers);
    }
    fetchAllInfluencers();
  }, [program]);

  return allinfluencers;
}
