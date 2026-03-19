# 📨 SuperDM

> A decentralized direct messaging protocol on Solana — enabling users to send on-chain messages to influencers via a funded inbox.

---

## 🧠 What is SuperDM?

SuperDM is a Solana program built with Anchor that lets users send direct messages to influencers on-chain. Users fund their personal inbox PDA and use those funds to send messages — creating a spam-resistant, pay-to-message communication layer on the blockchain.

No middlemen. No centralized servers. Just wallets, PDAs, and messages.

---

## 🏗️ Program Architecture

```
SuperDM
├── User Account         → stores user profile info
├── Influencer Account   → stores influencer profile & inbox config
├── UserInflInbox PDA    → unique inbox per (user, influencer) pair
└── DM PDA               → individual on-chain message account
```

### Accounts

| Account               | Description                                                           |
| --------------------- | --------------------------------------------------------------------- |
| `User`                | Represents a registered user in the protocol                          |
| `Influencer`          | Represents an influencer with a configurable inbox                    |
| `UserInfluencerInbox` | PDA derived from user + influencer — tracks message history & balance |
| `DM`                  | Individual message account storing content and metadata               |

---

## 🚀 Getting Started

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor CLI](https://www.anchor-lang.com/docs/installation)
- Node.js & Yarn

### Installation

```bash
git clone https://github.com/kar-saini/superdm
cd superdm
yarn install
```

### Build & Deploy (Devnet)

```bash
anchor build
anchor deploy --provider.cluster devnet
```

## 🛠️ Tech Stack

| Layer          | Technology            |
| -------------- | --------------------- |
| Smart Contract | Anchor (Rust)         |
| Blockchain     | Solana                |
| RPC            | Helius                |
| Frontend       | Next.js               |
| Wallet         | Solana Wallet Adapter |
| Deployment     | Vercel                |

---

## 📁 Project Structure

```
superdm/
├── programs/
│   └── superdm/
│       └── src/
│           ├── lib.rs
│           ├── instructions/
│           └── state/
|
├── app/               ← Next.js frontend
│   ├── components/
│   └── pages/
└── Anchor.toml
```

---

## 🔮 Roadmap (Future Upgrades)

- [ ] Pay-to-DM (influencer sets price per message)
- [ ] NFT-gated inbox (only holders can DM)
- [ ] On-chain replies & message threading
- [ ] Encrypted messages (X25519)
- [ ] Anchor events for off-chain indexing
- [ ] Tip/boost a message

---

## 📄 License

MIT

---

Built on Solana ⚡
