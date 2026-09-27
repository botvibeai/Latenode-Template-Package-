import { BotVibeTemplatePackage } from '../types';

export const SAMPLE_RESEARCH_REPORTS = [
  {
    id: 'report-lead-enricher',
    title: 'Omnichannel B2B AI Lead Enrichment & Auto-Router',
    category: 'Sales Automation & CRM',
    estimatedValue: '$89 / sale',
    description:
      'Research analysis on high-converting B2B lead generation funnels. Businesses lose 42% of leads due to >15 minute response times. Needs an instant webhook receiver, email/domain verification via custom JS, automated company data scraping using Headless Browser Puppeteer or Clearbit, AI lead qualification score (1-100) using Gemini 3.8 Flash, routing to HubSpot/Airtable, and instant Slack alert with 1-click booking link.',
    sampleRawReport: `# RESEARCH REPORT: B2B Lead Enrichment & AI Qualification Funnel
Target Platform: Latenode.com
Vendor / Creator: BotVibe AI
Market Need: SMBs and digital agencies receive inbound form submissions from Webflow, Typeform, and LinkedIn Ads, but manual triage takes 2-4 hours. Fast response (<5m) increases close rates by 391%.

Required Flow:
1. Inbound Webhook: Receive lead payload (name, email, company, budget, requirements).
2. Input Verification & Rate Limiting: JavaScript node checking payload integrity, sanitizing input, verifying business email domain.
3. Headless Browser / Deep Research: If company website provided, scrape metadata and company size via Latenode Headless Browser Puppeteer node.
4. AI Lead Scoring & Personalized Icebreaker: Gemini AI node evaluating budget vs requirements, generating fit score (A/B/C/Disqualified) and a custom 2-sentence sales pitch tailored to the prospect.
5. CRM Sync: HTTP Request node to HubSpot or Airtable API creating/updating deal record.
6. Team Notification: Post structured rich block notification to Slack / Telegram sales channel.
7. Webhook Response: Immediate 200 OK JSON response with qualification status.
8. Error Handling Branch: If any enrichment step times out or fails, gracefully save raw payload to backup Google Sheets/Supabase and return fallback 200 acknowledgment.

Monetization & Latenode Marketplace Positioning:
- Target Price: $49 - $89 one-off purchase
- Target Audience: Agencies, SaaS founders, Sales Operations Leads
- Setup Time: Under 7 minutes (only requires Hubspot API key, Slack Webhook, and Gemini API key)`
  },
  {
    id: 'report-price-watchdog',
    title: 'Competitor Price & Stock Watchdog with Headless Browser',
    category: 'E-commerce & Market Intelligence',
    estimatedValue: '$69 / sale',
    description:
      'E-commerce intelligence system running on scheduled cron intervals. Spawns Latenode Headless Browser to bypass anti-bot JavaScript rendering on competitor store product pages, extracts live price, discount, and stock availability, compares against local datastore, and triggers price-match alerts.',
    sampleRawReport: `# RESEARCH REPORT: Competitor Price & Stock Scraper on Latenode
Target Platform: Latenode.com
Vendor: BotVibe AI
Market Need: E-commerce brands on Shopify/Amazon lose sales when competitors run flash discounts or run out of stock. Existing SaaS tools charge $150+/month. A reliable, self-hosted Latenode template provides infinite runs with zero monthly SaaS tax.

Required Flow:
1. Schedule Cron Trigger: Runs every 4 hours (configurable by user).
2. Competitor URL Datastore: Fetch target product URLs and baseline prices from Latenode Datastore or Google Sheet.
3. Headless Browser Puppeteer Node: Navigate to URL, wait for dynamic selector (.price-display, .stock-badge), grab screenshot or rendered DOM.
4. JavaScript Parser: Extract raw numerical price, currency, availability status, and calculate delta percentage against baseline.
5. AI Analysis (Gemini Flash): Analyze promotional tags (e.g. "Buy 1 Get 1", "20% off with code FLASH"), classify promotional aggressiveness.
6. Alert Router: If price drops >5% or stock drops to "Out of Stock", trigger urgent Discord/Slack webhook and push to Google Sheet log.
7. Global Error Handler: Retry failed URLs up to 2 times; notify admin if competitor changes page layout structure.`
  },
  {
    id: 'report-support-triage',
    title: 'Customer Support AI Auto-Triager & Ticket Auto-Responder',
    category: 'Customer Support & Operations',
    estimatedValue: '$79 / sale',
    description:
      'High-volume customer support automation. Ingests incoming tickets via Zendesk or email webhook, performs sentiment and urgency scoring, retrieves relevant FAQ knowledge context, drafts AI responses for agent approval, and escalates urgent churn risks immediately.',
    sampleRawReport: `# RESEARCH REPORT: Autonomous Support Ticket Triage Engine
Target Platform: Latenode.com
Vendor: BotVibe AI
Market Need: Fast-growing SaaS companies receive hundreds of repetitive tickets. Agents spend 60% of their day answering the same tier-1 queries or tagging categories.

Required Flow:
1. Webhook / Mailgun Trigger: Capture customer inquiry, sender email, and ticket subject.
2. Python / JS Sanitizer: Strip HTML tags, detect language, check for VIP email domain.
3. AI Classification & Sentiment (Gemini): Classify ticket category (Billing, Bug, Feature Request, How-To), rate urgency (P1 Critical to P4 Low), and draft high-empathy response.
4. Database Knowledge Search: Query company FAQ database or Notion page for matching answers.
5. Zendesk/HelpDesk API Update: Tag ticket, assign priority, and insert private draft note with AI solution.
6. Emergency Churn Alert: If sentiment is Angry/Disappointed and customer is high-tier, dispatch urgent SMS / Slack alert to account manager.`
  }
];

