use anchor_lang::prelude::*;

declare_id!("72NEPQQkE1kYQ1A2fMUXxkcCbya7vf7nxVvJdpBrJeCC");

#[program]
pub mod contract {
    use anchor_lang::prelude::program::invoke;

    use super::*;

    pub fn init_influencer_profile(
        ctx:Context<InitInfluencerProfile>,
        name : String, 
        categories:String
    )->Result<()>{
        let influencer_profile = &mut ctx.accounts.influencer_profile;
        influencer_profile.pub_key = ctx.accounts.user.key();
        influencer_profile.name = name;
        influencer_profile.categories = categories;
        Ok(())
    }

    pub fn init_DM(
        ctx:Context<InitDM>, 
        message: String, 
        amount:u64

    )->Result<()>{

        let dm = &mut ctx.accounts.dm;
        let owner = &mut ctx.accounts.user;
        let influencer = &mut ctx.accounts.influencer_profile;

        dm.message = message;
        dm.influencer_pubkey = influencer.key();
        dm.owner_pubkey = owner.key();

        let ix = system_instruction::transfer(owner.key, &influencer.pub_key, amount);

        require!(ctx.accounts.influencer_profile.pub_key==ctx.accounts.influencer_wallet.key(),
                CustomError::InvalidInfluencerWallet);

        invoke(
            &ix, 
            &[
            owner.to_account_info(), 
            ctx.accounts.influencer_wallet.to_account_info(), 
            ctx.accounts.system_program.to_account_info()
        ])?;

        Ok(())
        
    }
}

#[account]
#[derive(InitSpace)]
pub struct DM {
    pub owner_pubkey: Pubkey,
    pub influencer_pubkey: Pubkey,
    #[max_len(100)]
    pub message: String,
    pub amount : u64
}

#[derive(Accounts)]
pub struct InitDM<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
     #[account(mut)]
    pub influencer_wallet: UncheckedAccount<'info>,
    #[account(
        init, 
        payer = user, 
        seeds = [b"dm", user.key().as_ref()], 
        bump, 
        space = 8 + DM::INIT_SPACE
    )]
    pub dm : Account<'info, DM>, 
    pub influencer_profile : Account<'info, InfluencerProfile>, 
    pub system_program: Program<'info, System>
}

#[account]
#[derive(InitSpace)]
pub struct InfluencerProfile {
    #[max_len(20)]
    pub name: String,
    #[max_len(40)]
    pub categories: String,
    pub pub_key: Pubkey,
}

#[derive(Accounts)]
pub struct InitInfluencerProfile<'info>{
    #[account(mut)]
    pub user: Signer<'info>, 
    #[account(
        init, 
        space = 8 + InfluencerProfile::INIT_SPACE, 
        payer = user, 
        seeds = [b"infleuncer", user.key().as_ref()], 
        bump
    )]
    pub influencer_profile: Account<'info, InfluencerProfile>, 
    pub system_program : Program<'info, System>
}


#[error_code]
pub enum CustomError{
    #[msg("Invalid influencer wallet")]
    InvalidInfluencerWallet
}