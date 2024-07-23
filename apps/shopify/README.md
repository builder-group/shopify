# Shopify App setup

This Shopify App setup is based on the [`shopify-app-template-remix`](https://github.com/Shopify/shopify-app-template-remix), with a few key differences to accommodate our monorepo setup.

## Differences from the Base Template

- [Base template](https://github.com/Shopify/shopify-app-template-remix)

### Monorepo Structure

Due to the limitations of nesting `pnpm` workspaces, we've modified the project structure and removed the `pnpm` workspace from the Shopify App in order to only have the monorepo `pnpm` workspace. Consequently, Shopify Extensions reside at the top level alongside the Shopify App (`app/`), rather than within the Shopify App (`app/`) inside an `extensions/` folder.

```
shopify/
├── app/ (<AppName>)
│   ├── src/
│   │   ├── entry.server.[jsx|tsx]
│   │   ├── root.[jsx|tsx]
│   │   └── ...
│   ├── shopify.app.toml
│   ├── shopify.web.toml
│   ├── package.json
│   ├── node_modules/
│   │   └── ...
│   └── .env
├── extension-1/
│   ├── shopify.extension.toml
│   ├── package.json
│   └── ...
├── extension-2/
│   ├── shopify.extension.toml
│   ├── package.json
│   └── ...


// instead of

shopify/
├── app/ (<AppName>)
│   ├── shopify.app.toml
│   ├── shopify.web.toml
│   ├── package.json
│   ├── node_modules/
│   │   └── ...
│   ├── app/
│   |   ├── entry.server.[jsx|tsx]
│   |   ├── root.[jsx|tsx]
│   |   └── ...
│   ├── extensions/
│   │   ├── extension-1/
│   │   │   ├── shopify.extension.toml
│   │   │   ├── package.json
│   │   │   └── ...
│   │   ├── extension-2/
│   │   │   ├── shopify.extension.toml
│   │   │   ├── package.json
│   │   │   └── ...
│   │   └── ...
|   └── .env
```

### Configuration Adjustments

- **ESLint**: Custom configuration tailored to our project needs.
- **TypeScript Config**: Adjusted `tsconfig.json` to meet our project requirements.
- **Package Management**: Modified `package.json` for specific dependencies and scripts.

### Different `appDirectory`

Since the Shopify app folder is now called `app/`, we renamed the [`appDirectory`](https://remix.run/docs/en/main/file-conventions/remix-config#appdirectory) to `src/` where among others the Remix routes reside.

### Session Storage

Instead of using the default [`PrismaSessionStorage`](https://www.npmjs.com/package/@shopify/shopify-app-session-storage-prisma), sessions are stored via API requests to a backend service. This custom session storage solution eliminates the need for a direct database connection within the Shopify app, allowing it to focus solely on being a frontend app and creating an abstract backend layer.

## Creating a New Extension

Due to the different extension setup, follow these steps to create a new extension:

1. **Generate Extension**: Use the command in the Shopify App's `app/` directory:

   ```bash
   pnpm shopify:generate extension
   ```

   Select the type of extension you wish to create. The extension will be generated in the `extensions/` folder inside the Shopify App's `app/` directory.

2. **Move Extension**: Move the newly created extension to the top level, alongside the `app/` directory.

   ```bash
   mv extensions/extension-1 ../
   ```

3. **Link Extension**: Update the `shopify.app.toml` file to include the new extension in the `extension_directories` array.

4. **Verify Generation**: Ensure the extension was generated correctly by checking the [`extensions-templates`](https://github.com/Shopify/extensions-templates).
