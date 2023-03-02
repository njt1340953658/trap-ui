>components => Vue3+element-plus+vite 组件的二次封装，封装了tabel表格，form表单搜索，echarts公共按需ts文件，通过json可配置项，方便复用；

**注意**：本包是vue项目；全局引入: 本包需依赖element-plus组件库。包构建并没有将element-plus组等生产依赖进行打包，避免造成重复依赖

##### 安装使用
```js
// 添加项目依赖： npm install table-form-list -S
// main.js中引入
1. import router from "./router";
2. import ElementPlus from 'element-plus'
3. import * as ElementPlusIconsVue from '@element-plus/icons-vue'
4. import mingfuUi from "mingfu-ui"
5. Vue.use(mingfuUi);
```

> 灵活使用，复制项目文件中的lib/TableFormList.vue文件在自己项目中，方便更改扩展

![table-form-list](./table.jpeg)

##### 使用案例
- 指定表格的数据源 `dataSource` 为一个数组，配置相关属性json；

```ts
<template>
  <div>
    <span>本地测试引入表格组件库开发</span>
    <br />
    <SearchForm
      :rules="rules"
      :search="search"
      :isShowSearch="true"
      :is-show-reset="false"
      style="margin-top: 16px"
      @handleSearch="handleSearch"
    >
     <template #pre_form_content>
        <el-button style="margin-right: 10px" type="primary">添加</el-button>
      </template>
    </SearchForm>
     <TableList
      ref="multipleTableRefs" 
      :httpRequest="httpRequest" 
      :is-footer-extend="false" 
      :columns="columns()" 
    />
    // 新增echarts按需引入公共处理部分 BarChart, LineChart, PieChart, GaugeChart
    <v-charts :options="setOptions" />
  </div>
</template>

<script>
// 搜索设置
const search = [
  {
    label: "姓名ID/手机号",
    inputType: "number",
    maxlength: 11,
    value: "name",
    rulesLength: true,
    labelProps: {
      "label-width": "130"
    }
  },
  {
    type: "select",
    label: "是否添加微信",
    value: "joinWeChatStatus",
    children: [
      {
        label: "未添加",
        value: "1"
      },
      {
        label: "已添加",
        value: "0"
      }
    ]
  },
  {
    type: "picker",
    label: "操作时间",
    value: "operate",
    props: {
      size: "mini",
      type: "datetimerange",
      "range-separator": "至",
      "start-placeholder": "开始日期",
      "end-placeholder": "结束日期",
      "value-format": "timestamp"
    }
  },
   {
    type: "cascader",
    label: "城市",
    value: "city",
    props: {
      size: "mini",
      expandTrigger: 'hover'
    },
    options: []
  }
];

// 表格头设置
const columns = ({ handleNewJump }) => [
  {
    label: "姓名",
    prop: "name",
    props: {
      sortable: "sortable"
    }
  },
  {
    label: "性别",
    prop: "sex",
    formatter: (row, column, index) => {
      return row.sex === 0 ? "男" : "女";
    }
  },
  {
    label: "住址",
    prop: "address",
    newjump: (row, columns, index) => {
      return `www.baidu.com/studentInfo/index/${row.accountId}`;
    }
  },
  {
    label: "手机号",
    render: (h, parmas) => {
      return [
        h("i", {
          class: "el-icon-phone-outline",
          style: "fontSize: 16px; color: red"
        }),
        h("span", parmas.row.mobileNum)
      ];
    }
  }, 
  {
    label: '操作',
    children: [
      {
        label: "编辑",
        isShow: row => {
          return row.status !== 2;
        },
        disabled: row => {
          return row.disabled === 2;
        },
        method: row => {
          handleNewJump(row);
        }
      }
    ]
  }
];

// 服务器请求返回值
const dataSource = [
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    sex: 0,
    address: "西湖区湖底公园1号"
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    sex: 1,
    disabled: 2,
    address: "西湖区湖底公园1号"
  }
];

<script lang="ts" setup>
import common from '@/api/common'
import { search, columns } from './list'
import { ref, reactive, onBeforeMount } from 'vue'
import type { FormRules } from 'element-plus'

const multipleTableRefs = ref(null)

const httpRequest = reactive({
  httpApi: '',
  params: {},
  response: {
    classA: 'list',
    customPage: 'page'
  }
})

const rules = reactive<FormRules>({
  name: { required: true, message: '名称信息不能为空', trigger: 'blur' },
  startTime: { required: true, message: '日期信息不能为空', trigger: 'blur' }
})

// 检索条件
const handleSearch = (searchVal) => {
  httpRequest.params = searchVal
  // baseUrl 当前域名或者全局自定义请求地址
  httpRequest.httpApi = baseUrl + '/api/getlist'
}
</script>
```
##### API使用

