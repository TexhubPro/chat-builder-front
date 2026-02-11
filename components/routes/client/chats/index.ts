import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
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
* @see \App\Http\Controllers\ClientChatController::assistant
 * @see app/Http/Controllers/ClientChatController.php:180
 * @route '/client-chats/{chat}/assistant'
 */
export const assistant = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: assistant.url(args, options),
    method: 'patch',
})

assistant.definition = {
    methods: ["patch"],
    url: '/client-chats/{chat}/assistant',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ClientChatController::assistant
 * @see app/Http/Controllers/ClientChatController.php:180
 * @route '/client-chats/{chat}/assistant'
 */
assistant.url = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return assistant.definition.url
            .replace('{chat}', parsedArgs.chat.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientChatController::assistant
 * @see app/Http/Controllers/ClientChatController.php:180
 * @route '/client-chats/{chat}/assistant'
 */
assistant.patch = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: assistant.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ClientChatController::assistant
 * @see app/Http/Controllers/ClientChatController.php:180
 * @route '/client-chats/{chat}/assistant'
 */
    const assistantForm = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: assistant.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClientChatController::assistant
 * @see app/Http/Controllers/ClientChatController.php:180
 * @route '/client-chats/{chat}/assistant'
 */
        assistantForm.patch = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: assistant.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    assistant.form = assistantForm
/**
* @see \App\Http\Controllers\ClientChatController::orders
 * @see app/Http/Controllers/ClientChatController.php:203
 * @route '/client-chats/{chat}/orders'
 */
export const orders = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: orders.url(args, options),
    method: 'post',
})

orders.definition = {
    methods: ["post"],
    url: '/client-chats/{chat}/orders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClientChatController::orders
 * @see app/Http/Controllers/ClientChatController.php:203
 * @route '/client-chats/{chat}/orders'
 */
orders.url = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return orders.definition.url
            .replace('{chat}', parsedArgs.chat.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientChatController::orders
 * @see app/Http/Controllers/ClientChatController.php:203
 * @route '/client-chats/{chat}/orders'
 */
orders.post = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: orders.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClientChatController::orders
 * @see app/Http/Controllers/ClientChatController.php:203
 * @route '/client-chats/{chat}/orders'
 */
    const ordersForm = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: orders.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClientChatController::orders
 * @see app/Http/Controllers/ClientChatController.php:203
 * @route '/client-chats/{chat}/orders'
 */
        ordersForm.post = (args: { chat: string | number | { id: string | number } } | [chat: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: orders.url(args, options),
            method: 'post',
        })
    
    orders.form = ordersForm
const chats = {
    send: Object.assign(send, send),
assistant: Object.assign(assistant, assistant),
orders: Object.assign(orders, orders),
}

export default chats