import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ClientBoardController::updateRequest
 * @see app/Http/Controllers/ClientBoardController.php:15
 * @route '/client-requests/{order}'
 */
export const updateRequest = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateRequest.url(args, options),
    method: 'patch',
})

updateRequest.definition = {
    methods: ["patch"],
    url: '/client-requests/{order}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ClientBoardController::updateRequest
 * @see app/Http/Controllers/ClientBoardController.php:15
 * @route '/client-requests/{order}'
 */
updateRequest.url = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return updateRequest.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientBoardController::updateRequest
 * @see app/Http/Controllers/ClientBoardController.php:15
 * @route '/client-requests/{order}'
 */
updateRequest.patch = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateRequest.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ClientBoardController::updateRequest
 * @see app/Http/Controllers/ClientBoardController.php:15
 * @route '/client-requests/{order}'
 */
    const updateRequestForm = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateRequest.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClientBoardController::updateRequest
 * @see app/Http/Controllers/ClientBoardController.php:15
 * @route '/client-requests/{order}'
 */
        updateRequestForm.patch = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateRequest.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateRequest.form = updateRequestForm
/**
* @see \App\Http\Controllers\ClientBoardController::deleteRequest
 * @see app/Http/Controllers/ClientBoardController.php:55
 * @route '/client-requests/{order}'
 */
export const deleteRequest = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteRequest.url(args, options),
    method: 'delete',
})

