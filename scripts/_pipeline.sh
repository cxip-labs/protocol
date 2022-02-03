#!/bin/sh

## we have to have this here in order to allow ganache to load first
# truffle compile --all
## everything else can start after
node pipeline/0_fund.js
node pipeline/1_deploy_factory.js
node pipeline/2_deploy_registry.js
node pipeline/3_deploy_provenance_proxy.js
node pipeline/4_deploy_asset_proxy.js
node pipeline/5_deploy_royalties_proxy.js
node pipeline/6_deploy_fake_royalties.js
node pipeline/7_deploy_provenance.js
node pipeline/8_deploy_asset.js
node pipeline/9_deploy_royalties.js
node pipeline/10_deploy_identity.js
node pipeline/11_deploy_collection.js
node pipeline/12_register.js
node pipeline/13_check_registry.js
node pipeline/14_fund_wallet.js
node pipeline/15_create_identity.js
node pipeline/16_check_identity.js
node pipeline/22_deploy_daniel.js
node pipeline/23_deploy_daniel_proxy.js
node pipeline/24_register_daniel.js
node pipeline/13_check_registry.js
node pipeline/25_create_daniel_erc721_collection.js
node pipeline/26_mint_daniel_erc721_collection.js
node pipeline/27_check_daniel_token.js
# node pipeline/17_create_erc721_collection.js
# node pipeline/18_check_erc721_collection.js
# node pipeline/19_create_erc721_token.js
# node pipeline/20_check_erc721_token.js
# node pipeline/21_get_bytecodes.js

exit