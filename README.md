# simpla-paths
[![Build status][travis-badge]][travis-url] [![Bower dependencies][bowerdeps-badge]][bowerdeps-url] ![Version][bower-badge]

Expose custom `sid` and `gid` attributes for constructing paths on Simpla elements.

### Installation & usage

Install simpla-paths with Bower

```sh
$ bower install simpla-paths --save
```

Import it into the `<head>` of your page

```html
<link rel="import" href="/bower_components/simpla-path/simpla-paths.html">
```

or, given there's no element needed

```html
<script src="/bower_components/simpla-path/simpla-paths.js"></script>
```

Example usage:

```html
<body>
  <main sid="main">
    <header sid="header">
      <!-- Will have a `path` of '/main/header/title' -->
      <h1><simpla-text sid="title"></simpla-text></h1>
    </header>

    <footer gid="footer">
      <!-- Will have a `path` of '/footer/caption' -->
      <span><simpla-text sid="caption"></simpla-text></span>
    </footer>
  </main>
</body>
```

### Watching Shadow Roots

The custom `sid` and `gid` attributes are only registered on the main document, and not on Shadow Trees. Therefore if you're wanting to use them inside a Shadow Root, you'll need to observe them manually e.g.

```js
let basePath = element.path;
SimplaPath.observe(element.shadowRoot, basePath);
```

_Note that the `basePath` defaults to ''_

--

MIT © Simpla

[webcomponents]: https://github.com/webcomponents/webcomponentsjs

[bower-badge]: https://img.shields.io/bower/v/simpla-path.svg
[bowerlicense-badge]: https://img.shields.io/bower/l/simpla-path.svg
[travis-badge]: https://img.shields.io/travis/SimplaElements/simpla-path.svg
[travis-url]: https://travis-ci.org/SimplaElements/simpla-path
[bowerdeps-badge]: https://img.shields.io/gemnasium/SimplaElements/simpla-path.svg
[bowerdeps-url]: https://gemnasium.com/bower/simpla-path
