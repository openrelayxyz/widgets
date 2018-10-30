---
layout: post
title:  "JavaScript Integrations"
date:   2018-09-26 07:17:00 -0500
categories: introduction
---

OpenRelay's widgets are designed to behave similarly to native HTML elements.
The widgets are implemented using
[LitElement](https://github.com/Polymer/lit-element), which uses the
[Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
to isolate the widget's structure from the rest of the HTML DOM. The result is
that OpenRelay's widgets present simple APIs that generally behave like a
single HTML element, even though they are comprised of several underlying
components.

In general, you should interact with OpenRelay's widgets using their documented
APIs. It is possible to use JavaScript to pierce the Shadow DOM and interact
with the underlying components, but we strongly advise against this. From one
version to the next, we may make changes to how the elements work, but we will
make a concerted effort to maintain a stable API wherever possible.

## API Patterns

### HTML Attributes

Each OpenRelay widget may take HTML attributes to provide the widget with
information on how it should behave. In most cases, these attributes are
optional and have default behaviors. These attributes are documented on each
Widget's respective widget page.

For most Widgets, you can change HTML attributes in JavaScript and the widget
will automatically update to reflect the attribute change.

### JavaScript Attributes

Many OpenRelay widgets will have a `value` attribute, which gives a JavaScript
object representing the value of the object. In many cases the `value`
attribute represents a user's input, though in some cases it may simply
represent data retrieved by requests to the Relayer, or data retrieved from the
blockchain.

Each widget also has several web3 related attributes:

* `web3` &mdash; A web3 object
* `account` &mdash; The Ethereum account associated with the web3 object
* `network` &mdash; The networkId of the Ethereum network exposed by the web3 object.

Many widgets have additional attributes, which are documented on their
respective widget pages.

### JavaScript Events

OpenRelay widgets tend to communicate amongst themselves using JavaScript
events. For example, the `<or-web3>` element discovers its children as they
fire events as they are added to the DOM. The `<or-web3>` element then provides
a web3 object, account, and network information to its children via events. In
general, you do not need to worry about these events. Even if you are
implementing custom widgets, you can subclass `OrWeb3Base` or `OrSRABase`
(depending on whether you need access to a Standard Relayer API or just Web3)
to have the events managed for you automatically.

The most common event provided by OpenRelay widgets that a typical developer
would be interested in is the `change` event. Just like many native HTML
elements, OpenRelay widgets fire `change` events when their `value` attributes
change. This allows your dApp to react to user inputs and other changes without
having to poll elements for changes.
