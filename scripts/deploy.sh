#!/bin/sh

## we have to have this here in order to allow ganache to load first
# truffle compile --all
## everything else can start after
node pipeline/0_fund.js
node pipeline/1_pipeline_factory.js
node pipeline/2_pipeline_registry.js
node pipeline/3_pipeline_provenance_proxy.js
node pipeline/4_pipeline_asset_proxy.js
node pipeline/5_pipeline_royalties_proxy.js
node pipeline/6_pipeline_fake_royalties.js
node pipeline/7_pipeline_provenance.js
node pipeline/8_pipeline_asset.js
node pipeline/9_pipeline_royalties.js
node pipeline/10_pipeline_identity.js
node pipeline/11_pipeline_collection.js
node pipeline/12_register.js
node pipeline/13_check_registry.js
node pipeline/14_fund_wallet.js
node pipeline/15_create_identity.js
node pipeline/16_check_identity.js
node pipeline/17_create_erc721_collection.js
node pipeline/18_check_erc721_collection.js
node pipeline/19_create_erc721_token.js
node pipeline/20_check_erc721_token.js
node pipeline/21_get_bytecodes.js

exit