import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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
const CompanyController = { store }

export default CompanyController