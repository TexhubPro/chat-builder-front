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
  },
  en: {
    app: {
      name: "Lido",
      tagline: "AI Lead Processing Assistant",
    },
    common: {
      loadingSession: "Checking session...",
      separatorOr: "OR",
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
  },
};
