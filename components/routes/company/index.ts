import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PageController::create
 * @see app/Http/Controllers/PageController.php:30
 * @route '/company/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/company/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::create
 * @see app/Http/Controllers/PageController.php:30
 * @route '/company/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::create
 * @see app/Http/Controllers/PageController.php:30
 * @route '/company/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PageController::create
 * @see app/Http/Controllers/PageController.php:30
 * @route '/company/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PageController::create
 * @see app/Http/Controllers/PageController.php:30
 * @route '/company/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PageController::create
 * @see app/Http/Controllers/PageController.php:30
 * @route '/company/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PageController::create
 * @see app/Http/Controllers/PageController.php:30
 * @route '/company/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\CompanyController::store
 * @see app/Http/Controllers/CompanyController.php:11
 * @route '/company'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/company',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompanyController::store
 * @see app/Http/Controllers/CompanyController.php:11
 * @route '/company'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyController::store
 * @see app/Http/Controllers/CompanyController.php:11
 * @route '/company'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompanyController::store
 * @see app/Http/Controllers/CompanyController.php:11
 * @route '/company'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompanyController::store
 * @see app/Http/Controllers/CompanyController.php:11
 * @route '/company'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const company = {
    create: Object.assign(create, create),
store: Object.assign(store, store),
}

export default company