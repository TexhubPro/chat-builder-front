export const SUPPORTED_LOCALES = ["ru", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export type Messages = {
  app: {
    name: string;
    tagline: string;
  };
  common: {
    loadingSession: string;
    separatorOr: string;
    cancel: string;
    language: {
      ru: string;
      en: string;
    };
  };
  auth: {
    loginTitle: string;
    welcomeBack: string;
    subtitle: string;
    loginLabel: string;
    loginPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    passwordRulesHint: string;
    rememberMe: string;
    forgotPassword: string;
    forgotPasswordTitle: string;
    forgotPasswordSubtitle: string;
    forgotPasswordEmailLabel: string;
    forgotPasswordEmailPlaceholder: string;
    forgotPasswordButton: string;
    forgotPasswordSuccess: string;
    forgotPasswordFailed: string;
    tooManyPasswordResetRequests: string;
    loginButton: string;
    noAccount: string;
    signUp: string;
    haveAccount: string;
    signIn: string;
    registerTitle: string;
    registerSubtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    registerButton: string;
    verifyTitle: string;
    verifySubtitle: string;
    verifyButton: string;
    codeLabel: string;
    codePlaceholder: string;
    resendCode: string;
    resendCodeIn: string;
    backToLogin: string;
    backToRegister: string;
    continueWithGoogle: string;
    continueWithGithub: string;
    requiredCredentials: string;
    errorTitle: string;
    successTitle: string;
    loginFailed: string;
    socialLoginFailed: string;
    requiredRegisterFields: string;
    invalidName: string;
    invalidEmail: string;
    invalidPhone: string;
    invalidLoginIdentifier: string;
    passwordTooShort: string;
    weakPassword: string;
    passwordMismatch: string;
    registerFailed: string;
    registerSuccess: string;
    verifyCodeRequired: string;
    verificationEmailMissing: string;
    invalidVerificationCode: string;
    verificationFailed: string;
    verificationSuccess: string;
    resendFailed: string;
    redirectToVerify: string;
    tooManyVerificationAttempts: string;
    tooManyResendRequests: string;
    tooManyLoginAttempts: string;
    tooManyRegistrationAttempts: string;
    verificationCodeExpired: string;
    verificationAttemptsExceeded: string;
    verificationCodeInvalidOrExpired: string;
    waitBeforeNewCode: string;
    invalidCredentials: string;
    userInactive: string;
    emailNotVerified: string;
    emailAlreadyVerified: string;
    emailAlreadyVerifiedPleaseLogin: string;
    verificationCodeSent: string;
    accountMayExistVerificationCodeSent: string;
    registrationCreatedVerificationCodeSent: string;
    emailVerifiedSuccessfully: string;
    emailAlreadyTaken: string;
    phoneAlreadyTaken: string;
    accountUnderModeration: string;
    moderationTitle: string;
    moderationSubtitle: string;
    moderationAlertTitle: string;
    moderationAlertDescription: string;
    moderationRefresh: string;
    moderationLogout: string;
    resetNotReady: string;
  };
  home: {
    badge: string;
    title: string;
    signedInAs: string;
    profile: string;
    settings: string;
    notifications: string;
    logout: string;
  };
  profile: {
    title: string;
    subtitle: string;
    avatarTitle: string;
    avatarHint: string;
    uploadAvatar: string;
    removeAvatar: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    phoneLabel: string;
    emailReadonlyHint: string;
    phoneReadonlyHint: string;
    phoneNotSet: string;
    passwordSectionTitle: string;
    currentPasswordLabel: string;
    currentPasswordPlaceholder: string;
    newPasswordLabel: string;
    newPasswordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    saveButton: string;
    successTitle: string;
    errorTitle: string;
    nameRequired: string;
    nameInvalid: string;
    avatarInvalidType: string;
    avatarTooLarge: string;
    currentPasswordRequired: string;
    newPasswordRequired: string;
    confirmPasswordRequired: string;
    currentPasswordInvalid: string;
    newPasswordDifferent: string;
    profileUpdated: string;
    updateFailed: string;
  };
  businessSettings: {
    title: string;
    subtitle: string;
    profileTitle: string;
    accountTypeLabel: string;
    accountTypeWithAppointments: string;
    accountTypeWithoutAppointments: string;
    nameLabel: string;
    nameValidation: string;
    shortDescriptionLabel: string;
    industryLabel: string;
    primaryGoalLabel: string;
    contactEmailLabel: string;
    contactPhoneLabel: string;
    websiteLabel: string;
    addressLabel: string;
    timezoneLabel: string;
    currencyLabel: string;
    timezonePlaceholder: string;
    workingHoursLabel: string;
    scheduleTitle: string;
    scheduleSubtitle: string;
    invalidScheduleRange: string;
    dayOffLabel: string;
    startTimeLabel: string;
    endTimeLabel: string;
    mondayLabel: string;
    tuesdayLabel: string;
    wednesdayLabel: string;
    thursdayLabel: string;
    fridayLabel: string;
    saturdayLabel: string;
    sundayLabel: string;
    bookingTitle: string;
    bookingSubtitle: string;
    bookingDisabledTitle: string;
    bookingDisabledDescription: string;
    slotLabel: string;
    bufferLabel: string;
    maxDaysAheadLabel: string;
    minutesUnit: string;
    autoConfirmLabel: string;
    requiredFieldsTitle: string;
    requiredFieldsSubtitle: string;
    orderRequiredFieldsLabel: string;
    appointmentRequiredFieldsLabel: string;
    requiredFieldClientName: string;
    requiredFieldPhone: string;
    requiredFieldService: string;
    requiredFieldAddress: string;
    requiredFieldAmount: string;
    requiredFieldNote: string;
    requiredFieldAppointmentDate: string;
    requiredFieldAppointmentTime: string;
    requiredFieldAppointmentDuration: string;
    aiLanguagesTitle: string;
    aiLanguagesSubtitle: string;
    aiLanguagesLabel: string;
    aiLanguageRequiredValidation: string;
    aiLanguageRu: string;
    aiLanguageEn: string;
    aiLanguageTg: string;
    aiLanguageUz: string;
    aiLanguageTr: string;
    aiLanguageFa: string;
    deliveryTitle: string;
    deliverySubtitle: string;
    deliveryEnabledLabel: string;
    deliveryRequireAddressLabel: string;
    deliveryRequireDateTimeLabel: string;
    deliveryEtaLabel: string;
    deliveryFeeLabel: string;
    deliveryFreeFromLabel: string;
    deliveryAvailableFromLabel: string;
    deliveryAvailableToLabel: string;
    deliveryNotesLabel: string;
    invalidDeliveryRange: string;
    invalidDeliveryFee: string;
    invalidDeliveryFreeFromAmount: string;
    saveButton: string;
    loading: string;
    loadFailed: string;
    saveFailed: string;
    saveSuccess: string;
    unauthorized: string;
    errorTitle: string;
    successTitle: string;
  };
  billing: {
    title: string;
    subtitle: string;
    pricePerPeriod: string;
    usageProgress: string;
    nextPaymentDate: string;
    plansTitle: string;
    plansSubtitle: string;
    renewSubscriptionTitle: string;
    paymentMethodLabel: string;
    choosePlanLabel: string;
    totalToPayLabel: string;
    noPlansAvailable: string;
    premiumTitle: string;
    premiumDescription: string;
    premiumAction: string;
    supportTitle: string;
    supportDescription: string;
    supportAction: string;
    currentSubscriptionTitle: string;
    currentSubscriptionEmpty: string;
    statusLabel: string;
    quantityLabel: string;
    cycleLabel: string;
    renewalLabel: string;
    expiresLabel: string;
    usageTitle: string;
    includedChats: string;
    usedChats: string;
    remainingChats: string;
    overageChats: string;
    overagePrice: string;
    assistantLimit: string;
    integrationLimit: string;
    quantityInputLabel: string;
    quantityRangeError: string;
    planFeaturesTitle: string;
    selectedPlan: string;
    checkoutButton: string;
    checkoutProcessing: string;
    updatePlanButton: string;
    hidePlanUpdateButton: string;
    creditAppliedLabel: string;
    downgradeWarningTitle: string;
    downgradeWarningDescription: string;
    downgradeWarningForfeit: string;
    downgradeCancelButton: string;
    downgradeConfirmButton: string;
    invoicesTitle: string;
    invoicesSubtitle: string;
    invoiceNumber: string;
    invoiceDate: string;
    invoiceDue: string;
    invoiceTotal: string;
    invoiceStatus: string;
    noInvoices: string;
    payButton: string;
    payingButton: string;
    refreshButton: string;
    statusActive: string;
    statusPendingPayment: string;
    statusPending: string;
    statusInactive: string;
    statusPastDue: string;
    statusUnpaid: string;
    statusExpired: string;
    statusCanceled: string;
    statusIssued: string;
    statusPaid: string;
    statusOverdue: string;
    statusFailed: string;
    statusVoid: string;
    statusUnknown: string;
    checkoutCreated: string;
    paymentSessionCreated: string;
    paymentCompleted: string;
    paymentAlreadyCompleted: string;
    checkoutFailed: string;
    loadFailed: string;
    unauthorized: string;
    errorTitle: string;
    successTitle: string;
  };
  catalog: {
    title: string;
    subtitle: string;
    assistantsTitle: string;
    assistantsSubtitle: string;
    backToAssistants: string;
    noAssistants: string;
    selectAssistant: string;
    selectedAssistantPrefix: string;
    addService: string;
    addProduct: string;
    servicesTab: string;
    productsTab: string;
    emptyServices: string;
    emptyProducts: string;
    statusActive: string;
    statusInactive: string;
    stockLabel: string;
    unlimitedStock: string;
    newServiceTitle: string;
    editServiceTitle: string;
    newProductTitle: string;
    editProductTitle: string;
    nameLabel: string;
    skuLabel: string;
    priceLabel: string;
    currencyLabel: string;
    sortOrderLabel: string;
    descriptionLabel: string;
    termsLabel: string;
    photoUrlsLabel: string;
    specialistsTitle: string;
    addSpecialist: string;
    noSpecialists: string;
    specialistNameLabel: string;
    specialistPriceLabel: string;
    productLinkLabel: string;
    openProductLink: string;
    activeLabel: string;
    unlimitedStockLabel: string;
    saveButton: string;
    validationName: string;
    validationPrice: string;
    validationSortOrder: string;
    validationStock: string;
    validationSpecialistName: string;
    validationSpecialistPrice: string;
    validationProductLink: string;
    loadAssistantsFailed: string;
    loadCatalogFailed: string;
    saveFailed: string;
    deleteFailed: string;
    serviceCreated: string;
    serviceUpdated: string;
    serviceDeleted: string;
    productCreated: string;
    productUpdated: string;
    productDeleted: string;
    unauthorized: string;
    errorTitle: string;
    successTitle: string;
  };
  clientChats: {
    title: string;
    subtitle: string;
    allChatsTab: string;
    instagramTab: string;
    telegramTab: string;
    widgetTab: string;
    apiTab: string;
    assistantTab: string;
    searchPlaceholder: string;
    loadingChats: string;
    loadingMessages: string;
    emptyChats: string;
    emptyMessages: string;
    noPreview: string;
    backToList: string;
    channelLabel: string;
    assistantTargetLabel: string;
    assistantAutoOption: string;
    messagePlaceholder: string;
    askAssistantButton: string;
    sendButton: string;
    selectChatTitle: string;
    selectChatDescription: string;
    senderCustomer: string;
    senderAssistant: string;
    senderAgent: string;
    senderSystem: string;
    sentSuccess: string;
    assistantReplySuccess: string;
    sendFailed: string;
    assistantReplyFailed: string;
    chatInfoButton: string;
    resetChatButton: string;
    resetChatFailed: string;
    chatInfoTitle: string;
    chatInfoDescription: string;
    chatInfoClient: string;
    chatInfoAiToggle: string;
    chatInfoAiEnabled: string;
    chatInfoAiDisabled: string;
    chatInfoContactsToggle: string;
    chatInfoContactsTitle: string;
    chatInfoNoContacts: string;
    chatInfoCreateOrderButton: string;
    orderModalTitle: string;
    orderModalPhoneLabel: string;
    orderModalPhonePlaceholder: string;
    orderModalServiceLabel: string;
    orderModalServicePlaceholder: string;
    orderModalAddressLabel: string;
    orderModalAddressPlaceholder: string;
    orderModalAmountLabel: string;
    orderModalAmountPlaceholder: string;
    orderModalBookAppointmentSwitch: string;
    orderModalAppointmentDateLabel: string;
    orderModalAppointmentTimeLabel: string;
    orderModalAppointmentDurationLabel: string;
    orderModalAppointmentDurationPlaceholder: string;
    orderModalNoteLabel: string;
    orderModalNotePlaceholder: string;
    orderModalCancelButton: string;
    orderModalSubmitButton: string;
    orderModalRequiredFields: string;
    orderModalAppointmentRequiredFields: string;
    orderModalInvalidAmount: string;
    orderModalInvalidDuration: string;
    chatInfoHistoryTitle: string;
    chatInfoNoHistory: string;
    chatInfoHistoryJumpHint: string;
    historyTypeTask: string;
    historyTypeQuestion: string;
    historyTypeOrder: string;
    orderCreated: string;
    loadFailed: string;
    unauthorized: string;
    errorTitle: string;
    successTitle: string;
  };
  clientRequests: {
    title: string;
    subtitle: string;
    refreshButton: string;
    loading: string;
    empty: string;
    columnNew: string;
    columnInProgress: string;
    columnAppointments: string;
    columnCompleted: string;
    openChatButton: string;
    editButton: string;
    deleteButton: string;
    moveToProgressButton: string;
    moveToAppointmentsButton: string;
    moveToCompletedButton: string;
    moveToConfirmedButton: string;
    moveToCourierButton: string;
    moveToDeliveredButton: string;
    markCanceledButton: string;
    archiveButton: string;
    reopenButton: string;
    appointmentLabel: string;
    noPhone: string;
    noAddress: string;
    amountLabel: string;
    serviceLabel: string;
    noteLabel: string;
    clientLabel: string;
    chatChannelLabel: string;
    statusNew: string;
    statusInProgress: string;
    statusAppointments: string;
    statusCompleted: string;
    statusConfirmed: string;
    statusCanceled: string;
    statusHandedToCourier: string;
    statusDelivered: string;
    editModalTitle: string;
    editModalSave: string;
    editModalCancel: string;
    editStatusLabel: string;
    editClientNameLabel: string;
    editPhoneLabel: string;
    editServiceLabel: string;
    editAddressLabel: string;
    editAmountLabel: string;
    editNoteLabel: string;
    editBookingSwitch: string;
    editAppointmentDateLabel: string;
    editAppointmentTimeLabel: string;
    editAppointmentDurationLabel: string;
    editAppointmentDurationPlaceholder: string;
    requiredFields: string;
    invalidAmount: string;
    invalidDuration: string;
    appointmentRequired: string;
    updateSuccess: string;
    updateFailed: string;
    deleteSuccess: string;
    deleteFailed: string;
    unauthorized: string;
    errorTitle: string;
    successTitle: string;
  };
  clientBase: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    refreshButton: string;
    statusAll: string;
    statusActive: string;
    statusArchived: string;
    statusBlocked: string;
    loading: string;
    empty: string;
    viewHistoryButton: string;
    statsOrders: string;
    statsAppointments: string;
    statsTasks: string;
    statsQuestions: string;
    totalSpent: string;
    lastContact: string;
    lastRequest: string;
    lastQuestion: string;
    phoneLabel: string;
    emailLabel: string;
    notesLabel: string;
    statusLabel: string;
    modalTitle: string;
    modalSubtitle: string;
    modalLoading: string;
    timelineTab: string;
    ordersTab: string;
    appointmentsTab: string;
    tasksTab: string;
    questionsTab: string;
    noTimeline: string;
    noOrders: string;
    noAppointments: string;
    noTasks: string;
    noQuestions: string;
    historyTypeOrder: string;
    historyTypeAppointment: string;
    historyTypeTask: string;
    historyTypeQuestion: string;
    orderServiceLabel: string;
    orderAmountLabel: string;
    orderStatusLabel: string;
    appointmentDateLabel: string;
    appointmentStatusLabel: string;
    taskStatusLabel: string;
    taskPriorityLabel: string;
    questionStatusLabel: string;
    loadFailed: string;
    detailsFailed: string;
    unauthorized: string;
    errorTitle: string;
  };
  integrations: {
    title: string;
    subtitle: string;
    assistantsTitle: string;
    assistantsSubtitle: string;
    channelsTitle: string;
    channelsSubtitle: string;
    selectAssistantTitle: string;
    selectAssistantDescription: string;
    backToAssistants: string;
    noAssistants: string;
    loadingAssistants: string;
    loadingChannels: string;
    assistantRunning: string;
    assistantStopped: string;
    activeIntegrationsLabel: string;
    integrationLimitLabel: string;
    statusEnabled: string;
    statusDisabled: string;
    channelInstagram: string;
    channelTelegram: string;
    channelWidget: string;
    channelApi: string;
    channelInstagramDescription: string;
    channelTelegramDescription: string;
    channelWidgetDescription: string;
    channelApiDescription: string;
    accountLabel: string;
    noConnection: string;
    connectButton: string;
    disconnectButton: string;
    toggleLabel: string;
    telegramTokenModalTitle: string;
    telegramTokenModalDescription: string;
    telegramTokenLabel: string;
    telegramTokenPlaceholder: string;
    telegramTokenRequired: string;
    loadFailed: string;
    updateFailed: string;
    unauthorized: string;
    errorTitle: string;
    successTitle: string;
  };
  assistantTraining: {
    title: string;
    subtitle: string;
    trainingTitle: string;
    listTitle: string;
    limitLabel: string;
    createButton: string;
    createModalTitle: string;
    createModalNameLabel: string;
    createModalNamePlaceholder: string;
    createModalCancel: string;
    createModalCreate: string;
    noAssistants: string;
    selectAssistantTitle: string;
    selectAssistantHint: string;
    backToAssistantsButton: string;
    nameLabel: string;
    nameValidation: string;
    instructionsLabel: string;
    restrictionsLabel: string;
    toneLabel: string;
    tonePolite: string;
    toneFriendly: string;
    toneConcise: string;
    toneFormal: string;
    toneCustom: string;
    settingsTitle: string;
    fileSearchLabel: string;
    fileAnalysisLabel: string;
    voiceLabel: string;
    webSearchLabel: string;
    triggersTitle: string;
    addTriggerButton: string;
    noTriggers: string;
    triggerLabel: string;
    triggerResponseLabel: string;
    removeTriggerButton: string;
    filesTitle: string;
    uploadFilesButton: string;
    noFiles: string;
    openFileButton: string;
    deleteFileButton: string;
    saveButton: string;
    saveSuccess: string;
    saveFailed: string;
    createSuccess: string;
    createFailed: string;
    startButton: string;
    stopButton: string;
    deleteButton: string;
    startSuccess: string;
    stopSuccess: string;
    deleteSuccess: string;
    actionFailed: string;
    statusRunning: string;
    statusStopped: string;
    inactiveSubscriptionTitle: string;
    inactiveSubscriptionDescription: string;
    limitReachedTitle: string;
    limitReachedDescription: string;
    deleteModalTitle: string;
    deleteModalDescription: string;
    deleteModalCancel: string;
    deleteModalConfirm: string;
    loading: string;
    unauthorized: string;
    loadFailed: string;
    errorTitle: string;
    successTitle: string;
    warningTitle: string;
    filesUploadedSuccess: string;
    fileDeletedSuccess: string;
  };
};

