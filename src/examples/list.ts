const search = [
  {
    type: 'select',
    placeholder: '域名',
    value: 'domain_id',
    props: { filterable: true },
    children: [{ label: '测试', value: 1 }]
  },
  {
    type: 'picker',
    placeholder: '日期',
    value: 'start_time',
    props: {
      'value-format': 'x',
      'disabled-date': (time) => {
        return time.getTime() > Date.now()
      }
    }
  }
]

const columns = () => [
  {
    prop: 'filename',
    label: '文件名'
  },
  {
    prop: 'startTime',
    label: '开始时间'
  },
  {
    prop: 'endTime',
    label: '结束时间'
  }
  // {
  //   label: '操作',
  //   align: 'center',
  //   minWidth: 130,
  //   children: [
  //     {
  //       label: '下载',
  //       method: (row) => {
  //         handleDownload(row)
  //       }
  //     }
  //   ]
  // }
]

export { search, columns }
