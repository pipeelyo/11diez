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

Este repositorio incluye la configuracion de Cursor para conectar el servidor MCP remoto de Contentful:

```json
{
  "mcpServers": {
    "contentful": {
      "url": "https://mcp.contentful.com/mcp"
    }
  }
}
```

Si Cursor solicita autorizacion al usar el MCP, inicia sesion con la cuenta de Contentful correspondiente.
