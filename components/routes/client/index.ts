import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import requests79d987 from './requests'
import questions21d3d2 from './questions'
import chats8dcd54 from './chats'
/**
* @see \App\Http\Controllers\PageController::requests
 * @see app/Http/Controllers/PageController.php:132
 * @route '/client-requests'
 */
export const requests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: requests.url(options),
    method: 'get',
})

requests.definition = {
    methods: ["get","head"],
    url: '/client-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::requests
 * @see app/Http/Controllers/PageController.php:132
 * @route '/client-requests'
 */
requests.url = (options?: RouteQueryOptions) => {
    return requests.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::requests
 * @see app/Http/Controllers/PageController.php:132
 * @route '/client-requests'
 */
requests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: requests.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PageController::requests
 * @see app/Http/Controllers/PageController.php:132
 * @route '/client-requests'
 */
requests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: requests.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PageController::requests
 * @see app/Http/Controllers/PageController.php:132
 * @route '/client-requests'
 */
    const requestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: requests.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PageController::requests
 * @see app/Http/Controllers/PageController.php:132
 * @route '/client-requests'
 */
        requestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: requests.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PageController::requests
 * @see app/Http/Controllers/PageController.php:132
 * @route '/client-requests'
 */
        requestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: requests.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    requests.form = requestsForm
/**
* @see \App\Http\Controllers\PageController::questions
 * @see app/Http/Controllers/PageController.php:170
 * @route '/client-questions'
 */
export const questions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: questions.url(options),
    method: 'get',
})

questions.definition = {
    methods: ["get","head"],
    url: '/client-questions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PageController::questions
 * @see app/Http/Controllers/PageController.php:170
 * @route '/client-questions'
 */
questions.url = (options?: RouteQueryOptions) => {
    return questions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PageController::questions
 * @see app/Http/Controllers/PageController.php:170
 * @route '/client-questions'
 */
questions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: questions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PageController::questions
 * @see app/Http/Controllers/PageController.php:170
 * @route '/client-questions'
 */
questions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: questions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PageController::questions
 * @see app/Http/Controllers/PageController.php:170
 * @route '/client-questions'
 */
    const questionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: questions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PageController::questions
 * @see app/Http/Controllers/PageController.php:170
 * @route '/client-questions'
 */
        questionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: questions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PageController::questions
 * @see app/Http/Controllers/PageController.php:170
 * @route '/client-questions'
 */
        questionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: questions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    questions.form = questionsForm
/**
* @see \App\Http\Controllers\ClientChatController::chats
 * @see app/Http/Controllers/ClientChatController.php:20
 * @route '/client-chats'
 */
export const chats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: chats.url(options),
    method: 'get',
})

chats.definition = {
    methods: ["get","head"],
    url: '/client-chats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClientChatController::chats
 * @see app/Http/Controllers/ClientChatController.php:20
 * @route '/client-chats'
 */
chats.url = (options?: RouteQueryOptions) => {
    return chats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClientChatController::chats
 * @see app/Http/Controllers/ClientChatController.php:20
 * @route '/client-chats'
 */
chats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: chats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClientChatController::chats
 * @see app/Http/Controllers/ClientChatController.php:20
 * @route '/client-chats'
 */
chats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: chats.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClientChatController::chats
 * @see app/Http/Controllers/ClientChatController.php:20
 * @route '/client-chats'
 */
    const chatsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: chats.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClientChatController::chats
 * @see app/Http/Controllers/ClientChatController.php:20
 * @route '/client-chats'
 */
        chatsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: chats.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClientChatController::chats
 * @see app/Http/Controllers/ClientChatController.php:20
 * @route '/client-chats'
 */
        chatsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: chats.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    chats.form = chatsForm
const client = {
    requests: Object.assign(requests, requests79d987),
questions: Object.assign(questions, questions21d3d2),
chats: Object.assign(chats, chats8dcd54),
}

export default client