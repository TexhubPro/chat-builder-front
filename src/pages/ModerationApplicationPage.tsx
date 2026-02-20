import {
  Alert,
  Button,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ApiError,
  moderationApplicationSubmitRequest,
  type ModerationApplicationUseCase,
} from "../auth/authClient";
import { useAuth } from "../auth/AuthProvider";
import { getAuthToken } from "../auth/authStorage";
import { localizeAuthMessage } from "../auth/errorLocalization";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { BRANDING } from "../config/branding";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

type FormField =
  | "companyName"
  | "industry"
  | "shortDescription"
  | "primaryGoal"
  | "useCase"
  | "contactEmail"
  | "contactPhone";

const COPY = {
  ru: {
    title: "Заявка на модерацию",
    subtitle:
      "Заполните данные о компании. После отправки заявки вы перейдёте на страницу ожидания.",
    companyName: "Название компании",
    industry: "Отрасль",
    shortDescription: "Краткое описание",
    primaryGoal: "Основная цель",
    useCase: "Цель использования Liddo",
    contactEmail: "Контактный email",
    contactPhone: "Контактный телефон",
    submit: "Отправить заявку",
    required: "Это поле обязательно",
    invalidEmail: "Введите корректный email",
    submitFailed: "Не удалось отправить заявку.",
  },
  en: {
    title: "Moderation Application",
    subtitle:
      "Fill in your company details. After submission you will be redirected to the waiting page.",
    companyName: "Company name",
    industry: "Industry",
    shortDescription: "Short description",
    primaryGoal: "Primary goal",
    useCase: "Liddo use case",
    contactEmail: "Contact email",
    contactPhone: "Contact phone",
    submit: "Submit application",
    required: "This field is required",
    invalidEmail: "Enter a valid email",
    submitFailed: "Failed to submit application.",
  },
} as const;

