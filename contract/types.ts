/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/contract.json`.
 */
export type Contract = {
  address: "72NEPQQkE1kYQ1A2fMUXxkcCbya7vf7nxVvJdpBrJeCC";
  metadata: {
    name: "contract";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "initInfluencerProfile";
      discriminator: [241, 203, 63, 33, 228, 135, 253, 171];
      accounts: [
        {
          name: "influencer";
          writable: true;
          signer: true;
        },
        {
          name: "influencerProfile";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [105, 110, 102, 108, 117, 101, 110, 99, 101, 114];
              },
              {
                kind: "account";
                path: "influencer";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
        {
          name: "categories";
          type: "string";
        },
      ];
    },
  ];
  accounts: [
    {
      name: "influencerProfile";
      discriminator: [15, 28, 67, 52, 237, 147, 27, 135];
    },
  ];
  types: [
    {
      name: "influencerProfile";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "categories";
            type: "string";
          },
          {
            name: "publicKey";
            type: "pubkey";
          },
        ];
      };
    },
  ];
};
