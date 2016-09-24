import _ from 'lodash'

const types = _.reduce([

  'ADD_QUEUE',
  'REMOVE_QUEUE',
  'REMOVE_QUEUES',

  'PLAY_QUEUE',
  'PLAY_NEXT',
  'PLAY_PREV'

], function (obj, value) {
  return _.assign(obj, value)
}, {})

export default types
