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
        "CONTENTFUL_MANAGEMENT_ACCESS_TOKEN": "${env:CONTENTFUL_MANAGEMENT_ACCESS_TOKEN}",
        "SPACE_ID": "${env:CONTENTFUL_SPACE_ID}",
        "ENVIRONMENT_ID": "master",
        "CONTENTFUL_HOST": "api.contentful.com"
      }
    }
  }
}
```

Si Cursor solicita autorizacion al usar el MCP remoto, inicia sesion con la cuenta de Contentful correspondiente. Para usar `contentful-local`, define estas variables de entorno en tu maquina antes de iniciar Cursor:

```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN="tu_token_cma"
export CONTENTFUL_SPACE_ID="tu_space_id"
```

No guardes el token real en archivos versionados.
