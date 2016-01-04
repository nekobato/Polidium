import Vue from 'vue';
import trayMenuView from './components/tray-menu.js';
import './controller.styl';

document.addEventListener('DOMContentLoaded', function() {
  new Vue(trayMenuView);
}, false );
