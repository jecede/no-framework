import { Router } from './router';

declare var router: Router;

export function Element(metadata?: any) {
    return function(target: any) {

        const originalConnectedCallback = target.prototype.connectedCallback;
        // override the connectedCallback to apply initialization steps the first time the component is added:
        target.prototype.connectedCallback = function () {
            if(!this.initialised) {
                // if it has an on-route attribute, register it to the router.
                const route = this.getAttribute('on-route');
                if(route) {
                    router.addRoute(route, this);
                }
                if(originalConnectedCallback) {
                    originalConnectedCallback();
                }
                //add the template
                this.innerHTML = metadata.template;
                this.initialised = true;
            }
        };
        // register it as a custom element
        window.customElements.define(metadata.tag, target);
        // return new constructor (will override original)
        return target;
    }
}