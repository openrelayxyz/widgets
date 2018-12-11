---
layout: widget
title:  "Web3 Enable"
date:   2018-09-26 08:13:00 -0500
categories: widgets
package: web3-enable
code:
  html: |

    <or-web3 manualEnable>
      <div slot="locked">
        <or-web3-enable></or-web3-enable>
      </div>
      This will display once web3 is enabled.
    </or-web3>
  npm:
    "@openrelay/web3-account-element"
---

EIP-1102 introduced privacy mode to web3 clients. By default, the `<or-web3>`
element will automatically attempt to automatically connect to web3. Some
dApps, however, may wish to connect to web3 only after a user interaction.

The `<or-web3-enable>` tag shows the user a "Connect Web3" button, which will
initiate this process manually.

To use the `<or-web3-enable>` tag, add the `manualEnable` attribute to the
`<or-web3>` element, and add the `<or-web3-enable>` element to the `locked`
slot, as shown above. This will show a "connect" button if the user has not yet
approved your dApp to connect to web3, or if the user's web3 client is locked.

The `<or-web3-enable>` tag attempts to detect whether the user has already
approved your dApp to connect to web3, and will automatically establish the
connection in such cases.
