import { Icon } from "@iconify/react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Switch,
  Checkbox,
  useDisclosure,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "../auth/authClient";
import { useAuth } from "../auth/AuthProvider";
import { getAuthToken } from "../auth/authStorage";
import { PAGE_ACCESS_KEYS } from "../auth/pageAccess";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import {
  employeeCreateRequest,
  employeeDeleteRequest,
  employeesListRequest,
  employeeUpdateRequest,
  type EmployeeItem,
} from "../employees/employeesClient";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

type EmployeeFormState = {
  name: string;
  email: string;
  phone: string;
  status: boolean;
  pageAccess: string[];
};

const PHONE_REGEX = /^\+[1-9][0-9]{7,14}$/;

function toFormState(employee: EmployeeItem | null): EmployeeFormState {
  if (!employee) {
    return {
      name: "",
      email: "",
      phone: "",
      status: true,
      pageAccess: ["dashboard"],
    };
  }

  return {
    name: employee.name,
    email: employee.email,
    phone: employee.phone ?? "",
    status: employee.status,
    pageAccess: [...employee.page_access],
  };
}

function normalizePhoneInput(value: string): string {
  const trimmed = value.trim();
  if (trimmed === "") {
    return "";
  }

  let normalized = trimmed.replace(/[^0-9+]/g, "");
  if (normalized !== "" && normalized[0] !== "+") {
    normalized = `+${normalized}`;
  }

  return normalized;
}

