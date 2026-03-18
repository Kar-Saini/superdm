"use client";

import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";
import {
  AnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import idl from "../contract_integration/contract.json";
import { useMemo } from "react";
import { Contract } from "../contract_integration/contract";

export default function useProgram() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const program: Program<Contract> = useMemo(() => {
    const provider = new AnchorProvider(connection, wallet as AnchorWallet);
    return new Program(idl as Idl, provider);
  }, [wallet, connection]);
  return program;
}
