export class Route {
    /**
     * @param {string} name: the urlHash that references this given route
     * @param {HTMLElement} element: The element that has to be added to the DOM when activated
     * @param {Comment} placeholder: The comment Node that is added when the route is inactive, to keep track of dom position
     * @param {boolean} active: if the route is currently displayed/active or not
     */
    constructor(readonly name: string,
                readonly element: HTMLElement,
                readonly placeholder: Comment,
                public active: boolean) {
    }
}

export class Router {
    private readonly routes: { [key: string]: Route } = {};
    private currentRouteName: string;

    /**
     * Create this router and start listening to Hash changes.
     */
    constructor() {
        this.currentRouteName = this.getRouteNameFromHash(window.location.hash);
        window.onhashchange = this.onHashChange.bind(this);
    }

    /**
     * Called by the {@link ./element/Element} function when the component is initialised (added to the dom)
     */
    addRoute(routeName: string, element: HTMLElement) {
        const newRoute = new Route(routeName, element, document.createComment(routeName), this.currentRouteName === routeName);
        this.routes[routeName] = newRoute;

        if (this.currentRouteName !== routeName) {
            this.setRouteState(newRoute, false);
        }
    }

    /**
     * When the hash of the current url changes, extract the route name and display the corresponding component
     */
    private onHashChange(evt: HashChangeEvent) {
        const newRouteName = this.getRouteNameFromHash(evt.newURL);
        this.switchToRoute(this.routes[newRouteName]);
    }

    private switchToRoute(route: Route | undefined) {
        this.closeOtherRoutes(route ? route.name : '');

        if (route && route.name !== this.currentRouteName) {
            this.setRouteState(route, true);
            this.currentRouteName = route.name;
        } else {
            this.currentRouteName = ''
        }
    }

    /**
     * If any route except the one given in the parameter is still active: deactivate it
     * to prevent having multiple active at the same time.
     */
    private closeOtherRoutes(preservedRouteName: string) {
        Object.keys(this.routes).forEach((routeName) => {
            const route = this.routes[routeName];
            if (route.active && routeName !== preservedRouteName) {
                this.setRouteState(route, false);
            }
        });
    }

    /**
     * Switches the route's element with the placeholder (or vice versa).
     * Instead of removing/adding the element itself, we swap it with a comment Node.
     * This is done because it is otherwise very difficult to keep track of the correct position in the dom.
     * (Especially when its siblings disappear as well..)
     */
    private setRouteState(route: Route, setActive: boolean) {
        const newElement = setActive ? route.element : route.placeholder;
        const currentElement = setActive ? route.placeholder : route.element;
        (route.element.parentElement || route.placeholder.parentElement)!.replaceChild(newElement, currentElement);
        route.active = setActive;
    }

    private getRouteNameFromHash(hash: string | null) {
        hash = hash || '#/';
        return hash.substr(hash.indexOf('#') + 2);
    }
}
