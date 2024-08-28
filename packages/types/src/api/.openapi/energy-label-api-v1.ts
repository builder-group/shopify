/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/health": {
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
        get: operations["checkHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/product-groups": {
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
    "/product-groups/{productGroup}/products": {
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
    "/products/{registrationNumber}/sheets": {
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
                query?: {
                    /** @description The language in which the product sheet should be returned. If not specified, all available languages will be returned. */
                    language?: components["parameters"]["Language"];
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
                        "application/json": components["schemas"]["SheetUrlsDto"];
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
    "/products/{registrationNumber}/labels": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get product label URLs
         * @description Retrieves URLs for product labels for a specific product.
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
                        "application/json": components["schemas"]["LabelUrlsDto"];
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
            error_description: string;
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
        };
        SheetUrlsDto: {
            /** @example [
             *       "https://api.example.com/fiche/Fiche_123456_EN.pdf",
             *       "https://api.example.com/fiche/Fiche_123456_FR.pdf"
             *     ] */
            urls?: string[];
        };
        LabelUrlsDto: {
            /** @example [
             *       "https://api.example.com/label/Label_123456.png",
             *       "https://api.example.com/label/Label_123456.svg",
             *       "https://api.example.com/label/Label_123456.pdf"
             *     ] */
            urls?: string[];
        };
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
        /** @description The product group identifier (e.g., airconditioners, electronicdisplays) */
        ProductGroup: string;
        /** @description Unique identifier of the product in the database */
        RegistrationNumber: string;
        /** @description The language in which the product sheet should be returned. If not specified, all available languages will be returned. */
        Language: "BG" | "CS" | "DA" | "DE" | "ET" | "EL" | "EN" | "ES" | "FR" | "GA" | "HR" | "IT" | "LV" | "LT" | "HU" | "MT" | "NL" | "PL" | "PT" | "RO" | "SK" | "SL" | "FI" | "SV";
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    checkHealth: {
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
