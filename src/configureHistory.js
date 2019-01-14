// configureHistory.js
import { createBrowserHistory, createHashHistory } from 'history'

export default function configureHistory() {
    console.log("configure History");
    var history = window.matchMedia('(display-mode: standalone)').matches ? "Hash": "Browser";
    console.log(history);
  return window.matchMedia('(display-mode: standalone)').matches
    ? createHashHistory()
    : createBrowserHistory()
}