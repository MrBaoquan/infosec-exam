import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '一、信息安全基础',
      items: ['fundamentals/index'],
    },
    {
      type: 'category',
      label: '二、密码学基础与应用 ⭐',
      items: [
        'crypto/index',
        'crypto/classical',
        'crypto/symmetric',
        'crypto/des',
        'crypto/asymmetric',
        'crypto/hash',
        'crypto/signature',
        'crypto/pki',
        'crypto/national-crypto',
      ],
    },
    {
      type: 'category',
      label: '三、网络安全',
      items: ['network/index'],
    },
    {
      type: 'category',
      label: '四、系统安全',
      items: ['system/index'],
    },
    {
      type: 'category',
      label: '五、应用安全',
      items: ['application/index'],
    },
    {
      type: 'category',
      label: '六、信息安全管理',
      items: ['management/index'],
    },
    {
      type: 'category',
      label: '七、信息安全工程',
      items: ['engineering/index'],
    },
  ],
};

export default sidebars;
