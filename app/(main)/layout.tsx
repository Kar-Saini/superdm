"use client";
import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import Appbar from "../_components/Appbar";
import "@solana/wallet-adapter-react-ui/styles.css";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], []);
  return (
    <ConnectionProvider endpoint={clusterApiUrl("devnet")}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Appbar />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default MainLayout;
