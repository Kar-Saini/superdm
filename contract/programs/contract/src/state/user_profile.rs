use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct UserProfile {
    pub dm_count: u64,
    pub owner: Pubkey,
}
