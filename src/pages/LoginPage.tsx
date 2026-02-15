import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Input,
  Link as HeroLink,
} from "@heroui/react";
import { useState, type FormEvent } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import {
  ApiError,
  socialRedirectRequest,
  type AuthUser,
  type SocialProvider,
} from "../auth/authClient";
import {
  localizeAuthFieldErrors,
  localizeAuthMessage,
} from "../auth/errorLocalization";
import {
  getAuthDeviceName,
  isEmailOrPhone,
  isValidEmail,
  normalizeLoginIdentifier,
  sanitizeLoginInput,
} from "../auth/validation";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { BRANDING } from "../config/branding";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

type LoginLocationState = {
  from?: string;
};

type LoginField = "login" | "password";

type ApiErrorData = {
  requires_email_verification?: boolean;
  requires_moderation?: boolean;
  token?: string;
  user?: AuthUser;
  errors?: Record<string, string[]>;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getApiErrorData(error: ApiError): ApiErrorData {
  if (!isObject(error.data)) {
    return {};
  }

  return error.data as ApiErrorData;
}

function hasModerationSessionPayload(
  data: ApiErrorData,
): data is ApiErrorData & { token: string; user: AuthUser } {
  return typeof data.token === "string" && isObject(data.user);
}

function extractLoginFieldErrors(
  error: ApiError,
): Partial<Record<LoginField, string>> {
  const data = getApiErrorData(error);
  const validationErrors = data.errors;

  if (!validationErrors) {
    return {};
  }

  const getFirst = (key: string): string | undefined => {
    const value = validationErrors[key];

    if (!Array.isArray(value)) {
      return undefined;
    }

    const first = value[0];
    return typeof first === "string" ? first : undefined;
  };

  const loginError =
    getFirst("login") ?? getFirst("email") ?? getFirst("phone");
  const passwordError = getFirst("password");

  return {
    ...(loginError ? { login: loginError } : {}),
    ...(passwordError ? { password: passwordError } : {}),
  };
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.7 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.2 14.7 2.2 12 2.2 6.8 2.2 2.5 6.5 2.5 11.7S6.8 21.2 12 21.2c6.9 0 9.1-4.8 9.1-7.2 0-.5 0-.8-.1-1.1H12Z"
      />
      <path
        fill="#34A853"
        d="M3.7 7.6l3.2 2.3C7.8 8 9.7 6.7 12 6.7c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.9 14.7 2.9 12 2.9 8.3 2.9 5.1 5 3.7 7.6Z"
      />
      <path
        fill="#FBBC05"
        d="M12 21.2c2.6 0 4.7-.8 6.3-2.3l-2.9-2.4c-.8.6-1.9 1.1-3.4 1.1-3.8 0-5.2-2.6-5.5-3.8l-3.2 2.5c1.5 2.9 4.6 4.9 8.7 4.9Z"
      />
      <path
        fill="#4285F4"
        d="M21.1 13.9c.1-.3.1-.6.1-1s0-.8-.1-1.2H12v3.9h5.5c-.3 1.4-1.2 2.5-2.2 3.3l2.9 2.4c1.7-1.6 2.9-4 2.9-7.4Z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5C5.6.5.5 5.6.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1 .1 1.6 1.1 1.6 1.1 1 .1 1.8 1.2 1.8 1.2.8 1.5 2.2 1.1 2.7.8.1-.6.3-1.1.6-1.3-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 .9a10.3 10.3 0 0 1 5.5 0c2.1-1.2 3-.9 3-.9.6 1.5.2 2.6.1 2.9.7.8 1.1 1.8 1.1 3 0 4.2-2.6 5.2-5.1 5.5.4.3.7 1 .7 2v3c0 .4.2.7.8.6A11.5 11.5 0 0 0 23.5 12C23.5 5.6 18.4.5 12 .5Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setSession } = useAuth();
  const { locale, messages } = useI18n();
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoadingProvider, setSocialLoadingProvider] =
    useState<SocialProvider | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<LoginField, string>>
  >({});

  const locationState = location.state as LoginLocationState | null;
  const redirectTo =
    locationState?.from && locationState.from !== "/login"
      ? locationState.from
      : "/";

  usePageSeo({
    title: `${messages.auth.loginTitle} | ${messages.app.name}`,
    description: messages.auth.subtitle,
    locale,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError(null);
    setFieldErrors({});

    const nextFieldErrors: Partial<Record<LoginField, string>> = {};

    if (!loginValue || !password) {
      if (!loginValue) {
        nextFieldErrors.login = messages.auth.requiredCredentials;
      }

      if (!password) {
        nextFieldErrors.password = messages.auth.requiredCredentials;
      }

      setFieldErrors(nextFieldErrors);
      return;
    }

    if (password.length <= 6) {
      setFieldErrors({ password: messages.auth.passwordTooShort });
      return;
    }

    if (!isEmailOrPhone(loginValue)) {
      setFieldErrors({ login: messages.auth.invalidLoginIdentifier });
      return;
    }

    const normalizedLogin = normalizeLoginIdentifier(loginValue);

    setIsSubmitting(true);
    setGlobalError(null);
    setFieldErrors({});

    try {
      await login({
        login: normalizedLogin,
        password,
        deviceName: rememberMe
          ? `${getAuthDeviceName()}-remember`
          : getAuthDeviceName(),
      });

      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      if (submitError instanceof ApiError) {
        const errorData = getApiErrorData(submitError);

        if (errorData.requires_moderation) {
          if (hasModerationSessionPayload(errorData)) {
            setSession(errorData.token, errorData.user);
            navigate("/moderation", { replace: true });
            return;
          }

          setGlobalError(messages.auth.accountUnderModeration);
          return;
        }

        if (errorData.requires_email_verification) {
          const emailQuery = isValidEmail(normalizedLogin)
            ? `?email=${encodeURIComponent(normalizedLogin)}`
            : "";

          navigate(`/verify-email${emailQuery}`, { replace: true });
          return;
        }

        const nextApiFieldErrors = localizeAuthFieldErrors(
          extractLoginFieldErrors(submitError),
          messages,
        );

        if (Object.keys(nextApiFieldErrors).length > 0) {
          setFieldErrors(nextApiFieldErrors);
          return;
        }

        setGlobalError(localizeAuthMessage(submitError.message, messages));
        return;
      }

      if (submitError instanceof Error) {
        setGlobalError(localizeAuthMessage(submitError.message, messages));
        return;
      }

      setGlobalError(messages.auth.loginFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    setGlobalError(null);
    setFieldErrors({});
    setSocialLoadingProvider(provider);

    try {
      const socialResponse = await socialRedirectRequest(provider);
      const authorizationUrl = socialResponse.authorization_url;

      if (!authorizationUrl) {
        throw new Error(messages.auth.socialLoginFailed);
      }

      window.location.assign(authorizationUrl);
    } catch (socialError) {
      if (socialError instanceof Error) {
        setGlobalError(localizeAuthMessage(socialError.message, messages));
      } else {
        setGlobalError(messages.auth.socialLoginFailed);
      }

      setSocialLoadingProvider(null);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-72">
        <header className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={BRANDING.logoUrl}
              alt={BRANDING.logoAlt}
              className="h-9 w-auto object-contain"
            />
          </div>
          <LanguageSwitcher />
        </header>

        <div className="mb-5">
          <h1 className="text-3xl font-bold leading-tight text-foreground">
            {messages.auth.welcomeBack}
          </h1>
          <p className="mt-1 text-base text-default-600">
            {messages.auth.subtitle}
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <Input
            isRequired
            autoComplete="username"
            label={messages.auth.loginLabel}
            labelPlacement="outside"
            placeholder={messages.auth.loginPlaceholder}
            value={loginValue}
            onValueChange={(value) => {
              setLoginValue(sanitizeLoginInput(value));

              if (fieldErrors.login) {
                setFieldErrors((prev) => ({ ...prev, login: undefined }));
              }
            }}
            variant="bordered"
            maxLength={255}
            inputMode="email"
            isInvalid={Boolean(fieldErrors.login)}
            errorMessage={fieldErrors.login}
          />

          <Input
            isRequired
            autoComplete="current-password"
            label={messages.auth.passwordLabel}
            labelPlacement="outside"
            placeholder={messages.auth.passwordPlaceholder}
            type="password"
            value={password}
            onValueChange={(value) => {
              setPassword(value);

              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            variant="bordered"
            maxLength={255}
            isInvalid={Boolean(fieldErrors.password)}
            errorMessage={fieldErrors.password}
          />

          <div className="flex items-center justify-between gap-2">
            <Checkbox
              isSelected={rememberMe}
              onValueChange={setRememberMe}
              classNames={{ label: "text-medium" }}
            >
              {messages.auth.rememberMe}
            </Checkbox>
            <Button
              type="button"
              variant="light"
              size="md"
              className="text-medium"
              onPress={() => navigate("/forgot-password")}
            >
              {messages.auth.forgotPassword}
            </Button>
          </div>

          {globalError ? (
            <Alert
              color="danger"
              title={messages.auth.errorTitle}
              description={globalError}
              variant="flat"
            />
          ) : null}

          <Button
            type="submit"
            color="primary"
            isLoading={isSubmitting}
            fullWidth
          >
            {messages.auth.loginButton}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <Divider className="flex-1" />
          <span className="text-small text-default-500">
            {messages.common.separatorOr}
          </span>
          <Divider className="flex-1" />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="bordered"
            startContent={<GoogleIcon />}
            isLoading={socialLoadingProvider === "google"}
            onPress={() => void handleSocialLogin("google")}
            fullWidth
          >
            {messages.auth.continueWithGoogle}
          </Button>
          <Button
            variant="bordered"
            startContent={<GithubIcon />}
            isLoading={socialLoadingProvider === "github"}
            onPress={() => void handleSocialLogin("github")}
            fullWidth
          >
            {messages.auth.continueWithGithub}
          </Button>
        </div>

        <p className="mt-4 text-center text-small text-default-500">
          {messages.auth.noAccount}{" "}
          <HeroLink as={RouterLink} to="/register" size="sm">
            {messages.auth.signUp}
          </HeroLink>
        </p>
      </div>
    </main>
  );
}
