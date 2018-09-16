import { Router } from './router';

export function bootstrAPP() {
    (window as any).router = new Router();
}