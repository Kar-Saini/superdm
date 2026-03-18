use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct DM {
    pub sender_pubkey: Pubkey,
    pub sol_attached: u64,
    #[max_len(200)]
    pub message: String,
    pub influencer_pubkey: Pubkey,
}
