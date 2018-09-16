import { Element } from '../framework/element';

@Element({
    tag: 'app-component2',
    template: `This is component2`
})
export class AppComponent2 extends HTMLElement {
    constructor() {
        super();
    }
}