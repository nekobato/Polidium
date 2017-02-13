const Vue = require('vue')
const Controller = require('renderer/Controller/Controller.vue')

describe('Controller.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(Controller)
    }).$mount()

    expect(vm.$el.classList).toContain('controller')
  })
})
