// configureHistory.js
import { createBrowserHistory, createHashHistory } from 'history'

export default function configureHistory() {
    var history = window.matchMedia('(display-mode: standalone)').matches ? "Hash": "Browser";
  return window.matchMedia('(display-mode: standalone)').matches
    ? createHashHistory()
    : createBrowserHistory()
}