import { PublicKey } from "@solana/web3.js";
import { connection, PROGRAM_ID } from "./constants";

export default async function getInfluencerProfile(pubkey: PublicKey) {
  const [influencerPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("influencer"), pubkey.toBuffer()],
    PROGRAM_ID,
  );
  const influencerPdaAccount = await connection.getAccountInfo(influencerPda);
  return influencerPdaAccount;
}
