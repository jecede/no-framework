import { Element } from '../framework/element';

@Element({
    tag: 'app-component1',
    template: `This is Component 1`
})
export class AppComponent1 extends HTMLElement {
    constructor() {
        super();
    }
}