export default function EmployeesPage() {
  const { user, logout } = useAuth();
  const { locale, messages } = useI18n();
  const modal = useDisclosure();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<number | null>(null);
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [availablePageAccess, setAvailablePageAccess] = useState<string[]>([...PAGE_ACCESS_KEYS]);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeItem | null>(null);
  const [form, setForm] = useState<EmployeeFormState>(toFormState(null));
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);

  usePageSeo({
    title: `${messages.employees.title} | ${messages.app.name}`,
    description: messages.employees.subtitle,
    locale,
  });

  const pageLabelMap = useMemo<Record<string, string>>(() => ({
    dashboard: messages.employees.pageDashboard,
    "client-requests": messages.employees.pageClientRequests,
    "client-questions": messages.employees.pageClientQuestions,
    "client-chats": messages.employees.pageClientChats,
    "client-base": messages.employees.pageClientBase,
    calendar: messages.employees.pageCalendar,
    "assistant-training": messages.employees.pageAssistantTraining,
    integrations: messages.employees.pageIntegrations,
    "products-services": messages.employees.pageProductsServices,
    billing: messages.employees.pageBilling,
    "business-settings": messages.employees.pageBusinessSettings,
    employees: messages.employees.pageEmployees,
  }), [messages.employees]);

  const pageAccessOptions = useMemo(
    () => availablePageAccess.filter((key) => key in pageLabelMap),
    [availablePageAccess, pageLabelMap],
  );

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const loadEmployees = useCallback(async (silent = false) => {
    const token = getAuthToken();
    if (!token) {
      setGlobalError(messages.employees.unauthorized);
      setIsLoading(false);
      return;
    }

    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setGlobalError(null);

    try {
      const response = await employeesListRequest(token);
      setEmployees(response.employees);
      setAvailablePageAccess(
        response.available_page_access.length > 0
          ? response.available_page_access
          : [...PAGE_ACCESS_KEYS],
      );
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.employees.loadFailed,
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [messages.employees.loadFailed, messages.employees.unauthorized]);

  useEffect(() => {
    void loadEmployees(false);
  }, [loadEmployees]);

  const openCreate = () => {
    setEditingEmployee(null);
    setForm(toFormState(null));
    setGlobalError(null);
    setGlobalSuccess(null);
    modal.onOpen();
  };

  const openEdit = (employee: EmployeeItem) => {
    setEditingEmployee(employee);
    setForm(toFormState(employee));
    setGlobalError(null);
    setGlobalSuccess(null);
    modal.onOpen();
  };

  const togglePageAccess = (key: string, isSelected: boolean) => {
    setForm((prev) => {
      if (isSelected) {
        if (prev.pageAccess.includes(key)) {
          return prev;
        }
        return {
          ...prev,
          pageAccess: [...prev.pageAccess, key],
        };
      }

      return {
        ...prev,
        pageAccess: prev.pageAccess.filter((entry) => entry !== key),
      };
    });
  };

  const validateForm = (): string | null => {
    const name = form.name.trim();
    if (name.length < 2) {
      return messages.employees.validationName;
    }

    const email = form.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return messages.employees.validationEmail;
    }

    const phone = normalizePhoneInput(form.phone);
    if (!PHONE_REGEX.test(phone)) {
      return messages.employees.validationPhone;
    }

    if (form.pageAccess.length === 0) {
      return messages.employees.validationPageAccess;
    }

    return null;
  };

  const submitForm = async () => {
    const validationError = validateForm();
    if (validationError) {
      setGlobalError(validationError);
      setGlobalSuccess(null);
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setGlobalError(messages.employees.unauthorized);
      return;
    }

    setIsSaving(true);
    setGlobalError(null);
    setGlobalSuccess(null);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: normalizePhoneInput(form.phone),
      page_access: [...form.pageAccess],
      status: form.status,
    };

    try {
      if (editingEmployee) {
        const response = await employeeUpdateRequest(token, editingEmployee.id, payload);
        setEmployees((prev) => prev.map((item) => (
          item.id === response.employee.id ? response.employee : item
        )));
        setGlobalSuccess(messages.employees.updateSuccess);
      } else {
        const response = await employeeCreateRequest(token, payload);
        setEmployees((prev) => [response.employee, ...prev]);
        setGlobalSuccess(messages.employees.createSuccess);
      }

      modal.onClose();
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.employees.saveFailed,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const removeEmployee = async (employee: EmployeeItem) => {
    const confirmed = window.confirm(
      locale === "ru"
        ? `Удалить сотрудника "${employee.name}"?`
        : `Delete employee "${employee.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setGlobalError(messages.employees.unauthorized);
      return;
    }

    setDeletingEmployeeId(employee.id);
    setGlobalError(null);
    setGlobalSuccess(null);

    try {
      await employeeDeleteRequest(token, employee.id);
      setEmployees((prev) => prev.filter((item) => item.id !== employee.id));
      setGlobalSuccess(messages.employees.deleteSuccess);
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.employees.deleteFailed,
      );
    } finally {
      setDeletingEmployeeId(null);
    }
  };

  return (
    <DashboardLayout
      title={messages.employees.title}
      user={user}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      defaultSelectedKey="employees"
    >
      <Card className="border border-default-200 shadow-none">
        <CardBody className="space-y-4 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">
                {messages.employees.title}
              </h2>
              <p className="text-sm text-default-500">
                {messages.employees.subtitle}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="bordered"
                onPress={() => {
                  void loadEmployees(true);
                }}
                isLoading={isRefreshing}
              >
                {messages.employees.refreshButton}
              </Button>
              <Button
                color="primary"
                startContent={<Icon icon="solar:add-circle-linear" width={18} />}
                onPress={openCreate}
              >
                {messages.employees.addButton}
              </Button>
            </div>
          </div>

          {globalError && (
            <Alert
              color="danger"
              title={messages.employees.errorTitle}
              description={globalError}
            />
          )}

          {globalSuccess && (
            <Alert
              color="success"
              title={messages.employees.successTitle}
              description={globalSuccess}
            />
          )}

          {isLoading ? (
            <div className="grid min-h-44 place-items-center">
              <Spinner label={messages.employees.loading} />
            </div>
          ) : employees.length === 0 ? (
            <div className="rounded-large border border-dashed border-default-300 bg-default-50 px-4 py-12 text-center text-default-500">
              {messages.employees.empty}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {employees.map((employee) => (
                <Card key={employee.id} className="border border-default-200 shadow-none">
                  <CardBody className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-foreground">{employee.name}</p>
                        <p className="text-sm text-default-600">{employee.email}</p>
                        <p className="text-sm text-default-500">{employee.phone ?? "-"}</p>
                      </div>
                      <Chip
                        size="sm"
                        color={employee.status ? "success" : "default"}
                        variant="flat"
                      >
                        {employee.status
                          ? messages.employees.activeStatus
                          : messages.employees.inactiveStatus}
                      </Chip>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {employee.page_access.map((pageKey) => (
                        <Chip key={`${employee.id}-${pageKey}`} size="sm" variant="flat">
                          {pageLabelMap[pageKey] ?? pageKey}
                        </Chip>
                      ))}
                    </div>

                    <div className="flex items-center justify-end gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        aria-label={messages.employees.editButton}
                        onPress={() => openEdit(employee)}
                      >
                        <Icon icon="solar:pen-new-square-linear" width={18} />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        isLoading={deletingEmployeeId === employee.id}
                        aria-label={messages.employees.deleteButton}
                        onPress={() => {
                          void removeEmployee(employee);
                        }}
                      >
                        <Icon icon="solar:trash-bin-trash-linear" width={18} />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={modal.isOpen} onOpenChange={modal.onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {editingEmployee
                  ? messages.employees.editModalTitle
                  : messages.employees.createModalTitle}
              </ModalHeader>
              <ModalBody className="space-y-3">
                {!editingEmployee && (
                  <Alert
                    color="primary"
                    title={messages.employees.successTitle}
                    description={messages.employees.temporaryPasswordHint}
                  />
                )}

                <Input
                  label={messages.employees.nameLabel}
                  value={form.name}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
                />
                <Input
                  label={messages.employees.emailLabel}
                  type="email"
                  value={form.email}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
                />
                <Input
                  label={messages.employees.phoneLabel}
                  value={form.phone}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
                />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {messages.employees.pageAccessLabel}
                  </p>
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {pageAccessOptions.map((pageKey) => (
                      <Checkbox
                        key={pageKey}
                        isSelected={form.pageAccess.includes(pageKey)}
                        onValueChange={(isSelected) => togglePageAccess(pageKey, isSelected)}
                      >
                        {pageLabelMap[pageKey] ?? pageKey}
                      </Checkbox>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-medium border border-default-200 px-3 py-2">
                  <span className="text-sm text-default-700">{messages.employees.statusLabel}</span>
                  <Switch
                    isSelected={form.status}
                    onValueChange={(isSelected) => setForm((prev) => ({ ...prev, status: isSelected }))}
                  >
                    {form.status ? messages.employees.activeStatus : messages.employees.inactiveStatus}
                  </Switch>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {messages.employees.cancelButton}
                </Button>
                <Button
                  color="primary"
                  isLoading={isSaving}
                  onPress={() => {
                    void submitForm();
                  }}
                >
                  {messages.employees.saveButton}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
}
