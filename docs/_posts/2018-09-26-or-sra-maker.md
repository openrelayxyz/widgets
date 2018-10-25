---
layout: widget
title:  "SRA Order Maker"
date:   2018-09-26 08:50:00 -0500
categories: widgets
package: sra-maker-element
code:
  html: |

    <or-sra sra="#SRA_ENDPOINT#" feeRecipient="#FEE_RECIPIENT_ADDRESS#">
        <or-sra-maker></or-sra-maker>
        <span slot="net">42</span>
        <span slot="net">1</span>
        <span slot="netunsupported">At this time, this widget is only supported on Kovan and mainnet</span>
    </or-sra>
  npm:
    "@openrelay/sra-maker-element"
---

The maker element provides the user with all of the necessary inputs to make an
order and submit it to a relayer. The relayer it is submitted to may be changed
from the ancestor `<or-sra>` element.


#### API


##### JavaScript Properties

* `value` &mdash; The percentage of the to be paid by the taker, as an integer
  between 0 and 100.

##### Events

###### Outgoing Events

* `change` &mdash; Fired when the user changes the token. The `event.details` object includes:
  * feeRecipient: The fee recipient address to be used for the order
  * makerFee: A `BigNumber` indicating the number of base units of ZRX to be paid by the maker.
  * takerFee: A `BigNumber` indicating the number of base units of ZRX to be paid by the taker.
