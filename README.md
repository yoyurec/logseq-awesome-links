<h1 align="center">"Awesome Links" plugin for Logseq</h1>
<p align="center">
    <a href="https://github.com/yoyurec/logseq-awesome-links">
        <img src="https://github.com/yoyurec/logseq-awesome-links/raw/main/icon.png" alt="logo" width="128" height="128" />
    </a>
</p>

* Custom **journal icon** <a href="#-journal-icon">🡖</a>
* **Favicons** for external links (with caching) <a href="#-auto-favicons-for-external-links">🡖</a>
* **Pages icons/colors** for internal links & tags (shows in content, sidebar, page title & tabs) <a href="#-page-icons">🡖</a>
    * Common page `icon::`
    * Icon for cases when the page is an alias
    * Inherit icon from page prop
    * Inherit icon for cases when the prop is an alias
    * Inherit icon from hierarchy root item or it's props
* In addition page links & tags **color** `color: "value"` <a href="#-page-colors">🡖</a>
* Page icons`icon::`extended from Emoji to hundreds icons set via Nerd fonts support <a href="#-custom-page-icons">🡖</a>

![](https://github.com/yoyurec/logseq-awesome-links/raw/main/screenshots/logseq-awesome-links.png)

## If you ❤ what i'm doing - you can support my work! ☕
<a href="https://www.buymeacoffee.com/yoyurec"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=yoyurec&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff" /></a>

## Install
From Logseq store - `Plugins -> Marketplace`

![](https://github.com/yoyurec/logseq-awesome-links/raw/main/screenshots/market.png)

## Recommended plugins/themes
* 🐱‍👤 [Awesome Styler](https://github.com/yoyurec/logseq-awesome-styler) theme
* ⚡ [Awesome UI](https://github.com/yoyurec/logseq-awesome-ui)
* 📰 [Banners](https://github.com/yoyurec/logseq-banners-plugin)
* 📌 [Sticky Headers](https://github.com/yoyurec/logseq-sticky-headers)

## Features

### ⭐ Auto favicons for external links

<img src="https://github.com/yoyurec/logseq-awesome-links/raw/main/screenshots/favicons.png" width="500">

### ✨ Page icons

Enable feature to show Logseq page (or aliased page) icon for internal links in content.
In addition you can config icon inheriting from page property referenced page, to avoid manual setting `icon::` for common pages.
For ex.:
* create "Projects" page, set `icon:: 🎯` for it
* create "Some project" page, set `page-type:: [[Projects]]`
* set in plugin settings "Inherit icon from..." `page-type`
* ...and all pages with `page-type:: [[Projects]]` will have inherited "Projects" page icon 🎯!

Hierarchy ex.:
* create "Location" page, set `icon:: 🌍` for it
* create "Ukraine" page, set `page-type:: [[Location]]`
* set in plugin settings "Inherit icon from..." `page-type`
* create page [[Ukraine/Kyiv]]
* ...page "Ukraine/Kyiv" will have inherited "Location" page icon 🌍!

Inherited icons also will be shown on current page title, current tab (if "Tabs" plugin installed) and sidebar.

To disable icon for custom markdown links - start link text with space:
```
 [→]([[books]]) — [[📖 →]]
[ →]([[books]]) — [[ →]]
```

To disable icon for specific page if it was inherited, but not needed
```
icon:: none
```

Journal pages default props (cose there is no inherit from) can be configured in Settings (⚠ no quotes in colors!).

<img src="https://github.com/yoyurec/logseq-awesome-links/raw/main/screenshots/page-icons.png" width="640">

### 🎨 Page colors

To customize link color, add property _(to page or to inherited page)_ `color::` with double quotes. Any valid CSS value (for ex [color names](https://enes.in/sorted-colors) )

`color:: "#00ff00"`

<img src="https://github.com/yoyurec/logseq-awesome-links/raw/main/screenshots/page-colors.png" width="540">


![](https://github.com/yoyurec/logseq-awesome-links/raw/main/screenshots/tag-colors.png)

### ✨ Custom page icons

3600+ icons combined from popular sets (Font Awesome, Material Design, SetiUI, etc...)!
Native Logseq props `icon::` extended with Nerd icons font:
* Search in collection ([Icons Cheat Sheet](https://www.nerdfonts.com/cheat-sheet)),
* select
* press "Copy icon",
* paste to `icon::` props

Banners & Tabs plugin support included 😎
Feature can be disabled.

<img src="https://github.com/yoyurec/logseq-awesome-links/raw/main/screenshots/nerd-icons.png" width="640">

<img src="https://github.com/yoyurec/logseq-awesome-links/raw/main/screenshots/nerd.png" width="640">


### ✨ Journal icon

Can be customized in settings.
Delete value to disable feature.

<img src="https://github.com/yoyurec/logseq-awesome-links/raw/main/screenshots/journal-icon.png" width="500">


## What is Logseq?
Logseq is a privacy-first, open-source knowledge base. Visit https://logseq.com for more information.

## Support
* Read about Logseq plugin updates on Dicscord - https://discord.com/channels/725182569297215569/896368413243494430
* Ask about Logseq plugins on Dicscord - https://discord.com/channels/725182569297215569/752845167030960141
* If you have any questions, issues or feature request, use the issue submission on GitHub: https://github.com/yoyurec/logseq-awesome-links/issues

## Credits
* Icon - https://www.flaticon.com/free-icon/clicking_1721678

## License

[MIT License](./LICENSE)