const USE_CASE_OPTIONS: Array<{
  key: ModerationApplicationUseCase;
  label: { ru: string; en: string };
}> = [
  {
    key: "lead_generation",
    label: {
      ru: "Сбор лидов",
      en: "Lead generation",
    },
  },
  {
    key: "support_automation",
    label: {
      ru: "Автоматизация поддержки",
      en: "Support automation",
    },
  },
  {
    key: "sales_automation",
    label: {
      ru: "Автоматизация продаж",
      en: "Sales automation",
    },
  },
  {
    key: "appointments",
    label: {
      ru: "Записи и бронирования",
      en: "Appointments and bookings",
    },
  },
  {
    key: "orders",
    label: {
      ru: "Заказы и доставка",
      en: "Orders and delivery",
    },
  },
  {
    key: "other",
    label: {
      ru: "Другое",
      en: "Other",
    },
  },
];

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ModerationApplicationPage() {
  const navigate = useNavigate();
  const { locale, messages } = useI18n();
  const { user } = useAuth();
  const copy = COPY[locale];

  const [companyName, setCompanyName] = useState(
    user?.name ? `${user.name} Company` : "",
  );
  const [industry, setIndustry] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [useCase, setUseCase] =
    useState<ModerationApplicationUseCase>("lead_generation");
  const [contactEmail, setContactEmail] = useState(user?.email ?? "");
  const [contactPhone, setContactPhone] = useState(user?.phone ?? "");
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FormField, string>>
  >({});

  usePageSeo({
    title: `${copy.title} | ${messages.app.name}`,
    description: copy.subtitle,
    locale,
  });

  const selectedUseCase = useMemo(() => new Set([useCase]), [useCase]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError(null);
    setFieldErrors({});

    const normalizedCompanyName = companyName.trim();
    const normalizedIndustry = industry.trim();
    const normalizedShortDescription = shortDescription.trim();
    const normalizedPrimaryGoal = primaryGoal.trim();
    const normalizedContactEmail = contactEmail.trim();
    const normalizedContactPhone = contactPhone.trim();

    const nextFieldErrors: Partial<Record<FormField, string>> = {};

    if (normalizedCompanyName.length < 2) {
      nextFieldErrors.companyName = copy.required;
    }

    if (normalizedContactEmail !== "" && !isValidEmail(normalizedContactEmail)) {
      nextFieldErrors.contactEmail = copy.invalidEmail;
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setGlobalError(messages.auth.loginFailed);
      return;
    }

    setIsSubmitting(true);

    try {
      await moderationApplicationSubmitRequest(token, {
        company_name: normalizedCompanyName,
        industry: normalizedIndustry !== "" ? normalizedIndustry : undefined,
        short_description:
          normalizedShortDescription !== "" ? normalizedShortDescription : undefined,
        primary_goal: normalizedPrimaryGoal !== "" ? normalizedPrimaryGoal : undefined,
        liddo_use_case: useCase,
        contact_email:
          normalizedContactEmail !== "" ? normalizedContactEmail : undefined,
        contact_phone:
          normalizedContactPhone !== "" ? normalizedContactPhone : undefined,
      });

      navigate("/moderation", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setGlobalError(localizeAuthMessage(error.message, messages));
      } else if (error instanceof Error) {
        setGlobalError(localizeAuthMessage(error.message, messages));
      } else {
        setGlobalError(copy.submitFailed);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6f8] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={BRANDING.logoUrl}
              alt={BRANDING.logoAlt}
              className="h-10 w-auto object-contain"
            />
          </div>
          <LanguageSwitcher />
        </header>

        <section className="rounded-2xl border border-default-200 bg-white p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
              {copy.title}
            </h1>
            <p className="mt-2 text-sm text-default-600 sm:text-base">
              {copy.subtitle}
            </p>
          </div>

          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Input
                isRequired
                variant="faded"
                label={`${copy.companyName} *`}
                labelPlacement="outside"
                value={companyName}
                onValueChange={(value) => {
                  setCompanyName(value);

                  if (fieldErrors.companyName) {
                    setFieldErrors((prev) => ({ ...prev, companyName: undefined }));
                  }
                }}
                maxLength={160}
                isInvalid={Boolean(fieldErrors.companyName)}
                errorMessage={fieldErrors.companyName}
              />

              <Input
                variant="faded"
                label={copy.industry}
                labelPlacement="outside"
                value={industry}
                onValueChange={(value) => {
                  setIndustry(value);

                  if (fieldErrors.industry) {
                    setFieldErrors((prev) => ({ ...prev, industry: undefined }));
                  }
                }}
                maxLength={120}
                isInvalid={Boolean(fieldErrors.industry)}
                errorMessage={fieldErrors.industry}
              />
            </div>

            <Textarea
              variant="faded"
              label={copy.shortDescription}
              labelPlacement="outside"
              value={shortDescription}
              onValueChange={(value) => {
                setShortDescription(value);

                if (fieldErrors.shortDescription) {
                  setFieldErrors((prev) => ({ ...prev, shortDescription: undefined }));
                }
              }}
              minRows={5}
              maxLength={1000}
              isInvalid={Boolean(fieldErrors.shortDescription)}
              errorMessage={fieldErrors.shortDescription}
            />

            <Textarea
              variant="faded"
              label={copy.primaryGoal}
              labelPlacement="outside"
              value={primaryGoal}
              onValueChange={(value) => {
                setPrimaryGoal(value);

                if (fieldErrors.primaryGoal) {
                  setFieldErrors((prev) => ({ ...prev, primaryGoal: undefined }));
                }
              }}
              minRows={5}
              maxLength={1000}
              isInvalid={Boolean(fieldErrors.primaryGoal)}
              errorMessage={fieldErrors.primaryGoal}
            />

            <Divider className="my-3" />

            <Select
              isRequired
              variant="faded"
              label={copy.useCase}
              labelPlacement="outside"
              selectedKeys={selectedUseCase}
              onSelectionChange={(keys) => {
                if (keys === "all") {
                  return;
                }

                const firstKey = keys.values().next().value;

                if (typeof firstKey === "string") {
                  setUseCase(firstKey as ModerationApplicationUseCase);
                }

                if (fieldErrors.useCase) {
                  setFieldErrors((prev) => ({ ...prev, useCase: undefined }));
                }
              }}
              isInvalid={Boolean(fieldErrors.useCase)}
              errorMessage={fieldErrors.useCase}
            >
              {USE_CASE_OPTIONS.map((option) => (
                <SelectItem key={option.key}>{option.label[locale]}</SelectItem>
              ))}
            </Select>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Input
                variant="faded"
                type="email"
                label={copy.contactEmail}
                labelPlacement="outside"
                value={contactEmail}
                onValueChange={(value) => {
                  setContactEmail(value);

                  if (fieldErrors.contactEmail) {
                    setFieldErrors((prev) => ({ ...prev, contactEmail: undefined }));
                  }
                }}
                maxLength={255}
                isInvalid={Boolean(fieldErrors.contactEmail)}
                errorMessage={fieldErrors.contactEmail}
              />

              <Input
                variant="faded"
                type="tel"
                label={copy.contactPhone}
                labelPlacement="outside"
                value={contactPhone}
                onValueChange={(value) => {
                  setContactPhone(value);

                  if (fieldErrors.contactPhone) {
                    setFieldErrors((prev) => ({ ...prev, contactPhone: undefined }));
                  }
                }}
                maxLength={32}
                isInvalid={Boolean(fieldErrors.contactPhone)}
                errorMessage={fieldErrors.contactPhone}
              />
            </div>

            {globalError && (
              <Alert
                color="danger"
                variant="flat"
                title={messages.auth.errorTitle}
                description={globalError}
              />
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                color="primary"
                isLoading={isSubmitting}
                className="w-full sm:w-auto"
              >
                {copy.submit}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
