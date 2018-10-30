---
layout: post
title:  "Affiliates"
date:   2018-09-26 07:19:00 -0500
categories: introduction
---

OpenRelay charges a small, flat fee, which can be split between the maker and
taker of an order. As an application developer, you are invited to sign up for
an OpenRelay affiliates account, which will reward you with 80% of the fees
collected on orders made through your application. To get started:

1. Go to [affiliates.openrelay.xyz](https://affiliates.openrelay.xyz) to sign
   up. All we need is a handle to identify you by, and one or more addresses
   where we can send your fees.
2. Once you're signed up for our Affiliates program, you'll get an affiliate
   address.
3. Put your affiliate address into the `feeRecipient` attribute of the
   [`<or-sra>`](../widgets/or-sra.html) tag in your application.

Now, when users of your application create orders using widgets from the
OpenRelay widget toolkit, fees will go to your affiliate contract. You can go
to your affiliate dashboard any time to distribute fees to the address you
provided when you signed up. (If you have enough fees sitting in your affiliate
account, OpenRelay may distribute the fees on your behalf).
