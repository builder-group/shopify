# `@repo/shopify-theme-extension-elements`

Theme extension elements are [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) created using [SolidJs](https://www.solidjs.com/).

## Why SolidJs?

SolidJs is chosen for its compact size and performance. At around 14kB (5.32kB zipped), it is among the smallest and fastest frontend frameworks available. Although Svelte 3 and 4 are slightly smaller, Svelte 5 is significantly larger, making SolidJs a more efficient choice ([discussion](https://github.com/sveltejs/svelte/issues/8826#issuecomment-2242175130)).

SolidJs also uses JSX syntax, similar to React, which makes it familiar and easy to work with for developers experienced with React (like myself).

### Comparison with Other Frameworks

#### **JavaScript in HTML (AlpineJs / Stimulus)**
- **AlpineJs**: Not as developer friendly and found to be slow according to [benchmark results](https://krausest.github.io/js-framework-benchmark/2023/table_chrome_115.0.5790.98.html).
- **Stimulus**: Not as developer friendly ([example](https://gist.github.com/panoply/241c1fbabd210d110b5290f046ab5f49)).

At some point, I might explore an embedded JavaScript framework that integrates more seamlessly with server-rendered HTML based on Liquid code. This could provide additional performance optimizations.

#### **Pure JavaScript Frameworks (Svelte / Preact / React / Vue)**
- **Svelte**: Although Svelte 3 and 4 are compact, Svelte 5 has a significantly larger bundle size compared to SolidJs. Opting for Svelte 3 or 4 could be an option, but using a legacy version is less desirable.
- **Preact / React / Vue**: Larger and less performant than SolidJs.
  
### Benefits of SolidJs

- **Performance**: Second fastest after Vanilla JS according to [benchmark results](https://krausest.github.io/js-framework-benchmark/2023/table_chrome_115.0.5790.98.html).
- **Lightweight**: Second most lightweight framework after Vanilla and Svelte 3/4.
- **Familiar Syntax**: Uses JSX syntax, making it easy for React developers to adopt.
- **Stable**: SolidJs is a stable framework with growing community support.
- **Custom Elements**: Easy creation of custom HTML elements, as detailed in the [SolidJs documentation](https://github.com/solidjs/solid/blob/main/packages/solid-element/README.md#custom-elements).

### Why Not Plain JavaScript with Liquid?

- **Maintenance**: Using a modern framework like SolidJs simplifies maintenance compared to plain JavaScript.