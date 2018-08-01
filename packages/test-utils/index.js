//
import * as ProviderEngine from 'web3-provider-engine';
import * as CacheSubprovider from 'web3-provider-engine/subproviders/cache';
import * as FixtureSubprovider from 'web3-provider-engine/subproviders/fixture';
import * as FilterSubprovider from 'web3-provider-engine/subproviders/filters';
import * as HookedWalletSubprovider from 'web3-provider-engine/subproviders/hooked-wallet';
import * as NonceSubprovider from 'web3-provider-engine/subproviders/nonce-tracker';
import * as RpcSubprovider from 'web3-provider-engine/subproviders/rpc';
import Web3 from 'web3';


export function getFakeWeb3(coreWallet) {

  var engine = new ProviderEngine()
  var web3 = new Web3(engine)

  // static results
  engine.addProvider(new FixtureSubprovider({
    web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
    net_listening: true,
    eth_hashrate: '0x00',
    eth_mining: false,
    eth_syncing: true,
  }))

  // cache layer
  engine.addProvider(new CacheSubprovider())

  // filters
  engine.addProvider(new FilterSubprovider())

  // pending nonce
  engine.addProvider(new NonceSubprovider())


  // id mgmt
  if(!coreWallet) {
    engine.addProvider(new HookedWalletSubprovider({
      getAccounts: function(cb){ cb(null, ["0xf00df00df00df00df00df00df00df00df00df00d"]) },
      approveTransaction: function(cb){ cb("not implemented") },
      signTransaction: function(cb){ cb("not implemented") },
    }))
  }

  // data source
  engine.addProvider(new RpcSubprovider({
    rpcUrl: 'http://localhost:17545/',
  }))

  // network connectivity error
  engine.on('error', function(err){
    // report connectivity errors
    console.error(err.stack)
  })

  // start polling for blocks
  engine.start()
  return web3
}
