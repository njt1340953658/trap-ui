export const dictionary = {
  启用: 1,
  停用: 2,
  禁用: 2,
  北: 'bei',
  江: 'jiang',
  山: 'shan',
  西: 'xi',
  河: 'he',
  湖: 'hu',
  广: 'guang',
  南: 'nan',
  东: 'dong',
  海: 'hai',
  宁: 'ning',
  移: 'chinamobile',
  电: 'chinatelecom',
  联: 'chinaunicom',
  默: 'default',
  电信: 'chinatelecom',
  联通: 'chinaunicom',
  移动: 'chinamobile',
  默认: 'default',
  山东: 'shandong',
  江苏: 'jiangsu',
  上海: 'shanghai',
  浙江: 'zhejiang',
  安徽: 'anhui',
  江西: 'jiangxi',
  福建: 'fujian',
  台湾: 'taiwan',
  河北: 'hebei',
  北京: 'beijing',
  天津: 'tianjin',
  山西: 'shanxi',
  内蒙古: 'inner mongolia',
  河南: 'henan',
  湖北: 'hubei',
  湖南: 'hunan',
  广东: 'guangdong',
  广西: 'guangxi',
  海南: 'hainan',
  香港: 'hong kong',
  澳门: 'macau',
  四川: 'sichuan',
  云南: 'yunnan',
  贵州: 'guizhou',
  重庆: 'chongqing',
  西藏: 'xizang',
  新疆: 'xinjiang',
  宁夏: 'ningxia',
  青海: 'qinghai',
  陕西: 'shaanxi',
  甘肃: 'gansu',
  黑龙江: 'heilongjiang',
  吉林: 'jilin',
  辽宁: 'liaoning'
}

export default [
  {
    label: '默认',
    value: 'default'
  },
  {
    label: '华东',
    value: '华东',
    children: [
      {
        label: '华东大区',
        value: 'big_huadong'
      },
      {
        label: '山东',
        value: 'shandong'
      },
      {
        label: '江苏',
        value: 'jiangsu'
      },
      {
        label: '安徽',
        value: 'anhui'
      },
      {
        label: '上海',
        value: 'shanghai'
      },
      {
        label: '浙江',
        value: 'zhejiang'
      },
      {
        label: '江西',
        value: 'jiangxi'
      },
      {
        label: '福建',
        value: 'fujian'
      }
    ]
  },
  {
    label: '华北',
    value: '华北',
    children: [
      {
        label: '华北大区',
        value: 'big_huabei'
      },
      {
        label: '北京',
        value: 'beijing'
      },
      {
        label: '天津',
        value: 'tianjin'
      },
      {
        label: '河北',
        value: 'hebei'
      },
      {
        label: '山西',
        value: 'shanxi'
      },
      {
        label: '内蒙古',
        value: 'inner mongolia'
      }
    ]
  },
  {
    label: '华南',
    value: '华南',
    children: [
      {
        label: '华南大区',
        value: 'big_huanan'
      },
      {
        label: '广东',
        value: 'guangdong'
      },
      {
        label: '广西',
        value: 'guangxi'
      },
      {
        label: '海南',
        value: 'hainan'
      }
    ]
  },
  {
    label: '西南',
    value: '西南',
    children: [
      {
        label: '西南大区',
        value: 'big_xinan'
      },
      {
        label: '云南',
        value: 'yunnan'
      },
      {
        label: '贵州',
        value: 'guizhou'
      },
      {
        label: '重庆',
        value: 'chongqing'
      },
      {
        label: '四川',
        value: 'sichuan'
      },
      {
        label: '西藏',
        value: 'xizang'
      }
    ]
  },
  {
    label: '西北',
    value: '西北',
    children: [
      {
        label: '西北大区',
        value: 'big_xibei'
      },
      {
        label: '陕西',
        value: 'shaanxi'
      },
      {
        label: '甘肃',
        value: 'gansu'
      },
      {
        label: '宁夏',
        value: 'ningxia'
      },
      {
        label: '青海',
        value: 'qinghai'
      },
      {
        label: '新疆',
        value: 'xinjiang'
      }
    ]
  },
  {
    label: '东北',
    value: '东北',
    children: [
      {
        label: '东北大区',
        value: 'big_dongbei'
      },
      {
        label: '辽宁',
        value: 'liaoning'
      },
      {
        label: '吉林',
        value: 'jilin'
      },
      {
        label: '黑龙江',
        value: 'heilongjiang'
      }
    ]
  }
]
