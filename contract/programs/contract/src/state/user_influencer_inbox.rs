use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct UserInfluencerInbox {
    pub user: Pubkey,
    pub influencer: Pubkey,
    pub dm_count: u64,
}
