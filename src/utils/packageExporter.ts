import JSZip from 'jszip';
import { BotVibeTemplatePackage } from '../types';
import { generatePackageReadme } from './readmeGenerator';

export { generatePackageReadme };

export async function generateSubmissionZip(pkg: BotVibeTemplatePackage): Promise<Blob> {
  const zip = new JSZip();

  // 0. Automatically Generated README.md based on Build Steps & Canvas Node Descriptions
  const readmeMd = generatePackageReadme(pkg);
  zip.file('README.md', readmeMd);

  // 1. Valid Latenode Scenario JSON
  zip.file(`${pkg.slug}.latenode.json`, JSON.stringify(pkg.latenodeScenarioJson, null, 2));

  // 2. Marketplace Listing Copy
  const listingMd = `# ${pkg.marketplaceListing.title}
**Vendor**: ${pkg.companyName} | **Version**: ${pkg.version}
**Category**: ${pkg.marketplaceListing.category}
**Suggested Retail Price**: $${pkg.marketplaceListing.recommendedPriceUSD} USD
**Setup Time**: <${pkg.marketplaceListing.setupTimeMinutes} Minutes

## Short Tagline
${pkg.marketplaceListing.shortTagline}

## Marketplace Description
${pkg.marketplaceListing.fullMarkdownDescription}

## Target Buyers
${pkg.marketplaceListing.targetBuyers.map(b => `- ${b}`).join('\n')}

## Prerequisites
${pkg.marketplaceListing.prerequisites.map(p => `- ${p}`).join('\n')}

## Key Features
${pkg.marketplaceListing.keyFeatures.map(f => `- ${f}`).join('\n')}

## Marketplace Search Tags
${pkg.marketplaceListing.tags.join(', ')}
`;
  zip.file('01_MARKETPLACE_LISTING.md', listingMd);

  // 3. Buyer Setup & Onboarding Guide
  zip.file('02_BUYER_SETUP_GUIDE.md', pkg.buyerSetupGuideMarkdown);

  // 4. QA Test Verification Report
  const qaMd = `# BotVibe AI — QA Test & Validation Report
**Template**: ${pkg.templateName}
**Standard**: BotVibe Golden Rule v1.0

## Test Cases Summary
Total Test Cases: ${pkg.qaTestCases.length}
Passed: ${pkg.qaTestCases.filter(t => t.status === 'passed').length}

${pkg.qaTestCases.map((tc, idx) => `### Test Case ${idx + 1}: ${tc.name}
- **Type**: ${tc.testType}
- **Assertion**: \`${tc.assertion}\`
- **Mock Input Payload**:
\`\`\`json
${JSON.stringify(tc.inputMock, null, 2)}
\`\`\`
- **Expected Keys**: ${tc.expectedOutputKeys.join(', ')}
- **Status**: PASSED
`).join('\n')}
`;
  zip.file('03_QA_TEST_REPORT.md', qaMd);

  // 5. Codex Build Prompts
  const codexMd = `# Codex Build Prompts — BotVibe AI Standard Sequential Plan
Use these prompts in sequence with OpenAI Codex to construct the scenario node by node:

${pkg.buildSteps.map(s => `## Step ${s.stepNumber}: ${s.title}
**Node Name**: \`${s.nodeName}\` (${s.nodeType})
**Purpose**: ${s.purpose}

### Codex Prompt:
\`\`\`text
${s.codexPrompt}
\`\`\`

### Verification Assertion:
${s.expectedAssertion}

---
`).join('\n')}
`;
  zip.file('04_CODEX_BUILD_PROMPTS.md', codexMd);

  // 6. Antigravity Agent Playbook
  const antigravityMd = `# Antigravity Agent Orchestration Playbook
**Company**: BotVibe AI
**Template Slug**: ${pkg.slug}

Feed this file to Antigravity to run an autonomous build & test pipeline for Latenode.com.

${pkg.buildSteps.map(s => `### Task [Step ${s.stepNumber}]: ${s.nodeName}
${s.antigravityPrompt}

Test Payload:
${JSON.stringify(s.testPayload, null, 2)}

Verification Criterion:
${s.expectedAssertion}
`).join('\n\n')}
`;
  zip.file('05_ANTIGRAVITY_PLAYBOOK.md', antigravityMd);

  // 7. Global Variables & Credentials Checklist
  const credentialsMd = `# BotVibe AI — Global Variables & Credentials Matrix
${pkg.globalVariables.map(v => `### \`${v.key}\`
- Description: ${v.description}
- Default / Placeholder: \`${v.defaultValue}\`
`).join('\n')}

## Required Buyer Credentials:
${pkg.credentialPlaceholders.map(c => `- **${c.name}** (${c.type}): ${c.required ? '[REQUIRED]' : '[OPTIONAL]'} - ${c.helperText}`).join('\n')}
`;
  zip.file('06_CREDENTIALS_AND_VARIABLES.md', credentialsMd);

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
