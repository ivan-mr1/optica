'use strict';
import 'virtual:svg-icons-register';
import pageNavigation from './modules/pageNavigation';
import Header from './../components/header/Header';
import ScrollUpButton from '../components/scrollUpButton/ScrollUpButton';
import scroller from './../components/scroller/scroller';
import Popup from './../components/popup/popup';
import shop from '../shop/shop';

window.addEventListener('DOMContentLoaded', () => {
  pageNavigation();
  new Header();
  new ScrollUpButton();
  new Popup();
  scroller();
  shop();
});
