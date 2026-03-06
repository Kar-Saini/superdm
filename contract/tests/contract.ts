import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
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
import { use } from "chai";

describe("contract", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.contract as Program<Contract>;
  const connection = new Connection("http://127.0.0.1:8899");
  it("init influencer profile", async () => {
    const user = Keypair.fromSecretKey(
      new Uint8Array([
        184, 81, 102, 20, 226, 103, 173, 173, 201, 45, 223, 207, 145, 26, 194,
        115, 101, 76, 137, 23, 61, 233, 128, 143, 181, 122, 169, 58, 178, 118,
        47, 194, 242, 32, 37, 40, 130, 239, 21, 38, 158, 154, 230, 235, 41, 50,
        65, 21, 188, 36, 255, 196, 97, 91, 239, 215, 195, 222, 135, 177, 48,
        206, 108, 194,
      ]),
    );
    const influencer = Keypair.fromSecretKey(
      new Uint8Array([
        74, 79, 74, 64, 55, 241, 163, 250, 139, 8, 104, 37, 201, 133, 110, 103,
        223, 130, 93, 12, 184, 239, 178, 186, 171, 216, 200, 64, 150, 89, 239,
        62, 18, 24, 66, 80, 174, 19, 180, 216, 51, 170, 74, 187, 255, 154, 41,
        155, 157, 210, 8, 186, 43, 95, 48, 153, 121, 175, 32, 76, 175, 8, 167,
        215,
      ]),
    );
    console.log(user.publicKey.toBase58());
    console.log(influencer.publicKey.toBase58());
    //HJA6M8dcxDz8bJruNEoLAq5cuVHXDAPTHHuigJWEtRjw
    //2Ddo1w7u72EuV4oV7HHRkRNU7RLSwDrEcp1cUKGhvL9t
    const balI = await connection.getBalance(user.publicKey);
    const infI = await connection.getBalance(influencer.publicKey);

    console.log(balI);
    console.log(infI);

    const inf1 = await program.methods
      .initInfluencerProfile("Kartik", "Web3")
      .accounts({
        influencer: influencer.publicKey,
      })
      .signers([influencer])
      .rpc();
    console.log(inf1);

    const userProfile = await program.methods
      .initUserProfile()
      .accounts({
        user: user.publicKey,
      })
      .signers([user])
      .rpc();
    console.log(userProfile);

    const [userProfilePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_profile"), user.publicKey.toBuffer()],
      program.programId,
    );
    const userProfileAccount = await program.account.userProfile.fetch(
      userProfilePda,
    );

    const dm = await program.methods
      .initDm(new BN(2), "Hello", userProfileAccount.dmCount)
      .accounts({
        influencer: influencer.publicKey,
        sender: user.publicKey,
      })
      .signers([user])
      .rpc();

    console.log(dm);
  });
});
