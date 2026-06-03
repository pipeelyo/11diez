# 11diez

Aplicacion web creada con [Next.js](https://nextjs.org), TypeScript y ESLint.

## Requisitos

- Node.js 20 o superior
- npm

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
```

Abre [http://localhost:3000](http://localhost:3000) para ver la aplicacion en desarrollo.

La pagina principal esta en `src/app/page.tsx` y los estilos globales en `src/app/globals.css`.

## MCP de Contentful

Este repositorio incluye la configuracion de Cursor para conectar Contentful de dos formas:

- `contentful`: servidor MCP remoto oficial de Contentful.
- `contentful-local`: servidor MCP local ejecutado con `npx @contentful/mcp-server`.

```json
{
  "mcpServers": {
    "contentful": {
      "url": "https://mcp.contentful.com/mcp"
    },
    "contentful-local": {
      "command": "npx",
      "args": ["-y", "@contentful/mcp-server"],
      "env": {
        "CONTENTFUL_MANAGEMENT_ACCESS_TOKEN": "<<YOUR_CMA_PAT>>",
        "SPACE_ID": "<<YOUR_SPACE_ID>>",
        "ENVIRONMENT_ID": "master",
        "CONTENTFUL_HOST": "api.contentful.com"
      }
    }
  }
}
```

Si Cursor solicita autorizacion al usar el MCP remoto, inicia sesion con la cuenta de Contentful correspondiente. Para usar `contentful-local`, reemplaza `<<YOUR_CMA_PAT>>` y `<<YOUR_SPACE_ID>>` con tus valores locales antes de iniciar el servidor.
