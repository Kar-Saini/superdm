"use client";
import Button from "./_components/Button";
import HeroAnimation from "./_components/HeroAnimation";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-neutral-400 ">
      <section className="py-16 md:py-32 px-4 flex-1">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-2">
            <div className="space-y-10">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white">
                Connect with your{" "}
                <span className="text-gradient-emerald">favorite creators</span>
              </h1>
              <Button title="Connect Wallet" variant="outline" size="lg" />
              <p className="text-xl text-neutral-400 max-w-xl">
                SuperDM powers direct messages with the {`world's`} top
                influencers. Get noticed and build real connections through
                blockchain-powered communication.
              </p>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-lg">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-neutral-900/20 border-t border-neutral-800">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-neutral-400 max-w-lg mx-auto">
              Send messages that stand out, backed by the value you attach to
              them
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Connect Wallet",
                description:
                  "Link your Solana wallet to get started on SuperDM",
                icon: "💼",
              },
              {
                title: "Choose Creator",
                description:
                  "Browse and select from our verified influencer network",
                icon: "👑",
              },
              {
                title: "Send SuperDM",
                description: "Attach SOL to your message to make it stand out",
                icon: "✉️",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 flex flex-col items-center text-center"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-neutral-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        .text-gradient-emerald {
          background: linear-gradient(90deg, #10b981, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </div>
  );
};

export default page;
