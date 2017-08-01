# MacDown (MacDown Extend)


MacDown is an open source Markdown editor for OS X, released under the MIT License. The author stole the idea from [Chen Luo](https://twitter.com/chenluois)’s [Mou](http://mouapp.com) so that people can [make crappy clones](https://twitter.com/remaerd/status/484914820408279040).


## Extend Features

* text-flow-chart
* table style
* image size
* new style: github3


## Install

[Download](http://macdown.uranusjr.com/download/latest/) dmg package and install it with double-click.

## License

MacDown is released under the terms of MIT License. You may find the content of the license [here](http://opensource.org/licenses/MIT), or inside the `LICENSE` directory.

You may find full text of licenses about third-party components in the `LICENSE` directory, or the **About MacDown** panel in the application.

The following editor themes and CSS files are extracted from [Mou](http://mouapp.com), courtesy of Chen Luo:

* Mou Fresh Air
* Mou Fresh Air+
* Mou Night
* Mou Night+
* Mou Paper
* Mou Paper+
* Tomorrow
* Tomorrow Blue
* Tomorrow+
* Writer
* Writer+
* Clearness
* Clearness Dark
* GitHub
* GitHub2
* GitHub3

## Development

### Requirements

If you wish to build MacDown yourself, you will need the following components/tools:

* OS X SDK (10.8 or later)
* Git
* [Bundler](http://bundler.io)

You may also need to install Xcode’s command line tools with the following command:

    xcode-select --install

> Note: Due to multiple upstream bugs, Xcode may fail to build certain dependencies if you use the CocoaPods with versions lower than 0.39. Please upgrade CocoaPods, or use Bundler to execute a local version (as suggested above) instead.

An appropriate SDK should be bundled with Xcode 5 or later versions.

### Environment Setup

After cloning the repository, run the following commands inside the repository root (directory containing this `README.md` file):

    git submodule init
    git submodule update
    bundle install
    bundle exec pod install

and open `MacDown.xcworkspace` in Xcode. The first command initialises the dependency submodule(s) used in MacDown; the second one installs dependencies managed by CocoaPods.

Refer to the official guides of Git and CocoaPods if you need more instructions. If you run into build issues later on, try running the following commands to update dependencies:

    git submodule update
    bundle exec pod install

## Tipping

If you find MacDown suitable for your needs, please consider [giving me a tip through PayPal](http://macdown.uranusjr.com/faq/#donation). Or, if you prefer to buy me a drink *personally* instead, just [send me a tweet](https://twitter.com/uranusjr) when you visit [Taipei, Taiwan](http://en.wikipedia.org/wiki/Taipei), where I live. I look forward to meeting you!

