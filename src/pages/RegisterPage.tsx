import { Alert, Button, Input, Link as HeroLink } from "@heroui/react";
import { useState, type FormEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ApiError, registerRequest } from "../auth/authClient";
import {
  localizeAuthFieldErrors,
  localizeAuthMessage,
} from "../auth/errorLocalization";
import {
  hasStrongPassword,
  isValidEmail,
  isValidPhone,
  normalizeEmail,
  normalizeName,
  normalizePhone,
  sanitizeNameInput,
  sanitizePhoneInput,
} from "../auth/validation";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { BRANDING } from "../config/branding";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

type ApiErrorData = {
  errors?: Record<string, string[]>;
};

type RegisterField =
  | "name"
  | "email"
  | "phone"
  | "password"
  | "passwordConfirmation";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractRegisterFieldErrors(
  error: ApiError,
): Partial<Record<RegisterField, string>> {
  const data = isObject(error.data) ? (error.data as ApiErrorData) : undefined;
  const validationErrors = data?.errors;

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

  const nameError = getFirst("name");
  const emailError = getFirst("email");
  const phoneError = getFirst("phone");
  const passwordError = getFirst("password");
  const passwordConfirmationError = getFirst("password_confirmation");

  return {
    ...(nameError ? { name: nameError } : {}),
    ...(emailError ? { email: emailError } : {}),
    ...(phoneError ? { phone: phoneError } : {}),
    ...(passwordError ? { password: passwordError } : {}),
    ...(passwordConfirmationError
      ? { passwordConfirmation: passwordConfirmationError }
      : {}),
  };
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { locale, messages } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<RegisterField, string>>
  >({});

  usePageSeo({
    title: `${messages.auth.registerTitle} | ${messages.app.name}`,
    description: messages.auth.registerSubtitle,
    locale,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError(null);
    setFieldErrors({});

    const normalizedName = normalizeName(name);
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);
    const nextFieldErrors: Partial<Record<RegisterField, string>> = {};

    if (
      !normalizedName ||
      !normalizedEmail ||
      !normalizedPhone ||
      !password ||
      !passwordConfirmation
    ) {
      if (!normalizedName) {
        nextFieldErrors.name = messages.auth.requiredRegisterFields;
      }

      if (!normalizedEmail) {
        nextFieldErrors.email = messages.auth.requiredRegisterFields;
      }

      if (!normalizedPhone) {
        nextFieldErrors.phone = messages.auth.requiredRegisterFields;
      }

      if (!password) {
        nextFieldErrors.password = messages.auth.requiredRegisterFields;
      }

      if (!passwordConfirmation) {
        nextFieldErrors.passwordConfirmation =
          messages.auth.requiredRegisterFields;
      }

      setFieldErrors(nextFieldErrors);
      return;
    }

    if (normalizedName.length < 2) {
      setFieldErrors({ name: messages.auth.invalidName });
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setFieldErrors({ email: messages.auth.invalidEmail });
      return;
    }

    if (!isValidPhone(normalizedPhone)) {
      setFieldErrors({ phone: messages.auth.invalidPhone });
      return;
    }

    if (password.length <= 6) {
      setFieldErrors({ password: messages.auth.passwordTooShort });
      return;
    }

    if (!hasStrongPassword(password)) {
      setFieldErrors({ password: messages.auth.weakPassword });
      return;
    }

    if (password !== passwordConfirmation) {
      setFieldErrors({ passwordConfirmation: messages.auth.passwordMismatch });
      return;
    }

    setIsSubmitting(true);
    setGlobalError(null);
    setFieldErrors({});

    try {
      const response = await registerRequest({
        name: normalizedName,
        email: normalizedEmail,
        phone: normalizedPhone,
        password,
      });

      navigate(`/verify-email?email=${encodeURIComponent(response.email)}`, {
        replace: true,
        state: {
          email: response.email,
          resendAvailableIn: response.resend_available_in,
        },
      });
    } catch (submitError) {
      if (submitError instanceof ApiError) {
        const nextApiFieldErrors = localizeAuthFieldErrors(
          extractRegisterFieldErrors(submitError),
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

      setGlobalError(messages.auth.registerFailed);
    } finally {
      setIsSubmitting(false);
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
              className="h-10 w-10 rounded-md object-contain"
            />
          </div>
          <LanguageSwitcher />
        </header>

        <div className="mb-5">
          <h1 className="text-3xl font-bold leading-tight text-foreground">
            {messages.auth.registerTitle}
          </h1>
          <p className="mt-1 text-base text-default-600">
            {messages.auth.registerSubtitle}
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <Input
            isRequired
            autoComplete="name"
            label={messages.auth.nameLabel}
            labelPlacement="outside"
            placeholder={messages.auth.namePlaceholder}
            value={name}
            onValueChange={(value) => {
              setName(sanitizeNameInput(value));

              if (fieldErrors.name) {
                setFieldErrors((prev) => ({ ...prev, name: undefined }));
              }
            }}
            variant="bordered"
            maxLength={255}
            isInvalid={Boolean(fieldErrors.name)}
            errorMessage={fieldErrors.name}
          />

          <Input
            isRequired
            autoComplete="email"
            type="email"
            label={messages.auth.emailLabel}
            labelPlacement="outside"
            placeholder={messages.auth.emailPlaceholder}
            value={email}
            onValueChange={(value) => {
              setEmail(value);

              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            variant="bordered"
            maxLength={255}
            isInvalid={Boolean(fieldErrors.email)}
            errorMessage={fieldErrors.email}
          />

          <Input
            isRequired
            autoComplete="tel"
            type="tel"
            inputMode="tel"
            label={messages.auth.phoneLabel}
            labelPlacement="outside"
            placeholder={messages.auth.phonePlaceholder}
            value={phone}
            onValueChange={(value) => {
              setPhone(sanitizePhoneInput(value));

              if (fieldErrors.phone) {
                setFieldErrors((prev) => ({ ...prev, phone: undefined }));
              }
            }}
            variant="bordered"
            maxLength={32}
            isInvalid={Boolean(fieldErrors.phone)}
            errorMessage={fieldErrors.phone}
          />

          <Input
            isRequired
            autoComplete="new-password"
            type="password"
            label={messages.auth.passwordLabel}
            labelPlacement="outside"
            placeholder={messages.auth.passwordPlaceholder}
            value={password}
            onValueChange={(value) => {
              setPassword(value);

              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            variant="bordered"
            maxLength={255}
            description={
              fieldErrors.password ? undefined : messages.auth.passwordRulesHint
            }
            isInvalid={Boolean(fieldErrors.password)}
            errorMessage={fieldErrors.password}
          />

          <Input
            isRequired
            autoComplete="new-password"
            type="password"
            label={messages.auth.confirmPasswordLabel}
            labelPlacement="outside"
            placeholder={messages.auth.confirmPasswordPlaceholder}
            value={passwordConfirmation}
            onValueChange={(value) => {
              setPasswordConfirmation(value);

              if (fieldErrors.passwordConfirmation) {
                setFieldErrors((prev) => ({
                  ...prev,
                  passwordConfirmation: undefined,
                }));
              }
            }}
            variant="bordered"
            maxLength={255}
            isInvalid={Boolean(fieldErrors.passwordConfirmation)}
            errorMessage={fieldErrors.passwordConfirmation}
          />

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
            {messages.auth.registerButton}
          </Button>
        </form>

        <p className="mt-4 text-center text-small text-default-500">
          {messages.auth.haveAccount}{" "}
          <HeroLink as={RouterLink} to="/login" size="sm">
            {messages.auth.signIn}
          </HeroLink>
        </p>
      </div>
    </main>
  );
}
