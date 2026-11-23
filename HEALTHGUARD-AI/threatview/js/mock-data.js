/**
 * AI-Based Healthcare Network Security Monitoring System
 * Healthcare-specific mock data — window.MOCK
 */
(function () {
  'use strict';

  window.MOCK = {};

  /* ─── Healthcare Network Assets ─── */
  MOCK.targets = [
    { id: 't001', name: 'EMR-Server-01',        address: '192.168.10.10',  type: 'server',     tags: ['EMR','critical','linux'],         status: 'active',      addedAt: '2025-01-01', lastScanned: '2025-10-25', criticality: 'critical', os: 'Ubuntu 22.04', department: 'IT' },
    { id: 't002', name: 'PACS-Server-01',        address: '192.168.10.20',  type: 'server',     tags: ['PACS','imaging','windows'],        status: 'active',      addedAt: '2025-01-05', lastScanned: '2025-10-24', criticality: 'critical', os: 'Windows Server 2019', department: 'Radiology' },
    { id: 't003', name: 'HIS-Database-01',       address: '192.168.10.30',  type: 'server',     tags: ['HIS','database','mysql'],          status: 'active',      addedAt: '2025-01-05', lastScanned: '2025-10-23', criticality: 'critical', os: 'CentOS 8', department: 'IT' },
    { id: 't004', name: 'ICU-Monitor-Gateway',   address: '192.168.20.5',   type: 'medical',    tags: ['ICU','IoMT','gateway'],            status: 'active',      addedAt: '2025-01-10', lastScanned: '2025-10-22', criticality: 'high',     os: 'Embedded Linux', department: 'ICU' },
    { id: 't005', name: 'Infusion-Pump-Ctrl',    address: '192.168.20.15',  type: 'medical',    tags: ['infusion','IoMT','pump'],          status: 'active',      addedAt: '2025-01-10', lastScanned: '2025-10-20', criticality: 'critical', os: 'VxWorks 6.9', department: 'Pharmacy' },
    { id: 't006', name: 'Workstation-Radiology', address: '192.168.30.10',  type: 'endpoint',   tags: ['workstation','windows','DICOM'],   status: 'active',      addedAt: '2025-01-12', lastScanned: '2025-10-21', criticality: 'medium',   os: 'Windows 10 Pro', department: 'Radiology' },
    { id: 't007', name: 'Workstation-Nursing',   address: '192.168.30.20',  type: 'endpoint',   tags: ['workstation','windows','nursing'],  status: 'active',      addedAt: '2025-01-12', lastScanned: '2025-10-19', criticality: 'medium',   os: 'Windows 10 Pro', department: 'Nursing' },
    { id: 't008', name: 'Lab-LIMS-Server',        address: '192.168.10.40',  type: 'server',     tags: ['LIMS','laboratory','linux'],       status: 'active',      addedAt: '2025-01-15', lastScanned: '2025-10-18', criticality: 'high',     os: 'Ubuntu 20.04', department: 'Laboratory' },
    { id: 't009', name: 'Firewall-Perimeter',     address: '10.0.0.1',       type: 'network',    tags: ['firewall','perimeter','network'],  status: 'active',      addedAt: '2025-01-01', lastScanned: '2025-10-25', criticality: 'critical', os: 'FortiOS 7.2', department: 'IT' },
    { id: 't010', name: 'MRI-Scanner-IoT',        address: '192.168.20.30',  type: 'medical',    tags: ['MRI','IoMT','imaging'],            status: 'in-progress', addedAt: '2025-02-01', lastScanned: '2025-10-15', criticality: 'high',     os: 'Embedded', department: 'Radiology' }
  ];

  /* ─── Scans ─── */
  MOCK.scans = [
    { id: 's001', targetId: 't001', targetName: 'EMR-Server-01',        type: 'full',    startedAt: '2025-10-25T08:00:00Z', completedAt: '2025-10-25T09:02:00Z', status: 'completed', findingsCount: { critical: 3, high: 6, medium: 9, low: 8, info: 4 } },
    { id: 's002', targetId: 't002', targetName: 'PACS-Server-01',        type: 'full',    startedAt: '2025-10-24T09:00:00Z', completedAt: '2025-10-24T10:15:00Z', status: 'completed', findingsCount: { critical: 2, high: 4, medium: 7, low: 5, info: 2 } },
    { id: 's003', targetId: 't003', targetName: 'HIS-Database-01',       type: 'full',    startedAt: '2025-10-23T10:00:00Z', completedAt: '2025-10-23T11:30:00Z', status: 'completed', findingsCount: { critical: 2, high: 5, medium: 6, low: 4, info: 3 } },
    { id: 's004', targetId: 't004', targetName: 'ICU-Monitor-Gateway',   type: 'quick',   startedAt: '2025-10-22T07:00:00Z', completedAt: '2025-10-22T07:28:00Z', status: 'completed', findingsCount: { critical: 1, high: 3, medium: 4, low: 2, info: 1 } },
    { id: 's005', targetId: 't005', targetName: 'Infusion-Pump-Ctrl',    type: 'stealth', startedAt: '2025-10-20T06:00:00Z', completedAt: '2025-10-20T06:45:00Z', status: 'completed', findingsCount: { critical: 2, high: 2, medium: 3, low: 2, info: 1 } },
    { id: 's006', targetId: 't008', targetName: 'Lab-LIMS-Server',        type: 'quick',   startedAt: '2025-10-18T11:00:00Z', completedAt: '2025-10-18T11:25:00Z', status: 'completed', findingsCount: { critical: 0, high: 2, medium: 4, low: 3, info: 2 } },
    { id: 's007', targetId: 't009', targetName: 'Firewall-Perimeter',     type: 'stealth', startedAt: '2025-10-25T06:00:00Z', completedAt: '2025-10-25T07:10:00Z', status: 'completed', findingsCount: { critical: 0, high: 1, medium: 2, low: 3, info: 5 } },
    { id: 's008', targetId: 't010', targetName: 'MRI-Scanner-IoT',        type: 'quick',   startedAt: '2025-10-15T09:00:00Z', completedAt: null,                   status: 'in-progress', findingsCount: { critical: 0, high: 0, medium: 0, low: 0, info: 0 } }
  ];

  /* ─── Vulnerabilities ─── */
  MOCK.vulnerabilities = [
    { id: 'v001', scanId: 's001', cveId: 'CVE-2024-1234', severity: 'critical', cvssScore: 9.8, service: 'HTTP',  port: 80,   title: 'Remote Code Execution in EMR API Endpoint',    description: 'Unsafe deserialization in patient record API allows unauthenticated RCE.', remediation: 'Update EMR software to v5.2.1. Apply vendor patch immediately.' },
    { id: 'v002', scanId: 's001', cveId: 'CVE-2024-5678', severity: 'critical', cvssScore: 9.4, service: 'HTTPS', port: 443,  title: 'SQL Injection in Patient Login Portal',         description: 'User-controlled input passed unsanitized to SQL query allowing patient data dump.', remediation: 'Use parameterized queries. Audit all DB calls. Patch immediately.' },
    { id: 'v003', scanId: 's001', cveId: 'CVE-2023-3888', severity: 'critical', cvssScore: 9.1, service: 'SSH',   port: 22,   title: 'Default SSH Credentials on EMR Server',         description: 'EMR server uses vendor default credentials "admin/admin123", fully accessible remotely.', remediation: 'Change default credentials. Implement key-based auth only.' },
    { id: 'v004', scanId: 's001', cveId: 'CVE-2024-2233', severity: 'high',     cvssScore: 8.1, service: 'HTTP',  port: 8080, title: 'SSRF Allowing Internal Network Access',          description: 'URL parameter in EMR allows access to internal healthcare network resources.', remediation: 'Whitelist allowed URL schemes and hosts. Block internal IPs.' },
    { id: 'v005', scanId: 's001', cveId: null,             severity: 'high',     cvssScore: 7.5, service: 'HTTP',  port: 80,   title: 'Patient Data Exposed in HTTP Response Headers', description: 'Internal patient record paths and DB version exposed in Server headers.', remediation: 'Remove Server/X-Powered-By headers. Configure header suppression.' },
    { id: 'v006', scanId: 's001', cveId: 'CVE-2023-1111', severity: 'high',     cvssScore: 7.2, service: 'HTTPS', port: 443,  title: 'Cross-Site Scripting in Patient Search',        description: 'Patient name search reflects unsanitized input, enabling XSS attacks.', remediation: 'HTML-encode all user-controlled output. Implement strict CSP.' },
    { id: 'v007', scanId: 's001', cveId: null,             severity: 'medium',   cvssScore: 5.4, service: 'HTTP',  port: 80,   title: 'Missing HIPAA Required Security Headers',       description: 'X-Frame-Options, HSTS, and CSP headers absent on patient portal.', remediation: 'Add all required security headers per HIPAA technical safeguards.' },
    { id: 'v008', scanId: 's001', cveId: null,             severity: 'medium',   cvssScore: 4.8, service: 'FTP',   port: 21,   title: 'FTP Service Exposing Patient Records',          description: 'Unencrypted FTP accessible; patient records transmitted in cleartext.', remediation: 'Disable FTP. Migrate to SFTP with strong authentication.' },
    { id: 'v009', scanId: 's002', cveId: 'CVE-2024-7712', severity: 'critical', cvssScore: 9.5, service: 'DICOM', port: 104,  title: 'DICOM Protocol Unauthenticated Access',          description: 'PACS server allows unauthenticated DICOM queries exposing all patient imaging data.', remediation: 'Enable DICOM TLS and require AE title authentication.' },
    { id: 'v010', scanId: 's002', cveId: 'CVE-2023-9521', severity: 'critical', cvssScore: 9.0, service: 'HTTPS', port: 443,  title: 'PACS Web Interface Remote Code Execution',      description: 'Vendor PACS web component contains deserialization vulnerability.', remediation: 'Apply vendor patch PSA-2023-003 immediately. Isolate PACS network.' },
    { id: 'v011', scanId: 's002', cveId: null,             severity: 'high',     cvssScore: 8.0, service: 'DICOM', port: 104,  title: 'Unencrypted DICOM Traffic on Network',          description: 'Medical imaging data transmitted unencrypted between PACS and workstations.', remediation: 'Enable DICOM TLS. Segment imaging network with VLAN.' },
    { id: 'v012', scanId: 's002', cveId: 'CVE-2022-4455', severity: 'high',     cvssScore: 7.8, service: 'HTTP',  port: 8080, title: 'Outdated PACS Web Component (v3.1.0)',           description: 'PACS web component v3.1.0 contains multiple known CVEs.', remediation: 'Upgrade to PACS Web v4.2.1 or later.' },
    { id: 'v013', scanId: 's003', cveId: 'CVE-2024-3344', severity: 'critical', cvssScore: 9.6, service: 'MySQL', port: 3306, title: 'HIS Database Root Access No Password',          description: 'Hospital Information System DB root account has no password and is remotely accessible.', remediation: 'Set strong root password. Disable remote root login. Apply RBAC.' },
    { id: 'v014', scanId: 's003', cveId: 'CVE-2023-7777', severity: 'critical', cvssScore: 9.2, service: 'MySQL', port: 3306, title: 'HIS Database Exposed to Public Network',         description: 'MySQL port 3306 accessible from external network, no firewall restriction.', remediation: 'Restrict DB access to application server IPs only via firewall rules.' },
    { id: 'v015', scanId: 's003', cveId: null,             severity: 'high',     cvssScore: 7.9, service: 'MySQL', port: 3306, title: 'Excessive Privilege on HIS Application Account', description: 'HIS application DB account has GRANT ALL, can access all databases.', remediation: 'Apply least-privilege. Grant only necessary schema/table permissions.' },
    { id: 'v016', scanId: 's003', cveId: 'CVE-2023-5512', severity: 'high',     cvssScore: 7.5, service: 'HTTP',  port: 80,   title: 'Unencrypted PHI Transmission (HTTP)',           description: 'HIS admin panel accessible over HTTP transmitting PHI in cleartext.', remediation: 'Enforce HTTPS. Redirect all HTTP to HTTPS. Use HSTS.' },
    { id: 'v017', scanId: 's004', cveId: 'CVE-2024-8821', severity: 'critical', cvssScore: 9.3, service: 'Telnet',port: 23,   title: 'Telnet Enabled on ICU Monitor Gateway',         description: 'ICU medical device gateway has Telnet service enabled with default credentials.', remediation: 'Disable Telnet. Use SSH with key-based authentication only.' },
    { id: 'v018', scanId: 's004', cveId: null,             severity: 'high',     cvssScore: 7.6, service: 'HTTP',  port: 80,   title: 'ICU Device Firmware Outdated (v1.8.3)',          description: 'ICU monitor gateway running firmware with 12 known security vulnerabilities.', remediation: 'Contact vendor for firmware v2.1.0 update. Schedule maintenance window.' },
    { id: 'v019', scanId: 's004', cveId: 'CVE-2023-2211', severity: 'high',     cvssScore: 7.2, service: 'SNMP',  port: 161,  title: 'SNMP v1/v2c with Public Community String',       description: 'ICU gateway uses SNMP v1 with "public" community string, full read access.', remediation: 'Upgrade to SNMPv3 with authentication and encryption. Change community strings.' },
    { id: 'v020', scanId: 's005', cveId: 'CVE-2025-0011', severity: 'critical', cvssScore: 9.7, service: 'HTTP',  port: 80,   title: 'Infusion Pump API Unauthenticated Dosage Change',description: 'Infusion pump control API accepts dosage modification without authentication — direct patient harm risk.', remediation: 'Apply vendor emergency patch. Isolate pump network segment immediately. Contact FDA.' },
    { id: 'v021', scanId: 's005', cveId: 'CVE-2024-6633', severity: 'critical', cvssScore: 9.1, service: 'HTTP',  port: 8080, title: 'Infusion Pump Hardcoded Credentials',            description: 'Device uses hardcoded credentials "admin:pump123" accessible on local network.', remediation: 'Apply vendor patch. Segment IoMT network. Monitor all pump traffic.' },
    { id: 'v022', scanId: 's005', cveId: null,             severity: 'high',     cvssScore: 8.2, service: 'FTP',   port: 21,   title: 'Pump Firmware Update via Unencrypted FTP',       description: 'Firmware update mechanism uses unencrypted FTP, susceptible to MITM attacks.', remediation: 'Require signed firmware updates over TLS. Verify firmware integrity.' },
    { id: 'v023', scanId: 's006', cveId: null,             severity: 'high',     cvssScore: 7.4, service: 'HTTP',  port: 80,   title: 'LIMS Authentication Bypass via JWT Flaw',        description: 'Lab system accepts JWTs signed with "none" algorithm, bypassing authentication.', remediation: 'Whitelist allowed JWT algorithms (RS256). Reject "none" algorithm.' },
    { id: 'v024', scanId: 's006', cveId: 'CVE-2023-4411', severity: 'high',     cvssScore: 7.0, service: 'HTTPS', port: 443,  title: 'LIMS Broken Object Level Authorization',         description: 'Lab result endpoint allows changing patient_id to access any patient lab data.', remediation: 'Implement server-side authorization on all resource access.' },
    { id: 'v025', scanId: 's007', cveId: null,             severity: 'high',     cvssScore: 7.8, service: 'VPN',   port: 1194, title: 'Firewall VPN Using TLS 1.0',                     description: 'Hospital VPN endpoint negotiates TLS 1.0 susceptible to POODLE/BEAST.', remediation: 'Set tls-version-min 1.2 in VPN config. Disable TLS 1.0/1.1.' },
    { id: 'v026', scanId: 's001', cveId: null,             severity: 'medium',   cvssScore: 5.8, service: 'HTTP',  port: 80,   title: 'No Rate Limiting on Patient Portal Login',      description: 'Patient login endpoint has no throttling, enabling brute force.', remediation: 'Implement 5 attempts/minute rate limiting. Add account lockout.' },
    { id: 'v027', scanId: 's002', cveId: null,             severity: 'medium',   cvssScore: 5.0, service: 'HTTPS', port: 443,  title: 'PACS Missing Audit Logging (HIPAA §164.312)',   description: 'PACS server does not log access to patient imaging records, HIPAA violation.', remediation: 'Enable audit logging per HIPAA §164.312(b). Forward logs to SIEM.' },
    { id: 'v028', scanId: 's003', cveId: null,             severity: 'medium',   cvssScore: 5.5, service: 'MySQL', port: 3306, title: 'HIS Database Audit Logging Disabled',            description: 'No audit trail for patient record access/modification, HIPAA non-compliant.', remediation: 'Enable MySQL audit plugin. Configure log retention ≥6 years per HIPAA.' },
    { id: 'v029', scanId: 's001', cveId: null,             severity: 'low',      cvssScore: 3.1, service: 'HTTPS', port: 443,  title: 'Session Cookie Missing HttpOnly Flag',           description: 'EMR session cookie accessible via JavaScript, aids XSS exploitation.', remediation: 'Set HttpOnly and Secure flags on all session cookies.' },
    { id: 'v030', scanId: 's001', cveId: null,             severity: 'low',      cvssScore: 2.8, service: 'HTTP',  port: 80,   title: 'EMR Web Server Banner Disclosure',               description: 'Server header reveals Apache 2.4.51 on Ubuntu, facilitates targeted attacks.', remediation: 'Set ServerTokens Prod. Remove version information from headers.' }
  ];

  /* ─── Security Incidents / Threat Intel ─── */
  MOCK.iocs = [
    { id: 'i001', type: 'ip',     value: '185.220.101.45',                              confidence: 97, source: 'Healthcare-ISAC',  tags: ['ransomware','LockBit'],          lastSeen: '2025-10-26', severity: 'critical' },
    { id: 'i002', type: 'ip',     value: '91.108.56.178',                               confidence: 95, source: 'CISecurity',        tags: ['c2','healthcare-targeted'],       lastSeen: '2025-10-25', severity: 'critical' },
    { id: 'i003', type: 'domain', value: 'hospital-update.evil-domain.ru',              confidence: 99, source: 'VirusTotal',        tags: ['phishing','hospital-impersonation'], lastSeen: '2025-10-24', severity: 'critical' },
    { id: 'i004', type: 'domain', value: 'emr-login.suspicious-health.co',              confidence: 93, source: 'PhishTank',         tags: ['phishing','EMR-credential'],      lastSeen: '2025-10-23', severity: 'high' },
    { id: 'i005', type: 'url',    value: 'http://192.168.99.1/HealthLocker.exe',        confidence: 98, source: 'URLhaus',           tags: ['ransomware','healthcare'],        lastSeen: '2025-10-22', severity: 'critical' },
    { id: 'i006', type: 'hash',   value: 'a1b2c3d4e5f6789012345678901234ab',            confidence: 100,source: 'MalwareBazaar',     tags: ['BlackCat','ALPHV','ransomware'],  lastSeen: '2025-10-21', severity: 'critical' },
    { id: 'i007', type: 'email',  value: 'it-support@hospital-helpdesk.net',            confidence: 88, source: 'SpamHaus',          tags: ['social-engineering','staff'],     lastSeen: '2025-10-20', severity: 'high' },
    { id: 'i008', type: 'ip',     value: '45.33.32.156',                                confidence: 82, source: 'AbuseIPDB',         tags: ['scanner','medical-device-probe'], lastSeen: '2025-10-19', severity: 'medium' },
    { id: 'i009', type: 'domain', value: 'pacs-viewer-update.pw',                       confidence: 91, source: 'URLhaus',           tags: ['fake-update','PACS-targeted'],    lastSeen: '2025-10-18', severity: 'high' },
    { id: 'i010', type: 'url',    value: 'https://evil.health.org/admin/ehr_backdoor.php', confidence: 97, source: 'ThreatFox',     tags: ['webshell','EHR-backdoor'],        lastSeen: '2025-10-17', severity: 'critical' },
    { id: 'i011', type: 'hash',   value: 'deadbeef1234567890abcdef01234567',            confidence: 99, source: 'MalwareBazaar',     tags: ['Ryuk','ransomware','hospital'],   lastSeen: '2025-10-16', severity: 'critical' },
    { id: 'i012', type: 'ip',     value: '198.51.100.77',                               confidence: 74, source: 'GreyNoise',         tags: ['port-scanner','IoMT-probe'],      lastSeen: '2025-10-15', severity: 'low' },
    { id: 'i013', type: 'email',  value: 'accounts@medical-billing-update.info',        confidence: 89, source: 'PhishTank',         tags: ['phishing','billing','financial'],  lastSeen: '2025-10-14', severity: 'high' },
    { id: 'i014', type: 'domain', value: 'cdn.medical-tracker.biz',                     confidence: 76, source: 'VirusTotal',        tags: ['adware','telemetry'],             lastSeen: '2025-10-13', severity: 'medium' },
    { id: 'i015', type: 'url',    value: 'ftp://203.0.113.55/tools/mimikatz.zip',       confidence: 100,source: 'ThreatFox',         tags: ['credential-dump','lateral-move'], lastSeen: '2025-10-12', severity: 'critical' },
    { id: 'i016', type: 'hash',   value: 'cafebabe1234567890fedcba098765432',           confidence: 94, source: 'MalwareBazaar',     tags: ['Conti','ransomware','data-exfil'], lastSeen: '2025-10-11', severity: 'critical' },
    { id: 'i017', type: 'ip',     value: '203.0.113.200',                               confidence: 68, source: 'GreyNoise',         tags: ['brute-force','RDP'],              lastSeen: '2025-10-10', severity: 'medium' },
    { id: 'i018', type: 'domain', value: 'secure-emr.myhos-portal.com',                confidence: 95, source: 'PhishTank',         tags: ['phishing','EMR-impersonation'],   lastSeen: '2025-10-09', severity: 'high' },
    { id: 'i019', type: 'email',  value: 'invoice@medical-supplier-update.co.uk',       confidence: 82, source: 'SpamHaus',          tags: ['BEC','invoice-fraud'],            lastSeen: '2025-10-08', severity: 'medium' },
    { id: 'i020', type: 'url',    value: 'http://185.220.101.2/files/pacs_stealer.ps1', confidence: 99, source: 'URLhaus',           tags: ['infostealer','PACS','imaging-data'], lastSeen: '2025-10-07', severity: 'critical' },
    { id: 'i021', type: 'hash',   value: 'f00d1234abcd5678ef901234abcdef01',            confidence: 90, source: 'VirusTotal',        tags: ['spyware','patient-data'],         lastSeen: '2025-10-06', severity: 'high' },
    { id: 'i022', type: 'ip',     value: '10.10.10.99',                                 confidence: 58, source: 'Internal-SIEM',     tags: ['lateral-movement','internal'],    lastSeen: '2025-10-05', severity: 'medium' },
    { id: 'i023', type: 'domain', value: 'telemetry.medical-shady-software.io',         confidence: 72, source: 'VirusTotal',        tags: ['adware','medical-device'],        lastSeen: '2025-10-04', severity: 'low' },
    { id: 'i024', type: 'url',    value: 'https://pastebin.com/raw/H3ALTHd4T4',         confidence: 65, source: 'ThreatFox',         tags: ['c2-config','cobalt-strike'],      lastSeen: '2025-10-03', severity: 'high' },
    { id: 'i025', type: 'email',  value: 'it-support@hospital-corp-portal.com',         confidence: 79, source: 'SpamHaus',          tags: ['social-engineering','IT-staff'],  lastSeen: '2025-10-02', severity: 'medium' }
  ];

  /* ─── Network Nodes — Healthcare topology ─── */
  MOCK.networkNodes = [
    { id: 1,  label: 'Firewall-Perimeter', type: 'firewall', risk: 'medium',   ip: '10.0.0.1',       group: 'perimeter',   icon: '🛡️' },
    { id: 2,  label: 'Core-Switch',        type: 'router',   risk: 'medium',   ip: '10.0.1.1',       group: 'network',     icon: '🔀' },
    { id: 3,  label: 'EMR-Server-01',      type: 'server',   risk: 'critical', ip: '192.168.10.10',  group: 'clinical',    icon: '🖥️' },
    { id: 4,  label: 'PACS-Server-01',     type: 'server',   risk: 'critical', ip: '192.168.10.20',  group: 'imaging',     icon: '🖥️' },
    { id: 5,  label: 'HIS-Database-01',    type: 'server',   risk: 'critical', ip: '192.168.10.30',  group: 'database',    icon: '🗄️' },
    { id: 6,  label: 'Lab-LIMS-Server',    type: 'server',   risk: 'high',     ip: '192.168.10.40',  group: 'laboratory',  icon: '🖥️' },
    { id: 7,  label: 'ICU-Monitor-GW',     type: 'medical',  risk: 'high',     ip: '192.168.20.5',   group: 'icu',         icon: '🏥' },
    { id: 8,  label: 'Infusion-Pump-Ctrl', type: 'medical',  risk: 'critical', ip: '192.168.20.15',  group: 'pharmacy',    icon: '💉' },
    { id: 9,  label: 'MRI-Scanner-IoT',    type: 'medical',  risk: 'high',     ip: '192.168.20.30',  group: 'radiology',   icon: '🔬' },
    { id: 10, label: 'WS-Radiology',       type: 'endpoint', risk: 'medium',   ip: '192.168.30.10',  group: 'workstation', icon: '💻' },
    { id: 11, label: 'WS-Nursing',         type: 'endpoint', risk: 'medium',   ip: '192.168.30.20',  group: 'workstation', icon: '💻' },
    { id: 12, label: 'VPN-Gateway',        type: 'host',     risk: 'medium',   ip: '10.0.0.2',       group: 'perimeter',   icon: '🔒' }
  ];

  MOCK.networkEdges = [
    { from: 12, to: 1,  label: 'VPN' },
    { from: 1,  to: 2,  label: 'trunk' },
    { from: 2,  to: 3,  label: 'VLAN-10' },
    { from: 2,  to: 4,  label: 'VLAN-10' },
    { from: 2,  to: 5,  label: 'VLAN-10' },
    { from: 2,  to: 6,  label: 'VLAN-10' },
    { from: 2,  to: 7,  label: 'VLAN-20' },
    { from: 2,  to: 8,  label: 'VLAN-20' },
    { from: 2,  to: 9,  label: 'VLAN-20' },
    { from: 2,  to: 10, label: 'VLAN-30' },
    { from: 2,  to: 11, label: 'VLAN-30' },
    { from: 3,  to: 5,  label: 'DB-link' },
    { from: 4,  to: 5,  label: 'DB-link' },
    { from: 6,  to: 5,  label: 'DB-link' },
    { from: 7,  to: 3,  label: 'HL7' },
    { from: 8,  to: 3,  label: 'HL7' },
    { from: 10, to: 4,  label: 'DICOM' }
  ];

  /* ─── Trend Data ─── */
  MOCK.trendData = {
    labels:   ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    critical: [2, 4, 3, 5, 6, 8],
    high:     [7, 9, 8, 11, 13, 16],
    medium:   [14, 18, 16, 20, 23, 25],
    low:      [22, 26, 24, 28, 30, 33]
  };

  /* ─── Security Incidents ─── */
  MOCK.incidents = [
    { id: 'inc001', title: 'Ransomware Activity on EMR Server',          severity: 'critical', status: 'active',       assetId: 't001', assetName: 'EMR-Server-01',        detectedAt: '2025-10-26T03:14:00Z', description: 'LockBit ransomware variant detected attempting encryption of EMR database files. Lateral movement from workstation observed.', affectedAssets: ['EMR-Server-01', 'WS-Nursing'], attackType: 'Ransomware', timeline: ['03:12 - Anomalous process spawn on WS-Nursing', '03:14 - Ransomware binary execution detected on EMR-Server-01', '03:15 - File encryption attempt blocked by EDR', '03:16 - Alert generated, network segment isolated'], remediation: ['Isolate affected systems immediately', 'Run full AV scan', 'Restore from last known good backup', 'Patch CVE-2024-1234 on EMR server', 'Reset all credentials on affected segment'] },
    { id: 'inc002', title: 'Unauthorized DICOM Access to Patient Images', severity: 'critical', status: 'investigating', assetId: 't002', assetName: 'PACS-Server-01',       detectedAt: '2025-10-25T14:22:00Z', description: 'Unauthenticated DICOM query from external IP 185.220.101.45 successfully retrieved 1,247 patient imaging records. Active exfiltration suspected.', affectedAssets: ['PACS-Server-01'], attackType: 'Unauthorized Access', timeline: ['14:20 - External IP scanned DICOM port 104', '14:22 - Unauthenticated DICOM query accepted', '14:22 - Bulk patient image retrieval started', '14:35 - AI anomaly detection triggered alert', '14:40 - Connection blocked by firewall rule'], remediation: ['Enable DICOM TLS authentication immediately', 'Block source IP at perimeter firewall', 'Audit all imaging data accessed', 'Notify affected patients per HIPAA breach rules'] },
    { id: 'inc003', title: 'Infusion Pump API Exploitation Attempt',     severity: 'critical', status: 'active',       assetId: 't005', assetName: 'Infusion-Pump-Ctrl',   detectedAt: '2025-10-25T09:45:00Z', description: 'Repeated unauthenticated API calls to /api/set-dosage endpoint from internal IP 10.10.10.99. Dosage values outside safe parameters attempted. Patient safety risk.', affectedAssets: ['Infusion-Pump-Ctrl', 'ICU-Monitor-GW'], attackType: 'Medical Device Attack', timeline: ['09:40 - Port scan of IoMT network segment', '09:45 - API call to /api/set-dosage with no auth', '09:46 - Multiple dosage values outside safe parameters', '09:47 - Clinical alert triggered', '09:48 - Network segment isolated by SOC'], remediation: ['URGENT: Verify all current infusion pump settings manually', 'Isolate pump network segment', 'Apply emergency vendor patch CVE-2025-0011', 'Contact FDA MedWatch per medical device incident protocol'] },
    { id: 'inc004', title: 'Brute Force Attack on HIS Database',         severity: 'high',     status: 'investigating', assetId: 't003', assetName: 'HIS-Database-01',      detectedAt: '2025-10-24T22:10:00Z', description: 'Automated credential stuffing attack against MySQL port 3306. 2,847 login attempts from 12 different IPs over 4 hours. 3 accounts show successful logins.', affectedAssets: ['HIS-Database-01'], attackType: 'Brute Force', timeline: ['22:10 - Unusual volume of DB connection attempts', '22:15 - AI correlation identifies credential stuffing pattern', '23:00 - 3 accounts successfully compromised', '23:05 - Accounts disabled, alert escalated'], remediation: ['Reset all compromised DB accounts', 'Restrict MySQL access to app server IPs only', 'Enable MySQL Enterprise Audit', 'Implement fail2ban for MySQL'] },
    { id: 'inc005', title: 'Phishing Email Campaign Targeting Staff',    severity: 'high',     status: 'resolved',     assetId: 't007', assetName: 'Workstation-Nursing',   detectedAt: '2025-10-23T10:30:00Z', description: 'Targeted spear-phishing campaign impersonating IT helpdesk, targeting 47 nursing staff accounts. 6 staff clicked malicious link. No credentials confirmed stolen.', affectedAssets: ['Workstation-Nursing'], attackType: 'Phishing', timeline: ['10:30 - Phishing emails delivered to 47 nursing accounts', '11:00 - 6 staff clicked malicious link', '11:05 - Email gateway blocked campaign', '11:30 - Affected workstations isolated', '14:00 - Malware scan cleared, users re-enabled'], remediation: ['Password reset for 6 affected staff', 'MFA enforcement for all clinical staff', 'Staff security awareness training', 'Email gateway rule update'] },
    { id: 'inc006', title: 'ICU Device Telnet Default Credentials',      severity: 'high',     status: 'resolved',     assetId: 't004', assetName: 'ICU-Monitor-Gateway',   detectedAt: '2025-10-22T16:00:00Z', description: 'Automated scan discovered Telnet service with default credentials "admin/admin" on ICU monitor gateway. Immediate remediation applied.', affectedAssets: ['ICU-Monitor-GW'], attackType: 'Misconfiguration', timeline: ['16:00 - Vulnerability scanner flagged Telnet on port 23', '16:05 - Default credential confirmed by security team', '16:30 - Telnet disabled, SSH key auth configured', '17:00 - Firmware update scheduled'], remediation: ['Disabled Telnet service', 'Configured SSH key-based auth', 'Firmware update to v2.1.0 scheduled'] }
  ];

  /* ─── Activity Feed ─── */
  MOCK.activityFeed = [
    { id: 'a001', timestamp: '2025-10-26T03:14:00Z', type: 'threat_detected', message: 'CRITICAL: Ransomware activity detected on EMR-Server-01 — network segment isolated', severity: 'critical' },
    { id: 'a002', timestamp: '2025-10-25T14:22:00Z', type: 'unauthorized_access', message: 'CRITICAL: Unauthenticated DICOM access — 1,247 patient images potentially exfiltrated', severity: 'critical' },
    { id: 'a003', timestamp: '2025-10-25T09:45:00Z', type: 'device_attack', message: 'CRITICAL: Infusion pump dosage API exploitation attempt — patient safety risk', severity: 'critical' },
    { id: 'a004', timestamp: '2025-10-25T08:00:00Z', type: 'scan_complete', message: 'Full scan completed on EMR-Server-01 — 30 findings (3 critical)', severity: 'critical' },
    { id: 'a005', timestamp: '2025-10-24T22:10:00Z', type: 'brute_force', message: 'Brute force attack on HIS-Database-01 — 3 accounts compromised', severity: 'high' },
    { id: 'a006', timestamp: '2025-10-24T09:00:00Z', type: 'scan_complete', message: 'Full scan completed on PACS-Server-01 — 20 findings (2 critical)', severity: 'high' },
    { id: 'a007', timestamp: '2025-10-23T10:30:00Z', type: 'phishing', message: 'Phishing campaign targeting 47 nursing staff — 6 accounts clicked malicious link', severity: 'high' },
    { id: 'a008', timestamp: '2025-10-22T16:00:00Z', type: 'misconfiguration', message: 'ICU gateway Telnet default credentials found and remediated', severity: 'high' },
    { id: 'a009', timestamp: '2025-10-20T06:00:00Z', type: 'scan_complete', message: 'Stealth scan on Infusion-Pump-Ctrl — 10 findings (2 critical)', severity: 'critical' },
    { id: 'a010', timestamp: '2025-10-18T11:00:00Z', type: 'scan_complete', message: 'Quick scan on Lab-LIMS-Server — 11 findings (0 critical)', severity: 'medium' }
  ];

  /* ─── AI Findings / Anomalies ─── */
  MOCK.aiFindings = [
    { id: 'ai001', timestamp: '2025-10-26T03:12:00Z', type: 'anomaly', title: 'Unusual Process Spawn Pattern on Nursing Workstation', confidence: 94, riskScore: 9.2, description: 'AI detected unusual PowerShell execution chain consistent with ransomware staging. Pattern matches LockBit 3.0 TTP.', relatedAssets: ['WS-Nursing', 'EMR-Server-01'], attackPhase: 'Execution', status: 'active' },
    { id: 'ai002', timestamp: '2025-10-25T14:18:00Z', type: 'anomaly', title: 'Bulk DICOM Query — Abnormal Data Volume', confidence: 98, riskScore: 9.5, description: 'AI flagged 1,247 DICOM queries in 13 minutes from single external IP. Normal baseline is <10 queries/hour per workstation.', relatedAssets: ['PACS-Server-01'], attackPhase: 'Exfiltration', status: 'active' },
    { id: 'ai003', timestamp: '2025-10-25T09:43:00Z', type: 'anomaly', title: 'Medical Device API Behavior Deviation', confidence: 96, riskScore: 9.7, description: 'AI detected unauthenticated API calls to infusion pump control endpoint. Dosage values exceed safe medical parameters by 400%.', relatedAssets: ['Infusion-Pump-Ctrl'], attackPhase: 'Impact', status: 'active' },
    { id: 'ai004', timestamp: '2025-10-24T22:08:00Z', type: 'correlation', title: 'Correlated Credential Stuffing Attack Chain', confidence: 91, riskScore: 8.4, description: 'AI correlated 12 distributed source IPs performing coordinated MySQL brute force. Pattern consistent with purchased credential list targeting healthcare systems.', relatedAssets: ['HIS-Database-01'], attackPhase: 'Initial Access', status: 'investigating' },
    { id: 'ai005', timestamp: '2025-10-23T10:28:00Z', type: 'pattern', title: 'Phishing Campaign Pattern Recognition', confidence: 88, riskScore: 7.8, description: 'AI identified spear-phishing emails targeting clinical staff. Sender domain registered 3 days ago. Email content matches healthcare credential harvesting template.', relatedAssets: ['WS-Nursing'], attackPhase: 'Initial Access', status: 'resolved' },
    { id: 'ai006', timestamp: '2025-10-22T15:55:00Z', type: 'anomaly', title: 'IoMT Device Unusual Network Traffic', confidence: 83, riskScore: 7.2, description: 'ICU monitor gateway initiating outbound connections to unknown IP on port 4444. No baseline for this behavior. Potential C2 communication.', relatedAssets: ['ICU-Monitor-GW'], attackPhase: 'Command & Control', status: 'resolved' },
    { id: 'ai007', timestamp: '2025-10-21T11:00:00Z', type: 'prediction', title: 'Predicted Attack Path: EMR → HIS Database', confidence: 79, riskScore: 8.1, description: 'AI predicts high probability (79%) of lateral movement from compromised EMR server to HIS database based on observed network path and credential reuse patterns.', relatedAssets: ['EMR-Server-01', 'HIS-Database-01'], attackPhase: 'Lateral Movement', status: 'active' }
  ];

  /* ─── Report Data ─── */
  MOCK.reportData = {
    executiveSummary: 'Security assessment of the healthcare network identified critical risks across EMR, PACS, and medical device systems. A total of 30 vulnerabilities were identified with 8 rated Critical — including a patient-safety risk on infusion pump controllers. Active threats include ransomware activity and unauthorized patient imaging data access. Immediate remediation is required per HIPAA §164.312 technical safeguards.',
    findings: MOCK.vulnerabilities,
    hipaaControls: [
      { id: 'h01', section: '§164.312(a)(1)', name: 'Access Control — Unique User Identification',      status: 'non-compliant', detail: 'Shared accounts detected on EMR and PACS servers' },
      { id: 'h02', section: '§164.312(a)(2)', name: 'Access Control — Automatic Logoff',               status: 'compliant',     detail: 'Session timeout configured on clinical workstations' },
      { id: 'h03', section: '§164.312(b)',    name: 'Audit Controls',                                  status: 'non-compliant', detail: 'Audit logging missing on PACS and HIS Database' },
      { id: 'h04', section: '§164.312(c)(1)', name: 'Integrity — Authentication Mechanisms',           status: 'non-compliant', detail: 'No data integrity checking on DICOM transfers' },
      { id: 'h05', section: '§164.312(c)(2)', name: 'Integrity — Mechanism to Authenticate ePHI',     status: 'non-compliant', detail: 'Missing file integrity monitoring on EMR' },
      { id: 'h06', section: '§164.312(d)',    name: 'Person or Entity Authentication',                 status: 'non-compliant', detail: 'MFA not enforced for all clinical staff' },
      { id: 'h07', section: '§164.312(e)(1)', name: 'Transmission Security — Encryption in Transit',  status: 'non-compliant', detail: 'DICOM, HIS admin panel, FTP transmitting unencrypted PHI' },
      { id: 'h08', section: '§164.312(e)(2)', name: 'Transmission Security — Encryption Mechanism',   status: 'compliant',     detail: 'EMR patient portal uses TLS 1.3 for HTTPS' },
      { id: 'h09', section: '§164.308(a)(1)', name: 'Risk Analysis',                                  status: 'compliant',     detail: 'Annual risk assessment completed' },
      { id: 'h10', section: '§164.308(a)(5)', name: 'Security Awareness Training',                    status: 'non-compliant', detail: 'Nursing staff vulnerable to phishing — training overdue' },
      { id: 'h11', section: '§164.308(a)(6)', name: 'Security Incident Procedures',                   status: 'compliant',     detail: 'Incident response plan documented and tested' },
      { id: 'h12', section: '§164.308(a)(7)', name: 'Contingency Plan / Backup',                      status: 'compliant',     detail: 'Daily backups with 30-day retention confirmed' }
    ],
    // Derived from hipaaControls — single source of truth for both dashboard and reports
    get hipaaCompliance() {
      var ctrls = this.hipaaControls;
      var compliant = ctrls.filter(function(c){ return c.status === 'compliant'; }).length;
      return { total: ctrls.length, compliant: compliant, nonCompliant: ctrls.length - compliant };
    },
    recommendations: [
      'URGENT: Isolate infusion pump network segment and apply emergency patch CVE-2025-0011.',
      'URGENT: Enable DICOM TLS authentication on all PACS servers within 24 hours.',
      'Apply all critical patches within 48 hours per healthcare security SLA.',
      'Implement network segmentation: separate IoMT devices onto isolated VLAN.',
      'Deploy HIPAA-compliant audit logging on all systems handling PHI.',
      'Enforce multi-factor authentication for all clinical staff access to EMR/PACS.',
      'Disable Telnet on all medical devices; enforce SSH key-based authentication.',
      'Conduct quarterly security awareness training for all healthcare staff.',
      'Deploy a healthcare-specific SIEM for real-time threat correlation.',
      'Establish IoMT security monitoring program with real-time device behavioral analysis.'
    ]
  };

}());
