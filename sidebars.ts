import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    tutorialSidebar: [
        'intro',
        'study-plan',
        {
            type: 'category',
            label: '一、信息安全基础',
            items: ['fundamentals/index', 'fundamentals/concepts', 'fundamentals/models', 'fundamentals/laws'],
        },
        {
            type: 'category',
            label: '二、密码学基础与应用 ⭐',
            items: [
                'crypto/index',
                'crypto/classical',
                'crypto/des',
                'crypto/symmetric',
                'crypto/hash',
                'crypto/asymmetric',
                'crypto/signature',
                'crypto/pki',
                'crypto/kerberos-x509',
                'crypto/national-crypto',
            ],
        },
        {
            type: 'category',
            label: '三、网络安全',
            items: [
                'network/index',
                'network/osi-model',
                'network/protocol-security',
                'network/security-system-model',
                'network/attack-principles',
                'network/attacks',
                'network/firewall',
                'network/ids-ips',
                'network/vpn-ipsec',
                'network/tls-https',
                'network/physical-security',
                'network/physical-isolation',
                'network/security-audit',
                'network/active-defense',
                'network/security-architecture',
                'network/security-assessment',
            ],
        },
        {
            type: 'category',
            label: '四、系统安全',
            items: [
                'system/index',
                'system/os-security',
                'system/access-control',
                'system/authentication',
                'system/malware',
                'system/malware-advanced',
                'system/vulnerability-incident',
                'system/vulnerability-management',
                'system/security-operations',
            ],
        },
        {
            type: 'category',
            label: '五、应用安全',
            items: [
                'application/index',
                'application/web-attacks',
                'application/web-security-extra',
                'application/database',
                'application/email-mobile',
                'application/cloud-iot',
            ],
        },
        {
            type: 'category',
            label: '六、信息安全管理',
            items: [
                'management/index',
                'management/risk-assessment',
                'management/level-protection',
                'management/bcp-drp',
                'management/security-management',
            ],
        },
        {
            type: 'category',
            label: '七、信息安全工程',
            items: ['engineering/index', 'engineering/engineering-detail'],
        },
        {
            type: 'category',
            label: '八、下午大题专项 ⭐',
            items: [
                'exam-cases/index',
                'exam-cases/crypto-case',
                'exam-cases/network-case',
                'exam-cases/web-case',
                'exam-cases/management-case',
                'exam-cases/comprehensive-case',
            ],
        },
    ],
};

export default sidebars;
