#!/bin/sh

## we have to have this here in order to allow ganache to load first
# truffle compile --all
## everything else can start after
node deploy/0_fund.js
node deploy/1_deploy_factory.js
node deploy/2_deploy_registry.js
node deploy/3_deploy_provenance_proxy.js
node deploy/4_deploy_asset_proxy.js
node deploy/5_deploy_royalties_proxy.js
node deploy/6_deploy_fake_royalties.js
node deploy/7_deploy_provenance.js
node deploy/8_deploy_asset.js
node deploy/9_deploy_royalties.js
node deploy/10_deploy_identity.js
node deploy/11_deploy_collection.js
node deploy/12_register.js
node deploy/13_check_registry.js
node deploy/14_fund_wallet.js
node deploy/15_create_identity.js
node deploy/16_check_identity.js
node deploy/17_create_erc721_collection.js
node deploy/18_check_erc721_collection.js
node deploy/19_create_erc721_token.js
node deploy/20_check_erc721_token.js
node deploy/21_get_bytecodes.js

exit