##### TableList

| 参数 | 说明 | 类型 | 默认值 | 必填项
| --- | --- | --- | --- | --- |
| type | 是否显示该行索引/复选框 | 'index' 'selection' String | - | 否
| border | 是否展示外边框和列边框 | Boolean | false | 否
| size | Table 的尺寸 | string | - | 否
| options | table参数扩展属性 [Table Attributes] | Object | - | 否
| columns | 表格列的配置描述，表头部分 | Array\[] | - | 是
| dataSource | 数据数组 | Array\[] | - | 是
| pagination | 分页的配置项 | Object | - | 否
| dataTotal | 数据总数 | Number | 0 | 否
| httpRequest | 内部请求及自定义响应label | object | {} | 否


##### Columns

列描述数据对象，是 columns 中的一项，与Element-Ui Columns 使用相同的 API在props中填写。使用用法：

| 参数 | 说明 | 类型 | 默认值 | 必填项
| --- | --- | --- | --- | --- |
| label | 列头显示文字 | String | - | 是
| prop | 列数据在数据项中对应的 key | String | - | 否
| align | 设置列的对齐方式 | 'left' 'right' 'center' | 'left' | 否
| width | 列宽度 | string number | - | 否
| props | 列表参数扩展属性[Table-column Attributes] | Object | - | 否
| render | 生成复杂数据的渲染函数，参数分别为createElement，当前行数据 | Function(h, record) {} | - | 否
| formatter | 数据格式化 | Function(row, columns, index) {} | - | 否 
| newjump | url页面跳转 | Function(row, columns, index) {} | - | 否
```jsx
const columns = [
{
  label: '姓名',
  prop: 'name',
  props: {
    sortable: 'sortable',
  }
}]
```

##### search type []
列表搜索条件对象描述，同FormItem API相同，同理在props中填写。使用用法：

| 参数 | 说明 | 类型 | 默认值 | 必填项
| --- | --- | --- | --- | --- |
| label | 表单label名称 | String | - | 是
| value | 表单名称对应的key | String | - | 是
| type | 表单类型(可选：select/picker/cascader) | String | input | 否
| inputType | input type: number | String | 'number' | 否
| maxlength | 最大输入的长度 | 'string' 'number' | - | 否
| rulesLength | 输入文本校验长度控制 | Boolean | - | 否
| children | 展示有子选项值type:select | Array\[] | - | 否
| props | 任意表单的属性扩展 | Object | - | 否
| rules | 是否添加搜索条件的校验 | Object | - | 否
| handleSearch | 数据验证成功后回调事件 | Function(e:Event) | - | 否
| handleReset | 重置所有组件 | Function() | - | 否
```jsx
const tableSearch = [{
  type: "picker",
  label: "操作时间",
  value: "operate",
  props: {
    size: "mini",
    type: "datetimerange",
    "range-separator": "至",
    "start-placeholder": "开始日期",
    "end-placeholder": "结束日期",
    "value-format": "timestamp"
    }
  },
  {
    type: "cascader",
    label: "城市",
    value: "city",
    props: {
      size: "mini",
      expandTrigger: 'hover'
    },
    options: []
  }
```

##### 操作列表 columns.children type []
列表操作列对象描述，使用用法：

| 参数 | 说明 | 类型 | 默认值 | 必填项
| --- | --- | --- | --- | --- |
| label | 列文本显示 | String | - | 否
| type | [button按钮类型](https://element.eleme.cn/2.8/#/zh-CN/component/button) | String | text | 否
| icon | [按钮icon图标](https://element.eleme.cn/2.8/#/zh-CN/component/icon) | String | - | 否
| plain | 是否朴素按钮 | Boolean | false | 否
| isShow | 依据状态是否显示，第一个参数当前行数据，第二个参数当前行索引 | Function(row, index) {} | - | 否
| disabled | 是否禁用状态 | Function(row, index) {} | - | 否
| method | event 事件 | Function(row, index) {} | - | 否

##### TableList Events
| 事件名 | 说明 | 类型 | 默认值 | 必填项
| --- | --- | --- | --- | --- |
| current-change | 页码改变的回调，参数是改变后的页码及每页条数 | Function(currentPage) | - | 否
| size-change | 每页条数改变的回调，参数是改变后的页码及每页条数 | Function(size) | - | 否
| handleSelectionChange | 当选择项发生变化时会触发该事件 | Function(selection) | - | 否
| toggleRowSelection | 设置当前选中项回显、清空复选框事件 | Function(dom节点) | - | 否

