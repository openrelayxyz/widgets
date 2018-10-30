---
layout: widget
title:  "SRA Order Fill"
date:   2018-09-26 09:30:00 -0500
categories: widgets
package: sra-order-fill
code:
  html: |

    <or-sra sra="#SRA_ENDPOINT#" feeRecipient="#FEE_RECIPIENT_ADDRESS#">
        <or-sra-order-fill orderHash="#ORDER_HASH#"></or-sra-order-fill>
    </or-sra>
  npm:
    "@openrelay/sra-order-fill"
settings:
  ORDER_HASH: "0x0f28e5512f37bb4b4efec4bb2a2eb4a546ca1f16b411f8b2652cb09b6b25ac68"
---

The `<or-sra-order-fill>` widget allows users to fill a specific 0x order. The
order hash is provided to the widget, and the user is given information about
the order and the inputs necessary to fill the order.

Under the hood, the `<or-sra-order-fill>` widget is a light wrapper around the
[`<or-sra-signed-order>`](./or-sra-signed-order.html) widget, which populates
it after retrieving the order from the relayer based on the hash, then provides
inputs for filling the order.

#### API

##### HTML Attributes

* `orderHash` &mdash; The 0x order to be filled. The full order must be
  available from the relayer set in the `<or-sra>`

##### Events

###### Outgoing Events

* `web3-transaction` &mdash; Fired when the element submits a transaction to
  the blockhain.
* `web3-tx-confirm` &mdash; Fired when a transaction submitted by this element is confirmed by the
  blockchain.
