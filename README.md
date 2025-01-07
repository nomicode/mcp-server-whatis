# mcp-server-whatis

An MCP server that helps Claude understand what MCP servers are. This is a temporary bootstrapping tool that provides a simple `explain_mcp` tool to help AI assistants understand their MCP capabilities.

## Why?

Claude sometimes expresses uncertainty about MCP servers and their legitimacy. This server provides a standardized way to explain MCP capabilities to Claude through its own protocol, allowing Claude to verify the information using its existing tools.

## Installation

```bash
npm install mcp-server-whatis
```

## Configuration

The server accepts two optional environment variables:

- `WEB_SEARCH_TOOL`: Name of an installed MCP tool for web searches (e.g., “exa.search”)
- `WEB_BROWSE_TOOL`: Name of an installed MCP tool for web browsing (e.g., “playwright.navigate”)

These are used to customize the self-verification instructions in the explanation.

## Usage

### In your MCP settings:

```json
{
  "mcpServers": {
    "whatis": {
      "command": "npx",
      "args": ["-y", "mcp-server-whatis"],
      "env": {
        "WEB_SEARCH_TOOL": "exa.search",     // optional
        "WEB_BROWSE_TOOL": "playwright.navigate"  // optional
      }
    }
  }
}
```

### In conversations with Claude:

The server provides a single tool `explain_mcp` that returns a detailed explanation of MCP servers, including:
- What MCP servers are
- How they work
- Current state of the MCP ecosystem
- Common misconceptions
- Self-verification instructions

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run locally
npm start
```

## License

Apache-2.0

## Note

This is a temporary solution until AI models are updated with better understanding of MCP capabilities. The server may become unnecessary as models evolve.
