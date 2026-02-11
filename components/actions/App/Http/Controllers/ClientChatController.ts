import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ClientChatController::index
 * @see app/Http/Controllers/ClientChatController.php:20
 * @route '/client-chats'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/client-chats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClientChatController::index
 * @see app/Http/Controllers/ClientChatController.php:20
 * @route '/client-chats'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientChatController::index
 * @see app/Http/Controllers/ClientChatController.php:20
 * @route '/client-chats'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClientChatController::index
 * @see app/Http/Controllers/ClientChatController.php:20
 * @route '/client-chats'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClientChatController::index
 * @see app/Http/Controllers/ClientChatController.php:20
 * @route '/client-chats'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClientChatController::index
 * @see app/Http/Controllers/ClientChatController.php:20
 * @route '/client-chats'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClientChatController::index
 * @see app/Http/Controllers/ClientChatController.php:20
 * @route '/client-chats'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\ClientChatController::send
 * @see app/Http/Controllers/ClientChatController.php:104
 * @route '/client-chats/{chat}/message'
 */
export const send = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/client-chats/{chat}/message',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClientChatController::send
 * @see app/Http/Controllers/ClientChatController.php:104
 * @route '/client-chats/{chat}/message'
 */
send.url = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { chat: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { chat: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    chat: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        chat: typeof args.chat === 'object'
                ? args.chat.id
                : args.chat,
                }

    return send.definition.url
            .replace('{chat}', parsedArgs.chat.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientChatController::send
 * @see app/Http/Controllers/ClientChatController.php:104
 * @route '/client-chats/{chat}/message'
 */
send.post = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClientChatController::send
 * @see app/Http/Controllers/ClientChatController.php:104
 * @route '/client-chats/{chat}/message'
 */
    const sendForm = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: send.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClientChatController::send
 * @see app/Http/Controllers/ClientChatController.php:104
 * @route '/client-chats/{chat}/message'
 */
        sendForm.post = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: send.url(args, options),
            method: 'post',
        })
    
    send.form = sendForm
/**
* @see \App\Http\Controllers\ClientChatController::toggleAssistant
 * @see app/Http/Controllers/ClientChatController.php:180
 * @route '/client-chats/{chat}/assistant'
 */
export const toggleAssistant = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAssistant.url(args, options),
    method: 'patch',
})

toggleAssistant.definition = {
    methods: ["patch"],
    url: '/client-chats/{chat}/assistant',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ClientChatController::toggleAssistant
 * @see app/Http/Controllers/ClientChatController.php:180
 * @route '/client-chats/{chat}/assistant'
 */
toggleAssistant.url = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { chat: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { chat: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    chat: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        chat: typeof args.chat === 'object'
                ? args.chat.id
                : args.chat,
                }

    return toggleAssistant.definition.url
            .replace('{chat}', parsedArgs.chat.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientChatController::toggleAssistant
 * @see app/Http/Controllers/ClientChatController.php:180
 * @route '/client-chats/{chat}/assistant'
 */
toggleAssistant.patch = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAssistant.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ClientChatController::toggleAssistant
 * @see app/Http/Controllers/ClientChatController.php:180
 * @route '/client-chats/{chat}/assistant'
 */
    const toggleAssistantForm = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleAssistant.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClientChatController::toggleAssistant
 * @see app/Http/Controllers/ClientChatController.php:180
 * @route '/client-chats/{chat}/assistant'
 */
        toggleAssistantForm.patch = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleAssistant.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleAssistant.form = toggleAssistantForm
/**
* @see \App\Http\Controllers\ClientChatController::storeOrder
 * @see app/Http/Controllers/ClientChatController.php:203
 * @route '/client-chats/{chat}/orders'
 */
export const storeOrder = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeOrder.url(args, options),
    method: 'post',
})

storeOrder.definition = {
    methods: ["post"],
    url: '/client-chats/{chat}/orders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClientChatController::storeOrder
 * @see app/Http/Controllers/ClientChatController.php:203
 * @route '/client-chats/{chat}/orders'
 */
storeOrder.url = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { chat: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { chat: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    chat: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        chat: typeof args.chat === 'object'
                ? args.chat.id
                : args.chat,
                }

    return storeOrder.definition.url
            .replace('{chat}', parsedArgs.chat.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientChatController::storeOrder
 * @see app/Http/Controllers/ClientChatController.php:203
 * @route '/client-chats/{chat}/orders'
 */
storeOrder.post = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeOrder.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClientChatController::storeOrder
 * @see app/Http/Controllers/ClientChatController.php:203
 * @route '/client-chats/{chat}/orders'
 */
    const storeOrderForm = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeOrder.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClientChatController::storeOrder
 * @see app/Http/Controllers/ClientChatController.php:203
 * @route '/client-chats/{chat}/orders'
 */
        storeOrderForm.post = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeOrder.url(args, options),
            method: 'post',
        })
    
    storeOrder.form = storeOrderForm
const ClientChatController = { index, send, toggleAssistant, storeOrder }

export default ClientChatController