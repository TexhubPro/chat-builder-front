import { Alert, Button, InputOtp, Link as HeroLink } from "@heroui/react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import {
  ApiError,
  resendVerificationCodeRequest,
  verifyEmailCodeRequest,
} from "../auth/authClient";
import {
  localizeAuthFieldErrors,
  localizeAuthMessage,
} from "../auth/errorLocalization";
import {
  getAuthDeviceName,
  isValidEmail,
  isValidVerificationCode,
  normalizeEmail,
} from "../auth/validation";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { BRANDING } from "../config/branding";
import { useI18n } from "../i18n/useI18n";

type VerificationLocationState = {
  email?: string;
  resendAvailableIn?: number;
};

type ApiErrorData = {
  errors?: Record<string, string[]>;
  retry_after?: number;
};

type VerifyField = "code";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getApiErrorData(error: ApiError): ApiErrorData {
  if (!isObject(error.data)) {
    return {};
  }

  return error.data as ApiErrorData;
}

function extractVerifyFieldErrors(
  error: ApiError,
): Partial<Record<VerifyField, string>> {
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

  const codeError = getFirst("code");

  return {
    ...(codeError ? { code: codeError } : {}),
  };
}

function parsePositiveNumber(
  value: string | undefined,
  fallback: number,
): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { setSession } = useAuth();
  const { messages } = useI18n();
  const locationState = location.state as VerificationLocationState | null;
  const initialEmail = searchParams.get("email") ?? locationState?.email ?? "";
  const defaultResendCooldown = parsePositiveNumber(
    import.meta.env.VITE_VERIFICATION_RESEND_COOLDOWN_SECONDS,
    60,
  );
  const initialResendCooldown = locationState?.resendAvailableIn ?? 0;
  const verificationEmail = normalizeEmail(initialEmail);

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(initialResendCooldown);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<VerifyField, string>>
  >({});
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldownSeconds((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [cooldownSeconds]);

  const resendButtonLabel = useMemo(() => {
    if (cooldownSeconds > 0) {
      return `${messages.auth.resendCodeIn} ${cooldownSeconds}s`;
    }

    return messages.auth.resendCode;
  }, [cooldownSeconds, messages.auth.resendCode, messages.auth.resendCodeIn]);

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError(null);
    setFieldErrors({});
    setInfo(null);

    const normalizedCode = code.trim();
    const nextFieldErrors: Partial<Record<VerifyField, string>> = {};

    if (!verificationEmail || !normalizedCode) {
      if (!normalizedCode) {
        nextFieldErrors.code = messages.auth.verifyCodeRequired;
      }

      if (!verificationEmail) {
        setGlobalError(messages.auth.verificationEmailMissing);
      }

      setFieldErrors(nextFieldErrors);
      return;
    }

    if (!isValidEmail(verificationEmail)) {
      setGlobalError(messages.auth.verificationEmailMissing);
      return;
    }

    if (!isValidVerificationCode(normalizedCode)) {
      setFieldErrors({ code: messages.auth.invalidVerificationCode });
      return;
    }

    setIsSubmitting(true);
    setGlobalError(null);
    setFieldErrors({});
    setInfo(null);

    try {
      const response = await verifyEmailCodeRequest({
        email: verificationEmail,
        code: normalizedCode,
        device_name: getAuthDeviceName(),
      });

      setSession(response.token, response.user);

      if (response.requires_moderation) {
        navigate("/moderation", { replace: true });
        return;
      }

      navigate("/", { replace: true });
    } catch (verifyError) {
      if (verifyError instanceof ApiError) {
        const nextApiFieldErrors = localizeAuthFieldErrors(
          extractVerifyFieldErrors(verifyError),
          messages,
        );

        if (Object.keys(nextApiFieldErrors).length > 0) {
          setFieldErrors(nextApiFieldErrors);
          return;
        }

        setGlobalError(localizeAuthMessage(verifyError.message, messages));
        return;
      }

      if (verifyError instanceof Error) {
        setGlobalError(localizeAuthMessage(verifyError.message, messages));
        return;
      }

      setGlobalError(messages.auth.verificationFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldownSeconds > 0 || isResending) {
      return;
    }

    if (!isValidEmail(verificationEmail)) {
      setGlobalError(messages.auth.verificationEmailMissing);
      return;
    }

    setIsResending(true);
    setGlobalError(null);
    setFieldErrors({});
    setInfo(null);

    try {
      const response = await resendVerificationCodeRequest({
        email: verificationEmail,
      });

      setCooldownSeconds(defaultResendCooldown);
      setInfo(localizeAuthMessage(response.message, messages));
    } catch (resendError) {
      if (resendError instanceof ApiError) {
        const errorData = getApiErrorData(resendError);
        const retryAfter = errorData.retry_after;

        if (typeof retryAfter === "number" && retryAfter > 0) {
          setCooldownSeconds(retryAfter);
        }

        const nextApiFieldErrors = localizeAuthFieldErrors(
          extractVerifyFieldErrors(resendError),
          messages,
        );

        if (Object.keys(nextApiFieldErrors).length > 0) {
          setFieldErrors(nextApiFieldErrors);
          return;
        }

        setGlobalError(localizeAuthMessage(resendError.message, messages));
        return;
      }

      if (resendError instanceof Error) {
        setGlobalError(localizeAuthMessage(resendError.message, messages));
        return;
      }

      setGlobalError(messages.auth.resendFailed);
    } finally {
      setIsResending(false);
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

        <div className="mb-5 w-full">
          <h1 className="text-3xl font-bold leading-tight text-foreground">
            {messages.auth.verifyTitle}
          </h1>
          <p className="mt-1 text-base text-default-600">
            {messages.auth.verifySubtitle}
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleVerify}
          noValidate
        >
          <InputOtp
            isRequired
            length={6}
            variant="bordered"
            autoComplete="one-time-code"
            inputMode="numeric"
            allowedKeys="^[0-9]*$"
            label={messages.auth.codeLabel}
            value={code}
            classNames={{
              base: "w-full",
              wrapper: "w-full",
              segmentWrapper: "!grid w-full grid-cols-6 gap-2 py-2",
              segment: "w-full min-w-0",
            }}
            onValueChange={(value) => {
              setCode(value.replace(/\D/g, "").slice(0, 6));

              if (fieldErrors.code) {
                setFieldErrors((prev) => ({ ...prev, code: undefined }));
              }
            }}
            fullWidth
            isInvalid={Boolean(fieldErrors.code)}
            errorMessage={fieldErrors.code}
          />

          {globalError ? (
            <Alert
              color="danger"
              title={messages.auth.errorTitle}
              description={globalError}
              variant="flat"
            />
          ) : null}

          {info ? (
            <Alert
              color="success"
              title={messages.auth.successTitle}
              description={info}
              variant="flat"
            />
          ) : null}

          <Button
            type="submit"
            color="primary"
            isLoading={isSubmitting}
            fullWidth
          >
            {messages.auth.verifyButton}
          </Button>

          <Button
            type="button"
            variant="bordered"
            isLoading={isResending}
            isDisabled={cooldownSeconds > 0 || !isValidEmail(verificationEmail)}
            onPress={handleResendCode}
            fullWidth
          >
            {resendButtonLabel}
          </Button>
        </form>

        <p className="mt-4 text-center text-small text-default-500">
          <HeroLink as={RouterLink} to="/register" size="sm">
            {messages.auth.backToRegister}
          </HeroLink>{" "}
          ·{" "}
          <HeroLink as={RouterLink} to="/login" size="sm">
            {messages.auth.backToLogin}
          </HeroLink>
        </p>
      </div>
    </main>
  );
}
