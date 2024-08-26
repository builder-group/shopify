import { json } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import {
	BlockStack,
	Box,
	Button,
	Card,
	InlineStack,
	Layout,
	Link,
	List,
	Page as PolarisPage,
	Text
} from '@shopify/polaris';
import { useEffect } from 'react';

import { authenticate } from '../shopify.server';
import { type TJsonActionFunction, type TLoaderFunction } from '../types';

const COLORS = ['Red', 'Orange', 'Yellow', 'Green'] as const;

export const loader: TLoaderFunction = async ({ request }) => {
	await authenticate.admin(request);

	return null;
};

export const action: TJsonActionFunction<TActionResponse> = async ({ request }) => {
	const { admin } = await authenticate.admin(request);
	const color: TColor = COLORS[Math.floor(Math.random() * COLORS.length)] as unknown as TColor;

	const createProductResponse = await admin.graphql(createProductMutation, {
		variables: {
			input: {
				title: `${color} Snowboard`
			}
		}
	});

	const { data: productData } = await createProductResponse.json();
	const product = productData?.productCreate?.product as TProductResponse;

	const variantId = product.variants.edges[0]?.node?.id;
	if (variantId == null) {
		throw new Error('Failed to create product or retrieve variant ID');
	}

	const updateVariantResponse = await admin.graphql(updateVariantMutation, {
		variables: {
			productId: product.id,
			variants: [{ id: variantId, price: '100.00' }]
		}
	});

	const { data: variantData } = await updateVariantResponse.json();
	const variant = variantData?.productVariantsBulkUpdate?.productVariants;

	if (variant == null) {
		throw new Error('Failed to update variant');
	}

	return json({ product, variant });
};

