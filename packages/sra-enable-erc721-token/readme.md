---
layout: widget
title:  "SRA Enable Token"
date:   2018-09-26 08:50:00 -0500
categories: widgets
package: sra-enable-token
code:
  html: |

    <or-sra sra="#SRA_ENDPOINT#" feeRecipient="#FEE_RECIPIENT_ADDRESS#">
      MBGN Trading: <or-sra-enable-token token="0xdde19c145c1ee51b48f7a28e8df125da0cc440be0"></or-sra-enable-token>
    </or-sra>
  npm:
    "@openrelay/sra-enable-token"
---


The `<or-sra-enable-token>` element provides a button to enable or disable
trading of a given ERC20 token. By default, it will enable trading on the
exchange indicated by the ancestor `<or-sra>` tag, but it can be configured to
set allowances for other Ethereum addresses.

The `<or-sra-enable-token>` must fall under an `<or-sra>` tag.

#### API

##### HTML Attributes


* `token` *(required)* &mdash; The ERC20 token to enable trading on.
* `enabled` *[default=true]* &mdash; If false, the button is disabled.
* `quantity` *[default=unlimited]* &mdash; The amount of the token (in base units) to enable for trading.
* `operatorAddress` *[default=0x asset proxy]* &mdash; The address being granted an allowance.
