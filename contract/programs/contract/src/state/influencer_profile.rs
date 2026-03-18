use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct InfluencerProfile {
    #[max_len(20)]
    pub name: String,
    #[max_len(50)]
    pub categories: String,
    pub public_key: Pubkey,
    pub total_dm_count: u64,
}
