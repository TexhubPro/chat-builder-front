import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \TexHub\AlifBank\Http\Controllers\AlifBankController::callback
 * @see packages/texhub/alifbank/src/Http/Controllers/AlifBankController.php:13
 * @route '/alifbank/callback'
 */
export const callback = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: callback.url(options),
    method: 'post',
})

callback.definition = {
    methods: ["post"],
    url: '/alifbank/callback',
} satisfies RouteDefinition<["post"]>

/**
* @see \TexHub\AlifBank\Http\Controllers\AlifBankController::callback
 * @see packages/texhub/alifbank/src/Http/Controllers/AlifBankController.php:13
 * @route '/alifbank/callback'
 */
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \TexHub\AlifBank\Http\Controllers\AlifBankController::callback
 * @see packages/texhub/alifbank/src/Http/Controllers/AlifBankController.php:13
 * @route '/alifbank/callback'
 */
callback.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: callback.url(options),
    method: 'post',
})

    /**
* @see \TexHub\AlifBank\Http\Controllers\AlifBankController::callback
 * @see packages/texhub/alifbank/src/Http/Controllers/AlifBankController.php:13
 * @route '/alifbank/callback'
 */
    const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: callback.url(options),
        method: 'post',
    })

            /**
* @see \TexHub\AlifBank\Http\Controllers\AlifBankController::callback
 * @see packages/texhub/alifbank/src/Http/Controllers/AlifBankController.php:13
 * @route '/alifbank/callback'
 */
        callbackForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: callback.url(options),
            method: 'post',
        })
    
    callback.form = callbackForm
const alifbank = {
    callback: Object.assign(callback, callback),
}

export default alifbank