# `@repo/sfy-chrome-extension`

## ❓ FAQ

### Choosing Offscreen DOM over Xml-Tokenizer

We chose the Offscreen DOM for our Chrome Extension because it's built-in, standardized, and more performant for extracting data from HTML. Xml-Tokenizer, while useful in non-DOM environments, is less suitable here.

```
Xml-Tokenizer: 16.75 ms to extract Shopify Apps
Offscreen DOM: 5.71 ms (excluding Offscreen DOM creation)
```