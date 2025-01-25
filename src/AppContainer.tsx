import { Frame } from '@nativescript/core';
import { App } from './App';

export class AppContainer extends Frame {
  constructor() {
    super();
    this.defaultPage = App;
  }
}