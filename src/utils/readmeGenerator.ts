import { BotVibeTemplatePackage, LatenodeNode, BuildStep } from '../types';

/**
 * Automatically generates a production-grade README.md file for the Latenode Marketplace Package
 * based on the canvas nodes, node descriptions, sticky notes, and sequential build steps.
 */
export function generatePackageReadme(pkg: BotVibeTemplatePackage): string {
  const {
    templateName,
    companyName,
    version,
    marketplaceListing,
    researchSummary,
    nodes,
    buildSteps,
    globalVariables,
    credentialPlaceholders,
    qaTestCases,
    slug,
  } = pkg;

  const totalNodes = nodes.length;
  const totalSteps = buildSteps.length;
  const passedTests = qaTestCases.filter(t => t.status === 'passed').length;

  const searchGroundingSection = pkg.searchGrounding?.used
    ? `
---

## 🌐 Live Technical & Market Grounding (Google Search)

This template's operational nodes, API schemas, and market viability were verified using **Google Search Grounding** (powered by \`gemini-3.5-flash\`):

- **Target Query**: \`${pkg.searchGrounding.query || 'Latenode template market demand & verified API contracts'}\`
- **Search Queries Verified**:
${(pkg.searchGrounding.webSearchQueries && pkg.searchGrounding.webSearchQueries.length > 0)
  ? pkg.searchGrounding.webSearchQueries.map(q => `  - \`${q}\``).join('\n')
  : '  - Real-time Latenode documentation and competitor scenario audit'}
- **Verified References & Documentation**:
${(pkg.searchGrounding.sources && pkg.searchGrounding.sources.length > 0)
  ? pkg.searchGrounding.sources.map(s => `  - [${s.title}](${s.url})`).join('\n')
  : '  - Latenode Developer Docs & Production Webhook Specs'}
`
    : '';

  const aiEngineBadge = pkg.aiProviderUsed
    ? `[![AI Architect](https://img.shields.io/badge/Architected_With-${encodeURIComponent(pkg.aiProviderUsed.provider.toUpperCase() + ' ' + pkg.aiProviderUsed.model)}-blueviolet.svg)](#)`
    : '';

  return `# ${templateName}

> **Official Latenode.com Template Package by ${companyName}**  
> *${marketplaceListing.shortTagline}*

[![Vendor](https://img.shields.io/badge/Vendor-${encodeURIComponent(companyName)}-amber.svg)](#)
[![Version](https://img.shields.io/badge/Version-${encodeURIComponent(version)}-blue.svg)](#)
[![Category](https://img.shields.io/badge/Category-${encodeURIComponent(marketplaceListing.category)}-purple.svg)](#)
[![Setup Time](https://img.shields.io/badge/Setup_Time-%3C${marketplaceListing.setupTimeMinutes}_min-emerald.svg)](#)
[![Latenode Ready](https://img.shields.io/badge/Latenode-Scenario_Import_Ready-brightgreen.svg)](#)
[![QA Standard](https://img.shields.io/badge/QA_Standard-BotVibe_Golden_Rule_v1.0-orange.svg)](#)
${aiEngineBadge}

---

## 📋 Executive Overview

**${templateName}** is an enterprise-grade, pre-built automation scenario engineered for deployment on **Latenode.com**. Designed according to the **BotVibe AI Golden Standards**, this package eliminates technical debt, prevents crashes via universal error handling, and standardizes credentials using isolated global variables.

- **Marketplace Category**: ${marketplaceListing.category}
- **Recommended Retail Price**: $${marketplaceListing.recommendedPriceUSD} USD
- **Setup & Onboarding Time**: ~${marketplaceListing.setupTimeMinutes} Minutes
- **Core Problem Solved**: ${researchSummary.coreProblemSolved}
- **Market Opportunity**: ${researchSummary.marketOpportunity}
- **Target Buyers**: ${marketplaceListing.targetBuyers.join(', ')}
${searchGroundingSection}

---

## 🏗️ Architecture & Canvas Node Specifications

This automation scenario consists of **${totalNodes} interconnected nodes** mapped on the Latenode canvas. Each node includes dedicated sticky note instructions, strict I/O contracts, and isolated configuration.

| # | Node Name | Type | Canvas Placement | Sticky Note / Description Summary |
|---|-----------|------|------------------|-----------------------------------|
${nodes.map((node, i) => `| ${i + 1} | \`${node.name}\` | **${node.type.replace('_', ' ').toUpperCase()}** | X:${node.position.x}, Y:${node.position.y} | ${node.stickyNote.title}: ${node.stickyNote.instructions.replace(/\n/g, ' ')} |`).join('\n')}

### Detailed Node Specifications & Sticky Notes

${nodes.map((node, i) => `#### ${i + 1}. \`${node.name}\` — ${node.title}
- **Node Type**: \`${node.type}\`
- **Canvas Coordinates**: (X: \`${node.position.x}\`, Y: \`${node.position.y}\`)
- **Sticky Note Badge**: \`${node.stickyNote.title}\` (Color: *${node.stickyNote.color}*)
- **Node Description & Instructions**:
  > ${node.stickyNote.instructions}
- **Required Credentials**: ${node.stickyNote.requiredCredentials.length > 0 ? node.stickyNote.requiredCredentials.map(c => `\`${c}\``).join(', ') : '*None (Internal logic)*'}
- **Input Contract**: \`${node.stickyNote.inputSchemaNotes}\`
- **Output Contract**: \`${node.stickyNote.outputContract}\`
- **Verification Rule**: \`${node.stickyNote.testRule}\`
${node.codeSnippet ? `
\`\`\`javascript
// Node Runtime Script (Node.js 20 ES Module)
${node.codeSnippet.trim()}
\`\`\`
` : ''}
---
`).join('\n')}

---

## 🪜 Sequential Build Steps & Implementation Guide

This section details the sequential build pipeline used by **OpenAI Codex** and autonomous **Antigravity Agents** to assemble and verify this workflow node-by-node.

${buildSteps.map(step => `### Step ${step.stepNumber}: ${step.title}