export const MESSAGES: Record<Locale, Messages> = {
  ru: {
    app: {
      name: "Lido",
      tagline: "AI Lead Processing Assistant",
    },
    common: {
      loadingSession: "Проверяем сессию...",
      separatorOr: "ИЛИ",
      cancel: "Отмена",
      language: {
        ru: "RU",
        en: "EN",
      },
    },
    auth: {
      loginTitle: "Вход",
      welcomeBack: "С возвращением!",
      subtitle: "Введите свои данные для входа",
      loginLabel: "Email или телефон",
      loginPlaceholder: "Введите email или телефон",
      passwordLabel: "Пароль",
      passwordPlaceholder: "Введите пароль",
      passwordRulesHint:
        "Минимум 10 символов, с буквами, цифрой и спецсимволом.",
      rememberMe: "Запомнить",
      forgotPassword: "Забыли пароль?",
      forgotPasswordTitle: "Сброс пароля",
      forgotPasswordSubtitle:
        "Введите email. Мы отправим временный пароль для входа.",
      forgotPasswordEmailLabel: "Email",
      forgotPasswordEmailPlaceholder: "Введите email",
      forgotPasswordButton: "Отправить временный пароль",
      forgotPasswordSuccess:
        "Если аккаунт существует, временный пароль отправлен на email.",
      forgotPasswordFailed:
        "Не удалось сбросить пароль. Попробуйте снова позже.",
      tooManyPasswordResetRequests:
        "Слишком много запросов на сброс пароля. Пожалуйста, попробуйте позже.",
      loginButton: "Войти",
      noAccount: "Нет аккаунта?",
      signUp: "Зарегистрироваться",
      haveAccount: "Уже есть аккаунт?",
      signIn: "Войти",
      registerTitle: "Регистрация",
      registerSubtitle: "Создайте аккаунт и подтвердите email кодом.",
      nameLabel: "Имя",
      namePlaceholder: "Введите имя",
      emailLabel: "Email",
      emailPlaceholder: "Введите email",
      phoneLabel: "Телефон",
      phonePlaceholder: "Введите телефон в формате +12345678900",
      confirmPasswordLabel: "Подтверждение пароля",
      confirmPasswordPlaceholder: "Повторите пароль",
      registerButton: "Создать аккаунт",
      verifyTitle: "Подтверждение email",
      verifySubtitle: "Введите 6-значный код, который отправлен на ваш email.",
      verifyButton: "Подтвердить код",
      codeLabel: "Введите код верификации",
      codePlaceholder: "Введите 6 цифр",
      resendCode: "Отправить код снова",
      resendCodeIn: "Повторная отправка через",
      backToLogin: "Вернуться ко входу",
      backToRegister: "К регистрации",
      continueWithGoogle: "Продолжить с Google",
      continueWithGithub: "Продолжить с Github",
      requiredCredentials: "Введите email/телефон и пароль.",
      errorTitle: "Ошибка",
      successTitle: "Успешно",
      loginFailed: "Не удалось выполнить вход. Попробуйте снова.",
      socialLoginFailed: "Не удалось начать вход через соцсеть.",
      requiredRegisterFields: "Заполните все обязательные поля.",
      invalidName: "Имя должно быть не короче 2 символов.",
      invalidEmail: "Введите корректный email.",
      invalidPhone:
        "Телефон должен быть в международном формате, например +12345678900.",
      invalidLoginIdentifier:
        "Введите корректный email или телефон в международном формате.",
      passwordTooShort: "Пароль должен быть длиннее 6 символов.",
      weakPassword:
        "Пароль слишком слабый. Используйте минимум 10 символов, строчные/заглавные буквы, цифру и спецсимвол.",
      passwordMismatch: "Пароли не совпадают.",
      registerFailed:
        "Не удалось зарегистрироваться. Проверьте данные и попробуйте снова.",
      registerSuccess:
        "Регистрация выполнена. Проверьте email и введите код подтверждения.",
      verifyCodeRequired: "Введите код подтверждения.",
      verificationEmailMissing:
        "Email для подтверждения не найден. Вернитесь к регистрации или входу.",
      invalidVerificationCode: "Код должен содержать 6 цифр.",
      verificationFailed:
        "Не удалось подтвердить email. Проверьте код и попробуйте снова.",
      verificationSuccess: "Email подтвержден. Вход выполнен.",
      resendFailed: "Не удалось отправить код повторно. Попробуйте позже.",
      redirectToVerify: "Email не подтвержден. Перейдите к подтверждению кода.",
      tooManyVerificationAttempts:
        "Слишком много попыток подтверждения. Пожалуйста, попробуйте позже.",
      tooManyResendRequests:
        "Слишком много запросов на повторную отправку. Попробуйте позже.",
      tooManyLoginAttempts:
        "Слишком много попыток входа. Пожалуйста, попробуйте позже.",
      tooManyRegistrationAttempts:
        "Слишком много попыток регистрации. Пожалуйста, попробуйте позже.",
      verificationCodeExpired: "Срок действия кода истек. Запросите новый код.",
      verificationAttemptsExceeded:
        "Превышено количество попыток. Запросите новый код.",
      verificationCodeInvalidOrExpired:
        "Код подтверждения недействителен или истек.",
      waitBeforeNewCode: "Пожалуйста, подождите перед запросом нового кода.",
      invalidCredentials: "Неверные данные для входа.",
      userInactive: "Пользователь неактивен.",
      emailNotVerified: "Email не подтвержден.",
      emailAlreadyVerified: "Email уже подтвержден.",
      emailAlreadyVerifiedPleaseLogin: "Email уже подтвержден. Выполните вход.",
      verificationCodeSent: "Код подтверждения отправлен.",
      accountMayExistVerificationCodeSent:
        "Если аккаунт существует, код подтверждения был отправлен.",
      registrationCreatedVerificationCodeSent:
        "Регистрация создана. Код подтверждения отправлен на email.",
      emailVerifiedSuccessfully: "Email успешно подтвержден.",
      emailAlreadyTaken: "Этот email уже занят.",
      phoneAlreadyTaken: "Этот номер телефона уже занят.",
      accountUnderModeration: "Ваш аккаунт находится на модерации.",
      moderationTitle: "Аккаунт на модерации",
      moderationSubtitle:
        "Ваш аккаунт находится в модерации. После подтверждения мы сообщим вам по email.",
      moderationAlertTitle: "Ожидает подтверждения",
      moderationAlertDescription:
        "Пожалуйста, дождитесь подтверждения вашего аккаунта.",
      moderationRefresh: "Обновить",
      moderationLogout: "Выйти",
      resetNotReady: "Восстановление пароля пока не подключено.",
    },
    home: {
      badge: "Главная",
      title: "Добро пожаловать",
      signedInAs: "Авторизован",
      profile: "Профиль",
      settings: "Настройки",
      notifications: "Уведомления",
      logout: "Выйти",
    },
    profile: {
      title: "Профиль",
      subtitle: "Управляйте личными данными аккаунта",
      avatarTitle: "Фото профиля",
      avatarHint: "Загрузите JPG, PNG, WEBP или AVIF до 4 МБ.",
      uploadAvatar: "Загрузить фото",
      removeAvatar: "Удалить фото",
      nameLabel: "Имя",
      namePlaceholder: "Введите имя",
      emailLabel: "Email",
      phoneLabel: "Телефон",
      emailReadonlyHint: "Email нельзя изменить.",
      phoneReadonlyHint: "Телефон нельзя изменить.",
      phoneNotSet: "Не указан",
      passwordSectionTitle: "Смена пароля",
      currentPasswordLabel: "Текущий пароль",
      currentPasswordPlaceholder: "Введите текущий пароль",
      newPasswordLabel: "Новый пароль",
      newPasswordPlaceholder: "Введите новый пароль",
      confirmPasswordLabel: "Подтверждение нового пароля",
      confirmPasswordPlaceholder: "Повторите новый пароль",
      saveButton: "Сохранить изменения",
      successTitle: "Сохранено",
      errorTitle: "Ошибка",
      nameRequired: "Введите имя.",
      nameInvalid: "Имя должно быть не короче 2 символов.",
      avatarInvalidType: "Выберите файл изображения.",
      avatarTooLarge: "Размер файла не должен превышать 4 МБ.",
      currentPasswordRequired: "Введите текущий пароль.",
      newPasswordRequired: "Введите новый пароль.",
      confirmPasswordRequired: "Подтвердите новый пароль.",
      currentPasswordInvalid: "Текущий пароль указан неверно.",
      newPasswordDifferent: "Новый пароль должен отличаться от текущего.",
      profileUpdated: "Профиль успешно обновлён.",
      updateFailed: "Не удалось обновить профиль. Попробуйте снова.",
    },
    businessSettings: {
      title: "Настройка бизнеса",
      subtitle: "Управляйте профилем компании и логикой работы с записями.",
      profileTitle: "Профиль компании",
      accountTypeLabel: "Тип аккаунта",
      accountTypeWithAppointments: "С записью клиентов",
      accountTypeWithoutAppointments: "Без записи клиентов",
      nameLabel: "Название компании",
      nameValidation: "Название компании должно быть не короче 2 символов.",
      shortDescriptionLabel: "Краткое описание",
      industryLabel: "Отрасль",
      primaryGoalLabel: "Основная цель",
      contactEmailLabel: "Контактный email",
      contactPhoneLabel: "Контактный телефон",
      websiteLabel: "Сайт",
      addressLabel: "Адрес",
      timezoneLabel: "Часовой пояс",
      currencyLabel: "Валюта",
      timezonePlaceholder: "Например: Asia/Dushanbe",
      workingHoursLabel: "Часы работы",
      scheduleTitle: "Расписание по дням недели",
      scheduleSubtitle:
        "Для каждого дня выберите рабочее время или отметьте его как выходной.",
      invalidScheduleRange:
        "Проверьте расписание: для рабочего дня время окончания должно быть позже времени начала.",
      dayOffLabel: "Выходной",
      startTimeLabel: "Начало",
      endTimeLabel: "Окончание",
      mondayLabel: "Понедельник",
      tuesdayLabel: "Вторник",
      wednesdayLabel: "Среда",
      thursdayLabel: "Четверг",
      fridayLabel: "Пятница",
      saturdayLabel: "Суббота",
      sundayLabel: "Воскресенье",
      bookingTitle: "Настройки записи",
      bookingSubtitle:
        "Укажите правила, по которым клиенты будут записываться.",
      bookingDisabledTitle: "Запись отключена",
      bookingDisabledDescription:
        "Для этого типа аккаунта блок записи не используется.",
      slotLabel: "Длительность слота",
      bufferLabel: "Пауза между слотами",
      maxDaysAheadLabel: "Запись на дни вперед",
      minutesUnit: "мин",
      autoConfirmLabel: "Авто-подтверждение записи",
      requiredFieldsTitle: "Обязательные поля для ассистента",
      requiredFieldsSubtitle:
        "Выберите, какие поля ассистент обязан запросить перед созданием заказа или записи.",
      orderRequiredFieldsLabel: "Для заказа",
      appointmentRequiredFieldsLabel: "Для записи",
      requiredFieldClientName: "Имя клиента",
      requiredFieldPhone: "Телефон",
      requiredFieldService: "Услуга",
      requiredFieldAddress: "Адрес",
      requiredFieldAmount: "Сумма",
      requiredFieldNote: "Заметка",
      requiredFieldAppointmentDate: "Дата записи",
      requiredFieldAppointmentTime: "Время записи",
      requiredFieldAppointmentDuration: "Длительность записи",
      aiLanguagesTitle: "Языки ответов ИИ",
      aiLanguagesSubtitle:
        "Ассистент будет отвечать только на выбранных языках. Можно выбрать несколько.",
      aiLanguagesLabel: "Разрешенные языки",
      aiLanguageRequiredValidation: "Выберите минимум один язык для ответов ИИ.",
      aiLanguageRu: "Русский",
      aiLanguageEn: "Английский",
      aiLanguageTg: "Таджикский",
      aiLanguageUz: "Узбекский",
      aiLanguageTr: "Турецкий",
      aiLanguageFa: "Персидский",
      deliveryTitle: "Настройки доставки",
      deliverySubtitle:
        "Включите доставку и укажите правила, которые ассистент должен учитывать в диалоге.",
      deliveryEnabledLabel: "Доставка доступна для клиентов",
      deliveryRequireAddressLabel: "Адрес обязателен",
      deliveryRequireDateTimeLabel: "Время доставки обязательно",
      deliveryEtaLabel: "ETA по умолчанию (минуты)",
      deliveryFeeLabel: "Стоимость доставки",
      deliveryFreeFromLabel: "Бесплатно от суммы (опционально)",
      deliveryAvailableFromLabel: "Доставка с",
      deliveryAvailableToLabel: "Доставка до",
      deliveryNotesLabel: "Комментарий для ассистента (опционально)",
      invalidDeliveryRange:
        "Проверьте интервал доставки: время окончания должно быть позже времени начала.",
      invalidDeliveryFee: "Стоимость доставки должна быть числом не меньше 0.",
      invalidDeliveryFreeFromAmount:
        "Порог бесплатной доставки должен быть числом не меньше 0.",
      saveButton: "Сохранить настройки",
      loading: "Загружаем настройки компании...",
      loadFailed: "Не удалось загрузить настройки компании.",
      saveFailed: "Не удалось сохранить настройки компании.",
      saveSuccess: "Настройки компании сохранены.",
      unauthorized: "Сессия истекла. Войдите снова.",
      errorTitle: "Ошибка",
      successTitle: "Успешно",
    },
    billing: {
      title: "Подписка и платежи",
      subtitle: "Управляйте тарифом, лимитами и счетами компании.",
      pricePerPeriod: "/ месяц",
      usageProgress: "Использование",
      nextPaymentDate: "Следующий платеж",
      plansTitle: "Доступные тарифы",
      plansSubtitle: "Выберите тариф и количество пакетов.",
      renewSubscriptionTitle: "Продлить подписку",
      paymentMethodLabel: "Способ оплаты",
      choosePlanLabel: "Выберите тариф",
      totalToPayLabel: "К оплате",
      noPlansAvailable: "Тарифы пока недоступны.",
      premiumTitle: "Премиум",
      premiumDescription:
        "Безлимитные чаты, приоритетная поддержка и расширенная аналитика.",
      premiumAction: "Узнать больше",
      supportTitle: "Нужна помощь?",
      supportDescription: "Свяжитесь с нашей командой поддержки.",
      supportAction: "Написать в поддержку",
      currentSubscriptionTitle: "Текущая подписка",
      currentSubscriptionEmpty: "Подписка еще не активирована.",
      statusLabel: "Статус",
      quantityLabel: "Количество пакетов",
      cycleLabel: "Период",
      renewalLabel: "Продление",
      expiresLabel: "Истекает",
      usageTitle: "Лимиты и использование",
      includedChats: "Включено чатов",
      usedChats: "Использовано чатов",
      remainingChats: "Осталось чатов",
      overageChats: "Чатов сверх лимита",
      overagePrice: "Цена сверх лимита",
      assistantLimit: "Лимит ассистентов",
      integrationLimit: "Лимит интеграций",
      quantityInputLabel: "Количество",
      quantityRangeError: "Введите число от 1 до 50.",
      planFeaturesTitle: "В тариф входит",
      selectedPlan: "Выбрано",
      checkoutButton: "Выставить счет",
      checkoutProcessing: "Создаем счет...",
      updatePlanButton: "Обновить тарифный план",
      hidePlanUpdateButton: "Скрыть тарифы",
      creditAppliedLabel: "Списан остаток текущего тарифа",
      downgradeWarningTitle: "Подтверждение смены тарифа",
      downgradeWarningDescription:
        "Вы переходите на более дешевый тариф. Часть остатка текущего тарифа не переносится и не возвращается.",
      downgradeWarningForfeit: "Сумма, которая сгорит",
      downgradeCancelButton: "Отмена",
      downgradeConfirmButton: "Подтвердить смену",
      invoicesTitle: "Счета",
      invoicesSubtitle: "История выставленных счетов и оплаты.",
      invoiceNumber: "Номер",
      invoiceDate: "Дата",
      invoiceDue: "Оплатить до",
      invoiceTotal: "Сумма",
      invoiceStatus: "Статус",
      noInvoices: "Счета пока не выставлялись.",
      payButton: "Оплатить",
      payingButton: "Оплата...",
      refreshButton: "Обновить",
      statusActive: "Активна",
      statusPendingPayment: "Ожидает оплату",
      statusPending: "Ожидает подтверждения",
      statusInactive: "Неактивна",
      statusPastDue: "Просрочена",
      statusUnpaid: "Не оплачена",
      statusExpired: "Истекла",
      statusCanceled: "Отменена",
      statusIssued: "Выставлен",
      statusPaid: "Оплачен",
      statusOverdue: "Просрочен",
      statusFailed: "Ошибка оплаты",
      statusVoid: "Аннулирован",
      statusUnknown: "Неизвестно",
      checkoutCreated: "Счет создан. Завершите оплату для активации подписки.",
      paymentSessionCreated: "Переход к оплате через Alif.",
      paymentCompleted: "Оплата выполнена успешно.",
      paymentAlreadyCompleted: "Этот счет уже оплачен.",
      checkoutFailed: "Не удалось создать счет. Попробуйте снова.",
      loadFailed: "Не удалось загрузить данные подписки.",
      unauthorized: "Сессия истекла. Войдите снова.",
      errorTitle: "Ошибка",
      successTitle: "Успешно",
    },
    catalog: {
      title: "Продукты и услуги",
      subtitle: "Управляйте каталогом услуг и товаров для каждого ассистента.",
      assistantsTitle: "Ассистенты",
      assistantsSubtitle: "Выберите ассистента для настройки каталога.",
      backToAssistants: "Назад к ассистентам",
      noAssistants: "Ассистенты пока не созданы.",
      selectAssistant: "Выберите ассистента слева, чтобы открыть каталог.",
      selectedAssistantPrefix: "Ассистент",
      addService: "Добавить услугу",
      addProduct: "Добавить продукт",
      servicesTab: "Услуги",
      productsTab: "Продукты",
      emptyServices: "Услуги пока не добавлены.",
      emptyProducts: "Продукты пока не добавлены.",
      statusActive: "Активно",
      statusInactive: "Выключено",
      stockLabel: "Остаток",
      unlimitedStock: "Безлимитный остаток",
      newServiceTitle: "Новая услуга",
      editServiceTitle: "Редактировать услугу",
      newProductTitle: "Новый продукт",
      editProductTitle: "Редактировать продукт",
      nameLabel: "Название",
      skuLabel: "SKU (опционально)",
      priceLabel: "Цена",
      currencyLabel: "Валюта",
      sortOrderLabel: "Порядок сортировки",
      descriptionLabel: "Описание",
      termsLabel: "Условия (опционально)",
      photoUrlsLabel: "Ссылки на фото (каждая с новой строки)",
      specialistsTitle: "Специалисты",
      addSpecialist: "Добавить специалиста",
      noSpecialists: "Специалисты пока не добавлены.",
      specialistNameLabel: "Имя специалиста",
      specialistPriceLabel: "Цена специалиста",
      productLinkLabel: "Ссылка на продукт",
      openProductLink: "Открыть ссылку продукта",
      activeLabel: "Активно",
      unlimitedStockLabel: "Безлимитный остаток",
      saveButton: "Сохранить",
      validationName: "Название должно быть не короче 2 символов.",
      validationPrice: "Цена должна быть числом не меньше 0.",
      validationSortOrder: "Порядок сортировки должен быть числом не меньше 0.",
      validationStock: "Остаток должен быть числом не меньше 0.",
      validationSpecialistName: "Имя специалиста должно быть не короче 2 символов.",
      validationSpecialistPrice: "Цена специалиста должна быть числом не меньше 0.",
      validationProductLink: "Ссылка продукта должна быть корректным URL.",
      loadAssistantsFailed: "Не удалось загрузить ассистентов.",
      loadCatalogFailed: "Не удалось загрузить каталог.",
      saveFailed: "Не удалось сохранить данные каталога.",
      deleteFailed: "Не удалось удалить элемент каталога.",
      serviceCreated: "Услуга добавлена.",
      serviceUpdated: "Услуга обновлена.",
      serviceDeleted: "Услуга удалена.",
      productCreated: "Продукт добавлен.",
      productUpdated: "Продукт обновлен.",
      productDeleted: "Продукт удален.",
      unauthorized: "Сессия истекла. Войдите снова.",
      errorTitle: "Ошибка",
      successTitle: "Успешно",
    },
    clientChats: {
      title: "Чаты клиентов",
      subtitle: "Список диалогов по всем подключенным каналам.",
      allChatsTab: "Все",
      instagramTab: "Instagram",
      telegramTab: "Telegram",
      widgetTab: "Веб виджет",
      apiTab: "API",
      assistantTab: "Ассистент",
      searchPlaceholder: "Поиск по имени, сообщению или ID чата",
      loadingChats: "Загружаем чаты...",
      loadingMessages: "Загружаем сообщения...",
      emptyChats:
        "Чаты не найдены. Проверьте фильтры или дождитесь новых сообщений.",
      emptyMessages: "Сообщений пока нет.",
      noPreview: "Нет предпросмотра",
      backToList: "Назад к списку",
      channelLabel: "Канал",
      assistantTargetLabel: "Ассистент для теста",
      assistantAutoOption: "Авто",
      messagePlaceholder: "Введите сообщение...",
      askAssistantButton: "Спросить ассистента",
      sendButton: "Отправить вручную",
      selectChatTitle: "Выберите чат",
      selectChatDescription:
        "Выберите чат слева, чтобы открыть переписку и отправить сообщение.",
      senderCustomer: "Клиент",
      senderAssistant: "Ассистент",
      senderAgent: "Оператор",
      senderSystem: "Система",
      sentSuccess: "Сообщение отправлено.",
      assistantReplySuccess: "Ответ ассистента получен.",
      sendFailed: "Не удалось отправить сообщение.",
      assistantReplyFailed: "Не удалось получить ответ ассистента.",
      chatInfoButton: "Информация о чате",
      resetChatButton: "Сбросить чат",
      resetChatFailed: "Не удалось сбросить чат. Попробуйте снова.",
      chatInfoTitle: "Информация о чате",
      chatInfoDescription: "Детали клиента и история по этому диалогу.",
      chatInfoClient: "Клиент",
      chatInfoAiToggle: "AI-ответы для этого чата",
      chatInfoAiEnabled: "ИИ для этого чата включен",
      chatInfoAiDisabled: "ИИ для этого чата отключен",
      chatInfoContactsToggle: "Показать контакты клиента",
      chatInfoContactsTitle: "Контакты клиента",
      chatInfoNoContacts: "Контакты пока не добавлены.",
      chatInfoCreateOrderButton: "Создать заявку",
      orderModalTitle: "Создать заказ",
      orderModalPhoneLabel: "Номер телефона",
      orderModalPhonePlaceholder: "Введите номер телефона",
      orderModalServiceLabel: "Услуга",
      orderModalServicePlaceholder: "Например: Консультация",
      orderModalAddressLabel: "Адрес",
      orderModalAddressPlaceholder: "Введите адрес",
      orderModalAmountLabel: "Сумма (опционально)",
      orderModalAmountPlaceholder: "Например: 120.50",
      orderModalBookAppointmentSwitch: "Записать клиента",
      orderModalAppointmentDateLabel: "День записи",
      orderModalAppointmentTimeLabel: "Время записи",
      orderModalAppointmentDurationLabel: "Длительность",
      orderModalAppointmentDurationPlaceholder: "Например: 60",
      orderModalNoteLabel: "Заметка (опционально)",
      orderModalNotePlaceholder: "Комментарий к заказу",
      orderModalCancelButton: "Отмена",
      orderModalSubmitButton: "Создать заказ",
      orderModalRequiredFields: "Заполните номер телефона, услугу и адрес.",
      orderModalAppointmentRequiredFields:
        "Для записи заполните день, время и длительность.",
      orderModalInvalidAmount: "Сумма должна быть числом не меньше 0.",
      orderModalInvalidDuration:
        "Длительность должна быть числом от 15 до 720 минут.",
      chatInfoHistoryTitle: "История по чату",
      chatInfoNoHistory: "Связанных записей пока нет.",
      chatInfoHistoryJumpHint: "Нажмите, чтобы перейти к сообщению",
      historyTypeTask: "Заявка",
      historyTypeQuestion: "Вопрос",
      historyTypeOrder: "Заказ",
      orderCreated: "Заказ создан.",
      loadFailed: "Не удалось загрузить чаты.",
      unauthorized: "Сессия истекла. Войдите снова.",
      errorTitle: "Ошибка",
      successTitle: "Успешно",
    },
    clientRequests: {
      title: "Заявки клиентов",
      subtitle: "Канбан-доска для обработки клиентских заявок.",
      refreshButton: "Обновить",
      loading: "Загружаем заявки...",
      empty: "Заявок пока нет.",
      columnNew: "Новые",
      columnInProgress: "В обработке",
      columnAppointments: "Записи",
      columnCompleted: "Завершено",
      openChatButton: "Открыть чат",
      editButton: "Изменить",
      deleteButton: "Удалить",
      moveToProgressButton: "В обработку",
      moveToAppointmentsButton: "В записи",
      moveToCompletedButton: "Завершить",
      moveToConfirmedButton: "Подтвердить",
      moveToCourierButton: "Передать курьеру",
      moveToDeliveredButton: "Отметить доставленной",
      markCanceledButton: "Отменить",
      archiveButton: "Архивировать",
      reopenButton: "Вернуть в обработку",
      appointmentLabel: "Запись",
      noPhone: "Телефон не указан",
      noAddress: "Адрес не указан",
      amountLabel: "Сумма",
      serviceLabel: "Услуга",
      noteLabel: "Заметка",
      clientLabel: "Клиент",
      chatChannelLabel: "Канал",
      statusNew: "Новая",
      statusInProgress: "В обработке",
      statusAppointments: "Запись",
      statusCompleted: "Завершена",
      statusConfirmed: "Подтверждено",
      statusCanceled: "Отменено",
      statusHandedToCourier: "Передан курьеру",
      statusDelivered: "Доставлено",
      editModalTitle: "Редактировать заявку",
      editModalSave: "Сохранить",
      editModalCancel: "Отмена",
      editStatusLabel: "Статус",
      editClientNameLabel: "Имя клиента",
      editPhoneLabel: "Телефон",
      editServiceLabel: "Услуга",
      editAddressLabel: "Адрес",
      editAmountLabel: "Сумма",
      editNoteLabel: "Заметка",
      editBookingSwitch: "Записать клиента",
      editAppointmentDateLabel: "День записи",
      editAppointmentTimeLabel: "Время записи",
      editAppointmentDurationLabel: "Длительность (мин)",
      editAppointmentDurationPlaceholder: "Например: 60",
      requiredFields: "Заполните имя клиента, телефон и услугу.",
      invalidAmount: "Сумма должна быть числом не меньше 0.",
      invalidDuration: "Длительность должна быть числом от 15 до 720 минут.",
      appointmentRequired: "Для записи заполните день, время и длительность.",
      updateSuccess: "Заявка обновлена.",
      updateFailed: "Не удалось обновить заявку.",
      deleteSuccess: "Заявка удалена.",
      deleteFailed: "Не удалось удалить заявку.",
      unauthorized: "Сессия истекла. Войдите снова.",
      errorTitle: "Ошибка",
      successTitle: "Успешно",
    },
    clientBase: {
      title: "База клиентов",
      subtitle: "Клиенты компании, контакты и полная история взаимодействий.",
      searchPlaceholder: "Поиск по имени, телефону или email",
      refreshButton: "Обновить",
      statusAll: "Все",
      statusActive: "Активные",
      statusArchived: "Архив",
      statusBlocked: "Заблокированные",
      loading: "Загружаем базу клиентов...",
      empty: "Клиенты пока не найдены.",
      viewHistoryButton: "История клиента",
      statsOrders: "Заказы",
      statsAppointments: "Записи",
      statsTasks: "Заявки",
      statsQuestions: "Вопросы",
      totalSpent: "Сумма заказов",
      lastContact: "Последний контакт",
      lastRequest: "Последняя заявка",
      lastQuestion: "Последний вопрос",
      phoneLabel: "Телефон",
      emailLabel: "Email",
      notesLabel: "Заметка",
      statusLabel: "Статус",
      modalTitle: "История клиента",
      modalSubtitle: "Заказы, записи, заявки и вопросы по выбранному клиенту.",
      modalLoading: "Загружаем историю клиента...",
      timelineTab: "Общая история",
      ordersTab: "Заказы",
      appointmentsTab: "Записи",
      tasksTab: "Заявки",
      questionsTab: "Вопросы",
      noTimeline: "История пока пустая.",
      noOrders: "Заказов пока нет.",
      noAppointments: "Записей пока нет.",
      noTasks: "Заявок пока нет.",
      noQuestions: "Вопросов пока нет.",
      historyTypeOrder: "Заказ",
      historyTypeAppointment: "Запись",
      historyTypeTask: "Заявка",
      historyTypeQuestion: "Вопрос",
      orderServiceLabel: "Услуга",
      orderAmountLabel: "Сумма",
      orderStatusLabel: "Статус заказа",
      appointmentDateLabel: "Дата и время",
      appointmentStatusLabel: "Статус записи",
      taskStatusLabel: "Статус заявки",
      taskPriorityLabel: "Приоритет",
      questionStatusLabel: "Статус вопроса",
      loadFailed: "Не удалось загрузить базу клиентов.",
      detailsFailed: "Не удалось загрузить историю клиента.",
      unauthorized: "Сессия истекла. Войдите снова.",
      errorTitle: "Ошибка",
    },
    integrations: {
      title: "Интеграции",
      subtitle: "Подключайте каналы к ассистентам и управляйте их активностью.",
      assistantsTitle: "Ассистенты",
      assistantsSubtitle: "Выберите ассистента для настройки интеграций.",
      channelsTitle: "Каналы интеграции",
      channelsSubtitle:
        "Включайте или отключайте каналы для выбранного ассистента.",
      selectAssistantTitle: "Выберите ассистента",
      selectAssistantDescription:
        "Выберите ассистента слева, чтобы открыть настройки Instagram, Telegram, веб-виджета и API.",
      backToAssistants: "Назад к ассистентам",
      noAssistants: "Ассистенты пока не созданы.",
      loadingAssistants: "Загружаем ассистентов...",
      loadingChannels: "Загружаем интеграции...",
      assistantRunning: "Запущен",
      assistantStopped: "Остановлен",
      activeIntegrationsLabel: "Активные интеграции",
      integrationLimitLabel: "Лимит",
      statusEnabled: "Включено",
      statusDisabled: "Отключено",
      channelInstagram: "Instagram",
      channelTelegram: "Telegram",
      channelWidget: "Веб-виджет",
      channelApi: "API",
      channelInstagramDescription:
        "Принимайте и отправляйте сообщения из Instagram.",
      channelTelegramDescription: "Работайте с клиентами через Telegram Bot.",
      channelWidgetDescription: "Подключите чат-виджет для сайта компании.",
      channelApiDescription: "Интеграция через API для внешних систем.",
      accountLabel: "Аккаунт",
      noConnection: "Канал пока не подключен.",
      connectButton: "Подключить",
      disconnectButton: "Отключить",
      toggleLabel: "Статус канала",
      telegramTokenModalTitle: "Подключение Telegram Bot",
      telegramTokenModalDescription:
        "Вставьте токен Telegram бота. Система проверит токен и автоматически установит webhook.",
      telegramTokenLabel: "Токен бота",
      telegramTokenPlaceholder: "Например: 123456789:AA...",
      telegramTokenRequired: "Введите токен Telegram бота.",
      loadFailed: "Не удалось загрузить интеграции.",
      updateFailed: "Не удалось обновить состояние интеграции.",
      unauthorized: "Сессия истекла. Войдите снова.",
      errorTitle: "Ошибка",
      successTitle: "Успешно",
    },
    assistantTraining: {
      title: "Обучение ассистента",
      subtitle:
        "Настройте инструкции, ограничения, ответы и инструменты ассистента.",
      trainingTitle: "Настройки и обучение",
      listTitle: "Ассистенты",
      limitLabel: "Лимит ассистентов",
      createButton: "Создать",
      createModalTitle: "Создать ассистента",
      createModalNameLabel: "Имя ассистента",
      createModalNamePlaceholder: "Например: Ассистент продаж",
      createModalCancel: "Отмена",
      createModalCreate: "Создать",
      noAssistants: "Ассистенты еще не созданы.",
      selectAssistantTitle: "Выберите ассистента",
      selectAssistantHint:
        "Выберите ассистента из списка, чтобы открыть настройки обучения.",
      backToAssistantsButton: "Назад",
      nameLabel: "Имя ассистента",
      nameValidation: "Имя ассистента должно быть не короче 2 символов.",
      instructionsLabel: "Инструкции",
      restrictionsLabel: "Ограничения",
      toneLabel: "Тон разговора",
      tonePolite: "Вежливый",
      toneFriendly: "Дружелюбный",
      toneConcise: "Короткий",
      toneFormal: "Формальный",
      toneCustom: "Кастомный",
      settingsTitle: "Настройки",
      fileSearchLabel: "Поиск по файлам",
      fileAnalysisLabel: "Анализ файлов",
      voiceLabel: "Голосовой режим",
      webSearchLabel: "Веб-поиск",
      triggersTitle: "Триггеры: вопрос -> ответ",
      addTriggerButton: "Добавить триггер",
      noTriggers: "Триггеры пока не добавлены.",
      triggerLabel: "Триггер",
      triggerResponseLabel: "Ответ на триггер",
      removeTriggerButton: "Удалить триггер",
      filesTitle: "Файлы для инструкций",
      uploadFilesButton: "Загрузить файлы",
      noFiles: "Файлы инструкций пока не добавлены.",
      openFileButton: "Открыть",
      deleteFileButton: "Удалить файл",
      saveButton: "Сохранить изменения",
      saveSuccess: "Настройки ассистента сохранены.",
      saveFailed: "Не удалось сохранить настройки ассистента.",
      createSuccess: "Ассистент создан.",
      createFailed: "Не удалось создать ассистента.",
      startButton: "Старт",
      stopButton: "Стоп",
      deleteButton: "Удалить",
      startSuccess: "Ассистент запущен.",
      stopSuccess: "Ассистент остановлен.",
      deleteSuccess: "Ассистент удален.",
      actionFailed: "Не удалось выполнить действие с ассистентом.",
      statusRunning: "Запущен",
      statusStopped: "Остановлен",
      inactiveSubscriptionTitle: "Подписка неактивна",
      inactiveSubscriptionDescription:
        "Создание и запуск ассистентов доступны только при активной подписке.",
      limitReachedTitle: "Лимит достигнут",
      limitReachedDescription:
        "Для создания нового ассистента обновите тариф или удалите текущий ассистент.",
      deleteModalTitle: "Удаление ассистента",
      deleteModalDescription:
        "Вы уверены, что хотите удалить ассистента? Это действие необратимо.",
      deleteModalCancel: "Отмена",
      deleteModalConfirm: "Удалить",
      loading: "Загружаем ассистентов...",
      unauthorized: "Сессия истекла. Войдите снова.",
      loadFailed: "Не удалось загрузить данные ассистентов.",
      errorTitle: "Ошибка",
      successTitle: "Успешно",
      warningTitle: "Внимание",
      filesUploadedSuccess: "Файлы успешно загружены.",
      fileDeletedSuccess: "Файл удален.",
    },
  },
  en: {
    app: {
      name: "Lido",
      tagline: "AI Lead Processing Assistant",
    },
    common: {
      loadingSession: "Checking session...",
      separatorOr: "OR",
      cancel: "Cancel",
      language: {
        ru: "RU",
        en: "EN",
      },
    },
    auth: {
      loginTitle: "Login",
      welcomeBack: "Welcome back!",
      subtitle: "Enter your credentials to sign in",
      loginLabel: "Email or phone",
      loginPlaceholder: "Enter email or phone",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter password",
      passwordRulesHint:
        "Use at least 10 chars with letters, a number, and a symbol.",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      forgotPasswordTitle: "Reset password",
      forgotPasswordSubtitle:
        "Enter your email. We will send a temporary password for sign in.",
      forgotPasswordEmailLabel: "Email",
      forgotPasswordEmailPlaceholder: "Enter email",
      forgotPasswordButton: "Send temporary password",
      forgotPasswordSuccess:
        "If the account exists, a temporary password has been sent to your email.",
      forgotPasswordFailed: "Failed to reset password. Please try again later.",
      tooManyPasswordResetRequests:
        "Too many password reset requests. Please try again later.",
      loginButton: "Sign In",
      noAccount: "Don't have an account?",
      signUp: "Sign Up",
      haveAccount: "Already have an account?",
      signIn: "Sign In",
      registerTitle: "Registration",
      registerSubtitle: "Create your account and verify email with a code.",
      nameLabel: "Name",
      namePlaceholder: "Enter your name",
      emailLabel: "Email",
      emailPlaceholder: "Enter email",
      phoneLabel: "Phone",
      phonePlaceholder: "Enter phone in +12345678900 format",
      confirmPasswordLabel: "Confirm password",
      confirmPasswordPlaceholder: "Repeat your password",
      registerButton: "Create account",
      verifyTitle: "Email verification",
      verifySubtitle: "Enter the 6-digit code sent to your email.",
      verifyButton: "Verify code",
      codeLabel: "Enter verification code",
      codePlaceholder: "Enter 6 digits",
      resendCode: "Resend code",
      resendCodeIn: "Resend available in",
      backToLogin: "Back to login",
      backToRegister: "Back to registration",
      continueWithGoogle: "Continue with Google",
      continueWithGithub: "Continue with Github",
      requiredCredentials: "Enter email/phone and password.",
      errorTitle: "Error",
      successTitle: "Success",
      loginFailed: "Failed to sign in. Please try again.",
      socialLoginFailed: "Failed to start social login.",
      requiredRegisterFields: "Please fill in all required fields.",
      invalidName: "Name must be at least 2 characters long.",
      invalidEmail: "Enter a valid email address.",
      invalidPhone: "Phone must be in international format, e.g. +12345678900.",
      invalidLoginIdentifier:
        "Enter a valid email or an international phone number.",
      passwordTooShort: "Password must be longer than 6 characters.",
      weakPassword:
        "Password is too weak. Use at least 10 characters, uppercase/lowercase letters, a number, and a symbol.",
      passwordMismatch: "Passwords do not match.",
      registerFailed: "Failed to register. Check your data and try again.",
      registerSuccess:
        "Registration completed. Check your email and enter verification code.",
      verifyCodeRequired: "Enter verification code.",
      verificationEmailMissing:
        "Verification email is missing. Go back to registration or login.",
      invalidVerificationCode: "Code must contain exactly 6 digits.",
      verificationFailed:
        "Email verification failed. Check the code and try again.",
      verificationSuccess: "Email verified. You are signed in.",
      resendFailed: "Failed to resend code. Please try later.",
      redirectToVerify:
        "Email is not verified. Continue with verification code.",
      tooManyVerificationAttempts:
        "Too many verification attempts. Please try again later.",
      tooManyResendRequests: "Too many resend requests. Try again later.",
      tooManyLoginAttempts: "Too many login attempts. Please try again later.",
      tooManyRegistrationAttempts:
        "Too many registration attempts. Please try again later.",
      verificationCodeExpired:
        "Verification code has expired. Request a new code.",
      verificationAttemptsExceeded:
        "Verification attempts exceeded. Request a new code.",
      verificationCodeInvalidOrExpired:
        "Verification code is invalid or expired.",
      waitBeforeNewCode: "Please wait before requesting a new code.",
      invalidCredentials: "Invalid credentials.",
      userInactive: "User is inactive.",
      emailNotVerified: "Email is not verified.",
      emailAlreadyVerified: "Email is already verified.",
      emailAlreadyVerifiedPleaseLogin:
        "Email is already verified. Please login.",
      verificationCodeSent: "Verification code sent.",
      accountMayExistVerificationCodeSent:
        "If the account exists, a verification code has been sent.",
      registrationCreatedVerificationCodeSent:
        "Registration created. Verification code sent to your email.",
      emailVerifiedSuccessfully: "Email verified successfully.",
      emailAlreadyTaken: "The email has already been taken.",
      phoneAlreadyTaken: "The phone has already been taken.",
      accountUnderModeration: "Your account is under moderation.",
      moderationTitle: "Account under moderation",
      moderationSubtitle:
        "Your account is under moderation. We will notify you by email once approved.",
      moderationAlertTitle: "Pending approval",
      moderationAlertDescription:
        "Please wait while your account is being reviewed.",
      moderationRefresh: "Refresh",
      moderationLogout: "Logout",
      resetNotReady: "Password reset is not connected yet.",
    },
    home: {
      badge: "Home",
      title: "Welcome",
      signedInAs: "Signed in as",
      profile: "Profile",
      settings: "Settings",
      notifications: "Notifications",
      logout: "Logout",
    },
    profile: {
      title: "Profile",
      subtitle: "Manage your account personal information",
      avatarTitle: "Profile photo",
      avatarHint: "Upload JPG, PNG, WEBP or AVIF up to 4 MB.",
      uploadAvatar: "Upload photo",
      removeAvatar: "Remove photo",
      nameLabel: "Name",
      namePlaceholder: "Enter your name",
      emailLabel: "Email",
      phoneLabel: "Phone",
      emailReadonlyHint: "Email cannot be changed.",
      phoneReadonlyHint: "Phone cannot be changed.",
      phoneNotSet: "Not set",
      passwordSectionTitle: "Change password",
      currentPasswordLabel: "Current password",
      currentPasswordPlaceholder: "Enter current password",
      newPasswordLabel: "New password",
      newPasswordPlaceholder: "Enter new password",
      confirmPasswordLabel: "Confirm new password",
      confirmPasswordPlaceholder: "Repeat new password",
      saveButton: "Save changes",
      successTitle: "Saved",
      errorTitle: "Error",
      nameRequired: "Enter your name.",
      nameInvalid: "Name must be at least 2 characters long.",
      avatarInvalidType: "Select an image file.",
      avatarTooLarge: "File size must not exceed 4 MB.",
      currentPasswordRequired: "Enter current password.",
      newPasswordRequired: "Enter new password.",
      confirmPasswordRequired: "Confirm new password.",
      currentPasswordInvalid: "Current password is incorrect.",
      newPasswordDifferent: "New password must differ from current password.",
      profileUpdated: "Profile updated successfully.",
      updateFailed: "Failed to update profile. Please try again.",
    },
    businessSettings: {
      title: "Business Settings",
      subtitle: "Manage company profile and booking workflow configuration.",
      profileTitle: "Company profile",
      accountTypeLabel: "Account type",
      accountTypeWithAppointments: "With appointments",
      accountTypeWithoutAppointments: "Without appointments",
      nameLabel: "Company name",
      nameValidation: "Company name must be at least 2 characters long.",
      shortDescriptionLabel: "Short description",
      industryLabel: "Industry",
      primaryGoalLabel: "Primary goal",
      contactEmailLabel: "Contact email",
      contactPhoneLabel: "Contact phone",
      websiteLabel: "Website",
      addressLabel: "Address",
      timezoneLabel: "Timezone",
      currencyLabel: "Currency",
      timezonePlaceholder: "For example: Asia/Dushanbe",
      workingHoursLabel: "Working hours",
      scheduleTitle: "Weekly schedule",
      scheduleSubtitle:
        "For each day, choose working hours or mark it as a day off.",
      invalidScheduleRange:
        "Check schedule: for a working day, end time must be later than start time.",
      dayOffLabel: "Day off",
      startTimeLabel: "Start",
      endTimeLabel: "End",
      mondayLabel: "Monday",
      tuesdayLabel: "Tuesday",
      wednesdayLabel: "Wednesday",
      thursdayLabel: "Thursday",
      fridayLabel: "Friday",
      saturdayLabel: "Saturday",
      sundayLabel: "Sunday",
      bookingTitle: "Booking settings",
      bookingSubtitle: "Configure how customers can book appointments.",
      bookingDisabledTitle: "Booking is disabled",
      bookingDisabledDescription:
        "Appointment options are not used for this account type.",
      slotLabel: "Slot duration",
      bufferLabel: "Buffer between slots",
      maxDaysAheadLabel: "Booking days ahead",
      minutesUnit: "min",
      autoConfirmLabel: "Auto-confirm bookings",
      requiredFieldsTitle: "Assistant required fields",
      requiredFieldsSubtitle:
        "Choose which fields the assistant must collect before creating an order or appointment.",
      orderRequiredFieldsLabel: "For orders",
      appointmentRequiredFieldsLabel: "For appointments",
      requiredFieldClientName: "Client name",
      requiredFieldPhone: "Phone",
      requiredFieldService: "Service",
      requiredFieldAddress: "Address",
      requiredFieldAmount: "Amount",
      requiredFieldNote: "Note",
      requiredFieldAppointmentDate: "Appointment date",
      requiredFieldAppointmentTime: "Appointment time",
      requiredFieldAppointmentDuration: "Appointment duration",
      aiLanguagesTitle: "AI response languages",
      aiLanguagesSubtitle:
        "The assistant will answer only in selected languages. Multiple languages are supported.",
      aiLanguagesLabel: "Allowed languages",
      aiLanguageRequiredValidation: "Select at least one language for AI responses.",
      aiLanguageRu: "Russian",
      aiLanguageEn: "English",
      aiLanguageTg: "Tajik",
      aiLanguageUz: "Uzbek",
      aiLanguageTr: "Turkish",
      aiLanguageFa: "Persian",
      deliveryTitle: "Delivery settings",
      deliverySubtitle:
        "Enable delivery and configure rules the assistant should follow in chat.",
      deliveryEnabledLabel: "Delivery is available for customers",
      deliveryRequireAddressLabel: "Address is required",
      deliveryRequireDateTimeLabel: "Delivery date/time is required",
      deliveryEtaLabel: "Default ETA (minutes)",
      deliveryFeeLabel: "Delivery fee",
      deliveryFreeFromLabel: "Free from amount (optional)",
      deliveryAvailableFromLabel: "Delivery from",
      deliveryAvailableToLabel: "Delivery until",
      deliveryNotesLabel: "Assistant note (optional)",
      invalidDeliveryRange:
        "Check delivery window: end time must be later than start time.",
      invalidDeliveryFee: "Delivery fee must be a number greater than or equal to 0.",
      invalidDeliveryFreeFromAmount:
        "Free-delivery threshold must be a number greater than or equal to 0.",
      saveButton: "Save settings",
      loading: "Loading company settings...",
      loadFailed: "Failed to load company settings.",
      saveFailed: "Failed to save company settings.",
      saveSuccess: "Company settings saved.",
      unauthorized: "Session expired. Please sign in again.",
      errorTitle: "Error",
      successTitle: "Success",
    },
    billing: {
      title: "Subscription and Billing",
      subtitle: "Manage company plan, limits, and invoices.",
      pricePerPeriod: "/ month",
      usageProgress: "Usage",
      nextPaymentDate: "Next payment",
      plansTitle: "Available plans",
      plansSubtitle: "Select a plan and package quantity.",
      renewSubscriptionTitle: "Renew subscription",
      paymentMethodLabel: "Payment method",
      choosePlanLabel: "Choose plan",
      totalToPayLabel: "Total to pay",
      noPlansAvailable: "No plans are available now.",
      premiumTitle: "Premium",
      premiumDescription:
        "Unlimited chats, priority support, and advanced analytics.",
      premiumAction: "Learn more",
      supportTitle: "Need help?",
      supportDescription: "Contact our support team.",
      supportAction: "Contact support",
      currentSubscriptionTitle: "Current subscription",
      currentSubscriptionEmpty: "Subscription is not activated yet.",
      statusLabel: "Status",
      quantityLabel: "Package quantity",
      cycleLabel: "Billing period",
      renewalLabel: "Renewal",
      expiresLabel: "Expires",
      usageTitle: "Limits and usage",
      includedChats: "Included chats",
      usedChats: "Used chats",
      remainingChats: "Remaining chats",
      overageChats: "Overage chats",
      overagePrice: "Overage price",
      assistantLimit: "Assistant limit",
      integrationLimit: "Integrations per channel",
      quantityInputLabel: "Quantity",
      quantityRangeError: "Enter a value from 1 to 50.",
      planFeaturesTitle: "Plan includes",
      selectedPlan: "Selected",
      checkoutButton: "Create invoice",
      checkoutProcessing: "Creating invoice...",
      updatePlanButton: "Update plan",
      hidePlanUpdateButton: "Hide plans",
      creditAppliedLabel: "Unused current plan credit",
      downgradeWarningTitle: "Confirm plan change",
      downgradeWarningDescription:
        "You are switching to a cheaper plan. Part of your current plan balance will be forfeited and is non-refundable.",
      downgradeWarningForfeit: "Amount to be forfeited",
      downgradeCancelButton: "Cancel",
      downgradeConfirmButton: "Confirm change",
      invoicesTitle: "Invoices",
      invoicesSubtitle: "Issued invoices and payment history.",
      invoiceNumber: "Number",
      invoiceDate: "Date",
      invoiceDue: "Due date",
      invoiceTotal: "Amount",
      invoiceStatus: "Status",
      noInvoices: "No invoices yet.",
      payButton: "Pay now",
      payingButton: "Processing...",
      refreshButton: "Refresh",
      statusActive: "Active",
      statusPendingPayment: "Pending payment",
      statusPending: "Pending confirmation",
      statusInactive: "Inactive",
      statusPastDue: "Past due",
      statusUnpaid: "Unpaid",
      statusExpired: "Expired",
      statusCanceled: "Canceled",
      statusIssued: "Issued",
      statusPaid: "Paid",
      statusOverdue: "Overdue",
      statusFailed: "Payment failed",
      statusVoid: "Voided",
      statusUnknown: "Unknown",
      checkoutCreated:
        "Invoice created. Complete payment to activate subscription.",
      paymentSessionCreated: "Redirecting to Alif payment.",
      paymentCompleted: "Payment completed successfully.",
      paymentAlreadyCompleted: "This invoice is already paid.",
      checkoutFailed: "Failed to create invoice. Please try again.",
      loadFailed: "Failed to load subscription data.",
      unauthorized: "Session expired. Please sign in again.",
      errorTitle: "Error",
      successTitle: "Success",
    },
    catalog: {
      title: "Products and Services",
      subtitle: "Manage products and services for each assistant.",
      assistantsTitle: "Assistants",
      assistantsSubtitle: "Select an assistant to manage catalog items.",
      backToAssistants: "Back to assistants",
      noAssistants: "No assistants created yet.",
      selectAssistant: "Select an assistant from the left to open catalog settings.",
      selectedAssistantPrefix: "Assistant",
      addService: "Add service",
      addProduct: "Add product",
      servicesTab: "Services",
      productsTab: "Products",
      emptyServices: "No services yet.",
      emptyProducts: "No products yet.",
      statusActive: "Active",
      statusInactive: "Inactive",
      stockLabel: "Stock",
      unlimitedStock: "Unlimited stock",
      newServiceTitle: "New service",
      editServiceTitle: "Edit service",
      newProductTitle: "New product",
      editProductTitle: "Edit product",
      nameLabel: "Name",
      skuLabel: "SKU (optional)",
      priceLabel: "Price",
      currencyLabel: "Currency",
      sortOrderLabel: "Sort order",
      descriptionLabel: "Description",
      termsLabel: "Terms (optional)",
      photoUrlsLabel: "Photo URLs (one per line)",
      specialistsTitle: "Specialists",
      addSpecialist: "Add specialist",
      noSpecialists: "No specialists added yet.",
      specialistNameLabel: "Specialist name",
      specialistPriceLabel: "Specialist price",
      productLinkLabel: "Product link",
      openProductLink: "Open product link",
      activeLabel: "Active",
      unlimitedStockLabel: "Unlimited stock",
      saveButton: "Save",
      validationName: "Name must be at least 2 characters.",
      validationPrice: "Price must be a number greater than or equal to 0.",
      validationSortOrder: "Sort order must be a number greater than or equal to 0.",
      validationStock: "Stock must be a number greater than or equal to 0.",
      validationSpecialistName: "Specialist name must be at least 2 characters.",
      validationSpecialistPrice: "Specialist price must be a number greater than or equal to 0.",
      validationProductLink: "Product link must be a valid URL.",
      loadAssistantsFailed: "Failed to load assistants.",
      loadCatalogFailed: "Failed to load catalog.",
      saveFailed: "Failed to save catalog item.",
      deleteFailed: "Failed to delete catalog item.",
      serviceCreated: "Service created.",
      serviceUpdated: "Service updated.",
      serviceDeleted: "Service deleted.",
      productCreated: "Product created.",
      productUpdated: "Product updated.",
      productDeleted: "Product deleted.",
      unauthorized: "Session expired. Please sign in again.",
      errorTitle: "Error",
      successTitle: "Success",
    },
    clientChats: {
      title: "Client Chats",
      subtitle: "Unified inbox for all connected channels.",
      allChatsTab: "All",
      instagramTab: "Instagram",
      telegramTab: "Telegram",
      widgetTab: "Web widget",
      apiTab: "API",
      assistantTab: "Assistant",
      searchPlaceholder: "Search by name, message, or chat ID",
      loadingChats: "Loading chats...",
      loadingMessages: "Loading messages...",
      emptyChats: "No chats found. Adjust filters or wait for new messages.",
      emptyMessages: "No messages yet.",
      noPreview: "No preview",
      backToList: "Back to list",
      channelLabel: "Channel",
      assistantTargetLabel: "Assistant for test",
      assistantAutoOption: "Auto",
      messagePlaceholder: "Type your message...",
      askAssistantButton: "Ask assistant",
      sendButton: "Send manually",
      selectChatTitle: "Select a chat",
      selectChatDescription:
        "Pick a chat from the list to open the conversation and send messages.",
      senderCustomer: "Customer",
      senderAssistant: "Assistant",
      senderAgent: "Operator",
      senderSystem: "System",
      sentSuccess: "Message sent.",
      assistantReplySuccess: "Assistant response received.",
      sendFailed: "Failed to send message.",
      assistantReplyFailed: "Failed to get assistant response.",
      chatInfoButton: "Chat info",
      resetChatButton: "Reset chat",
      resetChatFailed: "Failed to reset chat. Please try again.",
      chatInfoTitle: "Chat information",
      chatInfoDescription: "Client details and history for this dialog.",
      chatInfoClient: "Client",
      chatInfoAiToggle: "AI replies for this chat",
      chatInfoAiEnabled: "AI is enabled for this chat",
      chatInfoAiDisabled: "AI is disabled for this chat",
      chatInfoContactsToggle: "Show client contacts",
      chatInfoContactsTitle: "Client contacts",
      chatInfoNoContacts: "No contacts provided yet.",
      chatInfoCreateOrderButton: "Create lead",
      orderModalTitle: "Create order",
      orderModalPhoneLabel: "Phone",
      orderModalPhonePlaceholder: "Enter phone number",
      orderModalServiceLabel: "Service",
      orderModalServicePlaceholder: "For example: Consultation",
      orderModalAddressLabel: "Address",
      orderModalAddressPlaceholder: "Enter address",
      orderModalAmountLabel: "Amount (optional)",
      orderModalAmountPlaceholder: "For example: 120.50",
      orderModalBookAppointmentSwitch: "Book customer appointment",
      orderModalAppointmentDateLabel: "Appointment date",
      orderModalAppointmentTimeLabel: "Appointment time",
      orderModalAppointmentDurationLabel: "Duration (minutes)",
      orderModalAppointmentDurationPlaceholder: "For example: 60",
      orderModalNoteLabel: "Note (optional)",
      orderModalNotePlaceholder: "Order comment",
      orderModalCancelButton: "Cancel",
      orderModalSubmitButton: "Create order",
      orderModalRequiredFields: "Fill in phone, service and address.",
      orderModalAppointmentRequiredFields:
        "Fill in appointment date, time and duration.",
      orderModalInvalidAmount:
        "Amount must be a number greater than or equal to 0.",
      orderModalInvalidDuration:
        "Duration must be a number between 15 and 720 minutes.",
      chatInfoHistoryTitle: "Chat history",
      chatInfoNoHistory: "No linked records yet.",
      chatInfoHistoryJumpHint: "Click to jump to message",
      historyTypeTask: "Task",
      historyTypeQuestion: "Question",
      historyTypeOrder: "Order",
      orderCreated: "Order created.",
      loadFailed: "Failed to load chats.",
      unauthorized: "Session expired. Please sign in again.",
      errorTitle: "Error",
      successTitle: "Success",
    },
    clientRequests: {
      title: "Client requests",
      subtitle: "Kanban board for processing customer requests.",
      refreshButton: "Refresh",
      loading: "Loading requests...",
      empty: "No requests yet.",
      columnNew: "New",
      columnInProgress: "In progress",
      columnAppointments: "Appointments",
      columnCompleted: "Completed",
      openChatButton: "Open chat",
      editButton: "Edit",
      deleteButton: "Delete",
      moveToProgressButton: "Move to progress",
      moveToAppointmentsButton: "Move to appointments",
      moveToCompletedButton: "Complete",
      moveToConfirmedButton: "Confirm",
      moveToCourierButton: "Hand to courier",
      moveToDeliveredButton: "Mark delivered",
      markCanceledButton: "Cancel",
      archiveButton: "Archive",
      reopenButton: "Reopen",
      appointmentLabel: "Appointment",
      noPhone: "No phone",
      noAddress: "No address",
      amountLabel: "Amount",
      serviceLabel: "Service",
      noteLabel: "Note",
      clientLabel: "Client",
      chatChannelLabel: "Channel",
      statusNew: "New",
      statusInProgress: "In progress",
      statusAppointments: "Appointment",
      statusCompleted: "Completed",
      statusConfirmed: "Confirmed",
      statusCanceled: "Canceled",
      statusHandedToCourier: "Handed to courier",
      statusDelivered: "Delivered",
      editModalTitle: "Edit request",
      editModalSave: "Save",
      editModalCancel: "Cancel",
      editStatusLabel: "Status",
      editClientNameLabel: "Client name",
      editPhoneLabel: "Phone",
      editServiceLabel: "Service",
      editAddressLabel: "Address",
      editAmountLabel: "Amount",
      editNoteLabel: "Note",
      editBookingSwitch: "Book customer appointment",
      editAppointmentDateLabel: "Appointment date",
      editAppointmentTimeLabel: "Appointment time",
      editAppointmentDurationLabel: "Duration (minutes)",
      editAppointmentDurationPlaceholder: "For example: 60",
      requiredFields: "Fill in client name, phone and service.",
      invalidAmount: "Amount must be a number greater than or equal to 0.",
      invalidDuration: "Duration must be a number between 15 and 720 minutes.",
      appointmentRequired: "Fill in appointment date, time and duration.",
      updateSuccess: "Request updated.",
      updateFailed: "Failed to update request.",
      deleteSuccess: "Request deleted.",
      deleteFailed: "Failed to delete request.",
      unauthorized: "Session expired. Please sign in again.",
      errorTitle: "Error",
      successTitle: "Success",
    },
    clientBase: {
      title: "Client base",
      subtitle: "Company customers, contacts, and full interaction history.",
      searchPlaceholder: "Search by name, phone, or email",
      refreshButton: "Refresh",
      statusAll: "All",
      statusActive: "Active",
      statusArchived: "Archived",
      statusBlocked: "Blocked",
      loading: "Loading client base...",
      empty: "No clients found yet.",
      viewHistoryButton: "Client history",
      statsOrders: "Orders",
      statsAppointments: "Appointments",
      statsTasks: "Tasks",
      statsQuestions: "Questions",
      totalSpent: "Total orders",
      lastContact: "Last contact",
      lastRequest: "Last request",
      lastQuestion: "Last question",
      phoneLabel: "Phone",
      emailLabel: "Email",
      notesLabel: "Note",
      statusLabel: "Status",
      modalTitle: "Client history",
      modalSubtitle: "Orders, appointments, tasks, and questions for this client.",
      modalLoading: "Loading client history...",
      timelineTab: "Timeline",
      ordersTab: "Orders",
      appointmentsTab: "Appointments",
      tasksTab: "Tasks",
      questionsTab: "Questions",
      noTimeline: "No timeline records yet.",
      noOrders: "No orders yet.",
      noAppointments: "No appointments yet.",
      noTasks: "No tasks yet.",
      noQuestions: "No questions yet.",
      historyTypeOrder: "Order",
      historyTypeAppointment: "Appointment",
      historyTypeTask: "Task",
      historyTypeQuestion: "Question",
      orderServiceLabel: "Service",
      orderAmountLabel: "Amount",
      orderStatusLabel: "Order status",
      appointmentDateLabel: "Date and time",
      appointmentStatusLabel: "Appointment status",
      taskStatusLabel: "Task status",
      taskPriorityLabel: "Priority",
      questionStatusLabel: "Question status",
      loadFailed: "Failed to load client base.",
      detailsFailed: "Failed to load client history.",
      unauthorized: "Session expired. Please sign in again.",
      errorTitle: "Error",
    },
    integrations: {
      title: "Integrations",
      subtitle: "Connect channels to assistants and control channel activity.",
      assistantsTitle: "Assistants",
      assistantsSubtitle: "Select an assistant to configure integrations.",
      channelsTitle: "Integration channels",
      channelsSubtitle:
        "Enable or disable channels for the selected assistant.",
      selectAssistantTitle: "Select an assistant",
      selectAssistantDescription:
        "Choose an assistant from the left side to configure Instagram, Telegram, web widget, and API channels.",
      backToAssistants: "Back to assistants",
      noAssistants: "No assistants created yet.",
      loadingAssistants: "Loading assistants...",
      loadingChannels: "Loading integrations...",
      assistantRunning: "Running",
      assistantStopped: "Stopped",
      activeIntegrationsLabel: "Active integrations",
      integrationLimitLabel: "Limit",
      statusEnabled: "Enabled",
      statusDisabled: "Disabled",
      channelInstagram: "Instagram",
      channelTelegram: "Telegram",
      channelWidget: "Web widget",
      channelApi: "API",
      channelInstagramDescription:
        "Receive and send customer messages from Instagram.",
      channelTelegramDescription: "Communicate with clients via Telegram bot.",
      channelWidgetDescription: "Connect a web chat widget for your website.",
      channelApiDescription: "API integration for external systems.",
      accountLabel: "Account",
      noConnection: "Channel is not connected yet.",
      connectButton: "Connect",
      disconnectButton: "Disconnect",
      toggleLabel: "Channel status",
      telegramTokenModalTitle: "Connect Telegram Bot",
      telegramTokenModalDescription:
        "Paste Telegram bot token. The system will validate it and set webhook automatically.",
      telegramTokenLabel: "Bot token",
      telegramTokenPlaceholder: "For example: 123456789:AA...",
      telegramTokenRequired: "Telegram bot token is required.",
      loadFailed: "Failed to load integrations.",
      updateFailed: "Failed to update integration state.",
      unauthorized: "Session expired. Please sign in again.",
      errorTitle: "Error",
      successTitle: "Success",
    },
    assistantTraining: {
      title: "Assistant Training",
      subtitle:
        "Configure instructions, limits, responses, and assistant tools.",
      trainingTitle: "Training and settings",
      listTitle: "Assistants",
      limitLabel: "Assistant limit",
      createButton: "Create",
      createModalTitle: "Create assistant",
      createModalNameLabel: "Assistant name",
      createModalNamePlaceholder: "For example: Sales assistant",
      createModalCancel: "Cancel",
      createModalCreate: "Create",
      noAssistants: "No assistants created yet.",
      selectAssistantTitle: "Select assistant",
      selectAssistantHint:
        "Select an assistant from the list to open training settings.",
      backToAssistantsButton: "Back",
      nameLabel: "Assistant name",
      nameValidation: "Assistant name must be at least 2 characters long.",
      instructionsLabel: "Instructions",
      restrictionsLabel: "Restrictions",
      toneLabel: "Conversation tone",
      tonePolite: "Polite",
      toneFriendly: "Friendly",
      toneConcise: "Concise",
      toneFormal: "Formal",
      toneCustom: "Custom",
      settingsTitle: "Settings",
      fileSearchLabel: "File search",
      fileAnalysisLabel: "File analysis",
      voiceLabel: "Voice mode",
      webSearchLabel: "Web search",
      triggersTitle: "Triggers: prompt -> response",
      addTriggerButton: "Add trigger",
      noTriggers: "No triggers added yet.",
      triggerLabel: "Trigger",
      triggerResponseLabel: "Trigger response",
      removeTriggerButton: "Remove trigger",
      filesTitle: "Instruction files",
      uploadFilesButton: "Upload files",
      noFiles: "No instruction files uploaded yet.",
      openFileButton: "Open",
      deleteFileButton: "Delete file",
      saveButton: "Save changes",
      saveSuccess: "Assistant settings have been saved.",
      saveFailed: "Failed to save assistant settings.",
      createSuccess: "Assistant created.",
      createFailed: "Failed to create assistant.",
      startButton: "Start",
      stopButton: "Stop",
      deleteButton: "Delete",
      startSuccess: "Assistant started.",
      stopSuccess: "Assistant stopped.",
      deleteSuccess: "Assistant deleted.",
      actionFailed: "Failed to complete assistant action.",
      statusRunning: "Running",
      statusStopped: "Stopped",
      inactiveSubscriptionTitle: "Subscription is inactive",
      inactiveSubscriptionDescription:
        "Creating and running assistants is available only with an active subscription.",
      limitReachedTitle: "Limit reached",
      limitReachedDescription:
        "To create a new assistant, upgrade your plan or remove an existing assistant.",
      deleteModalTitle: "Delete assistant",
      deleteModalDescription:
        "Are you sure you want to delete this assistant? This action cannot be undone.",
      deleteModalCancel: "Cancel",
      deleteModalConfirm: "Delete",
      loading: "Loading assistants...",
      unauthorized: "Session expired. Please sign in again.",
      loadFailed: "Failed to load assistant data.",
      errorTitle: "Error",
      successTitle: "Success",
      warningTitle: "Warning",
      filesUploadedSuccess: "Files uploaded successfully.",
      fileDeletedSuccess: "File deleted.",
    },
  },
};
