export class Route {
    constructor(readonly name: string,
                readonly element: HTMLElement,
                readonly placeholder: Comment,
                public open: boolean) {
    }
}

export class Router {
    private readonly routes: { [key: string]: Route } = {};
    private currentRouteName: string;

    constructor() {
        this.currentRouteName = this.getRouteNameFromHash(window.location.hash);
        window.onhashchange = this.onHashChange.bind(this);
    }

    onHashChange(evt: HashChangeEvent) {
        const newRouteName = this.getRouteNameFromHash(evt.newURL);
        this.switchToRoute(this.routes[newRouteName]);
    }

    addRoute(routeName: string, element: HTMLElement) {
        const newRoute = new Route(routeName, element, document.createComment(routeName), this.currentRouteName === routeName);
        this.routes[routeName] = newRoute;

        if (this.currentRouteName !== routeName) {
            this.setRouteState(newRoute, false);
        }
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

    private closeOtherRoutes(preservedRouteName: string) {
        Object.keys(this.routes).forEach((routeName) => {
            const route = this.routes[routeName];
            if (route.open && routeName !== preservedRouteName) {
                this.setRouteState(route, false);
            }
        });
    }

    private setRouteState(route: Route, setOpen: boolean) {
        const newElement = setOpen ? route.element : route.placeholder;
        const currentElement = setOpen ? route.placeholder : route.element;
        (route.element.parentElement || route.placeholder.parentElement)!.replaceChild(newElement, currentElement);
        route.open = setOpen;
    }

    private getRouteNameFromHash(hash: string | null) {
        hash = hash || '#/';
        return hash.substr(hash.indexOf('#') + 2);
    }
}
