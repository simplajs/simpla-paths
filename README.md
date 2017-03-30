# Simpla Paths
[![Build status][travis-badge]][travis-url] ![Version][bower-badge] ![Size][size-badge] <br>
[![Simpla slack group][slack-badge]][slack-url]

Simpla-paths lets you declaratively build and manage content paths for Simpla elements with IDs and HTML attributes.

### Installation & usage

Simpla-paths is available on NPM/Yarn, Bower, and the Unpkg CDN

```sh
$ npm install simpla-paths --save
```

```sh
$ bower install simpla-paths --save
```

```
https://unpkg.com/simpla-paths@^0.1.0/[file]
```

Simpla-paths is distributed both as an HTML import (`simpla-paths.html`) and as a JavaScript file (`simpla-paths.min.js`). You can include either in your project, but make sure you only include one of them.

```html
<!-- As HTML import -->
<link rel="import" href="/bower_components/simpla-paths/simpla-paths.html">
```

```html
<!-- As Javascript file -->
<script src="/node_modules/simpla-paths/simpla-paths.min.js"></script>
```

Once simpla-paths is included on your page it will begin observing IDs and constructing paths automatically (except for inside Shadow DOM - see [Observing shadow roots](#observing-shadow-roots)).

## Constructing paths

Simpla-paths exposes two new HTML attributes you can use to declaratively construct content paths:

- `sid` (Scoped ID)
- `gid` (Global ID)

Every element with either of these attributes gets a `path` property set on it by simpla-paths.

### Scoped IDs

Scoped IDs are namespaced to their parent, and are the main building block of complex paths. To create nested paths, just nest elements with `sid` attributes.

```html
<div sid="page">
  <div sid="section">

    <!-- Content path = /page/section/title -->
    <simpla-text sid="title"></simpla-text>

  </div>
</div>
```

> Read more about structruing Simpla data in the [structuring data guide](https://www.simpla.io/docs/structuring-data).

### Global IDs

Global IDs are not namespaced to their parent, and create new root paths wherever they are used. They are equivalent to specifying `path="/[gid]"` on a Simpla element, but are applicable to any arbitrary HTML element. This means you can easily create global 'chunks' of content.

```html
<div sid="page">

  <!-- Content path = /page/title -->
  <simpla-text sid="title"></simpla-text>

  <div gid="footer">
    <!-- Content path = /footer/company -->
    <simpla-text sid="company"></simpla-text>  
  </div>

</div>

```

> Read more about structuring Simpla data in the [structuring data guide](https://www.simpla.io/docs/structuring-data).

## Dynamically reloading paths

When you change any ID in a chain of IDs, the whole path is reconstructed. This means you can easily fetch and reload whole sections of content dynamically by changing a single ID.

```html
<div id="page" sid="page">
  <div sid="section">
    <simpla-text sid="title"></simpla-text>
  </div>
</div>

<!-- simpla-text path = /page/section/title -->

<script>
  document.querySelector('#page').setAttribute('sid', 'about');
</script>

<!-- simpla-text path = /about/section/title -->
```

For example, fetch localized content for a page based on browser language

```html
<div id="localize" sid="en">
  <simpla-text sid="content"></simpla-text>
</div>

<script>
  // Set localization namespace to browser language
  document.querySelector('#localize').setAttribute('sid', navigator.languge);
</script>
```


## Observing shadow roots

Simpla-paths automatically observes IDs and constructs paths in the main document. To use `sid` and `gid` attributes in Shadow DOM you will need to manually tell simpla-paths to observe your shadow root.

Do this with the `observe` method on the `SimplaPaths` global. It takes two arguments, the shadow tree to observe, and an optional base path (defaults to `/`).

```js
SimplaPath.observe(element.shadowRoot, element.path);
```

## API

### Custom attributes

Attribute | Description
--------- | -----------
`sid`     | Scoped ID, appended to its parent to create nested paths
`gid`     | Global ID, creates a new root path

### Events

Events will only be fired on elements that have either an `sid` or `gid` attribute.

Event          | Detail             | Description                              
-------------- | ------------------ | ------------
`path-changed` | `{ path: String }` | Fired whenever an element's path changes

## Contributing

If you find any issues with simpla-paths please report them! If you'd like to see a new feature in supported file an issue or let us know in Simpla's public [Slack group](https://slack.simpla.io). We also happily accept PRs.

---

MIT © Simpla <friends@simpla.io>

[bower-badge]: https://img.shields.io/bower/v/simpla-paths.svg
[travis-badge]: https://img.shields.io/travis/SimplaElements/simpla-paths.svg
[travis-url]: https://travis-ci.org/SimplaElements/simpla-paths
[size-badge]: https://badges.herokuapp.com/size/github/SimplaElements/simpla-paths/master/simpla-paths.html?gzip=true&color=blue
[slack-badge]: http://slack.simpla.io/badge.svg
[slack-url]: https://slack.simpla.io
