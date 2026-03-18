declare_id!("72NEPQQkE1kYQ1A2fMUXxkcCbya7vf7nxVvJdpBrJeCC");
use anchor_lang::prelude::{program::invoke, *};
use instructions::*;

pub mod error;
pub mod instructions;
pub mod state;

#[program]
pub mod contract {

    use super::*;

    pub fn init_influencer_profile(
        ctx: Context<InitInfluencerProfile>,
        name: String,
        categories: String,
    ) -> Result<()> {
        let influencer_profile = &mut ctx.accounts.influencer_profile;

        influencer_profile.name = name;
        influencer_profile.categories = categories;
        influencer_profile.public_key = *ctx.accounts.influencer.key;
        influencer_profile.total_dm_count = 0;

        Ok(())
    }

    pub fn init_dm(ctx: Context<InitDm>, sol_attached: u64, message: String) -> Result<()> {
        let dm = &mut ctx.accounts.dm;
        let user = &mut ctx.accounts.user;
        let influencer = &mut ctx.accounts.influencer;
        let influencer_profile = &mut ctx.accounts.influencer_profile;
        let system_program = &ctx.accounts.system_program;
        let user_influencer_inbox = &mut ctx.accounts.user_influencer_inbox;

        dm.message = message;
        dm.sender_pubkey = user.key();
        dm.sol_attached = sol_attached;
        dm.influencer_pubkey = *influencer.key;

        let ix = system_instruction::transfer(&user.key(), &influencer.key(), sol_attached);

        invoke(
            &ix,
            &[
                user.to_account_info(),
                influencer.to_account_info(),
                system_program.clone().to_account_info(),
            ],
        )?;

        user_influencer_inbox.dm_count = user_influencer_inbox.dm_count.saturating_add(1);
        influencer_profile.total_dm_count = influencer_profile.total_dm_count.saturating_add(1);

        Ok(())
    }

    pub fn init_user_influcencer_inbox(ctx: Context<InitUserInfluencerInbox>) -> Result<()> {
        ctx.accounts.user_influencer_inbox.dm_count = 0;
        Ok(())
    }
}
