import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CompanyAssistantController::store
 * @see app/Http/Controllers/CompanyAssistantController.php:110
 * @route '/assistant/training'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/assistant/training',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompanyAssistantController::store
 * @see app/Http/Controllers/CompanyAssistantController.php:110
 * @route '/assistant/training'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyAssistantController::store
 * @see app/Http/Controllers/CompanyAssistantController.php:110
 * @route '/assistant/training'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompanyAssistantController::store
 * @see app/Http/Controllers/CompanyAssistantController.php:110
 * @route '/assistant/training'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompanyAssistantController::store
 * @see app/Http/Controllers/CompanyAssistantController.php:110
 * @route '/assistant/training'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CompanyAssistantController::update
 * @see app/Http/Controllers/CompanyAssistantController.php:262
 * @route '/assistant/training/{assistant}'
 */
const updatee0be99b6f464ef31d0a302d2dbaad1e3 = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatee0be99b6f464ef31d0a302d2dbaad1e3.url(args, options),
    method: 'post',
})

updatee0be99b6f464ef31d0a302d2dbaad1e3.definition = {
    methods: ["post"],
    url: '/assistant/training/{assistant}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompanyAssistantController::update
 * @see app/Http/Controllers/CompanyAssistantController.php:262
 * @route '/assistant/training/{assistant}'
 */
updatee0be99b6f464ef31d0a302d2dbaad1e3.url = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assistant: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { assistant: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    assistant: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assistant: typeof args.assistant === 'object'
                ? args.assistant.id
                : args.assistant,
                }

    return updatee0be99b6f464ef31d0a302d2dbaad1e3.definition.url
            .replace('{assistant}', parsedArgs.assistant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyAssistantController::update
 * @see app/Http/Controllers/CompanyAssistantController.php:262
 * @route '/assistant/training/{assistant}'
 */
updatee0be99b6f464ef31d0a302d2dbaad1e3.post = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatee0be99b6f464ef31d0a302d2dbaad1e3.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompanyAssistantController::update
 * @see app/Http/Controllers/CompanyAssistantController.php:262
 * @route '/assistant/training/{assistant}'
 */
    const updatee0be99b6f464ef31d0a302d2dbaad1e3Form = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatee0be99b6f464ef31d0a302d2dbaad1e3.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompanyAssistantController::update
 * @see app/Http/Controllers/CompanyAssistantController.php:262
 * @route '/assistant/training/{assistant}'
 */
        updatee0be99b6f464ef31d0a302d2dbaad1e3Form.post = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatee0be99b6f464ef31d0a302d2dbaad1e3.url(args, options),
            method: 'post',
        })
    
    updatee0be99b6f464ef31d0a302d2dbaad1e3.form = updatee0be99b6f464ef31d0a302d2dbaad1e3Form
    /**
* @see \App\Http\Controllers\CompanyAssistantController::update
 * @see app/Http/Controllers/CompanyAssistantController.php:262
 * @route '/assistant/training/{assistant}'
 */
const updatee0be99b6f464ef31d0a302d2dbaad1e3 = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatee0be99b6f464ef31d0a302d2dbaad1e3.url(args, options),
    method: 'patch',
})

