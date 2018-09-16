import { Router } from './router';

declare var router: Router;

export function Element(metadata?: any) {
    return function(target: any) {

        const originalConnectedCallback = target.prototype.connectedCallback;
        target.prototype.connectedCallback = function () {
            if(!this.initialised) {
                const route = this.getAttribute('on-route');
                if(route) {
                    router.addRoute(route, this);
                }
                if(originalConnectedCallback) {
                    originalConnectedCallback();
                }
                this.innerHTML = metadata.template;
                this.initialised = true;
            }
        };

        window.customElements.define(metadata.tag, target);
        // return new constructor (will override original)
        return target;
    }
}