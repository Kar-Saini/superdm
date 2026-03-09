use anchor_lang::prelude::*;
use crate::state::{DM, InfluencerProfile, UserProfile};

#[derive(Accounts)]
pub struct InitDm<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,
    #[account(
        mut, 
        seeds = [b"user_profile", sender.key().as_ref()], 
        bump
    )]
    pub user_profile : Account<'info, UserProfile>,
    #[account(
        init, 
        payer = sender, 
        space = 8 + DM::INIT_SPACE, 
        seeds = [b"dm", sender.key().as_ref(), &user_profile.dm_count.to_le_bytes()], 
        bump
    )]
    pub dm: Account<'info, DM>, 
    #[account(mut)]
    pub influencer: SystemAccount<'info>,
    #[account(
        seeds = [b"influencer", influencer.key().as_ref()],
        bump
    )]
    pub influencer_profile: Account<'info, InfluencerProfile>,
    pub system_program:Program<'info, System>
}
