//
import * as ProviderEngine from 'web3-provider-engine';
import * as HookedWalletSubprovider from 'web3-provider-engine/subproviders/hooked-wallet';
import * as FixtureSubprovider from 'web3-provider-engine/subproviders/fixture';


export function getFakeWeb3() {
  var engine = new ProviderEngine()
  var web3 = new window.Web3(engine)

  // static results
  engine.addProvider(new FixtureSubprovider({
    web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
    net_listening: true,
    eth_hashrate: '0x00',
    eth_mining: false,
    eth_syncing: true,
  }))

  // id mgmt
  engine.addProvider(new HookedWalletSubprovider({
    getAccounts: function(cb){ [cb(null, ["0xf00df00df00df00df00df00df00df00df00df00d"])] },
    approveTransaction: function(cb){ cb("not implemented, null") },
    signTransaction: function(cb){ "not implemented", "null" },
  }))

  // network connectivity error
  engine.on('error', function(err){
    // report connectivity errors
    console.error(err.stack)
  })

  // start polling for blocks
  engine.start()

  console.log(web3.eth.getAccounts());

  return web3;
}