updatee0be99b6f464ef31d0a302d2dbaad1e3.definition = {
    methods: ["patch"],
    url: '/assistant/training/{assistant}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\CompanyAssistantController::update
 * @see app/Http/Controllers/CompanyAssistantController.php:262
 * @route '/assistant/training/{assistant}'
 */
updatee0be99b6f464ef31d0a302d2dbaad1e3.url = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assistant: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { assistant: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    assistant: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assistant: typeof args.assistant === 'object'
                ? args.assistant.id
                : args.assistant,
                }

    return updatee0be99b6f464ef31d0a302d2dbaad1e3.definition.url
            .replace('{assistant}', parsedArgs.assistant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyAssistantController::update
 * @see app/Http/Controllers/CompanyAssistantController.php:262
 * @route '/assistant/training/{assistant}'
 */
updatee0be99b6f464ef31d0a302d2dbaad1e3.patch = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatee0be99b6f464ef31d0a302d2dbaad1e3.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CompanyAssistantController::update
 * @see app/Http/Controllers/CompanyAssistantController.php:262
 * @route '/assistant/training/{assistant}'
 */
    const updatee0be99b6f464ef31d0a302d2dbaad1e3Form = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatee0be99b6f464ef31d0a302d2dbaad1e3.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompanyAssistantController::update
 * @see app/Http/Controllers/CompanyAssistantController.php:262
 * @route '/assistant/training/{assistant}'
 */
        updatee0be99b6f464ef31d0a302d2dbaad1e3Form.patch = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatee0be99b6f464ef31d0a302d2dbaad1e3.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatee0be99b6f464ef31d0a302d2dbaad1e3.form = updatee0be99b6f464ef31d0a302d2dbaad1e3Form

export const update = {
    '/assistant/training/{assistant}': updatee0be99b6f464ef31d0a302d2dbaad1e3,
    '/assistant/training/{assistant}': updatee0be99b6f464ef31d0a302d2dbaad1e3,
}

/**
* @see \App\Http\Controllers\CompanyAssistantController::toggleStatus
 * @see app/Http/Controllers/CompanyAssistantController.php:495
 * @route '/assistant/training/{assistant}/status'
 */
export const toggleStatus = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

toggleStatus.definition = {
    methods: ["patch"],
    url: '/assistant/training/{assistant}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\CompanyAssistantController::toggleStatus
 * @see app/Http/Controllers/CompanyAssistantController.php:495
 * @route '/assistant/training/{assistant}/status'
 */
toggleStatus.url = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assistant: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { assistant: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    assistant: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assistant: typeof args.assistant === 'object'
                ? args.assistant.id
                : args.assistant,
                }

    return toggleStatus.definition.url
            .replace('{assistant}', parsedArgs.assistant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyAssistantController::toggleStatus
 * @see app/Http/Controllers/CompanyAssistantController.php:495
 * @route '/assistant/training/{assistant}/status'
 */
toggleStatus.patch = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CompanyAssistantController::toggleStatus
 * @see app/Http/Controllers/CompanyAssistantController.php:495
 * @route '/assistant/training/{assistant}/status'
 */
    const toggleStatusForm = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompanyAssistantController::toggleStatus
 * @see app/Http/Controllers/CompanyAssistantController.php:495
 * @route '/assistant/training/{assistant}/status'
 */
        toggleStatusForm.patch = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleStatus.form = toggleStatusForm
/**
* @see \App\Http\Controllers\CompanyAssistantController::destroy
 * @see app/Http/Controllers/CompanyAssistantController.php:511
 * @route '/assistant/training/{assistant}'
 */
export const destroy = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/assistant/training/{assistant}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CompanyAssistantController::destroy
 * @see app/Http/Controllers/CompanyAssistantController.php:511
 * @route '/assistant/training/{assistant}'
 */
destroy.url = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assistant: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { assistant: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    assistant: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assistant: typeof args.assistant === 'object'
                ? args.assistant.id
                : args.assistant,
                }

    return destroy.definition.url
            .replace('{assistant}', parsedArgs.assistant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyAssistantController::destroy
 * @see app/Http/Controllers/CompanyAssistantController.php:511
 * @route '/assistant/training/{assistant}'
 */
destroy.delete = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CompanyAssistantController::destroy
 * @see app/Http/Controllers/CompanyAssistantController.php:511
 * @route '/assistant/training/{assistant}'
 */
    const destroyForm = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompanyAssistantController::destroy
 * @see app/Http/Controllers/CompanyAssistantController.php:511
 * @route '/assistant/training/{assistant}'
 */
        destroyForm.delete = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const CompanyAssistantController = { store, update, toggleStatus, destroy }

export default CompanyAssistantController