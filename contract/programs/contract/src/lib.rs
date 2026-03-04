declare_id!("72NEPQQkE1kYQ1A2fMUXxkcCbya7vf7nxVvJdpBrJeCC");
use anchor_lang::prelude::*;
use instructions::*;

pub mod error;
pub mod instructions;
pub mod state;

#[program]
pub mod contract {

    use super::*;
    use anchor_lang::prelude::program::invoke;

    pub fn init_influencer_profile(
        ctx: Context<InitInfluencerProfile>,
        name: String,
        categories: String,
    ) -> Result<()> {
        let influencer_profile = &mut ctx.accounts.influencer_profile;
        influencer_profile.name = name;
        influencer_profile.categories = categories;

        influencer_profile.public_key = *ctx.accounts.influencer.key;
        Ok(())
    }

    pub fn init_user_profile(ctx: Context<InitUserProfile>) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.dm_count = 0;
        user_profile.owner = user_profile.key();
        Ok(())
    }

    pub fn init_dm(
        ctx: Context<InitDm>,
        sol_attached: u64,
        message: String,
        _user_profile_dm_count: u64,
    ) -> Result<()> {
        let dm = &mut ctx.accounts.dm;
        let sender = &mut ctx.accounts.sender;
        let influencer_profile = &ctx.accounts.influencer_profile;
        let system_program = &ctx.accounts.system_program;
        let user_profile = &mut ctx.accounts.user_profile;

        dm.message = message;
        dm.sender_pubkey = sender.key();
        dm.sol_attached = sol_attached;

        let ix =
            system_instruction::transfer(&sender.key(), &influencer_profile.key(), sol_attached);

        invoke(
            &ix,
            &[
                sender.clone().to_account_info(),
                influencer_profile.clone().to_account_info(),
                system_program.clone().to_account_info(),
            ],
        )?;

        user_profile.dm_count += 1;

        Ok(())
    }
}
