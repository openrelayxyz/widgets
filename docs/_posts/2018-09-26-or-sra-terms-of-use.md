---
layout: widget
title:  "SRA Terms of Use"
date:   2018-09-26 08:50:00 -0500
categories: widgets
package: sra-terms-of-use
code:
  html: |

    <or-sra sra="#SRA_ENDPOINT#" feeRecipient="#FEE_RECIPIENT_ADDRESS#">
      <or-sra-terms-of-use>
        You have accepted the terms of use!
      </or-sra-terms-of-use>
    </or-sra>
  npm:
    "@openrelay/sra-terms-of-use"
---

OpenRelay now requires users who wish to submit orders to sign our terms of
use in much the same way they would sign a 0x order. Users will not be able
to submit orders to OpenRelay unless we have a signature on file corresponding
to the maker's address.

The `<or-sra-terms-of-use>` tag makes it easy for users to read and sign the
terms of use. For any content of your dApp that you do not wish users to access
until they have signed the terms of use, simply wrap the content in an
`<or-sra-terms-of-use>` tag. Users who have accepted the terms of use will see
the content in the tag. Users who have not yet accepted the terms of use will
see the terms of use and an option to sign.