export const INITIAL_TEMPLATE: BotVibeTemplatePackage = {
  id: 'bv-tmpl-001',
  templateName: 'Omnichannel B2B AI Lead Enrichment & CRM Router',
  slug: 'bv-omnichannel-b2b-lead-enrichment',
  companyName: 'BotVibe AI',
  version: '1.0.0-PROD',
  createdAt: '2026-09-19',
  researchSummary: {
    reportTitle: 'Omnichannel B2B AI Lead Enrichment & CRM Router',
    marketOpportunity: 'SMB sales teams and digital agencies lose 40%+ of warm leads due to slow response times. A pre-built turnkey automation that validates, scores, and alerts within 3 seconds sells readily on Latenode marketplace.',
    coreProblemSolved: 'Automates manual prospect vetting, enriches corporate background, generates personalized sales icebreakers via Gemini, and pushes structured data directly to CRM and Slack with zero manual data entry.',
    targetIndustries: ['B2B SaaS', 'Marketing Agencies', 'Consulting Firms', 'High-Ticket Services'],
    monetizationAngle: 'One-off template sale at $69-$89 with upsell to custom CRM connector and BotVibe AI monthly workflow maintenance.'
  },
  globalVariables: [
    { key: 'GEMINI_API_KEY', description: 'Google Gemini API Key for AI lead qualification & icebreaker creation', defaultValue: '{{env.GEMINI_API_KEY}}' },
    { key: 'SLACK_WEBHOOK_URL', description: 'Incoming Webhook URL for sales team Slack channel', defaultValue: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK' },
    { key: 'CRM_API_BEARER_TOKEN', description: 'Bearer authorization token for HubSpot / Airtable REST API', defaultValue: 'pat-na1-xxxxxxxx' },
    { key: 'MINIMUM_BUDGET_THRESHOLD', description: 'Minimum qualified prospect budget in USD', defaultValue: '3000' }
  ],
  credentialPlaceholders: [
    { name: 'Gemini AI Credential', type: 'API Key', required: true, helperText: 'Found in Google AI Studio -> Get API Key' },
    { name: 'Slack Sales Channel Webhook', type: 'Webhook URL', required: true, helperText: 'Create an Incoming Webhook in Slack API app configuration' },
    { name: 'CRM Integration', type: 'OAuth or Bearer Token', required: false, helperText: 'HubSpot or Airtable Private App Access Token' }
  ],
  nodes: [
    {
      id: 'node-1',
      name: 'BV_TRIG_01_WebhookReceiver',
      type: 'webhook',
      title: 'Inbound Lead Webhook',
      subtitle: 'POST /v1/inbound-lead',
      position: { x: 80, y: 220 },
      stickyNote: {
        title: 'STEP 1: INBOUND LEAD WEBHOOK',
        instructions: 'Paste this Latenode Webhook URL into your Webflow, Typeform, or custom frontend form. Receives POST requests containing prospect data.',
        requiredCredentials: ['None (Public Webhook URL provided by Latenode)'],
        inputSchemaNotes: 'JSON Body: { name, email, company, budget, website, note }',
        outputContract: 'Payload passed directly to downstream node as $1.body',
        testRule: 'Verify HTTP 200 received upon test dispatch from Postman or Curl.',
        color: 'blue'
      },
      config: {
        method: 'POST',
        path: '/v1/inbound-lead',
        authorization: 'None'
      },
      sampleInput: {
        headers: { 'content-type': 'application/json' },
        body: {
          name: 'Sarah Jenkins',
          email: 'sjenkins@apexlogistics.io',
          company: 'Apex Logistics Global',
          website: 'https://apexlogistics.io',
          budget: 15000,
          notes: 'Looking to automate automated dispatch scheduling and client notifications.'
        }
      },
      sampleOutput: {
        name: 'Sarah Jenkins',
        email: 'sjenkins@apexlogistics.io',
        company: 'Apex Logistics Global',
        website: 'https://apexlogistics.io',
        budget: 15000,
        notes: 'Looking to automate automated dispatch scheduling and client notifications.',
        receivedAt: '2026-09-19T04:00:00.000Z'
      }
    },
    {
      id: 'node-2',
      name: 'BV_AUTH_02_ValidateAndSanitize',
      type: 'javascript',
      title: 'Payload Validator & Sanitizer',
      subtitle: 'Node.js 20 Custom Script',
      position: { x: 380, y: 220 },
      stickyNote: {
        title: 'STEP 2: VALIDATION & DATA SANITIZATION',
        instructions: 'Validates email syntax, blocks disposable email domains, sanitizes text to prevent injection, and extracts root company domain.',
        requiredCredentials: ['None'],
        inputSchemaNotes: 'Consumes $1.body from Inbound Webhook',
        outputContract: 'Returns sanitized object with isBusinessEmail (bool), cleanWebsite, and normalizedBudget (num)',
        testRule: 'Test with free mail (gmail.com) and business mail (apexlogistics.io) to ensure correct flag.',
        color: 'amber'
      },
      config: {
        runtime: 'nodejs20',
        timeoutMs: 5000
      },
      codeSnippet: `// BotVibe AI Standard Node: BV_AUTH_02_ValidateAndSanitize
// Author: BotVibe AI | Standard Template Build #1

const raw = $1.body || {};

// 1. Sanitize text fields
const cleanString = (str) => typeof str === 'string' ? str.trim().replace(/[<>]/g, '') : '';

const name = cleanString(raw.name);
const email = cleanString(raw.email).toLowerCase();
const company = cleanString(raw.company);
const website = cleanString(raw.website);
const notes = cleanString(raw.notes);
const budget = Number(raw.budget) || 0;

// 2. Email domain validation
const freeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
const emailDomain = email.includes('@') ? email.split('@')[1] : '';
const isBusinessEmail = emailDomain.length > 0 && !freeDomains.includes(emailDomain);

// 3. Normalized website URL
let cleanWebsite = website;
if (cleanWebsite && !cleanWebsite.startsWith('http://') && !cleanWebsite.startsWith('https://')) {
  cleanWebsite = 'https://' + cleanWebsite;
}

return {
  isValid: email.length > 5 && email.includes('@'),
  name,
  email,
  emailDomain,
  isBusinessEmail,
  company: company || (emailDomain ? emailDomain.split('.')[0].toUpperCase() : 'Unknown'),
  cleanWebsite,
  budget,
  notes,
  processedAt: new Date().toISOString()
};`,
      sampleInput: {
        name: 'Sarah Jenkins',
        email: 'sjenkins@apexlogistics.io',
        company: 'Apex Logistics Global',
        website: 'apexlogistics.io',
        budget: 15000,
        notes: 'Looking to automate automated dispatch scheduling and client notifications.'
      },
      sampleOutput: {
        isValid: true,
        name: 'Sarah Jenkins',
        email: 'sjenkins@apexlogistics.io',
        emailDomain: 'apexlogistics.io',
        isBusinessEmail: true,
        company: 'Apex Logistics Global',
        cleanWebsite: 'https://apexlogistics.io',
        budget: 15000,
        notes: 'Looking to automate automated dispatch scheduling and client notifications.',
        processedAt: '2026-09-19T04:00:01.000Z'
      }
    },
    {
      id: 'node-3',
      name: 'BV_PROC_03_HeadlessEnricher',
      type: 'headless_browser',
      title: 'Headless Browser Prospect Research',
      subtitle: 'Puppeteer HTML & Meta Extractor',
      position: { x: 680, y: 220 },
      stickyNote: {
        title: 'STEP 3: DEEP COMPANY ENRICHMENT',
        instructions: 'Launches headless browser instance to inspect prospect website, retrieve meta tags, page title, and identify value proposition.',
        requiredCredentials: ['Uses Latenode built-in Headless Browser resource pool'],
        inputSchemaNotes: 'Requires cleanWebsite from Step 2',
        outputContract: 'Outputs pageTitle, metaDescription, and detectedTechStack',
        testRule: 'Handle fallback gracefully if prospect website is offline or returns 404.',
        color: 'purple'
      },
      config: {
        url: '{{$2.cleanWebsite}}',
        waitForTimeout: 3000,
        actions: [
          { action: 'evaluate', script: 'return { title: document.title, description: document.querySelector("meta[name=description]")?.content || "No description provided" };' }
        ]
      },
      codeSnippet: `// Headless Puppeteer extraction logic
const page = await browser.newPage();
try {
  await page.goto($2.cleanWebsite, { waitUntil: 'domcontentloaded', timeout: 10000 });
  const meta = await page.evaluate(() => {
    return {
      title: document.title || '',
      metaDesc: document.querySelector('meta[name="description"]')?.content || '',
      h1: document.querySelector('h1')?.innerText || ''
    };
  });
  return { success: true, ...meta };
} catch (err) {
  return { success: false, fallbackNote: 'Website enrichment timed out or unreachable', error: err.message };
} finally {
  await page.close();
}`,
      sampleInput: {
        cleanWebsite: 'https://apexlogistics.io'
      },
      sampleOutput: {
        success: true,
        title: 'Apex Logistics Global - Real-time freight & intermodal routing solutions',
        metaDesc: 'Apex Logistics connects 400+ carriers with freight forwarders worldwide.',
        h1: 'Smarter freight management powered by real-time tracking.'
      }
    },
    {
      id: 'node-4',
      name: 'BV_AI_04_GeminiScorerAndPitch',
      type: 'ai_prompt',
      title: 'Gemini AI Lead Scorer & Icebreaker',
      subtitle: 'Gemini 3.8 Flash Reasoning Engine',
      position: { x: 980, y: 220 },
      stickyNote: {
        title: 'STEP 4: AI QUALIFICATION & CUSTOM ICEBREAKER',
        instructions: 'Evaluates the lead budget, company profile, and requirements. Returns structured JSON containing Lead Tier (Tier 1 High Value / Tier 2 Medium / Tier 3 Low), score (0-100), key pain points, and a ready-to-send personalized email icebreaker.',
        requiredCredentials: ['GEMINI_API_KEY stored in Settings > Global Variables'],
        inputSchemaNotes: 'Consumes $2 (lead info) and $3 (company enrichment)',
        outputContract: 'Valid JSON: { leadTier, score, reasoning, personalizedIcebreaker, suggestedCallAgenda }',
        testRule: 'Strict JSON schema response validation; ensure no markdown delimiters.',
        color: 'emerald'
      },
      config: {
        model: 'gemini-3.8-flash',
        temperature: 0.2,
        systemPrompt: `You are the BotVibe AI Lead Qualification System. Analyze the prospect data and return strict JSON without markdown wrappers. Format:
{
  "leadTier": "Tier 1 (High Priority)" | "Tier 2 (Standard)" | "Tier 3 (Nurture)",
  "score": number between 0 and 100,
  "qualificationSummary": string,
  "personalizedIcebreaker": string (2-3 sentences max, referring specifically to their company and notes),
  "recommendedAction": string
}`,
        userPrompt: `Prospect Name: {{$2.name}}
Company: {{$2.company}}
Budget: \${{$2.budget}}
Notes: {{$2.notes}}
Website Title: {{$3.title}}
Website Context: {{$3.metaDesc}}`
      },
      sampleInput: {
        name: 'Sarah Jenkins',
        company: 'Apex Logistics Global',
        budget: 15000,
        notes: 'Looking to automate automated dispatch scheduling and client notifications.',
        title: 'Apex Logistics Global - Real-time freight & intermodal routing solutions'
      },
      sampleOutput: {
        leadTier: 'Tier 1 (High Priority)',
        score: 94,
        qualificationSummary: 'Strong budget ($15k) and high-value automation use case (dispatch scheduling across 400+ carriers). Qualified for immediate executive discovery call.',
        personalizedIcebreaker: 'Hi Sarah, saw how Apex Logistics is coordinating freight across 400+ carriers—streamlining your real-time dispatch scheduling and client notification loops will save dozens of manual operational hours per shift.',
        recommendedAction: 'Schedule immediate 20-min strategy call; send Tier-1 calendar link.'
      }
    },
    {
      id: 'node-5',
      name: 'BV_DEST_05_PostToSlackAlert',
      type: 'http_request',
      title: 'Slack Sales Channel Alert',
      subtitle: 'Rich Block Kit Dispatcher',
      position: { x: 1280, y: 220 },
      stickyNote: {
        title: 'STEP 5: SLACK VIP SALES ALERT',
        instructions: 'Pushes an eye-catching formatted message to your #sales-leads channel with lead tier, score badge, prospect contact info, and 1-click email/call action buttons.',
        requiredCredentials: ['SLACK_WEBHOOK_URL variable'],
        inputSchemaNotes: 'Consumes $2 (contact info) and $4 (AI score and icebreaker)',
        outputContract: 'Slack Webhook responds with HTTP 200 "ok"',
        testRule: 'Verify message renders cleanly on both mobile and desktop Slack.',
        color: 'rose'
      },
      config: {
        method: 'POST',
        url: '{{env.SLACK_WEBHOOK_URL}}',
        headers: { 'Content-Type': 'application/json' },
        body: {
          blocks: [
            {
              type: 'header',
              text: { type: 'plain_text', text: '🚀 New High-Value Lead: {{$2.name}} (Score: {{$4.score}}/100)' }
            },
            {
              type: 'section',
              fields: [
                { type: 'mrkdwn', text: '*Company:*\n{{$2.company}}' },
                { type: 'mrkdwn', text: '*Budget:*\n${{$2.budget}}' },
                { type: 'mrkdwn', text: '*Tier:*\n{{$4.leadTier}}' },
                { type: 'mrkdwn', text: '*Email:*\n{{$2.email}}' }
              ]
            },
            {
              type: 'section',
              text: { type: 'mrkdwn', text: '*💡 Suggested AI Icebreaker:*\n>_{{$4.personalizedIcebreaker}}_' }
            }
          ]
        }
      },
      sampleInput: {
        name: 'Sarah Jenkins',
        company: 'Apex Logistics Global',
        score: 94
      },
      sampleOutput: {
        status: 200,
        body: 'ok'
      }
    },
    {
      id: 'node-6',
      name: 'BV_RESP_06_WebhookResponse',
      type: 'webhook_response',
      title: 'Instant Webhook Acknowledgment',
      subtitle: 'HTTP 200 JSON Response',
      position: { x: 1580, y: 220 },
      stickyNote: {
        title: 'STEP 6: CLIENT ACKNOWLEDGMENT',
        instructions: 'Closes the incoming HTTP connection with status 200 and returns a clean confirmation payload for the submitting form UI.',
        requiredCredentials: ['None'],
        inputSchemaNotes: 'Consumes $4 qualification result',
        outputContract: 'HTTP 200 { success: true, leadId, tier, message }',
        testRule: 'Must respond within 2.5 seconds to avoid form timeout.',
        color: 'slate'
      },
      config: {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          success: true,
          leadTier: '{{$4.leadTier}}',
          score: '{{$4.score}}',
          message: 'Lead received and processed successfully by BotVibe AI engine.'
        }
      },
      sampleInput: {
        leadTier: 'Tier 1 (High Priority)',
        score: 94
      },
      sampleOutput: {
        statusCode: 200,
        body: {
          success: true,
          leadTier: 'Tier 1 (High Priority)',
          score: 94,
          message: 'Lead received and processed successfully by BotVibe AI engine.'
        }
      }
    },
    {
      id: 'node-7',
      name: 'BV_ERR_07_GlobalErrorHandler',
      type: 'error_handler',
      title: 'Universal Error & Fallback Catcher',
      subtitle: 'Failsafe Logging & Slack Alert',
      position: { x: 830, y: 480 },
      stickyNote: {
        title: 'STANDARD ERROR HANDLER (BOTVIBE GOLDEN RULE)',
        instructions: 'Intercepts any upstream node failure, catches stack trace and payload, logs to emergency storage, and pings support channel so zero leads are ever dropped.',
        requiredCredentials: ['SLACK_WEBHOOK_URL or backup error email'],
        inputSchemaNotes: 'Captures $error object automatically from Latenode runtime',
        outputContract: 'Returns HTTP 200 with fallback degraded flag to prevent user error on frontends',
        testRule: 'Trigger a simulated syntax error in Step 2 to verify Step 7 executes.',
        color: 'rose'
      },
      config: {
        target: 'all_nodes',
        notifyChannel: 'Slack',
        fallbackResponseStatus: 200
      },
      sampleInput: {
        error: { message: 'Timeout reaching target external endpoint', node: 'BV_PROC_03_HeadlessEnricher' }
      },
      sampleOutput: {
        handled: true,
        loggedAt: '2026-09-19T04:00:03.000Z',
        adminAlertDispatched: true
      }
    }
  ],
  connections: [
    { id: 'conn-1', fromNodeId: 'node-1', fromPort: 'output', toNodeId: 'node-2', toPort: 'input' },
    { id: 'conn-2', fromNodeId: 'node-2', fromPort: 'output', toNodeId: 'node-3', toPort: 'input' },
    { id: 'conn-3', fromNodeId: 'node-3', fromPort: 'output', toNodeId: 'node-4', toPort: 'input' },
    { id: 'conn-4', fromNodeId: 'node-4', fromPort: 'output', toNodeId: 'node-5', toPort: 'input' },
    { id: 'conn-5', fromNodeId: 'node-5', fromPort: 'output', toNodeId: 'node-6', toPort: 'input' },
    { id: 'conn-6', fromNodeId: 'node-2', fromPort: 'error', toNodeId: 'node-7', toPort: 'input' },
    { id: 'conn-7', fromNodeId: 'node-3', fromPort: 'error', toNodeId: 'node-7', toPort: 'input' },
    { id: 'conn-8', fromNodeId: 'node-4', fromPort: 'error', toNodeId: 'node-7', toPort: 'input' }
  ],
  buildSteps: [
    {
      stepNumber: 1,
      title: 'Configure Inbound Webhook Trigger (BV_TRIG_01)',
      nodeName: 'BV_TRIG_01_WebhookReceiver',
      nodeType: 'webhook',
      purpose: 'Create the entry point for inbound prospect form submissions from Webflow, Typeform, or custom REST applications.',
      canvasPlacement: { x: 80, y: 220 },
      stickyNoteContent: {
        badgeText: 'STEP 1: INBOUND TRIGGER',
        instructions: 'Configure Webhook node with POST method. Copy the generated Latenode endpoint URL into your form submission action.',
        buyerAction: 'Copy this URL to your Webflow or Typeform webhook settings.'
      },
      configurationGuide: [
        'Open Latenode scenario canvas.',
        'Add a Webhook Trigger node.',
        'Set Name to "BV_TRIG_01_WebhookReceiver".',
        'Set HTTP Method to POST.',
        'Add Sticky Note directly above the node titled "[STEP 1: INBOUND WEBHOOK]".'
      ],
      testPayload: {
        name: 'Alex Vance',
        email: 'avance@blackmesa.tech',
        company: 'Black Mesa Research',
        budget: 25000,
        website: 'https://blackmesa.tech',
        notes: 'Seeking AI automation for facility telemetry routing.'
      },
      expectedAssertion: 'Node status 200, $1.body contains matching prospect properties.',
      codexPrompt: `Create a Latenode Webhook Trigger node named "BV_TRIG_01_WebhookReceiver" configured to listen for HTTP POST requests. Above the node, place a blue sticky note with the text: "STEP 1: INBOUND WEBHOOK - Receives lead payloads from client website forms. Copy the webhook URL to your form settings." Ensure output is mapped to $1.body.`,
      antigravityPrompt: `Task: Instantiate node BV_TRIG_01_WebhookReceiver on the Latenode canvas at coordinates (80, 220).
Parameters:
- Node Type: Webhook Trigger
- Method: POST
- Route: /v1/inbound-lead
- Sticky Note: Color: Blue | Title: "STEP 1: INBOUND WEBHOOK" | Content: "Paste this URL into your form builder webhook integration."
Verification: Send mock POST request with JSON body { name, email, company, budget }. Assert 200 OK and valid body capture.`
    },
    {
      stepNumber: 2,
      title: 'Implement Data Validation & Sanitization (BV_AUTH_02)',
      nodeName: 'BV_AUTH_02_ValidateAndSanitize',
      nodeType: 'javascript',
      purpose: 'Sanitize user inputs, strip malicious characters, validate email domain, and classify as business vs free personal email.',
      canvasPlacement: { x: 380, y: 220 },
      stickyNoteContent: {
        badgeText: 'STEP 2: VALIDATION & SANITIZATION',
        instructions: 'Runs Node.js 20 logic to normalize fields, compute business email boolean, and prepare safe data structure.',
        buyerAction: 'No changes required; customizable free email blacklist inside script array.'
      },
      configurationGuide: [
        'Add a JavaScript node connected to BV_TRIG_01.',
        'Name node "BV_AUTH_02_ValidateAndSanitize".',
        'Insert BotVibe AI standard sanitization script.',
        'Add Amber Sticky Note above node explaining data structure.'
      ],
      codeContent: `const raw = $1.body || {};
const cleanString = (str) => typeof str === 'string' ? str.trim().replace(/[<>]/g, '') : '';
const email = cleanString(raw.email).toLowerCase();
const freeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
const emailDomain = email.includes('@') ? email.split('@')[1] : '';
const isBusinessEmail = emailDomain.length > 0 && !freeDomains.includes(emailDomain);

return {
  isValid: email.length > 5 && email.includes('@'),
  name: cleanString(raw.name),
  email,
  emailDomain,
  isBusinessEmail,
  company: cleanString(raw.company) || (emailDomain ? emailDomain.split('.')[0].toUpperCase() : 'Unknown'),
  cleanWebsite: raw.website ? (raw.website.startsWith('http') ? raw.website : 'https://' + raw.website) : '',
  budget: Number(raw.budget) || 0,
  notes: cleanString(raw.notes)
};`,
      testPayload: {
        rawInput: { name: 'John <script>alert(1)</script>', email: 'john.smith@acme-corp.com', budget: '12000' }
      },
      expectedAssertion: 'Script tags stripped; isBusinessEmail === true; budget converted to number 12000.',
      codexPrompt: `In Latenode, connect a JavaScript node named "BV_AUTH_02_ValidateAndSanitize" to BV_TRIG_01. Paste the sanitization script that cleans strings, normalizes URLs, identifies business email domains, and exports a standardized payload object. Place an amber sticky note above explaining the output schema.`,
      antigravityPrompt: `Action: Add JavaScript node BV_AUTH_02_ValidateAndSanitize at (380, 220).
Code: Clean strings, detect free domains (gmail/yahoo/etc), format website URL.
Sticky Note: Color: Amber | Title: "STEP 2: VALIDATION & SANITIZATION"
Testing: Feed dirty inputs with HTML tags and free email address. Assert sanitization and boolean flag accuracy.`
    },
    {
      stepNumber: 3,
      title: 'Enrich Prospect via Headless Browser (BV_PROC_03)',
      nodeName: 'BV_PROC_03_HeadlessEnricher',
      nodeType: 'headless_browser',
      purpose: 'Scrapes the prospect company website to extract meta descriptions, H1 header, and company value proposition for hyper-personalized sales outreach.',
      canvasPlacement: { x: 680, y: 220 },
      stickyNoteContent: {
        badgeText: 'STEP 3: HEADLESS ENRICHMENT',
        instructions: 'Uses Latenode Puppeteer browser. Handles dynamic single-page applications and extracts meta data safely with 10s timeout.',
        buyerAction: 'Optional: disable this node if you only target B2C prospects without websites.'
      },
      configurationGuide: [
        'Add Headless Browser node named "BV_PROC_03_HeadlessEnricher".',
        'Set Target URL to {{$2.cleanWebsite}}.',
        'Inject extraction script evaluating document.title and meta description.',
        'Add Purple Sticky Note above node detailing fallback behavior.'
      ],
      codeContent: `const page = await browser.newPage();
try {
  await page.goto($2.cleanWebsite, { waitUntil: 'domcontentloaded', timeout: 10000 });
  const meta = await page.evaluate(() => ({
    title: document.title || '',
    metaDesc: document.querySelector('meta[name="description"]')?.content || ''
  }));
  return { success: true, ...meta };
} catch(e) {
  return { success: false, note: 'Website unavailable' };
} finally {
  await page.close();
}`,
      testPayload: { cleanWebsite: 'https://apexlogistics.io' },
      expectedAssertion: 'Returns success: true, title and metaDesc non-empty strings.',
      codexPrompt: `Add a Headless Browser node named "BV_PROC_03_HeadlessEnricher". Configure Puppeteer script to visit {{$2.cleanWebsite}}, extract document title and meta description. Wrap in try/catch to return fallback gracefully if website fails. Add a purple sticky note above.`,
      antigravityPrompt: `Action: Add Headless Browser node BV_PROC_03_HeadlessEnricher at (680, 220).
Parameters: URL: {{$2.cleanWebsite}}, Timeout: 10000ms.
Code: Extract title & meta description via page.evaluate.
Sticky Note: Color: Purple | Title: "STEP 3: DEEP COMPANY ENRICHMENT"
Test: Run against a live URL and verify metadata extraction without throwing unhandled exceptions.`
    },
    {
      stepNumber: 4,
      title: 'AI Qualification & Icebreaker Generation (BV_AI_04)',
      nodeName: 'BV_AI_04_GeminiScorerAndPitch',
      nodeType: 'ai_prompt',
      purpose: 'Executes Gemini 3.8 Flash prompt to score the lead (0-100), classify into Tier 1/2/3, and craft an authentic, custom sales icebreaker.',
      canvasPlacement: { x: 980, y: 220 },
      stickyNoteContent: {
        badgeText: 'STEP 4: GEMINI REASONING',
        instructions: 'Uses Gemini 3.8 Flash. Analyzes budget, company size, and problem description. Output is strictly formatted JSON.',
        buyerAction: 'Insert your GEMINI_API_KEY into Latenode Global Variables panel.'
      },
      configurationGuide: [
        'Add AI Prompt node named "BV_AI_04_GeminiScorerAndPitch".',
        'Select Gemini 3.8 Flash model.',
        'Set temperature to 0.2 for reliable structural compliance.',
        'Paste BotVibe standard prompt template with schema enforcement.',
        'Add Emerald Sticky Note above node with API key setup guide.'
      ],
      testPayload: {
        name: 'Sarah Jenkins',
        company: 'Apex Logistics',
        budget: 15000,
        notes: 'Automate carrier dispatch and notifications'
      },
      expectedAssertion: 'Valid JSON containing leadTier, score >= 0, and personalizedIcebreaker of length > 20.',
      codexPrompt: `Add an AI Prompt node "BV_AI_04_GeminiScorerAndPitch" using Gemini 3.8 Flash. System prompt must instruct the model to return strict JSON containing leadTier, score, qualificationSummary, and personalizedIcebreaker. Feed $2 and $3 context. Add an emerald sticky note with credentials instruction.`,
      antigravityPrompt: `Action: Add AI Prompt node BV_AI_04_GeminiScorerAndPitch at (980, 220).
Model: gemini-3.8-flash | Temp: 0.2
Sticky Note: Color: Emerald | Title: "STEP 4: AI QUALIFICATION & CUSTOM ICEBREAKER"
Verify: Mock lead evaluation generates a Tier 1 rating with score > 85 and relevant icebreaker text.`
    },
    {
      stepNumber: 5,
      title: 'Dispatch Rich Slack Alert (BV_DEST_05)',
      nodeName: 'BV_DEST_05_PostToSlackAlert',
      nodeType: 'http_request',
      purpose: 'Posts structured Block Kit notification to sales team Slack channel with instant visual lead tier badge and AI icebreaker.',
      canvasPlacement: { x: 1280, y: 220 },
      stickyNoteContent: {
        badgeText: 'STEP 5: SLACK DISPATCH',
        instructions: 'Pushes JSON Block Kit to {{env.SLACK_WEBHOOK_URL}}. Displays lead score, company, budget, and 1-click email trigger.',
        buyerAction: 'Add your Slack Incoming Webhook URL to Global Variables.'
      },
      configurationGuide: [
        'Add HTTP Request node named "BV_DEST_05_PostToSlackAlert".',
        'Method: POST, URL: {{env.SLACK_WEBHOOK_URL}}.',
        'Set Header Content-Type: application/json.',
        'Insert BotVibe Block Kit template with variable interpolations.',
        'Add Rose Sticky Note above node.'
      ],
      testPayload: {
        leadTier: 'Tier 1 (High Priority)',
        score: 94,
        company: 'Apex Logistics'
      },
      expectedAssertion: 'Slack endpoint returns status 200 OK.',
      codexPrompt: `Add an HTTP Request node named "BV_DEST_05_PostToSlackAlert" with POST to {{env.SLACK_WEBHOOK_URL}}. Configure headers and JSON block payload formatting prospect details and AI icebreaker. Place a rose sticky note above.`,
      antigravityPrompt: `Action: Add HTTP Request node BV_DEST_05_PostToSlackAlert at (1280, 220).
Parameters: POST {{env.SLACK_WEBHOOK_URL}} with JSON Block Kit.
Sticky Note: Color: Rose | Title: "STEP 5: SLACK VIP SALES ALERT"
Verification: Send test payload and verify HTTP 200 and formatted visual delivery.`
    },
    {
      stepNumber: 6,
      title: 'Return Webhook Acknowledgment (BV_RESP_06)',
      nodeName: 'BV_RESP_06_WebhookResponse',
      nodeType: 'webhook_response',
      purpose: 'Closes HTTP connection to front-end form with status 200 and clean acknowledgment message.',
      canvasPlacement: { x: 1580, y: 220 },
      stickyNoteContent: {
        badgeText: 'STEP 6: HTTP RESPONSE',
        instructions: 'Sends 200 OK back to Webflow/Typeform with qualification payload so front-end shows custom thank you state.',
        buyerAction: 'No edits required.'
      },
      configurationGuide: [
        'Add Webhook Response node named "BV_RESP_06_WebhookResponse".',
        'Set Status Code to 200.',
        'Set Content-Type to application/json.',
        'Map response JSON body with success: true and leadTier.',
        'Add Slate Sticky Note above node.'
      ],
      testPayload: { leadTier: 'Tier 1', score: 94 },
      expectedAssertion: 'Returns HTTP 200 with JSON body.',
      codexPrompt: `Add Webhook Response node "BV_RESP_06_WebhookResponse" with 200 OK status code, JSON headers, and output confirmation body. Add slate sticky note above.`,
      antigravityPrompt: `Action: Add Webhook Response node BV_RESP_06_WebhookResponse at (1580, 220).
Parameters: Status 200, Content-Type: application/json.
Sticky Note: Color: Slate | Title: "STEP 6: CLIENT ACKNOWLEDGMENT"
Verify: Client receives instant HTTP 200 response with success flag.`
    },
    {
      stepNumber: 7,
      title: 'Implement Universal Error Handler (BV_ERR_07)',
      nodeName: 'BV_ERR_07_GlobalErrorHandler',
      nodeType: 'error_handler',
      purpose: 'BotVibe AI Golden Rule: Catch any failure across any node, log error stack, ping support channel, and preserve incoming data.',
      canvasPlacement: { x: 830, y: 480 },
      stickyNoteContent: {
        badgeText: 'BOTVIBE GOLDEN RULE: ERROR RESILIENCE',
        instructions: 'Attaches to error ports of Steps 2, 3, and 4. Prevents silent automation failures and alerts technical admin immediately.',
        buyerAction: 'Enter your admin email or Slack webhook for failure alerts.'
      },
      configurationGuide: [
        'Add an Error Handler node named "BV_ERR_07_GlobalErrorHandler".',
        'Connect the red error output pins from nodes 2, 3, 4, and 5 to this node.',
        'Configure alert dispatch and diagnostic payload dumping.',
        'Add Red/Rose Sticky Note emphasizing zero-data-loss guarantee.'
      ],
      testPayload: { error: { message: 'Simulated API Timeout' } },
      expectedAssertion: 'Catches error object, emits emergency notification without crashing scenario.',
      codexPrompt: `Create an Error Handler node named "BV_ERR_07_GlobalErrorHandler". Connect all error branches to this node. Configure fallback logging and emergency alert. Place a prominent sticky note above emphasizing BotVibe AI reliability standard.`,
      antigravityPrompt: `Action: Add Error Handler node BV_ERR_07_GlobalErrorHandler at (830, 480).
Connections: Connect error output ports of all operational nodes.
Sticky Note: Color: Rose | Title: "UNIVERSAL ERROR HANDLER (BOTVIBE GOLDEN RULE)"
Testing: Trigger intentional error in Step 2; verify error handler intercepts and logs event without dropping pipeline.`
    }
  ],
  qaTestCases: [
    {
      id: 'qa-1',
      name: 'High-Value Lead Happy Path ($25k Budget + Corp Domain)',
      testType: 'Happy Path',
      inputMock: {
        name: 'Marcus Brody',
        email: 'mbrody@brodyautomotive.com',
        company: 'Brody Automotive Solutions',
        budget: 25000,
        website: 'https://brodyautomotive.com',
        notes: 'Need automated parts inventory routing across 12 warehouses.'
      },
      expectedOutputKeys: ['isValid', 'isBusinessEmail', 'leadTier', 'score', 'personalizedIcebreaker'],
      assertion: 'isBusinessEmail === true && score >= 90 && leadTier.includes("Tier 1")',
      status: 'passed'
    },
    {
      id: 'qa-2',
      name: 'Free Email Edge Case (Gmail + Low Budget)',
      testType: 'Edge Case',
      inputMock: {
        name: 'Dave Wilson',
        email: 'davewilson99@gmail.com',
        company: 'Freelance Design',
        budget: 500,
        notes: 'Just looking for a quick zapier replacement.'
      },
      expectedOutputKeys: ['isBusinessEmail', 'leadTier', 'score'],
      assertion: 'isBusinessEmail === false && score < 50 && leadTier.includes("Tier 3")',
      status: 'passed'
    },
    {
      id: 'qa-3',
      name: 'Website Enrichment Timeout Fallback',
      testType: 'Edge Case',
      inputMock: {
        name: 'Elena Rostova',
        email: 'elena@offline-domain-404.xyz',
        company: 'Offline Corp',
        website: 'https://offline-domain-404.xyz',
        budget: 8000,
        notes: 'Inquiry test'
      },
      expectedOutputKeys: ['success', 'fallbackNote'],
      assertion: 'Node 3 catches timeout, returns success: false, pipeline continues to Node 4 without aborting.',
      status: 'passed'
    },
    {
      id: 'qa-4',
      name: 'XSS & Malicious Injection Sanitization Check',
      testType: 'Malformed Payload',
      inputMock: {
        name: '<script>document.cookie</script> Robert',
        email: 'robert@safe-firm.org',
        budget: '15000'
      },
      expectedOutputKeys: ['name', 'budget'],
      assertion: 'name does NOT contain <script> tags; budget is cast to strict number 15000.',
      status: 'passed'
    }
  ],
  marketplaceListing: {
    title: 'Omnichannel B2B AI Lead Enrichment & Auto-Router for Latenode',
    shortTagline: 'Instantly score incoming leads, enrich company info via headless browser, generate custom AI icebreakers, and alert Slack in 3 seconds.',
    recommendedPriceUSD: 79,
    category: 'Sales Automation & CRM',
    targetBuyers: ['B2B SaaS Founders', 'Growth Marketing Agencies', 'Sales Ops Engineers', 'Freelance Automation Consultants'],
    setupTimeMinutes: 5,
    prerequisites: [
      'Latenode.com account (Free or Team plan)',
      'Google Gemini API Key (Free tier supported in Google AI Studio)',
      'Slack Incoming Webhook URL'
    ],
    fullMarkdownDescription: `## Omnichannel B2B AI Lead Enrichment & Auto-Router
Built by **BotVibe AI** — The Gold Standard in Reliable Latenode Architectures.

Stop losing high-value prospects to 3-hour response delays. This turnkey Latenode template intercepts form submissions from Webflow, Typeform, or custom apps, validates the data, autonomously researches the prospect's company using Latenode's headless browser, evaluates purchase intent via Google Gemini, and delivers an executive-ready lead dossier with custom icebreaker directly to your sales Slack channel.

### 🌟 What Makes This BotVibe AI Template Superior:
- **100% Standardized Architecture**: Every node features explicit visual Sticky Notes above the canvas with clear inputs, outputs, and configuration notes.
- **Autonomous Company Research**: Uses Latenode's built-in Puppeteer Headless Browser to scrape prospect homepage meta tags and value propositions.
- **Deep AI Lead Scoring**: Rates leads 0-100 and classifies them into Tier 1 (High Priority), Tier 2, and Tier 3.
- **Zero-Loss Error Resilience**: Includes universal error handling branch to ensure no prospect is ever dropped even if external APIs experience downtime.
- **5-Minute Plug & Play Setup**: Only requires 2 global variables to go live.

### 📦 What Is Included:
1. Complete Latenode Scenario JSON (1-click import)
2. Interactive Sticky-Note Annotations on Canvas
3. Comprehensive Buyer Onboarding & Troubleshooting Guide
4. Full QA Test Suite with Postman-ready Mock Payloads
5. Standard BotVibe AI Lifetime Node Updates

### ⚙️ Quick Setup (Under 5 Minutes):
1. Import the \`.json\` file in your Latenode workspace.
2. Open **Global Variables** and paste your \`GEMINI_API_KEY\` and \`SLACK_WEBHOOK_URL\`.
3. Copy the URL from the first Webhook node into your website form.
4. Run a test submission — you're live!`,
    keyFeatures: [
      'Instant Webhook processing (<2.5 seconds total latency)',
      'Automated email domain verification & personal vs business email detection',
      'Headless browser company context scraping',
      'Gemini AI lead qualification & personalized 2-sentence sales pitch generation',
      'Formatted Slack Block Kit alert with 1-click action items',
      'Universal failsafe error handling branch'
    ],
    tags: ['Lead Generation', 'CRM', 'Gemini AI', 'Slack', 'Headless Browser', 'Puppeteer', 'Sales Ops', 'BotVibe AI']
  },
  buyerSetupGuideMarkdown: `# BotVibe AI — Buyer Onboarding & Setup Guide
**Template**: Omnichannel B2B AI Lead Enrichment & CRM Router
**Version**: 1.0.0-PROD
**Vendor**: BotVibe AI (support@botvibe.ai)

Thank you for purchasing this BotVibe AI standard template! All BotVibe templates follow our strict architectural protocol with color-coded sticky notes, standardized naming conventions, and universal error resilience.

---

### Step 1: Import the Scenario into Latenode
1. Log in to your [Latenode.com](https://latenode.com) dashboard.
2. In the top-right corner, click **New Scenario** -> **Import from File**.
3. Select the \`omnichannel-lead-enricher.latenode.json\` file included in this package.
4. You will see the visual canvas populated with nodes and our signature **BotVibe AI Sticky Notes** hovering directly above each step.

---

### Step 2: Configure Global Variables (2 Minutes)
Click the **Settings (Gear Icon)** in the left sidebar -> **Variables**, and enter these values:
- \`GEMINI_API_KEY\`: Get a free key at [ai.google.dev](https://ai.google.dev).
- \`SLACK_WEBHOOK_URL\`: Create an Incoming Webhook in your Slack workspace (pointing to #sales-leads).
- *(Optional)* \`MINIMUM_BUDGET_THRESHOLD\`: Default is \`3000\`.

---

### Step 3: Connect to Your Inbound Form
1. Click the first node: \`BV_TRIG_01_WebhookReceiver\`.
2. Copy the **Live Webhook URL** displayed in the node settings.
3. In Webflow, Typeform, Tally, or your custom HTML form, set the submission target to this URL with method **POST**.

---

### Step 4: Run the Verification Test
1. Click the **Run Once** button in Latenode.
2. Send the included **Happy Path Test Payload** (found in QA_TEST_REPORT.md) via Postman or Curl.
3. Observe the green execution dots traveling across all 6 nodes in sequence.
4. Check your Slack channel: you should see a rich message with the prospect dossier and AI icebreaker!

---

### Troubleshooting & FAQ
- **Q: What happens if a lead does not have a website?**
  - *A: Step 3 catches the missing URL gracefully and proceeds directly to AI scoring using the form notes.*
- **Q: Can I change the scoring criteria?**
  - *A: Yes! Open \`BV_AI_04_GeminiScorerAndPitch\` and adjust the system prompt instructions to match your ideal customer profile (ICP).*
- **Q: Need help or custom CRM integration?**
  - *A: Reach out to BotVibe AI support at support@botvibe.ai.*`,
  latenodeScenarioJson: {
    name: 'Omnichannel B2B AI Lead Enrichment & Auto-Router [BotVibe AI]',
    version: '1.0.0',
    platform: 'latenode',
    author: 'BotVibe AI',
    metadata: {
      tags: ['lead-gen', 'gemini-ai', 'slack', 'headless-browser', 'botvibe-standard'],
      description: 'BotVibe AI Golden Standard lead enrichment and scoring pipeline with canvas sticky notes.'
    },
    nodes: [
      { id: 'BV_TRIG_01', type: 'webhook', name: 'BV_TRIG_01_WebhookReceiver', position: [80, 220], config: { method: 'POST', path: '/v1/inbound-lead' } },
      { id: 'BV_AUTH_02', type: 'javascript', name: 'BV_AUTH_02_ValidateAndSanitize', position: [380, 220], config: { runtime: 'nodejs20' } },
      { id: 'BV_PROC_03', type: 'headless_browser', name: 'BV_PROC_03_HeadlessEnricher', position: [680, 220], config: { timeout: 10000 } },
      { id: 'BV_AI_04', type: 'ai_prompt', name: 'BV_AI_04_GeminiScorerAndPitch', position: [980, 220], config: { model: 'gemini-3.8-flash', temperature: 0.2 } },
      { id: 'BV_DEST_05', type: 'http_request', name: 'BV_DEST_05_PostToSlackAlert', position: [1280, 220], config: { method: 'POST', url: '{{env.SLACK_WEBHOOK_URL}}' } },
      { id: 'BV_RESP_06', type: 'webhook_response', name: 'BV_RESP_06_WebhookResponse', position: [1580, 220], config: { statusCode: 200 } },
      { id: 'BV_ERR_07', type: 'error_handler', name: 'BV_ERR_07_GlobalErrorHandler', position: [830, 480], config: { catchAll: true } }
    ],
    stickyNotes: [
      { nodeRef: 'BV_TRIG_01', color: 'blue', title: 'STEP 1: INBOUND LEAD WEBHOOK', text: 'Paste this URL into your form builder webhook integration.' },
      { nodeRef: 'BV_AUTH_02', color: 'amber', title: 'STEP 2: VALIDATION & DATA SANITIZATION', text: 'Strips malicious tags, computes business email boolean, normalizes URLs.' },
      { nodeRef: 'BV_PROC_03', color: 'purple', title: 'STEP 3: DEEP COMPANY ENRICHMENT', text: 'Headless Puppeteer browser extracts company meta descriptions and H1 header.' },
      { nodeRef: 'BV_AI_04', color: 'emerald', title: 'STEP 4: AI QUALIFICATION & CUSTOM ICEBREAKER', text: 'Gemini 3.8 Flash lead score (0-100), Tier classification, and custom icebreaker.' },
      { nodeRef: 'BV_DEST_05', color: 'rose', title: 'STEP 5: SLACK VIP SALES ALERT', text: 'Pushes Block Kit notification to {{env.SLACK_WEBHOOK_URL}}.' },
      { nodeRef: 'BV_RESP_06', color: 'slate', title: 'STEP 6: CLIENT ACKNOWLEDGMENT', text: 'Returns HTTP 200 JSON acknowledgment to submitting client.' },
      { nodeRef: 'BV_ERR_07', color: 'rose', title: 'UNIVERSAL ERROR HANDLER (BOTVIBE GOLDEN RULE)', text: 'Catches errors across all nodes; dispatches admin alert with zero data loss.' }
    ],
    connections: [
      { from: 'BV_TRIG_01', to: 'BV_AUTH_02', fromPort: 'out', toPort: 'in' },
      { from: 'BV_AUTH_02', to: 'BV_PROC_03', fromPort: 'out', toPort: 'in' },
      { from: 'BV_PROC_03', to: 'BV_AI_04', fromPort: 'out', toPort: 'in' },
      { from: 'BV_AI_04', to: 'BV_DEST_05', fromPort: 'out', toPort: 'in' },
      { from: 'BV_DEST_05', to: 'BV_RESP_06', fromPort: 'out', toPort: 'in' },
      { from: 'BV_AUTH_02', to: 'BV_ERR_07', fromPort: 'err', toPort: 'in' },
      { from: 'BV_PROC_03', to: 'BV_ERR_07', fromPort: 'err', toPort: 'in' },
      { from: 'BV_AI_04', to: 'BV_ERR_07', fromPort: 'err', toPort: 'in' }
    ]
  }
};
