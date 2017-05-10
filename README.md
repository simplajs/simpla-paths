# Simpla Paths
[![NPM][npm-badge]][npm-url] [![Build status][travis-badge]][travis-url] ![Size][size-badge] [![Simpla slack group][slack-badge]][slack-url]

Simpla-paths maps Simpla content paths to the DOM, using HTML attributes. This allows you to easily structure data declaratively in code.

### Installation & usage

Simpla-paths is available on NPM/Yarn, Bower, and the Unpkg CDN

```sh
$ npm install simpla-paths --save
```

```sh
$ bower install simpla-paths --save
```

```
https://unpkg.com/simpla-paths@^1.0.0/[file]
```

Simpla-paths is distributed as both an HTML import (`simpla-paths.html`) and a JavaScript file (`simpla-paths.min.js`). You can include either in your project, but make sure you only include one of them.

```html
<!-- As HTML import -->
<link rel="import" href="/bower_components/simpla-paths/simpla-paths.html">
```

```html
<!-- As Javascript file -->
<script src="/node_modules/simpla-paths/simpla-paths.min.js"></script>
```

Once simpla-paths is included it will begin observing IDs and constructing paths automatically (except for inside Shadow DOM - see [Observing shadow roots](#observing-shadow-roots)).

## Constructing paths

Simpla-paths creates paths by stringing together IDs used in new HTML attributes. For example, this markup

```html
<div sid="page">
  <div sid="section">
    <simpla-text sid="element"></simpla-text>
  </div>
</div>
```

Creates the path `/page/section/element` for the `<simpla-text>`` element.

Simpla-paths exposes two new HTML attributes:

- `sid`: Scoped ID
- `gid`: Global ID

Every element with either of these attributes will get a `path` property set on it by simpla-paths.

### Scoped IDs

Scoped IDs (the `sid` attribute) are the building blocks of structured content. They are namespaced to any parent element with a path ID. To created nested paths, just nest HTML elements with `sid` attributes

```html
<div sid="nested">
  <span sid="path"></span>
</div>

<p sid="path"></p>

<script>
  document.querySelector('div').path // '/nested'
  document.querySelector('span').path // '/nested/path'
  document.querySelector('p').path // '/path'
</script>
```

### Global IDs

Global IDs (the `gid` attribute) always create new paths regardless of where they are used. When applied to Simpla elements, they are equivelant to specifying `path="/[gid]"`. 

They are useful for creating reusable chunks of content that always have consistent data, regardless of where they appear on your site.

```html
<div sid="page">

  <!-- path = /page/title -->
  <simpla-text sid="title"></simpla-text>

  <div gid="footer">

    <!-- path = /footer/company -->
    <simpla-text sid="company"></simpla-text>  

  </div>

</div>
```

## Dynamically reloading paths

When you change any ID in a chain of IDs, the whole path is recalculated. This means you can easily fetch and reload whole sections of content dynamically by changing a single attribute.

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

> Read more about [structuring data with simpla-paths](https://www.simpla.io/docs/guides/structuring-data)

## Observing shadow roots

Simpla-paths automatically observes IDs and constructs paths in the main document. To use `sid` and `gid` attributes in Shadow DOM you will need to tell simpla-paths to observe your shadow root manually.

Do this with the `observe` method on the `SimplaPaths` global. It takes two arguments, the shadow tree to observe, and an optional base path (defaults to `'/'`).

```js
SimplaPaths.observe(element.shadowRoot, element.path);
```

## API

### Custom attributes

Attribute | Description
--------- | -----------
`sid`     | Scoped ID, appended to parent IDs to create nested paths
`gid`     | Global ID, creates a new root path

### Events

Events are fired on elements that `sid` or `gid` attributes set

Event          | Detail             | Description                              
-------------- | ------------------ | ------------
`path-changed` | `{ path: String }` | Fired whenever an element's path changes

## Contributing

If you find any issues with simpla-paths please report them! If you'd like to see a new feature in supported file an issue or let us know in Simpla's public [Slack group](https://slack.simpla.io). We also happily accept PRs.

***

MIT © Simpla

[npm-badge]: https://img.shields.io/npm/v/simpla-paths.svg
[npm-url]: https://www.npmjs.com/package/simpla-paths
[travis-badge]: https://img.shields.io/travis/SimplaElements/simpla-paths.svg
[travis-url]: https://travis-ci.org/SimplaElements/simpla-paths
[size-badge]: https://badges.herokuapp.com/size/github/SimplaElements/simpla-paths/master/simpla-paths.min.js?gzip=true
[slack-badge]: http://slack.simpla.io/badge.svg
[slack-url]: https://slack.simpla.io
