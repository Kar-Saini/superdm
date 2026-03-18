use anchor_lang::prelude::*;

use crate::state::{InfluencerProfile, UserInfluencerInbox};

#[derive(Accounts)]
pub struct InitUserInfluencerInbox<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    pub influencer_profile: Account<'info, InfluencerProfile>,

     #[account(
        init_if_needed, 
        space = 8 + UserInfluencerInbox::INIT_SPACE,
        payer = user,
        seeds = [b"inbox", user.key().as_ref(), influencer_profile.public_key.key().as_ref()], 
        bump
    )]
    pub user_influencer_inbox : Account<'info, UserInfluencerInbox>,
    pub system_program: Program<'info, System>
}
