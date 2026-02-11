import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PageController::training
 * @see app/Http/Controllers/PageController.php:65
 * @route '/assistant/training'
 */
export const training = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: training.url(options),
    method: 'get',
})

training.definition = {
    methods: ["get","head"],
    url: '/assistant/training',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::training
 * @see app/Http/Controllers/PageController.php:65
 * @route '/assistant/training'
 */
training.url = (options?: RouteQueryOptions) => {
    return training.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::training
 * @see app/Http/Controllers/PageController.php:65
 * @route '/assistant/training'
 */
training.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: training.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PageController::training
 * @see app/Http/Controllers/PageController.php:65
 * @route '/assistant/training'
 */
training.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: training.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PageController::training
 * @see app/Http/Controllers/PageController.php:65
 * @route '/assistant/training'
 */
    const trainingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: training.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PageController::training
 * @see app/Http/Controllers/PageController.php:65
 * @route '/assistant/training'
 */
        trainingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: training.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PageController::training
 * @see app/Http/Controllers/PageController.php:65
 * @route '/assistant/training'
 */
        trainingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: training.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    training.form = trainingForm
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
export const update = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/assistant/training/{assistant}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompanyAssistantController::update
 * @see app/Http/Controllers/CompanyAssistantController.php:262
 * @route '/assistant/training/{assistant}'
 */
update.url = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{assistant}', parsedArgs.assistant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyAssistantController::update
 * @see app/Http/Controllers/CompanyAssistantController.php:262
 * @route '/assistant/training/{assistant}'
 */
update.post = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompanyAssistantController::update
 * @see app/Http/Controllers/CompanyAssistantController.php:262
 * @route '/assistant/training/{assistant}'
 */
    const updateForm = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompanyAssistantController::update
 * @see app/Http/Controllers/CompanyAssistantController.php:262
 * @route '/assistant/training/{assistant}'
 */
        updateForm.post = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, options),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\CompanyAssistantController::toggle
 * @see app/Http/Controllers/CompanyAssistantController.php:495
 * @route '/assistant/training/{assistant}/status'
 */
export const toggle = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

toggle.definition = {
    methods: ["patch"],
    url: '/assistant/training/{assistant}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\CompanyAssistantController::toggle
 * @see app/Http/Controllers/CompanyAssistantController.php:495
 * @route '/assistant/training/{assistant}/status'
 */
toggle.url = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return toggle.definition.url
            .replace('{assistant}', parsedArgs.assistant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyAssistantController::toggle
 * @see app/Http/Controllers/CompanyAssistantController.php:495
 * @route '/assistant/training/{assistant}/status'
 */
toggle.patch = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CompanyAssistantController::toggle
 * @see app/Http/Controllers/CompanyAssistantController.php:495
 * @route '/assistant/training/{assistant}/status'
 */
    const toggleForm = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggle.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompanyAssistantController::toggle
 * @see app/Http/Controllers/CompanyAssistantController.php:495
 * @route '/assistant/training/{assistant}/status'
 */
        toggleForm.patch = (args: { assistant: string | number | { id: string | number } } | [assistant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggle.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggle.form = toggleForm
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
const assistant = {
    training: Object.assign(training, training),
store: Object.assign(store, store),
update: Object.assign(update, update),
toggle: Object.assign(toggle, toggle),
destroy: Object.assign(destroy, destroy),
}

export default assistant