const Vue = require('vue');

import filer from './components/filer';

new Vue({
  el: 'body',
  components: {
    filer: filer
  }
});
