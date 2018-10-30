---
layout: widget
title:  "SRA Signed Order"
date:   2018-09-26 09:20:00 -0500
categories: widgets
package: sra-signed-order
code:
  html: |

    <or-sra sra="#SRA_ENDPOINT#" feeRecipient="#FEE_RECIPIENT_ADDRESS#">
      <or-sra-signed-order
        exchangeaddress="0x4f833a24e1f95d70f028921e27040ca56e09ab0b"
        expirationtimeseconds="32503661989"
        feerecipientaddress="0xfaec02c3474b1a1c553eddf3df27946643cc7122"
        makeraddress="0xeeea17b0cef49d206668075991058cc4e79596a2"
        makerassetamount="1000000000000000000"
        makerassetdata="0xf47261b00000000000000000000000000027449bf0887ca3e431d263ffdefb244d95b555"
        makerfee="0"
        salt="0"
        senderaddress="0x0000000000000000000000000000000000000000"
        takeraddress="0x0000000000000000000000000000000000000000"
        takerassetamount="10000000000000000000"
        takerassetdata="0xf47261b0000000000000000000000000dde19c145c1ee51b48f7a28e8df125da0cc440be"
        takerfee="200000000000000000"
        signature="0x1c16a0ceac9af7785db8ff7db0ad7c45439b49425c69820b3166e93b5da554d7287ce5322766ce3309cf4fb9f4b21b639786e0e69d33ae95f7ff50e3bbbbddc01102"
        takerassetamountremaining="10000000000000000000">
      </or-sra-signed-order>
    </or-sra>
  npm:
    "@openrelay/sra-signed-order"
settings:
  ORDER_HASH: "0x0f28e5512f37bb4b4efec4bb2a2eb4a546ca1f16b411f8b2652cb09b6b25ac68"
---

The `<or-sra-signed-order>` widget renders a signed order. It is
non-interactive, and is just intended to render order information. The base
version displays the price in terms of Maker Asset / Taker Asset, and the
number available units of the Maker Asset. The class can be subclassed to
provide a new `render()` method to achieve the desired presentation.

In general, this widget is expected to be populated programatically by other
widgets, and not embedded in HTML directly. All attributes must exactly match a
valid 0x order to ensure correctness; this widget does minimal validations on
the order.

#### API

##### HTML Attributes

* `exchangeaddress` &mdash; The Exchange Address of the order
* `expirationtimeseconds` &mdash; The timestamp in seconds of the order expiration
* `feerecipientaddress` &mdash; The relayer's fee recipient address
* `makeraddress` &mdash; The address of the maker
* `makerassetamount` &mdash; The amount of the maker asset offered
* `makerassetdata` &mdash; The maker asset data string
* `makerfee` &mdash; The fee in ZRX base units to be paid by the maker
* `salt` &mdash; The order salt
* `senderaddress` &mdash; The sender designated by the 0x order
* `takeraddress` &mdash; The taker designated by the 0x order
* `takerassetamount` &mdash; The amount of the taker asset required
* `takerassetdata` &mdash; The taker asset data string
* `takerfee` &mdash; The fee in ZRX base units to be paid by the taker
* `signature` &mdash; The 0x order signature
* `takerassetamountremaining` &mdash; The number of units of the taker asset available to be taken
