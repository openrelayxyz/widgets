---
layout: widget
title:  "Token Select"
date:   2018-09-26 08:20:00 -0500
categories: widgets
package: token-select-element
code:
  html: |

    <or-web3>
      <or-token-select id="token-select"></or-token-select>
      <ul>
        <li>Symbol: <span id="token-symbol"></span>
        <li>Decimals: <span id="token-decimals"></span>
        <li>Address: <span id="token-address"></span>
      </ul>
    </or-web3>

  css: |

    @import url("https://fonts.googleapis.com/css?family=Muli:200,400,600");

    or-web3 {
      font-family: Muli, "avenir next", helvetica, sans-serif;
    }

  js: |

    let tokenSelect = demoDoc.querySelector("#token-select");

    tokenSelect.addEventListener("change", function() {
      demoDoc.querySelector("#token-symbol").innerText = tokenSelect.value.symbol;
      demoDoc.querySelector("#token-decimals").innerText = tokenSelect.value.decimals;
      demoDoc.querySelector("#token-address").innerText = tokenSelect.value.address;
      }
    );

  npm:
    "@openrelay/token-select"
---

The `<or-erc20-balance>` element displays the user's balance of a given ERC20
token.


#### API

##### HTML Attributes

* `tokenListUrl` &mdash; A URL for a JSON document containing a list of tokens.
  The list must provide `symbol`, `decimal`, and `address` for each record. By
  default, it will use the tokens for the connected network based on
  [this list](https://github.com/openrelayxyz/widgets/blob/master/packages/utilities/tokens.json).
* `selectedIndex` &mdash; Pre-select a token from the list based on index. You
  should not rely on indexes to remain the same when the JavaScript library is
  updated.
* `selectedSymbol` &mdash; Pre-select a token based on its symbol.


##### JavaScript Properties

* `value` &mdash; An object containing `symbol`, `decimal`, and `address`
  attributes corresponding to the selected token.

##### Events

###### Outgoing Events

* `change` &mdash; Fired when the user selects a token. The event includes the
  details of the token at `e.detail.token`.
