import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
* @see \App\Http\Controllers\PageController::home
 * @see app/Http/Controllers/PageController.php:15
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::home
 * @see app/Http/Controllers/PageController.php:15
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::home
 * @see app/Http/Controllers/PageController.php:15
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PageController::home
 * @see app/Http/Controllers/PageController.php:15
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PageController::home
 * @see app/Http/Controllers/PageController.php:15
 * @route '/'
 */
    const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: home.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PageController::home
 * @see app/Http/Controllers/PageController.php:15
 * @route '/'
 */
        homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PageController::home
 * @see app/Http/Controllers/PageController.php:15
 * @route '/'
 */
        homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    home.form = homeForm
/**
* @see \App\Http\Controllers\PageController::login
 * @see app/Http/Controllers/PageController.php:20
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::login
 * @see app/Http/Controllers/PageController.php:20
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::login
 * @see app/Http/Controllers/PageController.php:20
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PageController::login
 * @see app/Http/Controllers/PageController.php:20
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PageController::login
 * @see app/Http/Controllers/PageController.php:20
 * @route '/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PageController::login
 * @see app/Http/Controllers/PageController.php:20
 * @route '/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PageController::login
 * @see app/Http/Controllers/PageController.php:20
 * @route '/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\PageController::register
 * @see app/Http/Controllers/PageController.php:25
 * @route '/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::register
 * @see app/Http/Controllers/PageController.php:25
 * @route '/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::register
 * @see app/Http/Controllers/PageController.php:25
 * @route '/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PageController::register
 * @see app/Http/Controllers/PageController.php:25
 * @route '/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PageController::register
 * @see app/Http/Controllers/PageController.php:25
 * @route '/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PageController::register
 * @see app/Http/Controllers/PageController.php:25
 * @route '/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PageController::register
 * @see app/Http/Controllers/PageController.php:25
 * @route '/register'
 */
        registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    register.form = registerForm
/**
* @see \App\Http\Controllers\PageController::pending
 * @see app/Http/Controllers/PageController.php:35
 * @route '/pending'
 */
export const pending = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pending.url(options),
    method: 'get',
})

pending.definition = {
    methods: ["get","head"],
    url: '/pending',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::pending
 * @see app/Http/Controllers/PageController.php:35
 * @route '/pending'
 */
pending.url = (options?: RouteQueryOptions) => {
    return pending.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::pending
 * @see app/Http/Controllers/PageController.php:35
 * @route '/pending'
 */
pending.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pending.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PageController::pending
 * @see app/Http/Controllers/PageController.php:35
 * @route '/pending'
 */
pending.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pending.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PageController::pending
 * @see app/Http/Controllers/PageController.php:35
 * @route '/pending'
 */
    const pendingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pending.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PageController::pending
 * @see app/Http/Controllers/PageController.php:35
 * @route '/pending'
 */
        pendingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pending.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PageController::pending
 * @see app/Http/Controllers/PageController.php:35
 * @route '/pending'
 */
        pendingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pending.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pending.form = pendingForm
/**
* @see \App\Http\Controllers\PageController::dashboard
 * @see app/Http/Controllers/PageController.php:60
 * @route '/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::dashboard
 * @see app/Http/Controllers/PageController.php:60
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::dashboard
 * @see app/Http/Controllers/PageController.php:60
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PageController::dashboard
 * @see app/Http/Controllers/PageController.php:60
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PageController::dashboard
 * @see app/Http/Controllers/PageController.php:60
 * @route '/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PageController::dashboard
 * @see app/Http/Controllers/PageController.php:60
 * @route '/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PageController::dashboard
 * @see app/Http/Controllers/PageController.php:60
 * @route '/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\PageController::calendar
 * @see app/Http/Controllers/PageController.php:207
 * @route '/calendar'
 */
export const calendar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar.url(options),
    method: 'get',
})

calendar.definition = {
    methods: ["get","head"],
    url: '/calendar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::calendar
 * @see app/Http/Controllers/PageController.php:207
 * @route '/calendar'
 */
calendar.url = (options?: RouteQueryOptions) => {
    return calendar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::calendar
 * @see app/Http/Controllers/PageController.php:207
 * @route '/calendar'
 */
calendar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PageController::calendar
 * @see app/Http/Controllers/PageController.php:207
 * @route '/calendar'
 */
calendar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: calendar.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PageController::calendar
 * @see app/Http/Controllers/PageController.php:207
 * @route '/calendar'
 */
    const calendarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: calendar.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PageController::calendar
 * @see app/Http/Controllers/PageController.php:207
 * @route '/calendar'
 */
        calendarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: calendar.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PageController::calendar
 * @see app/Http/Controllers/PageController.php:207
 * @route '/calendar'
 */
        calendarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: calendar.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    calendar.form = calendarForm
/**
* @see \App\Http\Controllers\PageController::catalog
 * @see app/Http/Controllers/PageController.php:98
 * @route '/catalog'
 */
export const catalog = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: catalog.url(options),
    method: 'get',
})

catalog.definition = {
    methods: ["get","head"],
    url: '/catalog',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::catalog
 * @see app/Http/Controllers/PageController.php:98
 * @route '/catalog'
 */
catalog.url = (options?: RouteQueryOptions) => {
    return catalog.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::catalog
 * @see app/Http/Controllers/PageController.php:98
 * @route '/catalog'
 */
catalog.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: catalog.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PageController::catalog
 * @see app/Http/Controllers/PageController.php:98
 * @route '/catalog'
 */
catalog.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: catalog.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PageController::catalog
 * @see app/Http/Controllers/PageController.php:98
 * @route '/catalog'
 */
    const catalogForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: catalog.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PageController::catalog
 * @see app/Http/Controllers/PageController.php:98
 * @route '/catalog'
 */
        catalogForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: catalog.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PageController::catalog
 * @see app/Http/Controllers/PageController.php:98
 * @route '/catalog'
 */
        catalogForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: catalog.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    catalog.form = catalogForm
/**
* @see \App\Http\Controllers\PageController::integrations
 * @see app/Http/Controllers/PageController.php:103
 * @route '/integrations'
 */
export const integrations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: integrations.url(options),
    method: 'get',
})

integrations.definition = {
    methods: ["get","head"],
    url: '/integrations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::integrations
 * @see app/Http/Controllers/PageController.php:103
 * @route '/integrations'
 */
integrations.url = (options?: RouteQueryOptions) => {
    return integrations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::integrations
 * @see app/Http/Controllers/PageController.php:103
 * @route '/integrations'
 */
integrations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: integrations.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PageController::integrations
 * @see app/Http/Controllers/PageController.php:103
 * @route '/integrations'
 */
integrations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: integrations.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PageController::integrations
 * @see app/Http/Controllers/PageController.php:103
 * @route '/integrations'
 */
    const integrationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: integrations.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PageController::integrations
 * @see app/Http/Controllers/PageController.php:103
 * @route '/integrations'
 */
        integrationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: integrations.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PageController::integrations
 * @see app/Http/Controllers/PageController.php:103
 * @route '/integrations'
 */
        integrationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: integrations.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    integrations.form = integrationsForm
/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:71
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:71
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:71
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:71
 * @route '/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:71
 * @route '/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm