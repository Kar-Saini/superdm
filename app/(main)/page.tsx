"use client";

import HeroAnimation from "../_components/HeroAnimation";

const page = () => {
  return (
    <div className=" flex flex-col text-neutral-400 h-screen  justify-center pt-10 px-2">
      <div className=" mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-2">
          <div className="space-y-10">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white">
              Connect with your{" "}
              <span className="text-gradient-emerald">favorite creators</span>
            </h1>
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
    </div>
  );
};

export default page;
