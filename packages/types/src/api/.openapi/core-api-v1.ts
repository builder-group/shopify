/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/v1/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Check API health
         * @description Returns the current health status of the API
         */
        get: operations["checkCoreHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/shopify/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Check API health
         * @description Returns the current health status of the API
         */
        get: operations["checkShopifyHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/shopify/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a new Shopify session */
        post: operations["createSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/shopify/session/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Retrieve a Shopify session by ID */
        get: operations["getSession"];
        put?: never;
        post?: never;
        /** Delete a Shopify session by ID */
        delete: operations["deleteSession"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/shopify/session/delete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Delete multiple Shopify sessions */
        post: operations["deleteSessions"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/shopify/session/shop/{shop}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Find Shopify sessions by shop */
        get: operations["findSessionsByShop"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/energy-label/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Check API health
         * @description Returns the current health status of the API
         */
        get: operations["checkEnergyLabelHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/energy-label/product-groups": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get list of product groups
         * @description Returns a list of product groups with their associated details.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ProductGroupListDto"];
                    };
                };
                401: components["responses"]["Unauthorized"];
                500: components["responses"]["InternalServerError"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/energy-label/product-groups/{productGroup}/products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get product details by model
         * @description Retrieves specific details for a product model within a product group.
         */
        get: {
            parameters: {
                query: {
                    /**
                     * @description The model identifier of the product
                     * @example P2422H
                     */
                    model: string;
                };
                header?: never;
                path: {
                    /** @description The product group identifier (e.g., airconditioners, electronicdisplays) */
                    productGroup: components["parameters"]["ProductGroup"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ProductDetailsListDto"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["Unauthorized"];
                500: components["responses"]["InternalServerError"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/energy-label/product/{registrationNumber}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a product by registration number
         * @description Retrieves detailed information about a product using its registration number.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Unique identifier of the product in the database */
                    registrationNumber: components["parameters"]["RegistrationNumber"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ProductDetailsDto"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["Unauthorized"];
                404: components["responses"]["NotFound"];
                500: components["responses"]["InternalServerError"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/energy-label/product/{registrationNumber}/sheets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get product sheet URLs
         * @description Retrieves URLs for product information sheets (fiches) for a specific product.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Unique identifier of the product in the database */
                    registrationNumber: components["parameters"]["RegistrationNumber"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SheetUrlsDto"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["Unauthorized"];
                500: components["responses"]["InternalServerError"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/energy-label/product/{registrationNumber}/sheet": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get product sheet URL
         * @description Retrieves URL for product information sheets (fiches) for a specific product.
         */
        get: {
            parameters: {
                query?: {
                    language?: components["parameters"]["SheetLanguage"];
                };
                header?: never;
                path: {
                    /** @description Unique identifier of the product in the database */
                    registrationNumber: components["parameters"]["RegistrationNumber"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": string;
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["Unauthorized"];
                404: components["responses"]["NotFound"];
                500: components["responses"]["InternalServerError"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/energy-label/product/{registrationNumber}/label": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get product label URL
         * @description Retrieves URL for product labels for a specific product.
         */
        get: {
            parameters: {
                query?: {
                    format?: components["parameters"]["LabelFormat"];
                };
                header?: never;
                path: {
                    /** @description Unique identifier of the product in the database */
                    registrationNumber: components["parameters"]["RegistrationNumber"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": string;
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["Unauthorized"];
                404: components["responses"]["NotFound"];
                500: components["responses"]["InternalServerError"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @example {
         *       "error_code": "#ERR_INVALID_INPUT",
         *       "error_description": "Invalid input",
         *       "error_uri": "https://api.builder.group/docs/errors#ERR_INVALID_INPUT",
         *       "additional_errors": []
         *     } */
        AppErrorDto: {
            /** @description Error code */
            error_code: string;
            /** @description Error description */
            error_description?: string;
            /** @description Error URI for more information */
            error_uri?: string | null;
            /** @description Additional error details */
            additional_errors?: Record<string, never>[];
        };
        /** @example {
         *       "status": "Up",
         *       "message": "API is functioning normally"
         *     } */
        HealthDto: {
            status: components["schemas"]["HealthStatus"];
            /** @description Additional health check information */
            message: string;
        };
        /**
         * @description The current health status of the API:
         *     * `Up` - Fully operational
         *     * `Restricted` - Partially operational
         *     * `Down` - Not operational
         *
         * @enum {string}
         */
        HealthStatus: "Up" | "Restricted" | "Down";
        /** @example {
         *       "id": "session123",
         *       "app": "myShopifyApp",
         *       "shop": "mystore.myshopify.com",
         *       "state": "active",
         *       "isOnline": true,
         *       "scope": "read_products,write_orders",
         *       "expires": "2023-12-31T23:59:59Z",
         *       "accessToken": "shpat_1234567890abcdef",
         *       "userId": 12345678
         *     } */
        ShopifySessionDto: {
            /** @description Unique identifier for the session */
            id: string;
            /** @description Unique identifier for the app */
            app: string;
            /** @description Shopify shop domain */
            shop: string;
            /** @description Current state of the session */
            state: string;
            /** @description Indicates if the access token is online or offline */
            isOnline: boolean;
            /** @description Desired scopes for the access token */
            scope?: string;
            /**
             * Format: date-time
             * @description Expiration date and time of the access token
             */
            expires?: number;
            /** @description Access token for the session */
            accessToken?: string;
            /** @description Shopify user ID associated with the session */
            userId?: number;
        };
        ProductGroupListDto: components["schemas"]["ProductGroupDto"][];
        ProductGroupDto: {
            /** @example AIR_CONDITIONER */
            code?: string;
            /** @example airconditioners */
            urlCode?: string;
            /** @example Air conditioners */
            name?: string;
            /** @example Regulation (EU) 626/2011 */
            regulation?: string;
        };
        ProductDetailsDto: {
            /** @example P2422H */
            modelIdentifier?: string;
            /** @example [
             *       2022,
             *       5,
             *       1
             *     ] */
            onMarketStartDate?: number[];
            /** @example null */
            onMarketEndDate?: number[] | null;
            /**
             * @example PUBLISHED
             * @enum {string}
             */
            status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
            /** @example 123456 */
            eprelRegistrationNumber?: string;
            /** @example A */
            energyClass?: string;
            /** @example electronicdisplays */
            productGroup?: string;
            /** @example EU_2019_2013 */
            implementingAct?: string;
            placementCountries?: {
                /** @example DE */
                country?: string;
                /** @example 1 */
                orderNumber?: number;
            }[];
        };
        SheetUrlsDto: {
            /**
             * @example DE
             * @enum {string}
             */
            language?: "BG" | "CS" | "DA" | "DE" | "ET" | "EL" | "EN" | "ES" | "FR" | "GA" | "HR" | "IT" | "LV" | "LT" | "HU" | "MT" | "NL" | "PL" | "PT" | "RO" | "SK" | "SL" | "FI" | "SV";
            /** @example https://eprel.ec.europa.eu/api/products/electronicdisplays/550826/fiches?language=DE */
            url?: string;
        }[];
        ProductDetailsListDto: components["schemas"]["ProductDetailsDto"][];
    };
    responses: {
        /** @description Bad request */
        BadRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["AppErrorDto"];
            };
        };
        /** @description Unauthorized */
        Unauthorized: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["AppErrorDto"];
            };
        };
        /** @description Resource not found */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["AppErrorDto"];
            };
        };
        /** @description Internal server error */
        InternalServerError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["AppErrorDto"];
            };
        };
    };
    parameters: {
        /** @description Unique identifier of the Shopify session */
        SessionId: string;
        /** @description The product group identifier (e.g., airconditioners, electronicdisplays) */
        ProductGroup: string;
        /** @description Unique identifier of the product in the database */
        RegistrationNumber: string;
        SheetLanguage: "BG" | "CS" | "DA" | "DE" | "ET" | "EL" | "EN" | "ES" | "FR" | "GA" | "HR" | "IT" | "LV" | "LT" | "HU" | "MT" | "NL" | "PL" | "PT" | "RO" | "SK" | "SL" | "FI" | "SV";
        LabelFormat: "PNG" | "PDF" | "SVG";
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    checkCoreHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthDto"];
                };
            };
            500: components["responses"]["InternalServerError"];
        };
    };
    checkShopifyHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthDto"];
                };
            };
            500: components["responses"]["InternalServerError"];
        };
    };
    createSession: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Shopify session details */
        requestBody: {
            content: {
                "application/json": components["schemas"]["ShopifySessionDto"];
            };
        };
        responses: {
            /** @description Session created successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example true */
                        success?: boolean;
                        /** @example Session created successfully */
                        message?: string;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalServerError"];
        };
    };
    getSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Unique identifier of the Shopify session */
                id: components["parameters"]["SessionId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ShopifySessionDto"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["InternalServerError"];
        };
    };
    deleteSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Unique identifier of the Shopify session */
                id: components["parameters"]["SessionId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Session deleted successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example true */
                        success?: boolean;
                        /** @example Session deleted successfully */
                        message?: string;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["InternalServerError"];
        };
    };
    deleteSessions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Array of session IDs to delete */
        requestBody: {
            content: {
                "application/json": string[];
            };
        };
        responses: {
            /** @description Sessions deleted successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example true */
                        success?: boolean;
                        /** @example Sessions deleted successfully */
                        message?: string;
                        /** @example 3 */
                        deletedCount?: number;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalServerError"];
        };
    };
    findSessionsByShop: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Shopify shop domain */
                shop: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ShopifySessionDto"][];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalServerError"];
        };
    };
    checkEnergyLabelHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthDto"];
                };
            };
            500: components["responses"]["InternalServerError"];
        };
    };
}