- **Target Node**: \`${step.nodeName}\` (\`${step.nodeType}\`)
- **Step Purpose**: ${step.purpose}
- **Canvas Sticky Note**:
  - *Badge*: \`${step.stickyNoteContent.badgeText}\`
  - *Instruction*: ${step.stickyNoteContent.instructions}
  - *Buyer Action*: ${step.stickyNoteContent.buyerAction}

#### Click-by-Click Configuration:
${step.configurationGuide.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

#### Unit Testing & Verification Assertion:
- **Expected Assertion**: \`${step.expectedAssertion}\`
- **Mock Input Payload ($node.in)**:
\`\`\`json
${JSON.stringify(step.testPayload, null, 2)}
\`\`\`

#### Codex Build Prompt:
\`\`\`text
${step.codexPrompt.trim()}
\`\`\`

#### Antigravity Autonomous Agent Directive:
\`\`\`text
${step.antigravityPrompt.trim()}
\`\`\`

---
`).join('\n')}

---

## 🔑 Global Variables & Credentials Matrix

To maintain the **BotVibe Golden Standard**, no sensitive tokens or secrets are hardcoded in scenario scripts. All credentials must be mapped through Latenode Global Variables.

### Required Global Variables

| Variable Key | Description | Default / Example Value |
|--------------|-------------|-------------------------|
${globalVariables.map(v => `| \`{{env.${v.key}}}\` | ${v.description} | \`${v.defaultValue}\` |`).join('\n')}

### Buyer Credential Placeholders

${credentialPlaceholders.map(c => `- **${c.name}** (\`${c.type}\`): ${c.required ? '**[REQUIRED]**' : '*[OPTIONAL]*'} — ${c.helperText}`).join('\n')}

---

## 🚀 Quick Start Buyer Onboarding Guide (<${marketplaceListing.setupTimeMinutes} Minutes)

Follow this standardized 4-step deployment ritual to activate this scenario in your Latenode workspace:

### 1. Import Scenario JSON
1. Log into your [Latenode.com](https://latenode.com) account.
2. In your workspace, click **"New Scenario"** &rarr; **"Import from File"**.
3. Select \`${slug}.latenode.json\` included in this package.

### 2. Configure Global Variables & Secrets
1. Go to **Settings** &rarr; **Global Variables** in Latenode.
2. Add each of the keys listed in the [Global Variables Matrix](#-global-variables--credentials-matrix) above.
3. Paste your live API keys / authorization tokens into the respective environment slots.

### 3. Bind Trigger Webhook
1. Locate the initial node (\`${nodes[0]?.name || 'BV_Trigger'}\`) on the canvas.
2. Copy your unique Latenode Webhook URL.
3. Paste this webhook endpoint into your source platform (CRM, Form, Webhook dispatcher, or Cron).

### 4. Execute Verification Test
1. Click **"Run Once"** on the top toolbar of Latenode.
2. Send the mock payload provided in [Unit Testing](#unit-testing--verification-assertion) for Step 1.
3. Verify that all nodes illuminate green and the output contract is confirmed.

---

## 🛡️ Quality Assurance & Test Verification

This template has passed **${passedTests} of ${qaTestCases.length}** BotVibe Golden Rule automated verification tests:

| Test Case | Type | Assertion Condition | Status |
|-----------|------|---------------------|--------|
${qaTestCases.map(t => `| **${t.name}** | \`${t.testType}\` | \`${t.assertion}\` | **${t.status.toUpperCase()}** |`).join('\n')}

---

## 📦 Package Distribution Manifest

This submission package contains all files required for Latenode Marketplace certification:

- **\`README.md\`**: Comprehensive architecture, node directory, and build guide (this file).
- **\`${slug}.latenode.json\`**: Verified Latenode Scenario export file ready for 1-click import.
- **\`01_MARKETPLACE_LISTING.md\`**: High-converting marketplace title, tagline, description, and tags.
- **\`02_BUYER_SETUP_GUIDE.md\`**: Step-by-step buyer onboarding and troubleshooting manual.
- **\`03_QA_TEST_REPORT.md\`**: Detailed QA test run logs and assertion reports.
- **\`04_CODEX_BUILD_PROMPTS.md\`**: Sequential OpenAI Codex prompts for programmatic workflow assembly.
- **\`05_ANTIGRAVITY_PLAYBOOK.md\`**: Antigravity agent playbook for autonomous pipeline construction.
- **\`06_CREDENTIALS_AND_VARIABLES.md\`**: Credentials matrix and environment variable definitions.

---

## 📄 Support & Licensing

- **Developed By**: ${companyName}
- **Website / Inquiries**: michael@botvibe.ai
- **Standard**: BotVibe Golden Standard v1.0
- **License**: Commercial End-User License (Latenode Marketplace compliant)

*Generated automatically by BotVibe AI Latenode Studio.*
`;
}
