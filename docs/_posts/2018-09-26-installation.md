---
layout: post
title:  "Installation"
date:   2018-09-26 07:15:26 -0500
categories: introduction
---

# Installation

Depending on what you're trying to do there are two different ways to install
the OpenRelay widget toolkit.

If you are trying to use our widgets directly on your website and aren't
interested in building your own JavaScript libraries, you can use the
[Prepared Bundle](#prepared-bundle) to start adding widget tags to your HTML
right away.

If you are trying to incorporate our widgets into a larger JavaScript
application, we recommend installing each specific widget with NPM or yarn and
incorporating them into your [JavaScript builds](#javascript-builds).

## Prepared Bundle

OpenRelay provides a prepare JavaScript bundle which includes all of our
widgets. You can add the following script tag to the `<head>` section of your
HTML and start embedding our Widget tags without writing any custom JavaScript:

<pre><code class="language-html">
&lt;script src="{{ site.url }}/{{ site.data.release.version }}/assets/js/widgets-bundle.js"
        integrity="sha256-{{ site.data.release.bundle_checksum }}">
&lt;/script>
</code></pre>

Be aware that when using the prepared bundle your users must download the
entire bundle, which includes widgets you may not be using on your site. You
are likely to get better performance creating a customized JavaScript build, as
shown below.

Once you have the bundle installed, read about the [Web3 Layer](./web3.html) to
get started.

## JavaScript Builds

If you are building a JavaScript application, you will probably want to bundle
the widgets you are going to use with the rest of your JavaScript code. Each
widget page has the `yarn` command for installing the widget, then it can be
imported into your application. Unless you intend to extend the widgets to make
new ones, you only need to import the widgets into your application to start
embedding their respective tags into the page.

Each widget page also documents the API for that widget. You can interact with
widgets like native HTML elements. They have HTML attributes, JavaScript
properties, and emit events, allowing you to interact with them in almost any
JavaScript application framework as if they were native HTML elements. Whether
you're building your application with jQuery, Angular, React, Vue, or any of a
number of other application frameworks, it should be easy to integrate
OpenRelay's widgets.

Once you have the widgets installed, read about the [Web3 Layer](./web3.html)
to get started.
