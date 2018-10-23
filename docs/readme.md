This is the scaffold for OpenRelay's widget site. We have a lot to do!

At least for now, we're building the widget site using Jekyll, which should
allow us to focus on each widget and tutorial page without too much structural
overhead.

Each page gets its own file in `widget-site/_posts`, which should demonstrate a
given widget or configuration of widgets, and describe what a developer needs
to know to deploy that widget on their own site. Widgets should have the
category set to "widgets", which will make sure they get listed under the right
headings.

Note that Jekyll is intended primarily for building blogs, and as such sorts
pages by date. The widget site doesn't really care about dates, so we're
setting the date in each post fairly arbitrarily based on where we want it to
appear in lists of widgets.

We will likely also use posts to create tutorials, that walk users through
wiring up widgets with various other frameworks, as well as introductory
material for how to get set up with the widget framework in general, before
worrying about specific widgets.
