import SearchForm from './SearchForm/SearchForm.vue'
import TableList from './TableList/TableList.vue'

const component = [SearchForm, TableList]

// 批量组件注册
const install = function (Vue: any) {
  component.forEach((app) => {
    Vue.component(app.name, app);
  });
};

export default install;

