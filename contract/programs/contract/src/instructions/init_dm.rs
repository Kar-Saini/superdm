use anchor_lang::prelude::*;
use crate::state::{DM, InfluencerProfile, UserInfluencerInbox};

#[derive(Accounts)]
pub struct InitDm<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
     #[account(mut)]
    pub influencer: SystemAccount<'info>,
    #[account(
        mut, 
        seeds = [b"inbox", user.key().as_ref(), influencer.key().as_ref()], 
        bump
    )]
    pub user_influencer_inbox : Account<'info, UserInfluencerInbox>,
    #[account(
        init, 
        payer = user, 
        space = 8 + DM::INIT_SPACE, 
        seeds = [b"dm", user.key().as_ref(), influencer.key().as_ref(), &user_influencer_inbox.dm_count.to_le_bytes()], 
        bump
    )]
    pub dm: Account<'info, DM>, 
    #[account(
        seeds = [b"influencer", influencer.key().as_ref()],
        bump
    )]
    pub influencer_profile: Account<'info, InfluencerProfile>,
    pub system_program:Program<'info, System>
}
