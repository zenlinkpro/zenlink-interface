# How to add a new network support

This is a simple guide how to add a new network support your self.

## Add the chain meta you want to support

We support EVM and Parachain now, `@zenlink-interface/chain` contains all chain meta. You should add the chain meta you want to support in this package, and config it correctly.



## Add the support token in your network.

Add the token list you want to support on your network in `@zenlink-interface/token-lists`


## Add the base feature for your dex

Add the base dex feature of your network.
 - the balance and the pool info query
 - how to submit the transactions

If your network is evm chain, `@zenlink-interface/wagmi` will help you. If your network is parachain, `@zenlink-interface/parachains-impl` has a refer implement about Bifrost


## Add GraphQL Service support on your network.

We have a GraphQL Service as a dependency for the info display. You need add the GraphQL Service about your network. Here is the refer implement on parachain and evm chain 

- [bifrost-kusama-squid](https://github.com/zenlinkpro/bifrost-kusama-squid)

- [zenlink-astar-subsquid](https://github.com/zenlinkpro/zenlink-astar-subsquid)


## Add config to enable your network

You need to add your network to the switch config to enable your network on `@zenlink-interface/compat`.
There is some app, `swap`, `pool`, `analytics`, `referrals` If you want to enable it, You should enable it in the config file. Otherwise they won't display.

## Add the other resource

After you add the support of your network, you need add other resource about your network.
eg.
- token icons
- chain icons