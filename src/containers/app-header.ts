import { Element } from '../framework/element';

@Element({
    tag: 'app-header',
    template: `<div>
                 <ul>
                   <li>
                     <a href="#/component-1">Component 1</a>
                   </li>
                   <li>
                     <a href="#/component-2">Component 2</a>
                   </li>
                 </ul>
               </div>`
})
export class AppHeader extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        // console.log('hi world');
    }
}