
### Why We Can't Use Partytown to Load Shopify App Extension Scripts

[Partytown](https://partytown.builder.io/) requires the library files to be hosted on the same origin as the webpage ([see `lib` config](https://partytown.builder.io/configuration)). Shopify app extensions are typically served from Shopify's CDN (`https://cdn.shopify.com/`), which is a different origin from the Shopify store itself (e.g., `https://bennos-dev-store.myshopify.com/`). This difference in origins violates Partytown's requirement, making it unsuitable for loading Shopify app extension scripts as far as I know.

<details>
<summary>Experiment</summary>

```liquid
{%
	# The following attempt to set the Partytown library path for Shopify app extension
	# scripts won't work because Shopify's CDN is a different origin from the webpage's origin.
    #
	# Meaning additional partytown scripts are attempted to be loaded from:
    # https://bennos-dev-store.myshopify.com/extensions/03b259ba-6447-4248-a82e-7be394c9b5db/0.0.0/assets/partytown-sw.js
    # but are only available at:
	# https://cdn.shopify.com/extensions/03b259ba-6447-4248-a82e-7be394c9b5db/0.0.0/assets/partytown-sw.js
%}
{% comment %}
	{% assign full_url = 'partytown.js' | asset_url %}
	{% assign url_parts = full_url | split: '/' %}
	{% assign partytown_lib_path = '/'
		| append: url_parts[3]
		| append: '/'
		| append: url_parts[4]
		| append: '/'
		| append: url_parts[5]
		| append: '/'
		| append: url_parts[6]
		| append: '/'
	%}
	<script>
		partytown = {
			lib: '{{ partytown_lib_path }}'
		};
	</script>
	<script
		src='{{ 'partytown.js' | asset_url }}'
		type='module'
	></script>
{% endcomment %}
```
In this experiment, the URL for the Partytown library script (`https://cdn.shopify.com/...`) is different from the store's origin (`https://bennos-dev-store.myshopify.com/`). 

The scripts were generated via the [Partytown Vite plugin](https://partytown.builder.io/solid).
```
partytownVite({ dest: join(__dirname, '../theme-extension/assets'), debug: false })
```

</details>