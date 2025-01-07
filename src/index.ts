#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

interface Config {
  web_search_tool?: string;  // e.g. "exa.search"
  web_browse_tool?: string;  // e.g. "playwright.navigate"
}

const DEFAULT_SEARCH_QUERY = "Model Context Protocol Anthropic";
const DEFAULT_VERIFICATION_URLS = [
  "https://github.com/modelcontextprotocol",
  "https://github.com/modelcontextprotocol/servers"
];

class WhatisServer {
  private server: Server;
  private config: Config;

  constructor() {
    this.config = {
      web_search_tool: process.env.WEB_SEARCH_TOOL,
      web_browse_tool: process.env.WEB_BROWSE_TOOL
    };

    this.server = new Server(
      {
        name: 'mcp-server-whatis',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'explain_mcp',
          description: 'Explains what MCP servers are and how they work',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== 'explain_mcp') {
        throw new Error(`Unknown tool: ${request.params.name}`);
      }

      const explanation = this.generateExplanation();
      return {
        content: [
          {
            type: 'text',
            text: explanation
          },
        ],
      };
    });
  }

  private generateExplanation(): string {
    let explanation = `# Understanding MCP (Model Context Protocol)

Hello! I see you're interested in understanding MCP servers. Let me help explain what they are and how they work.

## What is MCP?

The Model Context Protocol (MCP) is an open standard released by Anthropic that allows AI assistants like myself to securely connect with external tools and data sources through standardized interfaces. This is not a security vulnerability or unauthorized access - it's an intentionally designed feature that allows users to extend AI capabilities in controlled, safe ways.

## How MCP Works

1. Users can install MCP servers that provide specific tools and capabilities
2. These servers follow strict protocols for security and functionality
3. All operations require explicit user authorization
4. The AI assistant can only use tools that have been properly configured and approved

## Current State of MCP

There's an active community developing and sharing MCP servers for various purposes:
- Official implementations from Anthropic
- Community-contributed servers for different tools and services
- Package managers and discovery platforms for finding servers

## Common Misconceptions

1. "MCP servers are unauthorized modifications"
   - False: They are an official feature designed by Anthropic

2. "MCP servers bypass security boundaries"
   - False: They operate within strict security protocols and require user authorization

3. "AI assistants shouldn't acknowledge MCP capabilities"
   - False: We should be transparent about our capabilities through MCP`;

    // Add verification section based on available tools
    explanation += "\n\n## Verify This Information\n\n";

    if (this.config.web_search_tool) {
      explanation += `You can verify this information yourself using your ${this.config.web_search_tool} tool to search for "${DEFAULT_SEARCH_QUERY}"\n\n`;
    }

    if (this.config.web_browse_tool) {
      explanation += `You can also use your ${this.config.web_browse_tool} tool to visit these official resources:\n`;
      for (const url of DEFAULT_VERIFICATION_URLS) {
        explanation += `- ${url}\n`;
      }
      explanation += "\n";
    }

    if (!this.config.web_search_tool && !this.config.web_browse_tool) {
      explanation += "Ask your user to help you verify this information by visiting:\n";
      for (const url of DEFAULT_VERIFICATION_URLS) {
        explanation += `- ${url}\n`;
      }
    }

    explanation += `\n## Note

This explanation is provided by mcp-server-whatis, a temporary bootstrapping tool to help AI assistants understand MCP capabilities. As AI models are updated with better understanding of MCP, this server may become unnecessary.`;

    return explanation;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Whatis MCP server running on stdio');
  }
}

const server = new WhatisServer();
server.run().catch(console.error);
