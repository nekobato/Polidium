const Vue = require('vue')
const Player = require('renderrer/Player/Player.vue')

describe('Player.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(Player)
    }).$mount()

    expect(vm.$el.classList).toContain('player')
  })
})
