import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contract } from "../target/types/contract";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { publicEncrypt } from "node:crypto";
import { profile } from "node:console";

describe("contract", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.contract as Program<Contract>;
  const connection = new Connection(clusterApiUrl("testnet"));
  it("init influencer profile", async () => {
    const keypair = new Keypair();
    const res = await connection.requestAirdrop(
      keypair.publicKey,
      1 * LAMPORTS_PER_SOL,
    );
    const [userPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("influencer"), keypair.publicKey.toBuffer()],
      program.programId,
    );
    const res2 = await program.methods
      .initInfluencerProfile("Kartik", "Web3")
      .accounts({
        user: keypair.publicKey,
        influencerProfile: userPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log(res);
    console.log(res2);
  });
});
