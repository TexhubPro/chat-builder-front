import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::verify
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:17
 * @route '/instagram-verify'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verify.url(options),
    method: 'get',
})

verify.definition = {
    methods: ["get","head"],
    url: '/instagram-verify',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::verify
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:17
 * @route '/instagram-verify'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::verify
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:17
 * @route '/instagram-verify'
 */
verify.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verify.url(options),
    method: 'get',
})
/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::verify
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:17
 * @route '/instagram-verify'
 */
verify.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verify.url(options),
    method: 'head',
})

    /**
* @see \TexHub\Meta\Http\Controllers\InstagramController::verify
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:17
 * @route '/instagram-verify'
 */
    const verifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: verify.url(options),
        method: 'get',
    })

            /**
* @see \TexHub\Meta\Http\Controllers\InstagramController::verify
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:17
 * @route '/instagram-verify'
 */
        verifyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verify.url(options),
            method: 'get',
        })
            /**
* @see \TexHub\Meta\Http\Controllers\InstagramController::verify
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:17
 * @route '/instagram-verify'
 */
        verifyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verify.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    verify.form = verifyForm
/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::webhook
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:24
 * @route '/instagram-main-webhook'
 */
export const webhook = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: webhook.url(options),
    method: 'get',
})

webhook.definition = {
    methods: ["get","post","head"],
    url: '/instagram-main-webhook',
} satisfies RouteDefinition<["get","post","head"]>

/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::webhook
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:24
 * @route '/instagram-main-webhook'
 */
webhook.url = (options?: RouteQueryOptions) => {
    return webhook.definition.url + queryParams(options)
}

/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::webhook
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:24
 * @route '/instagram-main-webhook'
 */
webhook.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: webhook.url(options),
    method: 'get',
})
/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::webhook
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:24
 * @route '/instagram-main-webhook'
 */
webhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
})
/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::webhook
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:24
 * @route '/instagram-main-webhook'
 */
webhook.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: webhook.url(options),
    method: 'head',
})

    /**
* @see \TexHub\Meta\Http\Controllers\InstagramController::webhook
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:24
 * @route '/instagram-main-webhook'
 */
    const webhookForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: webhook.url(options),
        method: 'get',
    })

            /**
* @see \TexHub\Meta\Http\Controllers\InstagramController::webhook
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:24
 * @route '/instagram-main-webhook'
 */
        webhookForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: webhook.url(options),
            method: 'get',
        })
            /**
* @see \TexHub\Meta\Http\Controllers\InstagramController::webhook
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:24
 * @route '/instagram-main-webhook'
 */
        webhookForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: webhook.url(options),
            method: 'post',
        })
            /**
* @see \TexHub\Meta\Http\Controllers\InstagramController::webhook
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:24
 * @route '/instagram-main-webhook'
 */
        webhookForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: webhook.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    webhook.form = webhookForm
/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::callback
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:51
 * @route '/callback'
 */
export const callback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

callback.definition = {
    methods: ["get","head"],
    url: '/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::callback
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:51
 * @route '/callback'
 */
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::callback
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:51
 * @route '/callback'
 */
callback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})
/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::callback
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:51
 * @route '/callback'
 */
callback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callback.url(options),
    method: 'head',
})

    /**
* @see \TexHub\Meta\Http\Controllers\InstagramController::callback
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:51
 * @route '/callback'
 */
    const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: callback.url(options),
        method: 'get',
    })

            /**
* @see \TexHub\Meta\Http\Controllers\InstagramController::callback
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:51
 * @route '/callback'
 */
        callbackForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callback.url(options),
            method: 'get',
        })
            /**
* @see \TexHub\Meta\Http\Controllers\InstagramController::callback
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:51
 * @route '/callback'
 */
        callbackForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callback.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    callback.form = callbackForm
const instagram = {
    verify: Object.assign(verify, verify),
webhook: Object.assign(webhook, webhook),
callback: Object.assign(callback, callback),
}

export default instagram