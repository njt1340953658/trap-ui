const search = [
  {
    type: 'select',
    placeholder: '域名',
    value: 'domain_id',
    props: { filterable: true },
    children: [{ label: '测试', value: 1 }]
  },
  {
    type: 'select-v2',
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

const columns = (props) => [
  {
    prop: 'name',
    label: '名字'
  },
  {
    prop: 'startTime',
    label: '开始时间'
  },
  {
    prop: 'endTime',
    label: '结束时间'
  },
  {
    prop: 'address',
    label: '地址'
  },
  {
    label: '操作',
    align: 'center',
    minWidth: 130,
    children: [
      {
        label: '下载',
        method: (row) => {
          props.handleDownload(row)
        }
      }
    ]
  }
]

const tableData = [
  {
    startTime: '2016-05-03',
    name: 'Tom',
    endTime: '2016-05-03',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    endTime: '2016-05-03',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    endTime: '2016-05-03',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    endTime: '2016-05-03',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

export { search, columns, tableData }
