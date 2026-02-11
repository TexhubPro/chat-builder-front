import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ClientBoardController::update
 * @see app/Http/Controllers/ClientBoardController.php:15
 * @route '/client-requests/{order}'
 */
export const update = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/client-requests/{order}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ClientBoardController::update
 * @see app/Http/Controllers/ClientBoardController.php:15
 * @route '/client-requests/{order}'
 */
update.url = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return update.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientBoardController::update
 * @see app/Http/Controllers/ClientBoardController.php:15
 * @route '/client-requests/{order}'
 */
update.patch = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ClientBoardController::update
 * @see app/Http/Controllers/ClientBoardController.php:15
 * @route '/client-requests/{order}'
 */
    const updateForm = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClientBoardController::update
 * @see app/Http/Controllers/ClientBoardController.php:15
 * @route '/client-requests/{order}'
 */
        updateForm.patch = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\ClientBoardController::deleteMethod
 * @see app/Http/Controllers/ClientBoardController.php:55
 * @route '/client-requests/{order}'
 */
export const deleteMethod = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/client-requests/{order}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ClientBoardController::deleteMethod
 * @see app/Http/Controllers/ClientBoardController.php:55
 * @route '/client-requests/{order}'
 */
deleteMethod.url = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return deleteMethod.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientBoardController::deleteMethod
 * @see app/Http/Controllers/ClientBoardController.php:55
 * @route '/client-requests/{order}'
 */
deleteMethod.delete = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ClientBoardController::deleteMethod
 * @see app/Http/Controllers/ClientBoardController.php:55
 * @route '/client-requests/{order}'
 */
    const deleteMethodForm = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMethod.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClientBoardController::deleteMethod
 * @see app/Http/Controllers/ClientBoardController.php:55
 * @route '/client-requests/{order}'
 */
        deleteMethodForm.delete = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
const requests = {
    update: Object.assign(update, update),
delete: Object.assign(deleteMethod, deleteMethod),
}

export default requests