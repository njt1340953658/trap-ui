import SearchForm from './SearchForm/SearchForm.vue'
import TableList from './TableList/TableList.vue'
import vCharts from './v-charts/v-charts.vue'

export * from './v-charts/useCharts';

const components = [SearchForm, TableList, vCharts]

const install = function (Vue: any) {
  components.forEach((app) => {
    Vue.component(app.name, app);
  });
};

export default install;