const Page: React.FC = () => {
	const fetcher = useFetcher<typeof action>();

	const shopify = useAppBridge();
	const isLoading =
		['loading', 'submitting'].includes(fetcher.state) && fetcher.formMethod === 'POST';
	const productId = fetcher.data?.product.id.replace('gid://shopify/Product/', '');

	useEffect(() => {
		if (productId) {
			shopify.toast.show('Product created');
		}
	}, [productId, shopify]);
	const generateProduct = () => {
		fetcher.submit({}, { method: 'POST' });
	};

	return (
		<PolarisPage>
			<TitleBar title="Remix app template">
				<Button variant="primary" onClick={generateProduct}>
					Generate a product
				</Button>
			</TitleBar>
			<BlockStack gap="500">
				<Layout>
					<Layout.Section>
						<Card>
							<BlockStack gap="500">
								<BlockStack gap="200">
									<Text as="h2" variant="headingMd">
										Congrats on creating a new Shopify app 🎉
									</Text>
									<Text variant="bodyMd" as="p">
										This embedded app template uses{' '}
										<Link
											url="https://shopify.dev/docs/apps/tools/app-bridge"
											target="_blank"
											removeUnderline
										>
											App Bridge
										</Link>{' '}
										interface examples like an{' '}
										<Link url="/app/additional" removeUnderline>
											additional page in the app nav
										</Link>
										, as well as an{' '}
										<Link
											url="https://shopify.dev/docs/api/admin-graphql"
											target="_blank"
											removeUnderline
										>
											Admin GraphQL
										</Link>{' '}
										mutation demo, to provide a starting point for app development.
									</Text>
								</BlockStack>
								<BlockStack gap="200">
									<Text as="h3" variant="headingMd">
										Get started with products
									</Text>
									<Text as="p" variant="bodyMd">
										Generate a product with GraphQL and get the JSON output for that product. Learn
										more about the{' '}
										<Link
											url="https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate"
											target="_blank"
											removeUnderline
										>
											productCreate
										</Link>{' '}
										mutation in our API references.
									</Text>
								</BlockStack>
								<InlineStack gap="300">
									<Button loading={isLoading} onClick={generateProduct}>
										Generate a product
									</Button>
									{productId != null ? (
										<Button
											url={`shopify:admin/products/${productId}`}
											target="_blank"
											variant="plain"
										>
											View product
										</Button>
									) : null}
								</InlineStack>
								{fetcher.data?.product ? (
									<>
										<Text as="h3" variant="headingMd">
											{' '}
											productCreate mutation
										</Text>
										<Box
											padding="400"
											background="bg-surface-active"
											borderWidth="025"
											borderRadius="200"
											borderColor="border"
											overflowX="scroll"
										>
											<pre style={{ margin: 0 }}>
												<code>{JSON.stringify(fetcher.data.product, null, 2)}</code>
											</pre>
										</Box>
										<Text as="h3" variant="headingMd">
											{' '}
											productVariantsBulkUpdate mutation
										</Text>
										<Box
											padding="400"
											background="bg-surface-active"
											borderWidth="025"
											borderRadius="200"
											borderColor="border"
											overflowX="scroll"
										>
											<pre style={{ margin: 0 }}>
												<code>{JSON.stringify(fetcher.data.variant, null, 2)}</code>
											</pre>
										</Box>
									</>
								) : null}
							</BlockStack>
						</Card>
					</Layout.Section>
					<Layout.Section variant="oneThird">
						<BlockStack gap="500">
							<Card>
								<BlockStack gap="200">
									<Text as="h2" variant="headingMd">
										App template specs
									</Text>
									<BlockStack gap="200">
										<InlineStack align="space-between">
											<Text as="span" variant="bodyMd">
												Framework
											</Text>
											<Link url="https://remix.run" target="_blank" removeUnderline>
												Remix
											</Link>
										</InlineStack>
										<InlineStack align="space-between">
											<Text as="span" variant="bodyMd">
												Database
											</Text>
											<Link url="https://www.prisma.io/" target="_blank" removeUnderline>
												Prisma
											</Link>
										</InlineStack>
										<InlineStack align="space-between">
											<Text as="span" variant="bodyMd">
												Interface
											</Text>
											<span>
												<Link url="https://polaris.shopify.com" target="_blank" removeUnderline>
													Polaris
												</Link>
												{', '}
												<Link
													url="https://shopify.dev/docs/apps/tools/app-bridge"
													target="_blank"
													removeUnderline
												>
													App Bridge
												</Link>
											</span>
										</InlineStack>
										<InlineStack align="space-between">
											<Text as="span" variant="bodyMd">
												API
											</Text>
											<Link
												url="https://shopify.dev/docs/api/admin-graphql"
												target="_blank"
												removeUnderline
											>
												GraphQL API
											</Link>
										</InlineStack>
									</BlockStack>
								</BlockStack>
							</Card>
							<Card>
								<BlockStack gap="200">
									<Text as="h2" variant="headingMd">
										Next steps
									</Text>
									<List>
										<List.Item>
											Build an{' '}
											<Link
												url="https://shopify.dev/docs/apps/getting-started/build-app-example"
												target="_blank"
												removeUnderline
											>
												{' '}
												example app
											</Link>{' '}
											to get started
										</List.Item>
										<List.Item>
											Explore Shopify’s API with{' '}
											<Link
												url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
												target="_blank"
												removeUnderline
											>
												GraphiQL
											</Link>
										</List.Item>
									</List>
								</BlockStack>
							</Card>
						</BlockStack>
					</Layout.Section>
				</Layout>
			</BlockStack>
		</PolarisPage>
	);
};

export default Page;

interface TProductResponse {
	id: string;
	title: string;
	handle: string;
	status: string;
	variants: {
		edges: {
			node: {
				id: string;
				price: string;
				barcode: string;
				createdAt: string;
			};
		}[];
	};
}

interface TActionResponse {
	product: TProductResponse;
	variant: {
		id: string;
		price: string;
		barcode: string;
		createdAt: string;
	}[];
}

type TColor = (typeof COLORS)[number];

const createProductMutation = `#graphql
  mutation populateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        title
        handle
        status
        variants(first: 10) {
          edges {
            node {
              id
              price
              barcode
              createdAt
            }
          }
        }
      }
    }
  }
`;

const updateVariantMutation = `#graphql
  mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants {
        id
        price
        barcode
        createdAt
      }
    }
  }
`;