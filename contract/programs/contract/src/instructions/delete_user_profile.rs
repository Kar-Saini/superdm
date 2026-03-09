use anchor_lang::prelude::*;
use crate::state::UserProfile;

#[derive(Accounts)]
pub struct DeleteUserProfile<'info> {
    #[account(mut)]
    pub user : Signer<'info>, 
    #[account(
        mut, 
        close = user, 
        seeds = [b"user_profile", user.key().as_ref()], 
        bump
    )]
    pub user_profile:Account<'info, UserProfile>, 
    pub system_program:Program<'info, System>
}
