import { Alert, Button, Input, Link as HeroLink } from "@heroui/react";
import { useState, type FormEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ApiError, forgotPasswordRequest } from "../auth/authClient";
import {
  localizeAuthFieldErrors,
  localizeAuthMessage,
} from "../auth/errorLocalization";
import { isValidEmail, normalizeEmail } from "../auth/validation";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { BRANDING } from "../config/branding";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

type ForgotPasswordField = "email";

type ApiErrorData = {
  errors?: Record<string, string[]>;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractForgotPasswordFieldErrors(
  error: ApiError,
): Partial<Record<ForgotPasswordField, string>> {
  const data = isObject(error.data) ? (error.data as ApiErrorData) : undefined;
  const validationErrors = data?.errors;

  if (!validationErrors) {
    return {};
  }

  const emailError = validationErrors.email?.[0];

  return typeof emailError === "string" ? { email: emailError } : {};
}

export default function ForgotPasswordPage() {
  const { locale, messages } = useI18n();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<ForgotPasswordField, string>>
  >({});

  usePageSeo({
    title: `${messages.auth.forgotPasswordTitle} | ${messages.app.name}`,
    description: messages.auth.forgotPasswordSubtitle,
    locale,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});
    setGlobalError(null);
    setGlobalSuccess(null);

    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      setFieldErrors({ email: messages.auth.requiredCredentials });
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setFieldErrors({ email: messages.auth.invalidEmail });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await forgotPasswordRequest({
        email: normalizedEmail,
      });

      setGlobalSuccess(localizeAuthMessage(response.message, messages));
    } catch (submitError) {
      if (submitError instanceof ApiError) {
        const nextApiFieldErrors = localizeAuthFieldErrors(
          extractForgotPasswordFieldErrors(submitError),
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

      setGlobalError(messages.auth.forgotPasswordFailed);
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
            {messages.auth.forgotPasswordTitle}
          </h1>
          <p className="mt-1 text-base text-default-600">
            {messages.auth.forgotPasswordSubtitle}
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <Input
            isRequired
            autoComplete="email"
            type="email"
            label={messages.auth.forgotPasswordEmailLabel}
            labelPlacement="outside"
            placeholder={messages.auth.forgotPasswordEmailPlaceholder}
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

          {globalError ? (
            <Alert
              color="danger"
              title={messages.auth.errorTitle}
              description={globalError}
              variant="flat"
            />
          ) : null}

          {globalSuccess ? (
            <Alert
              color="success"
              title={messages.auth.successTitle}
              description={globalSuccess}
              variant="flat"
            />
          ) : null}

          <Button type="submit" color="primary" isLoading={isSubmitting} fullWidth>
            {messages.auth.forgotPasswordButton}
          </Button>
        </form>

        <p className="mt-4 text-center text-small text-default-500">
          <HeroLink as={RouterLink} to="/login" size="sm">
            {messages.auth.backToLogin}
          </HeroLink>
        </p>
      </div>
    </main>
  );
}
