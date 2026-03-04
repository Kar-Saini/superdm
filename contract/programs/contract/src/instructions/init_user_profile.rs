use anchor_lang::prelude::*;
use crate::state::UserProfile;
#[derive(Accounts)]
pub struct InitUserProfile<'info> {
    #[account(mut)]
    pub user: Signer<'info>, 
    #[account(
        init, 
        payer = user, 
        space = 8 + UserProfile::INIT_SPACE, 
        seeds = [b"user_profile", user.key().as_ref()], 
        bump
    )]
    pub user_profile : Account<'info, UserProfile>, 
    pub system_program: Program<'info, System>
}
