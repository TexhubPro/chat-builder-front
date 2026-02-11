import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::verifyPage
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:17
 * @route '/instagram-verify'
 */
export const verifyPage = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyPage.url(options),
    method: 'get',
})

verifyPage.definition = {
    methods: ["get","head"],
    url: '/instagram-verify',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::verifyPage
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:17
 * @route '/instagram-verify'
 */
verifyPage.url = (options?: RouteQueryOptions) => {
    return verifyPage.definition.url + queryParams(options)
}

/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::verifyPage
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:17
 * @route '/instagram-verify'
 */
verifyPage.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyPage.url(options),
    method: 'get',
})
/**
* @see \TexHub\Meta\Http\Controllers\InstagramController::verifyPage
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:17
 * @route '/instagram-verify'
 */
verifyPage.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verifyPage.url(options),
    method: 'head',
})

    /**
* @see \TexHub\Meta\Http\Controllers\InstagramController::verifyPage
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:17
 * @route '/instagram-verify'
 */
    const verifyPageForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: verifyPage.url(options),
        method: 'get',
    })

            /**
* @see \TexHub\Meta\Http\Controllers\InstagramController::verifyPage
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:17
 * @route '/instagram-verify'
 */
        verifyPageForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verifyPage.url(options),
            method: 'get',
        })
            /**
* @see \TexHub\Meta\Http\Controllers\InstagramController::verifyPage
 * @see packages/texhub/meta/src/Http/Controllers/InstagramController.php:17
 * @route '/instagram-verify'
 */
        verifyPageForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verifyPage.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    verifyPage.form = verifyPageForm
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
const InstagramController = { verifyPage, webhook, callback }

export default InstagramController