deleteRequest.definition = {
    methods: ["delete"],
    url: '/client-requests/{order}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ClientBoardController::deleteRequest
 * @see app/Http/Controllers/ClientBoardController.php:55
 * @route '/client-requests/{order}'
 */
deleteRequest.url = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return deleteRequest.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientBoardController::deleteRequest
 * @see app/Http/Controllers/ClientBoardController.php:55
 * @route '/client-requests/{order}'
 */
deleteRequest.delete = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteRequest.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ClientBoardController::deleteRequest
 * @see app/Http/Controllers/ClientBoardController.php:55
 * @route '/client-requests/{order}'
 */
    const deleteRequestForm = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteRequest.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClientBoardController::deleteRequest
 * @see app/Http/Controllers/ClientBoardController.php:55
 * @route '/client-requests/{order}'
 */
        deleteRequestForm.delete = (args: { order: string | number | { id: string | number } } | [order: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteRequest.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteRequest.form = deleteRequestForm
/**
* @see \App\Http\Controllers\ClientBoardController::updateQuestion
 * @see app/Http/Controllers/ClientBoardController.php:67
 * @route '/client-questions/{question}'
 */
export const updateQuestion = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateQuestion.url(args, options),
    method: 'patch',
})

updateQuestion.definition = {
    methods: ["patch"],
    url: '/client-questions/{question}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ClientBoardController::updateQuestion
 * @see app/Http/Controllers/ClientBoardController.php:67
 * @route '/client-questions/{question}'
 */
updateQuestion.url = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return updateQuestion.definition.url
            .replace('{question}', parsedArgs.question.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientBoardController::updateQuestion
 * @see app/Http/Controllers/ClientBoardController.php:67
 * @route '/client-questions/{question}'
 */
updateQuestion.patch = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateQuestion.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ClientBoardController::updateQuestion
 * @see app/Http/Controllers/ClientBoardController.php:67
 * @route '/client-questions/{question}'
 */
    const updateQuestionForm = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateQuestion.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClientBoardController::updateQuestion
 * @see app/Http/Controllers/ClientBoardController.php:67
 * @route '/client-questions/{question}'
 */
        updateQuestionForm.patch = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateQuestion.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateQuestion.form = updateQuestionForm
/**
* @see \App\Http\Controllers\ClientBoardController::deleteQuestion
 * @see app/Http/Controllers/ClientBoardController.php:115
 * @route '/client-questions/{question}'
 */
export const deleteQuestion = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteQuestion.url(args, options),
    method: 'delete',
})

deleteQuestion.definition = {
    methods: ["delete"],
    url: '/client-questions/{question}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ClientBoardController::deleteQuestion
 * @see app/Http/Controllers/ClientBoardController.php:115
 * @route '/client-questions/{question}'
 */
deleteQuestion.url = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return deleteQuestion.definition.url
            .replace('{question}', parsedArgs.question.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientBoardController::deleteQuestion
 * @see app/Http/Controllers/ClientBoardController.php:115
 * @route '/client-questions/{question}'
 */
deleteQuestion.delete = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteQuestion.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ClientBoardController::deleteQuestion
 * @see app/Http/Controllers/ClientBoardController.php:115
 * @route '/client-questions/{question}'
 */
    const deleteQuestionForm = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteQuestion.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClientBoardController::deleteQuestion
 * @see app/Http/Controllers/ClientBoardController.php:115
 * @route '/client-questions/{question}'
 */
        deleteQuestionForm.delete = (args: { question: string | number | { id: string | number } } | [question: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteQuestion.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteQuestion.form = deleteQuestionForm
/**
* @see \App\Http\Controllers\ClientBoardController::updateCalendarAppointment
 * @see app/Http/Controllers/ClientBoardController.php:127
 * @route '/calendar/appointments/{appointment}'
 */
export const updateCalendarAppointment = (args: { appointment: string | number | { id: string | number } } | [appointment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateCalendarAppointment.url(args, options),
    method: 'patch',
})

updateCalendarAppointment.definition = {
    methods: ["patch"],
    url: '/calendar/appointments/{appointment}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ClientBoardController::updateCalendarAppointment
 * @see app/Http/Controllers/ClientBoardController.php:127
 * @route '/calendar/appointments/{appointment}'
 */
updateCalendarAppointment.url = (args: { appointment: string | number | { id: string | number } } | [appointment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { appointment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { appointment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    appointment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        appointment: typeof args.appointment === 'object'
                ? args.appointment.id
                : args.appointment,
                }

    return updateCalendarAppointment.definition.url
            .replace('{appointment}', parsedArgs.appointment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientBoardController::updateCalendarAppointment
 * @see app/Http/Controllers/ClientBoardController.php:127
 * @route '/calendar/appointments/{appointment}'
 */
updateCalendarAppointment.patch = (args: { appointment: string | number | { id: string | number } } | [appointment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateCalendarAppointment.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ClientBoardController::updateCalendarAppointment
 * @see app/Http/Controllers/ClientBoardController.php:127
 * @route '/calendar/appointments/{appointment}'
 */
    const updateCalendarAppointmentForm = (args: { appointment: string | number | { id: string | number } } | [appointment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateCalendarAppointment.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClientBoardController::updateCalendarAppointment
 * @see app/Http/Controllers/ClientBoardController.php:127
 * @route '/calendar/appointments/{appointment}'
 */
        updateCalendarAppointmentForm.patch = (args: { appointment: string | number | { id: string | number } } | [appointment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateCalendarAppointment.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateCalendarAppointment.form = updateCalendarAppointmentForm
/**
* @see \App\Http\Controllers\ClientBoardController::deleteCalendarAppointment
 * @see app/Http/Controllers/ClientBoardController.php:226
 * @route '/calendar/appointments/{appointment}'
 */
export const deleteCalendarAppointment = (args: { appointment: string | number | { id: string | number } } | [appointment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteCalendarAppointment.url(args, options),
    method: 'delete',
})

deleteCalendarAppointment.definition = {
    methods: ["delete"],
    url: '/calendar/appointments/{appointment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ClientBoardController::deleteCalendarAppointment
 * @see app/Http/Controllers/ClientBoardController.php:226
 * @route '/calendar/appointments/{appointment}'
 */
deleteCalendarAppointment.url = (args: { appointment: string | number | { id: string | number } } | [appointment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { appointment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { appointment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    appointment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        appointment: typeof args.appointment === 'object'
                ? args.appointment.id
                : args.appointment,
                }

    return deleteCalendarAppointment.definition.url
            .replace('{appointment}', parsedArgs.appointment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientBoardController::deleteCalendarAppointment
 * @see app/Http/Controllers/ClientBoardController.php:226
 * @route '/calendar/appointments/{appointment}'
 */
deleteCalendarAppointment.delete = (args: { appointment: string | number | { id: string | number } } | [appointment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteCalendarAppointment.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ClientBoardController::deleteCalendarAppointment
 * @see app/Http/Controllers/ClientBoardController.php:226
 * @route '/calendar/appointments/{appointment}'
 */
    const deleteCalendarAppointmentForm = (args: { appointment: string | number | { id: string | number } } | [appointment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteCalendarAppointment.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClientBoardController::deleteCalendarAppointment
 * @see app/Http/Controllers/ClientBoardController.php:226
 * @route '/calendar/appointments/{appointment}'
 */
        deleteCalendarAppointmentForm.delete = (args: { appointment: string | number | { id: string | number } } | [appointment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteCalendarAppointment.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteCalendarAppointment.form = deleteCalendarAppointmentForm
/**
* @see \App\Http\Controllers\ClientBoardController::updateCalendarTask
 * @see app/Http/Controllers/ClientBoardController.php:190
 * @route '/calendar/tasks/{task}'
 */
export const updateCalendarTask = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateCalendarTask.url(args, options),
    method: 'patch',
})

updateCalendarTask.definition = {
    methods: ["patch"],
    url: '/calendar/tasks/{task}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ClientBoardController::updateCalendarTask
 * @see app/Http/Controllers/ClientBoardController.php:190
 * @route '/calendar/tasks/{task}'
 */
updateCalendarTask.url = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { task: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        task: typeof args.task === 'object'
                ? args.task.id
                : args.task,
                }

    return updateCalendarTask.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientBoardController::updateCalendarTask
 * @see app/Http/Controllers/ClientBoardController.php:190
 * @route '/calendar/tasks/{task}'
 */
updateCalendarTask.patch = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateCalendarTask.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ClientBoardController::updateCalendarTask
 * @see app/Http/Controllers/ClientBoardController.php:190
 * @route '/calendar/tasks/{task}'
 */
    const updateCalendarTaskForm = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateCalendarTask.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClientBoardController::updateCalendarTask
 * @see app/Http/Controllers/ClientBoardController.php:190
 * @route '/calendar/tasks/{task}'
 */
        updateCalendarTaskForm.patch = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateCalendarTask.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateCalendarTask.form = updateCalendarTaskForm
/**
* @see \App\Http\Controllers\ClientBoardController::deleteCalendarTask
 * @see app/Http/Controllers/ClientBoardController.php:237
 * @route '/calendar/tasks/{task}'
 */
export const deleteCalendarTask = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteCalendarTask.url(args, options),
    method: 'delete',
})

deleteCalendarTask.definition = {
    methods: ["delete"],
    url: '/calendar/tasks/{task}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ClientBoardController::deleteCalendarTask
 * @see app/Http/Controllers/ClientBoardController.php:237
 * @route '/calendar/tasks/{task}'
 */
deleteCalendarTask.url = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { task: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        task: typeof args.task === 'object'
                ? args.task.id
                : args.task,
                }

    return deleteCalendarTask.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientBoardController::deleteCalendarTask
 * @see app/Http/Controllers/ClientBoardController.php:237
 * @route '/calendar/tasks/{task}'
 */
deleteCalendarTask.delete = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteCalendarTask.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ClientBoardController::deleteCalendarTask
 * @see app/Http/Controllers/ClientBoardController.php:237
 * @route '/calendar/tasks/{task}'
 */
    const deleteCalendarTaskForm = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteCalendarTask.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClientBoardController::deleteCalendarTask
 * @see app/Http/Controllers/ClientBoardController.php:237
 * @route '/calendar/tasks/{task}'
 */
        deleteCalendarTaskForm.delete = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteCalendarTask.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteCalendarTask.form = deleteCalendarTaskForm
const ClientBoardController = { updateRequest, deleteRequest, updateQuestion, deleteQuestion, updateCalendarAppointment, deleteCalendarAppointment, updateCalendarTask, deleteCalendarTask }

export default ClientBoardController