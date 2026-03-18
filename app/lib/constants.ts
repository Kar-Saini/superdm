import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

import idl from "../contract/target/idl/contract.json";

export const PROGRAM_ID = new PublicKey(idl.address);
export const connection = new Connection(clusterApiUrl("devnet"));
