"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { UnicornTestModal } from "@/components/UnicornTestModal";

export function WarRoomTerminal() {
    const [isTestOpen, setIsTestOpen] = useState(false);
    const [runId, setRunId] = useState(0);
    const outputRef = useRef<HTMLDivElement>(null);
    const terminalBodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const terminal = outputRef.current;
        const terminalBody = terminalBodyRef.current;
        if (!terminal || !terminalBody) return;

        let isCancelled = false;
        let audioCtx: AudioContext | null = null;
        
        const enableAudio = () => {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        };
        document.addEventListener('click', enableAudio, { once: true });

        function playTone(freq = 800, duration = 0.03, vol = 0.02) {
            try {
                if (!audioCtx) return;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(vol, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + duration);
            } catch {}
        }

        function getTimestamp() {
            const now = new Date();
            return `[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}.${now.getMilliseconds().toString().padStart(3,'0')}]`;
        }

        async function wait(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function typeLine(text: string, className = '', speed = 25) {
            if (isCancelled) return null;
            const line = document.createElement('div');
            line.className = 'wr-line';
            const timestamp = getTimestamp();
            const colorClass = className.startsWith('wr-text-') ? className : `wr-text-${className}`;
            
            line.innerHTML = `<span class="wr-timestamp">${timestamp}</span><span class="wr-prompt">➜</span><span class="${colorClass}"></span><span class="wr-cursor"></span>`;
            terminal?.appendChild(line);
            
            const textSpan = line.querySelector('span.' + colorClass);
            const cursor = line.querySelector('.wr-cursor');
            
            for (let i = 0; i < text.length; i++) {
                if (isCancelled) return null;
                if (textSpan) textSpan.textContent += text.charAt(i);
                if (i % 2 === 0) playTone(600 + Math.random() * 400, 0.02, 0.015);
                await wait(speed + 15 + Math.random() * 20);
                if (terminalBodyRef.current) {
                    terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
                }
            }
            
            if (cursor) cursor.remove();
            return line;
        }

        async function addLine(text: string, type = 'info', indent = false, delay = 250) {
            if (isCancelled) return null;
            await wait(delay);
            if (isCancelled) return null;
            const line = document.createElement('div');
            line.className = 'wr-line';
            if (indent) line.classList.add('wr-indent');
            
            const timestamp = getTimestamp();
            const colors: Record<string, string> = {
                success: 'wr-text-success',
                error: 'wr-text-error',
                warning: 'wr-text-warning',
                info: 'wr-text-info',
                muted: 'wr-text-muted',
                highlight: 'wr-text-highlight',
                critical: 'wr-text-critical'
            };
            
            const color = colors[type] || 'wr-text-info';
            const prompt = type === 'error' || type === 'critical' ? '✖' : type === 'warning' ? '⚠' : type === 'success' ? '✓' : '>';
            
            line.innerHTML = `<span class="wr-timestamp">${timestamp}</span><span class="wr-prompt">${prompt}</span><span class="${color}">${text}</span>`;
            
            // if (type === 'error' || type === 'critical') line.classList.add('wr-glitch');
            
            terminal?.appendChild(line);
            if (terminalBodyRef.current) {
                terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
            }
            
            if (Math.random() > 0.6) playTone(400, 0.04, 0.01);
            return line;
        }

        async function addProgress(label: string, type = 'info') {
            if (isCancelled) return null;
            await wait(200);
            if (isCancelled) return null;
            const line = document.createElement('div');
            line.className = 'wr-line';
            const timestamp = getTimestamp();
            line.innerHTML = `
                <span class="wr-timestamp">${timestamp}</span>
                <span class="wr-prompt">~</span>
                <span class="wr-text-${type}">${label}</span>
                <span class="wr-progress-container">
                    <span class="wr-progress-bar"><span class="wr-progress-fill" id="prog-${Date.now()}"></span></span>
                    <span class="wr-progress-text">0%</span>
                </span>
            `;
            terminal?.appendChild(line);
            
            const fill = line.querySelector('.wr-progress-fill') as HTMLElement;
            const text = line.querySelector('.wr-progress-text') as HTMLElement;
            
            for (let i = 0; i <= 100; i += Math.random() * 8 + 3) {
                if (isCancelled) return null;
                await wait(80 + Math.random() * 120);
                if (fill && text) {
                    fill.style.width = Math.min(i, 100) + '%';
                    text.textContent = Math.floor(Math.min(i, 100)) + '%';
                }
                if (terminalBodyRef.current) {
                    terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
                }
                if (i % 20 === 0) playTone(300 + i * 3, 0.02, 0.01);
            }
            if (fill && text) {
                fill.style.width = '100%';
                text.textContent = '100%';
            }
            return line;
        }

        async function addSeparator() {
            await addLine('═══════════════════════════════════════════════════════════════', 'muted', false, 100);
        }

        async function addSection(title: string) {
            if (isCancelled) return null;
            await wait(300);
            if (isCancelled) return null;
            const line = document.createElement('div');
            line.className = 'wr-line wr-section-header';
            line.innerHTML = `<span class="wr-timestamp">${getTimestamp()}</span><span class="wr-text-highlight">▶ ${title}</span>`;
            terminal?.appendChild(line);
            if (terminalBodyRef.current) {
                terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
            }
        }

        async function runDeepScan() {
            if (isCancelled || !outputRef.current) return;
            outputRef.current.innerHTML = "";
            // BOOT SEQUENCE
            await typeLine('INITIALIZING WAR ROOM SIMULATOR v10.2.EXTENDED...', 'success', 20);
            await addLine('Kernel loaded: BusinessContinuity-DeepScan-Module', 'success', false, 300);
            await addLine('Memory allocated: 64TB simulation buffer', 'info', false, 200);
            await addLine('Authentication: Biometric+Token+HardwareKey [VERIFIED]', 'success', false, 400);
            await addLine('WARNING: Audit running in DESTRUCTIVE-ANALYSIS mode', 'warning', false, 300);
            await addSeparator();
            
            // PHASE 1: TREASURY & FINANCIAL (DOUBLED)
            await addSection('PHASE 01: FINANCIAL_RESILIENCE_MATRIX');
            await typeLine('Initializing Treasury Deep Scan...', 'info', 30);
            
            await addProgress('Scanning banking relationships...', 'info');
            await addLine('PRIMARY_BANK: Silicon Valley Bank [CONNECTION TIMEOUT]', 'error', true, 400);
            await addLine('FAILOVER_BANK_01: Signature Bank [ACCOUNT FROZEN]', 'error', true, 300);
            await addLine('FAILOVER_BANK_02: First Republic [ENTITY DISSOLVED]', 'error', true, 300);
            await addLine('Checking: Multi-currency accounts (USD, EUR, GBP, JPY)...', 'muted', true, 400);
            await addLine('ERROR: FX hedging documentation [NOT FOUND]', 'error', true, 500);
            await addLine('ALERT: $2.4M trapped in international transfer limbo', 'critical', true, 600);
            
            await addProgress('Analyzing credit facilities...', 'warning');
            await addLine('REVOLVING_CREDIT: $5M facility [EXPIRED 14 DAYS AGO]', 'error', true, 400);
            await addLine('TERM_LOAN_BACKUP: Covenant compliance [BREACH DETECTED]', 'error', true, 500);
            await addLine('ASSET_BASED_LENDING: Accounts receivable eligibility [73% INELIGIBLE]', 'warning', true, 400);
            
            await addProgress('Calculating liquidity runway...', 'error');
            await addLine('BURN_RATE_CURRENT: $340K/month', 'info', true, 300);
            await addLine('CASH_RESERVES: $412K accessible', 'warning', true, 400);
            await addLine('RESTRICTED_CASH: $1.2M (earmarked for payroll - 1.2 cycles)', 'warning', true, 500);
            await addLine('RUNWAY_CALCULATION: 23.4 days operating capital', 'error', true, 600);
            await addLine('CRITICAL: Negative cash flow projected Day 24', 'critical', true, 400);
            
            await addProgress('Scanning payment processors...', 'info');
            await addLine('STRIPE_PRIMARY: Operational [RATE_LIMIT: 87% utilized]', 'warning', true, 300);
            await addLine('STRIPE_FAILOVER: Not configured', 'error', true, 400);
            await addLine('PAYPAL_BACKUP: Account restricted [KYC documentation stale]', 'error', true, 500);
            await addLine('CRYPTO_TREASURY: Cold wallet keys [SINGLE CUSTODIAN]', 'error', true, 400);
            
            // PHASE 2: SUPPLY CHAIN
            await addSeparator();
            await addSection('PHASE 02: SUPPLY_CHAIN_VULNERABILITY_ANALYSIS');
            await typeLine('Mapping supplier dependencies...', 'info', 35);
            
            await addProgress('Analyzing Tier 1 suppliers...', 'warning');
            await addLine('SUPPLIER_A (Critical Components): Single source [SHENZHEN_LTD]', 'error', true, 400);
            await addLine('CONTRACT_STATUS: Expires in 18 days, renewal unsigned', 'warning', true, 500);
            await addLine('INSURANCE: Force majeure coverage [POLICY LAPSED]', 'error', true, 400);
            await addLine('INVENTORY_BUFFER: 14 days (Target: 45 days)', 'error', true, 300);
            
            await addProgress('Scanning Tier 2/3 sub-suppliers...', 'info');
            await addLine('SUB-SUPPLIER_DEPENDENCY: 34 critical components traced to single region', 'error', true, 500);
            await addLine('GEOPOLITICAL_RISK: Taiwan Strait manufacturing [HIGH EXPOSURE]', 'warning', true, 400);
            await addLine('ALTERNATIVE_SOURCING: Mexico/Vietnam alternatives [NOT QUALIFIED]', 'error', true, 600);
            
            await addProgress('Evaluating logistics redundancy...', 'warning');
            await addLine('3PL_PRIMARY: Fulfillment by Amazon [CONCENTRATION RISK: 89%]', 'error', true, 400);
            await addLine('3PL_SECONDARY: ShipBob contract [PENDING - 3 MONTHS DELAYED]', 'warning', true, 500);
            await addLine('FREIGHT_FORWARDER: Flexport relationship [PAYMENT DISPUTE]', 'warning', true, 400);
            await addLine('COLD_CHAIN_BACKUP: Generator maintenance [OVERDUE 90 DAYS]', 'error', true, 500);
            await addLine('CUSTOMS_BROKER: Import documentation backup [NO SECONDARY]', 'error', true, 400);
            
            await addProgress('Checking inventory management systems...', 'info');
            await addLine('ERP_SYSTEM: NetSuite primary [LICENSE EXPIRES T+30]', 'warning', true, 400);
            await addLine('BARCODE_SCANNING: Hardware refresh [60% END-OF-LIFE]', 'warning', true, 300);
            await addLine('CYCLE_COUNT: Last physical inventory [47 DAYS AGO]', 'error', true, 500);
            await addLine('SHRINKAGE_RATE: 4.7% (Industry avg: 1.2%)', 'error', true, 400);
            
            // PHASE 3: ACCOUNTING & COMPLIANCE
            await addSeparator();
            await addSection('PHASE 03: FINANCIAL_CONTROLS_AUDIT');
            await typeLine('Initiating deep accounting scan...', 'info', 40);
            
            await addProgress('Testing segregation of duties...', 'error');
            await addLine('APPROVAL_MATRIX: CFO + Controller [SAME PERSON - CONFLICT]', 'error', true, 400);
            await addLine('WIRE_TRANSFER_AUTH: Dual authorization disabled', 'error', true, 500);
            await addLine('CHECK_SIGNING: Physical checks accessible to AR clerk', 'error', true, 400);
            await addLine('JOURNAL_ENTRY: Post-close adjustments [NO DOCUMENTATION]', 'warning', true, 600);
            
            await addProgress('Scanning compliance frameworks...', 'warning');
            await addLine('SOX_COMPLIANCE: Material weakness identified [ITGC-05]', 'error', true, 400);
            await addLine('GAAP_VIOLATION: Revenue recognition inconsistencies [RESTATEMENT RISK]', 'error', true, 500);
            await addLine('TAX_FILINGS: Q3 estimated taxes [UNPAID - PENALTIES ACCRUING]', 'error', true, 400);
            await addLine('SALES_TAX_NEXUS: Economic nexus analysis [8 STATES NON-COMPLIANT]', 'critical', true, 600);
            
            await addProgress('Evaluating audit trails...', 'info');
            await addLine('LOG_RETENTION: Database audit logs [7 DAYS - REQUIREMENT: 7 YEARS]', 'error', true, 500);
            await addLine('BACKUP_VERIFICATION: Last successful restore test [NEVER PERFORMED]', 'error', true, 400);
            await addLine('DOCUMENT_RETENTION: Physical records storage [WATER DAMAGE - FLOOR 3]', 'critical', true, 700);
            
            // PHASE 4: HR & PERSONNEL
            await addSeparator();
            await addSection('PHASE 04: HUMAN_CAPITAL_RISK_ASSESSMENT');
            await typeLine('Mapping organizational knowledge...', 'info', 35);
            
            await addProgress('Analyzing key person dependencies...', 'error');
            await addLine('CTO_KNOWLEDGE: 78% of codebase undocumented [BUS FACTOR: 1]', 'error', true, 400);
            await addLine('CFO_ACCESS: Banking credentials not shared [SINGLE POINT OF FAILURE]', 'error', true, 500);
            await addLine('HEAD_OF_SALES: 63% of enterprise relationships personal [NO CRM BACKUP]', 'error', true, 400);
            await addLine('LEAD_DEVOPS: Production access [NO SECONDARY ADMIN]', 'error', true, 600);
            
            await addProgress('Scanning HR documentation...', 'warning');
            await addLine('EMPLOYMENT_CONTRACTS: 23% missing signed agreements', 'warning', true, 400);
            await addLine('IP_ASSIGNMENT: Pre-2019 employees [NO AUTOMATIC ASSIGNMENT]', 'error', true, 500);
            await addLine('NON_COMPETE: Enforceability review [NOT CONDUCTED - LEGAL RISK]', 'warning', true, 400);
            await addLine('EMERGENCY_CONTACTS: Next of kin data [45% INCOMPLETE]', 'warning', true, 300);
            
            await addProgress('Checking succession planning...', 'error');
            await addLine('C_SUITE_BACKUP: No documented emergency succession plan', 'error', true, 400);
            await addLine('BOARD_SUCCESSION: Chairperson replacement procedure [UNDEFINED]', 'error', true, 500);
            await addLine('CRITICAL_ROLES: Engineering lead, Head of product [NO INTERNAL CANDIDATES]', 'error', true, 400);
            
            await addProgress('Evaluating payroll continuity...', 'warning');
            await addLine('PAYROLL_SYSTEM: ADP primary access [HR Manager only]', 'error', true, 400);
            await addLine('EMERGENCY_PAYROLL: Wire transfer capability for salaries [NOT TESTED]', 'error', true, 500);
            await addLine('BENEFITS_ADMIN: Health insurance liaison [VACATION - NO BACKUP]', 'warning', true, 400);
            
            // PHASE 5: IT INFRASTRUCTURE
            await addSeparator();
            await addSection('PHASE 05: TECHNOLOGY_INFRASTRUCTURE_PENTEST');
            await typeLine('Initiating infrastructure vulnerability scan...', 'info', 30);
            
            await addProgress('Testing backup integrity (3-2-1 rule)...', 'error');
            await addLine('LOCAL_BACKUP: Last successful backup [3 DAYS AGO - FAILED JOBS]', 'error', true, 400);
            await addLine('OFFSITE_BACKUP: AWS S3 replication [CREDENTIALS EXPIRED]', 'error', true, 500);
            await addLine('AIR_GAPPED: Tape backup rotation [DISCONTINUED 2023]', 'error', true, 400);
            await addLine('IMMUTABILITY: Ransomware protection [NOT CONFIGURED]', 'critical', true, 600);
            
            await addProgress('Scanning access controls...', 'warning');
            await addLine('DOMAIN_ADMIN: 8 accounts (Best practice: 2-3)', 'error', true, 400);
            await addLine('SERVICE_ACCOUNTS: Password rotation [>365 DAYS]', 'error', true, 500);
            await addLine('OFFBOARDING: Terminated employee access [3 ACTIVE ACCOUNTS]', 'critical', true, 400);
            await addLine('PRIVILEGED_ACCESS: PAM solution [NOT IMPLEMENTED]', 'error', true, 300);
            
            await addProgress('Analyzing cloud architecture...', 'info');
            await addLine('AWS_ROOT_ACCOUNT: MFA enabled [YES]', 'success', true, 400);
            await addLine('AWS_ROOT_ACCOUNT: Physical security key [NO - SMS BACKUP ONLY]', 'warning', true, 500);
            await addLine('MULTI_REGION: Database failover [SINGLE AZ]', 'error', true, 400);
            await addLine('DDoS_PROTECTION: CloudFlare business [RATE LIMIT EXCEEDED LAST WEEK]', 'warning', true, 600);
            
            await addProgress('Checking disaster recovery...', 'error');
            await addLine('RTO_OBJECTIVE: 4 hours [CURRENT CAPABILITY: 72+ HOURS]', 'error', true, 400);
            await addLine('RPO_OBJECTIVE: 1 hour [ACTUAL: 24 HOURS - NO CONTINUOUS REPLICATION]', 'error', true, 500);
            await addLine('DR_SITE: Warm standby [NOT BUILT - COST SAVING MEASURE]', 'error', true, 400);
            await addLine('RUNBOOKS: Disaster recovery procedures [OUTDATED - 2019 VERSION]', 'warning', true, 500);
            
            // PHASE 6: LEGAL & IP (NEW)
            await addSeparator();
            await addSection('PHASE 06: LEGAL_FRAMEWORK & INTELLECTUAL_PROPERTY');
            await typeLine('Scanning legal vulnerabilities...', 'info', 35);
            
            await addProgress('Analyzing contract concentration...', 'warning');
            await addLine('CUSTOMER_CONTRACTS: Top 3 clients = 67% of revenue [CONCENTRATION]', 'error', true, 400);
            await addLine('MSA_TERMS: Liability caps [UNLIMITED EXPOSURE IN 2 CONTRACTS]', 'error', true, 500);
            await addLine('TERMINATION_CLAUSES: Convenience termination [NO MINIMUM TERM]', 'warning', true, 400);
            await addLine('AUTO_RENEWAL: 30-day notice requirements [CALENDAR NOT TRACKED]', 'error', true, 600);
            
            await addProgress('Checking IP portfolio...', 'error');
            await addLine('PATENT_FILING: Core algorithm provisional [EXPIRED - NEVER FILED]', 'error', true, 400);
            await addLine('TRADEMARK: Brand name EU registration [OPPOSITION PENDING]', 'warning', true, 500);
            await addLine('TRADE_SECRETS: NDAs signed [34% MISSING RETURNED COPIES]', 'warning', true, 400);
            await addLine('OPEN_SOURCE: License compliance audit [NOT PERFORMED - GPL RISK]', 'error', true, 500);
            
            await addProgress('Evaluating litigation exposure...', 'info');
            await addLine('PENDING_SUITS: 2 active (Vendor dispute, Employment)', 'warning', true, 400);
            await addLine('REGULATORY_INQUIRY: SEC preliminary investigation [NOT DISCLOSED]', 'critical', true, 600);
            await addLine('INSURANCE: D&O coverage [CLAIMS-MADE BASIS - RETROACTIVE DATE ISSUE]', 'warning', true, 500);
            
            // PHASE 7: SALES & BD (NEW)
            await addSeparator();
            await addSection('PHASE 07: REVENUE_ENGINE_ANALYSIS');
            await typeLine('Auditing commercial operations...', 'info', 40);
            
            await addProgress('Scanning CRM hygiene...', 'warning');
            await addLine('SALESFORCE_DATA: 12,000 contacts [NO BACKUP EXPORT - 180 DAYS]', 'error', true, 400);
            await addLine('PIPELINE_VISIBILITY: Q4 forecast [54% SAND-BAGGING DETECTED]', 'warning', true, 500);
            await addLine('COMMISSION_CALCULATION: Shadow accounting [SPREADSHEET DEPENDENCY]', 'error', true, 400);
            await addLine('PRICING_AUTHORITY: Discount approvals [NO SYSTEMATIC TRACKING]', 'warning', true, 300);
            
            await addProgress('Analyzing customer health...', 'error');
            await addLine('CHURN_RISK: 34% of ARR showing downgrade signals', 'error', true, 400);
            await addLine('IMPLEMENTATION_BACKLOG: 47 customers [NO PROJECT MANAGER]', 'error', true, 500);
            await addLine('SUPPORT_TICKETS: >5 day backlog [ESCALATION PATH UNCLEAR]', 'warning', true, 400);
            
            await addProgress('Checking partnerships...', 'muted');
            await addLine('CHANNEL_PARTNERS: 3 active [NO ALTERNATE ROUTE TO MARKET]', 'warning', true, 400);
            await addLine('TECHNOLOGY_PARTNERS: API dependencies [4 CRITICAL - NO SLA]', 'error', true, 500);
            
            // PHASE 8: FACILITIES & PHYSICAL (NEW)
            await addSeparator();
            await addSection('PHASE 08: PHYSICAL_SECURITY & FACILITIES');
            await typeLine('Inspecting physical infrastructure...', 'info', 30);
            
            await addProgress('Scanning office security...', 'warning');
            await addLine('ACCESS_CONTROL: Keycard system [DEFAULT PASSWORDS NOT CHANGED]', 'error', true, 400);
            await addLine('BADGING: Terminated employee cards [23 ACTIVE IN SYSTEM]', 'critical', true, 500);
            await addLine('VIDEO_SURVEILLANCE: Backup retention [7 DAYS - INSURANCE REQUIRES 30]', 'warning', true, 400);
            
            await addProgress('Checking business continuity sites...', 'error');
            await addLine('ALTERNATE_SITE: Work from home policy [BANDWIDTH CAP NOT TESTED]', 'warning', true, 400);
            await addLine('HARDWARE_INVENTORY: Laptop availability for emergency [18 SHORTAGE]', 'error', true, 500);
            await addLine('SERVER_ROOM: Fire suppression [WATER SPRINKLER - SHOULD BE GAS]', 'error', true, 600);
            await addLine('UPS_SYSTEMS: Battery health [REPLACE INDICATOR - 14 MONTHS]', 'error', true, 400);
            
            await addProgress('Evaluating environmental risks...', 'info');
            await addLine('EARTHQUAKE_PREP: Secure fastening [SERVER RACKS NOT BOLTED]', 'error', true, 500);
            await addLine('FLOOD_ZONE: Location assessment [100-YEAR FLOOD PLAIN]', 'warning', true, 400);
            await addLine('INSURANCE_VALUATION: Equipment replacement cost [UNDERINSURED BY 40%]', 'error', true, 600);
            
            // FINAL CALCULATION
            await addSeparator();
            await addLine('AGGREGATING CROSS-FUNCTIONAL RISK DATA...', 'highlight', false, 800);
            await addLine('CALCULATING COMPOSITE RESILIENCE SCORES...', 'highlight', false, 600);
            
            await addLine('TREASURY_RESILIENCE:        [████░░░░░░] 18/100', 'error', false, 400);
            await addLine('SUPPLY_CHAIN_RESILIENCE:    [███░░░░░░░] 23/100', 'error', false, 300);
            await addLine('FINANCIAL_CONTROL_RESILIENCE: [████░░░░░░] 31/100', 'error', false, 400);
            await addLine('HUMAN_CAPITAL_RESILIENCE:   [██░░░░░░░░] 14/100', 'error', false, 300);
            await addLine('TECH_INFRA_RESILIENCE:      [██████░░░░] 42/100', 'warning', false, 400);
            await addLine('LEGAL_RESILIENCE:           [███░░░░░░░] 28/100', 'error', false, 300);
            await addLine('REVENUE_ENGINE_RESILIENCE:  [████░░░░░░] 19/100', 'error', false, 400);
            await addLine('PHYSICAL_RESILIENCE:        [██████░░░░] 35/100', 'warning', false, 300);
            
            await addSeparator();
            await typeLine('EXECUTIVE_SUMMARY_GENERATION', 'text-critical', 50);
            
            await addLine('TOTAL_BUSINESS_RESILIENCE: 24.375/100 [CRITICAL FAILURE]', 'critical', false, 500);
            await addLine('RISK_CLASSIFICATION: SEVERE - MULTIPLE CASCADING FAILURES DETECTED', 'critical', false, 400);
            await addLine('BANKRUPTCY_PROBABILITY: 78% (90-day horizon)', 'error', false, 400);
            await addLine('REGULATORY_SHUTDOWN_RISK: HIGH', 'error', false, 300);
            
            await addLine('_', 'muted', false, 200);
            await typeLine('RECOMMENDATION: IMMEDIATE CEASE-OF-OPERATIONS PROTOCOL ADVISED', 'critical', 40);
            await typeLine('ESTIMATED_TIMELINE TO IRREVERSIBLE FAILURE: 14-23 DAYS', 'critical', 35);
            await typeLine('CRITICAL_PATH: Cash exhaustion → Vendor lockout → Employee exodus → Data breach', 'error', 30);
            
            await addSeparator();
            await addLine('WAR ROOM PROTOCOL ACTIVATED - ALL HANDS REQUIRED', 'highlight', false, 600);
            await addLine('REPORT_GENERATED: /var/log/warroom/CRITICAL_AUDIT_2026-03-01.log', 'muted', false, 400);
            
            // Final blinking cursor
            if (isCancelled) return null;
            const finalLine = document.createElement('div');
            finalLine.className = 'wr-line';
            finalLine.innerHTML = '<span class="wr-prompt">➜</span><span class="wr-cursor"></span>';
            terminal!.appendChild(finalLine);
        }

        const scanTimeout = setTimeout(() => {
            if (!isCancelled) runDeepScan();
        }, 800);

        return () => {
            isCancelled = true;
            clearTimeout(scanTimeout);
            document.removeEventListener('click', enableAudio);
        };
    }, [runId]);

    const handleRestart = () => {
        setRunId(prev => prev + 1);
    };

    return (
        <section className="w-full py-24 bg-muted/50 border-y border-border">
            <style dangerouslySetInnerHTML={{ __html: `
                .war-room-terminal {
                    font-family: 'Fira Code', monospace;
                    color: #00ff41;
                }
                .war-room-terminal .wr-terminal-container {
                    background: linear-gradient(135deg, #0a0a0a 0%, #151515 100%);
                    border: 1px solid #2a2a2a;
                    border-radius: 12px;
                    box-shadow: 
                        0 0 50px rgba(0, 255, 65, 0.15),
                        inset 0 0 150px rgba(0, 0, 0, 0.9),
                        0 20px 60px rgba(0,0,0,0.8);
                    max-width: 1100px;
                    margin: 0 auto;
                    overflow: hidden;
                    position: relative;
                    text-align: left;
                    cursor: pointer;
                }
                .war-room-terminal .wr-terminal-header {
                    background: linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%);
                    padding: 15px 25px;
                    border-bottom: 1px solid #333;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.5);
                }
                .war-room-terminal .wr-window-controls {
                    display: flex;
                    gap: 10px;
                }
                .war-room-terminal .wr-dot {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    border: 1px solid rgba(0,0,0,0.3);
                    box-shadow: inset 0 1px 3px rgba(255,255,255,0.2);
                }
                .war-room-terminal .wr-dot.red { background: #ff5f56; }
                .war-room-terminal .wr-dot.yellow { background: #ffbd2e; }
                .war-room-terminal .wr-dot.green { background: #27c93f; }
                .war-room-terminal .wr-terminal-title {
                    color: #888;
                    font-size: 13px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .war-room-terminal .wr-status-indicator {
                    color: #ff073a;
                    font-size: 11px;
                    font-weight: 700;
                    animation: wr-pulse 2s infinite;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    white-space: nowrap;
                }
                @keyframes wr-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .war-room-terminal .wr-terminal-body {
                    padding: 30px;
                    height: 275px;
                    overflow-y: auto;
                    position: relative;
                    background: 
                        repeating-linear-gradient(
                            0deg,
                            rgba(0, 255, 65, 0.03),
                            rgba(0, 255, 65, 0.03) 1px,
                            transparent 1px,
                            transparent 2px
                        ),
                        linear-gradient(180deg, rgba(0,255,65,0.02) 0%, transparent 10%);
                    background-size: 100% 100%, 100% 100%;
                }
                .war-room-terminal .wr-line {
                    margin: 0;
                    padding: 4px 0;
                    font-size: 13px;
                    line-height: 1.6;
                    opacity: 0;
                    animation: wr-fadeIn 0.08s forwards;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    text-shadow: 0 0 2px currentColor;
                    font-family: inherit;
                }
                @keyframes wr-fadeIn {
                    to { opacity: 1; }
                }
                .war-room-terminal .wr-prompt {
                    color: #00ff41;
                    font-weight: 700;
                    margin-right: 10px;
                    opacity: 0.8;
                }
                .war-room-terminal .wr-text-success { color: #00ff41; text-shadow: 0 0 8px rgba(0, 255, 65, 0.6); }
                .war-room-terminal .wr-text-error { 
                    color: #ff073a; 
                    text-shadow: 0 0 5px rgba(255, 7, 58, 0.5); 
                    font-weight: 700;
                }
                .war-room-terminal .wr-text-warning { color: #ffd700; text-shadow: 0 0 8px rgba(255, 215, 0, 0.5); font-weight: 600; }
                .war-room-terminal .wr-text-info { color: #00d9ff; text-shadow: 0 0 8px rgba(0, 217, 255, 0.4); }
                .war-room-terminal .wr-text-muted { color: #555; }
                .war-room-terminal .wr-text-highlight { color: #ff00ff; text-shadow: 0 0 10px rgba(255, 0, 255, 0.6); font-weight: 700; }
                .war-room-terminal .wr-text-critical { 
                    color: #ff0000; 
                    background: rgba(255, 0, 0, 0.1);
                    padding: 2px 6px;
                    font-weight: 900;
                    text-shadow: 0 0 8px rgba(255, 0, 0, 0.6);
                }
                @keyframes wr-criticalPulse {
                    0%, 100% { background: rgba(255, 0, 0, 0.1); }
                    50% { background: rgba(255, 0, 0, 0.3); }
                }
                .war-room-terminal .wr-cursor {
                    display: inline-block;
                    width: 10px;
                    height: 16px;
                    background: #00ff41;
                    animation: wr-blink 1.1s infinite;
                    vertical-align: middle;
                    margin-left: 3px;
                    box-shadow: 0 0 10px #00ff41;
                }
                @keyframes wr-blink {
                    0%, 45% { opacity: 1; }
                    50%, 95% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .war-room-terminal .wr-scan-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.4), transparent);
                    animation: wr-scan 6s linear infinite;
                    pointer-events: none;
                    box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
                    z-index: 10;
                }
                @keyframes wr-scan {
                    0% { top: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                /* .war-room-terminal .wr-glitch animation removed */
                .war-room-terminal .wr-glitch::before,
                .war-room-terminal .wr-glitch::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                @keyframes wr-glitch {
                    0% { transform: translate(0); filter: hue-rotate(0deg); }
                    10% { transform: translate(-3px, 3px); }
                    20% { transform: translate(-3px, -3px); }
                    30% { transform: translate(3px, 3px); }
                    40% { transform: translate(3px, -3px); filter: hue-rotate(90deg); }
                    50% { transform: translate(-3px, 3px); }
                    60% { transform: translate(-3px, -3px); }
                    70% { transform: translate(3px, 3px); }
                    80% { transform: translate(3px, -3px); }
                    90% { transform: translate(-3px, 3px); filter: hue-rotate(0deg); }
                    100% { transform: translate(0); }
                }
                .war-room-terminal .wr-indent {
                    margin-left: 30px;
                    border-left: 2px solid #333;
                    padding-left: 15px;
                    opacity: 0.9;
                }
                .war-room-terminal .wr-timestamp {
                    color: #444;
                    font-size: 11px;
                    margin-right: 12px;
                    font-weight: 300;
                }
                .war-room-terminal .wr-progress-container {
                    display: inline-flex;
                    align-items: center;
                    margin-left: 15px;
                    gap: 10px;
                }
                .war-room-terminal .wr-progress-bar {
                    width: 150px;
                    height: 6px;
                    background: #1a1a1a;
                    border: 1px solid #333;
                    position: relative;
                    overflow: hidden;
                }
                .war-room-terminal .wr-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #00ff41, #00d9ff, #00ff41);
                    background-size: 200% 100%;
                    width: 0%;
                    transition: width 0.5s ease;
                    box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
                    animation: wr-shimmer 2s infinite;
                }
                @keyframes wr-shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .war-room-terminal .wr-progress-text {
                    font-size: 11px;
                    color: #666;
                    min-width: 40px;
                }
                .war-room-terminal .wr-section-header {
                    border-top: 1px solid #333;
                    border-bottom: 1px solid #333;
                    padding: 8px 0;
                    margin: 15px 0;
                    background: rgba(255,255,255,0.02);
                }
                .war-room-terminal .wr-metric {
                    display: inline-block;
                    background: rgba(0,0,0,0.3);
                    padding: 2px 8px;
                    margin: 0 4px;
                    border: 1px solid #333;
                    font-family: inherit;
                    font-size: 12px;
                }
                .war-room-terminal .wr-matrix-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(circle at 50% 50%, rgba(0,255,65,0.03) 0%, transparent 70%),
                        repeating-linear-gradient(
                            90deg,
                            rgba(0, 255, 65, 0.02) 0px,
                            rgba(0, 255, 65, 0.02) 1px,
                            transparent 1px,
                            transparent 30px
                        );
                    pointer-events: none;
                    z-index: 0;
                }
                .war-room-terminal .wr-content {
                    position: relative;
                    z-index: 1;
                }
                /* Scrollbar */
                .war-room-terminal .wr-terminal-body::-webkit-scrollbar {
                    width: 12px;
                }
                .war-room-terminal .wr-terminal-body::-webkit-scrollbar-track {
                    background: #0a0a0a;
                    border-left: 1px solid #222;
                }
                .war-room-terminal .wr-terminal-body::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #333, #222);
                    border-radius: 6px;
                    border: 1px solid #444;
                }
                .war-room-terminal .wr-terminal-body::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, #444, #333);
                }
            ` }} />
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: Copy */}
                <div className="space-y-6 order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 text-signal-red font-mono text-xs uppercase tracking-widest">
                        <span className="w-2 h-2 bg-signal-red rounded-full animate-pulse" />
                        Active Simulation
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground uppercase tracking-tighter">
                        Don&apos;t Wait for <br />A <span className="text-signal-red">Crisis.</span>
                    </h2>
                    <p className="text-muted-foreground text-lg font-mono leading-relaxed">
                        We don&apos;t just store documents. We stress-test them. <br />
                        Run scenarios to see if your business survives a dispute or audit.
                    </p>
                    <button 
                        onClick={() => setIsTestOpen(true)}
                        className="flex items-center gap-3 text-signal-green font-mono uppercase tracking-widest text-sm hover:text-foreground transition-colors group"
                    >
                        <Sparkles className="w-4 h-4" />
                        Free Unicorn Ready Test
                    </button>
                </div>

                {/* Right: Terminal Visual */}
                <div className="order-1 lg:order-2 war-room-terminal" suppressHydrationWarning>
                    <div className="wr-terminal-container" onDoubleClick={handleRestart}>
                        <div className="wr-terminal-header">
                            <div className="wr-window-controls">
                                <div className="wr-dot red"></div>
                                <div className="wr-dot yellow"></div>
                                <div className="wr-dot green"></div>
                            </div>
                            <div className="wr-status-indicator">● LIVE AUDIT IN PROGRESS</div>
                        </div>
                        <div className="wr-terminal-body" id="terminal" ref={terminalBodyRef}>
                            <div className="wr-matrix-bg"></div>
                            <div className="wr-scan-line"></div>
                            <div className="wr-content" id="output" ref={outputRef}></div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Unicorn Test Modal */}
            <UnicornTestModal isOpen={isTestOpen} onClose={() => setIsTestOpen(false)} />
        </section>
    );
}
