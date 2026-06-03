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

## Contentful GraphQL API

La app incluye un cliente server-side para el GraphQL Content API de Contentful en `src/lib/contentful/graphql.ts` y una ruta proxy en `src/app/api/contentful/graphql/route.ts`.

Configura estas variables en tu entorno local o en el proveedor de despliegue:

```bash
CONTENTFUL_GRAPHQL_ACCESS_TOKEN=tu_content_delivery_token
CONTENTFUL_SPACE_ID=w4hosymzan98
CONTENTFUL_ENVIRONMENT_ID=master
CONTENTFUL_GRAPHQL_HOST=graphql.contentful.com
```

> Nota: `CONTENTFUL_GRAPHQL_ACCESS_TOKEN` debe ser un token de Content Delivery API o Preview API para leer contenido con GraphQL. El token de Content Management API usado por el MCP no sirve para el Content GraphQL API.

Puedes probar la ruta local con una consulta de tu modelo de contenido:

```bash
curl -X POST http://localhost:3000/api/contentful/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { __typename }"}'
```

Para consultas preview, agrega `"preview": true` al body y define `CONTENTFUL_PREVIEW_ACCESS_TOKEN`.

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
        "SPACE_ID": "w4hosymzan98",
        "ENVIRONMENT_ID": "master",
        "CONTENTFUL_HOST": "api.contentful.com"
      }
    }
  }
}
```

Si Cursor solicita autorizacion al usar el MCP remoto, inicia sesion con la cuenta de Contentful correspondiente. Para usar `contentful-local`, define esta variable de entorno en tu maquina antes de iniciar Cursor:

```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN="tu_token_cma"
```

No guardes el token real en archivos versionados.
