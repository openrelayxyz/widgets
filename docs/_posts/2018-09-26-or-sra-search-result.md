---
layout: widget
title:  "SRA Search Result"
date:   2018-09-26 09:30:00 -0500
categories: widgets
package: sra-search-result
code:
  html: |

    <or-sra sra="#SRA_ENDPOINT#" feeRecipient="#FEE_RECIPIENT_ADDRESS#">
        <div>
          Maker Asset: <or-token-select></or-token-select>
        </div>
        <div>
          <or-sra-search-result></or-sra-search-result>
        </div>
        <div>
          Selected Items:
          <ul id="search-result-selected"></ul>
        </div>
    </or-sra>
  js: |

    let resultElement = demoDoc.querySelector("or-sra-search-result");
    let tokenSelect = demoDoc.querySelector("or-token-select");
    let results = demoDoc.querySelector("#search-result-selected")

    // Search selected token
    tokenSelect.addEventListener("change", function(e) {
      if(e.detail.token) {
        resultElement.makerAssetAddress = e.detail.token.address;
      }
    })

    // Display results
    resultElement.addEventListener("change", function(e) {
      results.innerHTML = "";
      for(let item of e.detail.value) {
        let el = document.createElement("li");
        el.innerHTML = item.metaData.hash;
        results.appendChild(el);
      }
    });
  npm:
    "@openrelay/sra-search-result"
---

The `<or-sra-search-result>` widget allows application developers to search a
standard relayer API and display the orders. The search terms are defined as
attributes of the `<or-sra-search-result>` element, so additional code is
needed to enable the user to specify search terms. In the example above, we
have connected an `<or-token-select>` element to the `makerAssetAddress`
attribute, so a user can search for results by `makerAssetAddress`.

The `<or-sra-search-result>` also allows the user to select multiple results,
which are exposed as `el.value`. In the above example, we put the hash of
selected orders into a list to show interaction with selected values.

#### API

##### HTML Attributes

* `makerAssetProxyId` &mdash; Search the standard relayer API on the proxyID portion of the makerAssetData property of orders.
* `takerAssetProxyId` &mdash; Search the standard relayer API on the proxyID portion of the takerAssetData property of orders.
* `makerAssetAddress` &mdash; Search the standard relayer API on the address portion of the makerAssetData property of orders.
* `takerAssetAddress` &mdash; Search the standard relayer API on the address portion of the takerAssetData property of orders.
* `exchangeAddress` &mdash; Search the standard relayer API on the `exchangeAddress` property of orders.
* `senderAddress` &mdash; Search the standard relayer API on the `senderAddress` property of orders.
* `makerAssetData` &mdash; Search the standard relayer API on the `makerAssetData` property of orders.
* `takerAssetData` &mdash; Search the standard relayer API on the `takerAssetData` property of orders.
* `traderAssetData` &mdash; Search the standard relayer API for orders where either the `makerAssetData` or `takerAssetData` property matches this value.
* `makerAddress` &mdash; Search the standard relayer API on the `makerAddress` property of orders.
* `takerAddress` &mdash; Search the standard relayer API on the `takerAddress` property of orders.
* `traderAddress` &mdash; Search the standard relayer API for orders where either the `makerAddress` or `takerAddress` property matches this value.
* `feeRecipientAddress` &mdash; Search the standard relayer API on the `feeRecipientAddress` property of orders.

##### JavaScript Attributes

* `value` - A list of orders selected by the user.

##### Events

###### Outgoing Events

* `change` &mdash; Fired when a user selects or deselects an order. `e.detail`
  has the following attributes:
  * `value`: The `value` of the element after the change was made.
  * `item`: The order that was selected or deselected.
  * `selected`: The value of `item.selected` after the change.
