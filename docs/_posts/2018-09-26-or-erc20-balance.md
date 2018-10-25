---
layout: widget
title:  "ERC20 Balance"
date:   2018-09-26 08:30:00 -0500
categories: widgets
package: erc20-balance
code:
  html: |

    <or-web3>
      Your MBGN Balance is: <b><or-erc20-balance token="0xdde19c145c1ee51b48f7a28e8df125da0cc440be" round="2"></or-erc20-balance></b>
    </or-web3>
  npm:
    "@openrelay/erc20-balance"
---

The `<or-erc20-balance>` element displays the user's balance of a given ERC20
token.


#### API

##### HTML Attributes

* `token` *(required)* &mdash; The token contract to display the balance of.
* `account` *[default=web3 default account]* &mdash; The account to display the balance of.
* `refresh` *[default=true]* &mdash; Whether to refresh the balance on block updates.
* `round` *[default=10]* &mdash; The number of decimal places to display.

##### JavaScript Properties

* `value` &mdash; A `BigNumber` object representing the token balance, adjusted
  based on the number of decimals for the token (not in base units).
* `balancePromise` &mdash; A promise that resolves after this token's balance
  has been retrieved from the blockchain.
