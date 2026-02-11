import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ClientBoardController::update
 * @see app/Http/Controllers/ClientBoardController.php:67
 * @route '/client-questions/{question}'
 */
export const update = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/client-questions/{question}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ClientBoardController::update
 * @see app/Http/Controllers/ClientBoardController.php:67
 * @route '/client-questions/{question}'
 */
update.url = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { question: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { question: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    question: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        question: typeof args.question === 'object'
                ? args.question.id
                : args.question,
                }

    return update.definition.url
            .replace('{question}', parsedArgs.question.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientBoardController::update
 * @see app/Http/Controllers/ClientBoardController.php:67
 * @route '/client-questions/{question}'
 */
update.patch = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ClientBoardController::update
 * @see app/Http/Controllers/ClientBoardController.php:67
 * @route '/client-questions/{question}'
 */
    const updateForm = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/ClientBoardController.php:67
 * @route '/client-questions/{question}'
 */
        updateForm.patch = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/ClientBoardController.php:115
 * @route '/client-questions/{question}'
 */
export const deleteMethod = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/client-questions/{question}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ClientBoardController::deleteMethod
 * @see app/Http/Controllers/ClientBoardController.php:115
 * @route '/client-questions/{question}'
 */
deleteMethod.url = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { question: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { question: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    question: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        question: typeof args.question === 'object'
                ? args.question.id
                : args.question,
                }

    return deleteMethod.definition.url
            .replace('{question}', parsedArgs.question.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientBoardController::deleteMethod
 * @see app/Http/Controllers/ClientBoardController.php:115
 * @route '/client-questions/{question}'
 */
deleteMethod.delete = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ClientBoardController::deleteMethod
 * @see app/Http/Controllers/ClientBoardController.php:115
 * @route '/client-questions/{question}'
 */
    const deleteMethodForm = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/ClientBoardController.php:115
 * @route '/client-questions/{question}'
 */
        deleteMethodForm.delete = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
const questions = {
    update: Object.assign(update, update),
delete: Object.assign(deleteMethod, deleteMethod),
}

export default questions