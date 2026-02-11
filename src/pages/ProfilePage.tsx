import { Icon } from "@iconify/react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardBody,
  Divider,
  Input,
} from "@heroui/react";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "../auth/AuthProvider";
import { ApiError, updateProfileRequest } from "../auth/authClient";
import { getAuthToken } from "../auth/authStorage";
import { localizeAuthMessage } from "../auth/errorLocalization";
import { hasStrongPassword, normalizeName, sanitizeNameInput } from "../auth/validation";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import type { I18nContextValue } from "../i18n/I18nContext";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

const MAX_AVATAR_SIZE_BYTES = 4 * 1024 * 1024;

type ProfileField =
  | "name"
  | "avatar"
  | "currentPassword"
  | "newPassword"
  | "confirmPassword";

type ApiErrorData = {
  errors?: Record<string, string[]>;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeMessage(rawMessage: string): string {
  return rawMessage.trim().toLowerCase().replace(/[.,!?]+/g, "").replace(/\s+/g, " ");
}

function localizeProfileMessage(rawMessage: string, i18n: I18nContextValue): string {
  const normalized = normalizeMessage(rawMessage);
  const { messages } = i18n;

  if (normalized === "profile updated successfully") {
    return messages.profile.profileUpdated;
  }

  if (normalized === "current password is incorrect") {
    return messages.profile.currentPasswordInvalid;
  }

  if (normalized === "the new password must be different from the current password") {
    return messages.profile.newPasswordDifferent;
  }

  if (
    normalized.includes("file must be an image")
    || normalized.includes("must be an image")
    || normalized.includes("file of type")
  ) {
    return messages.profile.avatarInvalidType;
  }

  if (normalized.includes("must not be greater than")) {
    return messages.profile.avatarTooLarge;
  }

  return localizeAuthMessage(rawMessage, messages);
}

function extractProfileFieldErrors(
  error: ApiError,
  i18n: I18nContextValue,
): Partial<Record<ProfileField, string>> {
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
  const avatarError = getFirst("avatar");
  const currentPasswordError = getFirst("current_password");
  const newPasswordError = getFirst("new_password");
  const confirmPasswordError = getFirst("new_password_confirmation");

  return {
    ...(nameError ? { name: localizeProfileMessage(nameError, i18n) } : {}),
    ...(avatarError ? { avatar: localizeProfileMessage(avatarError, i18n) } : {}),
    ...(currentPasswordError
      ? { currentPassword: localizeProfileMessage(currentPasswordError, i18n) }
      : {}),
    ...(newPasswordError
      ? { newPassword: localizeProfileMessage(newPasswordError, i18n) }
      : {}),
    ...(confirmPasswordError
      ? { confirmPassword: localizeProfileMessage(confirmPasswordError, i18n) }
      : {}),
  };
}

export default function ProfilePage() {
  const { user, logout, refreshSession } = useAuth();
  const i18n = useI18n();
  const { locale, messages } = i18n;

  const [name, setName] = useState(user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ProfileField, string>>>({});

  usePageSeo({
    title: `${messages.profile.title} | ${messages.app.name}`,
    description: messages.profile.subtitle,
    locale,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user?.name]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  const avatarSource = removeAvatar ? null : avatarPreviewUrl ?? user?.avatar ?? null;

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleAvatarSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setFieldErrors((prev) => ({ ...prev, avatar: messages.profile.avatarInvalidType }));
      return;
    }

    if (selectedFile.size > MAX_AVATAR_SIZE_BYTES) {
      setFieldErrors((prev) => ({ ...prev, avatar: messages.profile.avatarTooLarge }));
      return;
    }

    setFieldErrors((prev) => ({ ...prev, avatar: undefined }));
    setGlobalError(null);
    setGlobalSuccess(null);
    setRemoveAvatar(false);
    setAvatarFile(selectedFile);
    setAvatarPreviewUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }

      return URL.createObjectURL(selectedFile);
    });

    event.target.value = "";
  };

  const handleAvatarRemove = () => {
    setAvatarFile(null);
    setRemoveAvatar(true);
    setFieldErrors((prev) => ({ ...prev, avatar: undefined }));
    setGlobalError(null);
    setGlobalSuccess(null);
    setAvatarPreviewUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }

      return null;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFieldErrors({});
    setGlobalError(null);
    setGlobalSuccess(null);

    const normalizedUserName = normalizeName(name);
    const nextFieldErrors: Partial<Record<ProfileField, string>> = {};

    if (!normalizedUserName) {
      nextFieldErrors.name = messages.profile.nameRequired;
    } else if (normalizedUserName.length < 2) {
      nextFieldErrors.name = messages.profile.nameInvalid;
    }

    const wantsPasswordChange =
      currentPassword !== "" || newPassword !== "" || confirmPassword !== "";

    if (wantsPasswordChange) {
      if (!currentPassword) {
        nextFieldErrors.currentPassword = messages.profile.currentPasswordRequired;
      }

      if (!newPassword) {
        nextFieldErrors.newPassword = messages.profile.newPasswordRequired;
      }

      if (!confirmPassword) {
        nextFieldErrors.confirmPassword = messages.profile.confirmPasswordRequired;
      }

      if (newPassword && newPassword.length <= 6) {
        nextFieldErrors.newPassword = messages.auth.passwordTooShort;
      } else if (newPassword && !hasStrongPassword(newPassword)) {
        nextFieldErrors.newPassword = messages.auth.weakPassword;
      }

      if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        nextFieldErrors.confirmPassword = messages.auth.passwordMismatch;
      }
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.auth.invalidCredentials);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await updateProfileRequest(token, {
        name: normalizedUserName,
        avatarFile,
        removeAvatar: removeAvatar && !avatarFile,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
        newPasswordConfirmation: confirmPassword || undefined,
      });

      await refreshSession();

      setName(response.user.name);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setAvatarFile(null);
      setRemoveAvatar(false);
      setGlobalSuccess(localizeProfileMessage(response.message, i18n));
    } catch (submitError) {
      if (submitError instanceof ApiError) {
        const nextApiFieldErrors = extractProfileFieldErrors(submitError, i18n);

        if (Object.keys(nextApiFieldErrors).length > 0) {
          setFieldErrors(nextApiFieldErrors);
          return;
        }

        setGlobalError(localizeProfileMessage(submitError.message, i18n));
        return;
      }

      if (submitError instanceof Error) {
        setGlobalError(localizeProfileMessage(submitError.message, i18n));
        return;
      }

      setGlobalError(messages.profile.updateFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title={messages.profile.title}
      user={user}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      defaultSelectedKey=""
    >
      <Card shadow="none" className="border border-default-200 bg-white">
        <CardBody className="space-y-6 p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                src={avatarSource ?? undefined}
                name={normalizeName(name) || user?.name || (locale === "ru" ? "Пользователь" : "User")}
                className="h-20 w-20 text-2xl"
              />
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {normalizeName(name) || user?.name || (locale === "ru" ? "Пользователь" : "User")}
                </p>
                <p className="text-sm text-default-500">{messages.profile.subtitle}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
                className="hidden"
                onChange={handleAvatarSelection}
              />
              <Button
                variant="bordered"
                startContent={<Icon icon="solar:camera-add-linear" width={18} />}
                onPress={() => fileInputRef.current?.click()}
              >
                {messages.profile.uploadAvatar}
              </Button>
              <Button
                variant="light"
                color="danger"
                startContent={<Icon icon="solar:trash-bin-trash-linear" width={18} />}
                isDisabled={!avatarSource}
                onPress={handleAvatarRemove}
              >
                {messages.profile.removeAvatar}
              </Button>
            </div>
          </div>

          <p className="text-xs text-default-500">{messages.profile.avatarHint}</p>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                isRequired
                label={messages.profile.nameLabel}
                labelPlacement="outside"
                placeholder={messages.profile.namePlaceholder}
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
                label={messages.profile.emailLabel}
                labelPlacement="outside"
                value={user?.email ?? ""}
                variant="bordered"
                isReadOnly
                description={messages.profile.emailReadonlyHint}
              />

              <Input
                label={messages.profile.phoneLabel}
                labelPlacement="outside"
                value={user?.phone ?? messages.profile.phoneNotSet}
                variant="bordered"
                isReadOnly
                description={messages.profile.phoneReadonlyHint}
              />
            </div>

            {fieldErrors.avatar ? (
              <Alert
                color="danger"
                title={messages.profile.errorTitle}
                description={fieldErrors.avatar}
                variant="flat"
              />
            ) : null}

            <Divider />

            <section className="space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                {messages.profile.passwordSectionTitle}
              </h2>

              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  autoComplete="current-password"
                  type="password"
                  label={messages.profile.currentPasswordLabel}
                  labelPlacement="outside"
                  placeholder={messages.profile.currentPasswordPlaceholder}
                  value={currentPassword}
                  onValueChange={(value) => {
                    setCurrentPassword(value);

                    if (fieldErrors.currentPassword) {
                      setFieldErrors((prev) => ({ ...prev, currentPassword: undefined }));
                    }
                  }}
                  variant="bordered"
                  maxLength={255}
                  isInvalid={Boolean(fieldErrors.currentPassword)}
                  errorMessage={fieldErrors.currentPassword}
                />

                <Input
                  autoComplete="new-password"
                  type="password"
                  label={messages.profile.newPasswordLabel}
                  labelPlacement="outside"
                  placeholder={messages.profile.newPasswordPlaceholder}
                  value={newPassword}
                  onValueChange={(value) => {
                    setNewPassword(value);

                    if (fieldErrors.newPassword) {
                      setFieldErrors((prev) => ({ ...prev, newPassword: undefined }));
                    }
                  }}
                  variant="bordered"
                  maxLength={255}
                  isInvalid={Boolean(fieldErrors.newPassword)}
                  errorMessage={fieldErrors.newPassword}
                />

                <Input
                  autoComplete="new-password"
                  type="password"
                  label={messages.profile.confirmPasswordLabel}
                  labelPlacement="outside"
                  placeholder={messages.profile.confirmPasswordPlaceholder}
                  value={confirmPassword}
                  onValueChange={(value) => {
                    setConfirmPassword(value);

                    if (fieldErrors.confirmPassword) {
                      setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  variant="bordered"
                  maxLength={255}
                  isInvalid={Boolean(fieldErrors.confirmPassword)}
                  errorMessage={fieldErrors.confirmPassword}
                />
              </div>
            </section>

            {globalError ? (
              <Alert
                color="danger"
                title={messages.profile.errorTitle}
                description={globalError}
                variant="flat"
              />
            ) : null}

            {globalSuccess ? (
              <Alert
                color="success"
                title={messages.profile.successTitle}
                description={globalSuccess}
                variant="flat"
              />
            ) : null}

            <div className="flex justify-end">
              <Button type="submit" color="primary" isLoading={isSubmitting}>
                {messages.profile.saveButton}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
}
