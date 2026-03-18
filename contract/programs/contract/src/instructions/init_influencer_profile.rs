use anchor_lang::prelude::*;

use crate::state::InfluencerProfile;

#[derive(Accounts)]
pub struct InitInfluencerProfile<'info> {
    #[account(mut)]
    pub influencer: Signer<'info>,
    #[account(
        init, 
        payer = influencer, 
        space = 8 + InfluencerProfile::INIT_SPACE, 
        seeds = [b"influencer", influencer.key().as_ref()], 
        bump
    )]
    pub influencer_profile:Account<'info, InfluencerProfile>, 
    pub system_program:Program<'info, System>
}
