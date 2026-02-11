import PageController from './PageController'
import CompanyController from './CompanyController'
import ClientBoardController from './ClientBoardController'
import ClientChatController from './ClientChatController'
import CompanyAssistantController from './CompanyAssistantController'
import AuthController from './AuthController'
const Controllers = {
    PageController: Object.assign(PageController, PageController),
CompanyController: Object.assign(CompanyController, CompanyController),
ClientBoardController: Object.assign(ClientBoardController, ClientBoardController),
ClientChatController: Object.assign(ClientChatController, ClientChatController),
CompanyAssistantController: Object.assign(CompanyAssistantController, CompanyAssistantController),
AuthController: Object.assign(AuthController, AuthController),
}

export default Controllers