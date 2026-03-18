/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/contract.json`.
 */
export type Contract = {
  "address": "72NEPQQkE1kYQ1A2fMUXxkcCbya7vf7nxVvJdpBrJeCC",
  "metadata": {
    "name": "contract",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initDm",
      "discriminator": [
        176,
        40,
        227,
        232,
        200,
        73,
        10,
        74
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "influencer",
          "writable": true
        },
        {
          "name": "userInfluencerInbox",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  98,
                  111,
                  120
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "influencer"
              }
            ]
          }
        },
        {
          "name": "dm",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "influencer"
              },
              {
                "kind": "account",
                "path": "user_influencer_inbox.dm_count",
                "account": "userInfluencerInbox"
              }
            ]
          }
        },
        {
          "name": "influencerProfile",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  102,
                  108,
                  117,
                  101,
                  110,
                  99,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "influencer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "solAttached",
          "type": "u64"
        },
        {
          "name": "message",
          "type": "string"
        }
      ]
    },
    {
      "name": "initInfluencerProfile",
      "discriminator": [
        241,
        203,
        63,
        33,
        228,
        135,
        253,
        171
      ],
      "accounts": [
        {
          "name": "influencer",
          "writable": true,
          "signer": true
        },
        {
          "name": "influencerProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  102,
                  108,
                  117,
                  101,
                  110,
                  99,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "influencer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "categories",
          "type": "string"
        }
      ]
    },
    {
      "name": "initUserInflucencerInbox",
      "discriminator": [
        250,
        228,
        207,
        56,
        117,
        63,
        224,
        177
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "influencerProfile"
        },
        {
          "name": "userInfluencerInbox",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  98,
                  111,
                  120
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "influencer_profile.public_key",
                "account": "influencerProfile"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "dm",
      "discriminator": [
        135,
        247,
        32,
        127,
        159,
        140,
        233,
        64
      ]
    },
    {
      "name": "influencerProfile",
      "discriminator": [
        15,
        28,
        67,
        52,
        237,
        147,
        27,
        135
      ]
    },
    {
      "name": "userInfluencerInbox",
      "discriminator": [
        41,
        55,
        233,
        200,
        36,
        97,
        187,
        244
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidInfluencer",
      "msg": "Invalid influencer profile"
    }
  ],
  "types": [
    {
      "name": "dm",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "senderPubkey",
            "type": "pubkey"
          },
          {
            "name": "influencerPubkey",
            "type": "pubkey"
          },
          {
            "name": "solAttached",
            "type": "u64"
          },
          {
            "name": "message",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "influencerProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "categories",
            "type": "string"
          },
          {
            "name": "publicKey",
            "type": "pubkey"
          },
          {
            "name": "totalDmCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userInfluencerInbox",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "influencer",
            "type": "pubkey"
          },
          {
            "name": "dmCount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
