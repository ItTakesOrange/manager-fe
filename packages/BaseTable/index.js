import BaseTable from './BaseTable.vue'

BaseTable.install = function(app) {
  app.component(BaseTable.name, BaseTable)
}

export default BaseTable
