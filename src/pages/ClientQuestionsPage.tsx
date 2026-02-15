import { Icon } from "@iconify/react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../auth/authClient";
import { useAuth } from "../auth/AuthProvider";
import { getAuthToken } from "../auth/authStorage";
import {
  clientQuestionDeleteRequest,
  clientQuestionsListRequest,
  clientQuestionUpdateRequest,
  type ClientQuestionBoard,
  type ClientQuestionItem,
  type ClientQuestionStatus,
} from "../clientQuestions/clientQuestionsClient";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

type EditFormState = {
  description: string;
  status: ClientQuestionStatus;
};

function formatDateTime(value: string | null, locale: "ru" | "en"): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function statusFromBoard(board: ClientQuestionBoard): ClientQuestionStatus {
  if (board === "new") {
    return "open";
  }

  if (board === "in_progress") {
    return "in_progress";
  }

  return "answered";
}

export default function ClientQuestionsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { locale, messages } = useI18n();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [questions, setQuestions] = useState<ClientQuestionItem[]>([]);
  const [editingQuestion, setEditingQuestion] =
    useState<ClientQuestionItem | null>(null);
  const [deletingQuestion, setDeletingQuestion] =
    useState<ClientQuestionItem | null>(null);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);

  usePageSeo({
    title: `${messages.clientQuestions.title} | ${messages.app.name}`,
    description: messages.clientQuestions.subtitle,
    locale,
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const loadQuestions = useCallback(
    async () => {
      const token = getAuthToken();

      if (!token) {
        setGlobalError(messages.clientQuestions.unauthorized);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await clientQuestionsListRequest(token);
        setQuestions(response.questions);
      } catch (error) {
        setGlobalError(
          error instanceof ApiError
            ? error.message
            : messages.clientQuestions.updateFailed,
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      messages.clientQuestions.unauthorized,
      messages.clientQuestions.updateFailed,
    ],
  );

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  const columns = useMemo(
    () => [
      {
        key: "new" as ClientQuestionBoard,
        label: messages.clientQuestions.columnNew,
      },
      {
        key: "in_progress" as ClientQuestionBoard,
        label: messages.clientQuestions.columnInProgress,
      },
      {
        key: "completed" as ClientQuestionBoard,
        label: messages.clientQuestions.columnCompleted,
      },
    ],
    [
      messages.clientQuestions.columnCompleted,
      messages.clientQuestions.columnInProgress,
      messages.clientQuestions.columnNew,
    ],
  );

  const grouped = useMemo(() => {
    const map = new Map<ClientQuestionBoard, ClientQuestionItem[]>();

    columns.forEach((column) => {
      map.set(column.key, []);
    });

    questions.forEach((question) => {
      const list = map.get(question.board);
      if (list) {
        list.push(question);
      }
    });

    return map;
  }, [columns, questions]);

  const statusLabel = (status: ClientQuestionStatus): string => {
    switch (status) {
      case "in_progress":
        return messages.clientQuestions.statusInProgress;
      case "answered":
        return messages.clientQuestions.statusAnswered;
      case "closed":
        return messages.clientQuestions.statusClosed;
      default:
        return messages.clientQuestions.statusOpen;
    }
  };

  const statusColor = (
    status: ClientQuestionStatus,
  ): "default" | "primary" | "success" => {
    switch (status) {
      case "in_progress":
        return "primary";
      case "answered":
      case "closed":
        return "success";
      default:
        return "default";
    }
  };

  const openEditModal = (question: ClientQuestionItem) => {
    setEditingQuestion(question);
    setEditForm({
      description: question.description,
      status: question.status,
    });
  };

  const closeEditModal = () => {
    setEditingQuestion(null);
    setEditForm(null);
  };

  const saveQuestion = async () => {
    if (!editingQuestion || !editForm) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.clientQuestions.unauthorized);
      return;
    }

    const description = editForm.description.trim();
    if (description.length < 2) {
      setGlobalError(messages.clientQuestions.requiredFields);
      return;
    }

    setIsSaving(true);
    setGlobalError(null);

    try {
      const response = await clientQuestionUpdateRequest(
        token,
        editingQuestion.id,
        {
          description,
          status: editForm.status,
        },
      );

      setQuestions((previous) =>
        previous.map((item) =>
          item.id === response.question.id ? response.question : item,
        ),
      );

      setGlobalSuccess(messages.clientQuestions.updateSuccess);
      closeEditModal();
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.clientQuestions.updateFailed,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const moveQuestionToBoard = async (
    question: ClientQuestionItem,
    board: ClientQuestionBoard,
  ) => {
    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.clientQuestions.unauthorized);
      return;
    }

    setGlobalError(null);

    try {
      const response = await clientQuestionUpdateRequest(token, question.id, {
        board,
        status: statusFromBoard(board),
      });

      setQuestions((previous) =>
        previous.map((item) =>
          item.id === response.question.id ? response.question : item,
        ),
      );
      setGlobalSuccess(messages.clientQuestions.updateSuccess);
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.clientQuestions.updateFailed,
      );
    }
  };

  const archiveQuestion = async () => {
    if (!deletingQuestion) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.clientQuestions.unauthorized);
      return;
    }

    setIsDeleting(true);
    setGlobalError(null);

    try {
      await clientQuestionDeleteRequest(token, deletingQuestion.id);

      setQuestions((previous) =>
        previous.filter((item) => item.id !== deletingQuestion.id),
      );
      setDeletingQuestion(null);
      setGlobalSuccess(messages.clientQuestions.deleteSuccess);
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.clientQuestions.deleteFailed,
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout
      title={messages.clientQuestions.title}
      user={user}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      defaultSelectedKey="client-questions"
    >
      <div className="space-y-4">
        {globalError ? (
          <Alert
            color="danger"
            title={messages.clientQuestions.errorTitle}
            description={globalError}
          />
        ) : null}

        {globalSuccess ? (
          <Alert
            color="success"
            title={messages.clientQuestions.successTitle}
            description={globalSuccess}
          />
        ) : null}

        {isLoading ? (
          <Card className="border border-default-200 shadow-none">
            <CardBody className="grid min-h-56 place-items-center">
              <Spinner label={messages.clientQuestions.loading} />
            </CardBody>
          </Card>
        ) : questions.length === 0 ? (
          <Card className="border border-default-200 shadow-none">
            <CardBody className="rounded-large border border-dashed border-default-300 bg-default-50 px-4 py-14 text-center text-default-500">
              {messages.clientQuestions.empty}
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
            {columns.map((column) => (
              <Card
                key={column.key}
                className="border border-default-200 shadow-none"
              >
                <CardBody className="space-y-3 p-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    {column.label}
                  </h3>
                  <div className="space-y-3">
                    {(grouped.get(column.key) ?? []).map((item) => {
                      const nextBoard =
                        item.board === "new"
                          ? "in_progress"
                          : item.board === "in_progress"
                          ? "completed"
                          : "in_progress";
                      const nextButtonLabel =
                        item.board === "new"
                          ? messages.clientQuestions.moveToProgressButton
                          : item.board === "in_progress"
                          ? messages.clientQuestions.moveToCompletedButton
                          : messages.clientQuestions.reopenButton;

                      return (
                        <Card
                          key={item.id}
                          className="border border-default-200 bg-default-50 shadow-none"
                        >
                          <CardBody className="space-y-3 p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-foreground">
                                  {item.client?.name ??
                                    messages.clientQuestions.noClient}
                                </p>
                                <p className="truncate text-xs text-default-500">
                                  {item.assistant?.name ?? "-"}
                                </p>
                              </div>
                              <Chip
                                size="sm"
                                variant="flat"
                                color={statusColor(item.status)}
                              >
                                {statusLabel(item.status)}
                              </Chip>
                            </div>

                            <p className="line-clamp-4 text-sm text-default-700">
                              {item.description}
                            </p>

                            <div className="space-y-1 text-xs text-default-500">
                              <p className="flex items-center gap-1.5">
                                <Icon icon="solar:phone-linear" width={14} />
                                <span>
                                  {messages.clientQuestions.phoneLabel}:{" "}
                                  {item.client?.phone ||
                                    messages.clientQuestions.noPhone}
                                </span>
                              </p>
                              <p className="flex items-center gap-1.5">
                                <Icon
                                  icon="solar:clock-circle-linear"
                                  width={14}
                                />
                                <span>
                                  {messages.clientQuestions.updatedAtLabel}:{" "}
                                  {formatDateTime(item.updated_at, locale)}
                                </span>
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="flat"
                                className="flex-1"
                                isDisabled={!item.source_chat_id}
                                onPress={() => {
                                  if (!item.source_chat_id) {
                                    return;
                                  }

                                  navigate("/client-chats");
                                }}
                              >
                                {item.source_chat_id
                                  ? messages.clientQuestions.openChatButton
                                  : messages.clientQuestions.noChat}
                              </Button>
                              <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                isIconOnly
                                onPress={() => openEditModal(item)}
                                aria-label={messages.clientQuestions.editButton}
                              >
                                <Icon icon="solar:pen-linear" width={17} />
                              </Button>
                              <Button
                                size="sm"
                                variant="flat"
                                color="danger"
                                isIconOnly
                                onPress={() => setDeletingQuestion(item)}
                                aria-label={
                                  messages.clientQuestions.deleteButton
                                }
                              >
                                <Icon
                                  icon="solar:trash-bin-trash-linear"
                                  width={17}
                                />
                              </Button>
                            </div>

                            <Button
                              size="sm"
                              color={
                                item.board === "in_progress"
                                  ? "success"
                                  : "primary"
                              }
                              className="w-full"
                              onPress={() => {
                                void moveQuestionToBoard(item, nextBoard);
                              }}
                            >
                              {nextButtonLabel}
                            </Button>
                          </CardBody>
                        </Card>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={Boolean(editingQuestion && editForm)}
        onOpenChange={closeEditModal}
      >
        <ModalContent>
          <ModalHeader>{messages.clientQuestions.editModalTitle}</ModalHeader>
          <ModalBody className="space-y-3">
            {editForm ? (
              <>
                <Textarea
                  label={messages.clientQuestions.editDescriptionLabel}
                  value={editForm.description}
                  onValueChange={(value) => {
                    setEditForm((previous) =>
                      previous
                        ? {
                            ...previous,
                            description: value,
                          }
                        : previous,
                    );
                  }}
                  minRows={5}
                />
                <Select
                  label={messages.clientQuestions.editStatusLabel}
                  selectedKeys={[editForm.status]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    if (typeof selected !== "string") {
                      return;
                    }

                    setEditForm((previous) =>
                      previous
                        ? {
                            ...previous,
                            status: selected as ClientQuestionStatus,
                          }
                        : previous,
                    );
                  }}
                >
                  <SelectItem key="open">
                    {messages.clientQuestions.statusOpen}
                  </SelectItem>
                  <SelectItem key="in_progress">
                    {messages.clientQuestions.statusInProgress}
                  </SelectItem>
                  <SelectItem key="answered">
                    {messages.clientQuestions.statusAnswered}
                  </SelectItem>
                  <SelectItem key="closed">
                    {messages.clientQuestions.statusClosed}
                  </SelectItem>
                </Select>
              </>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={closeEditModal}>
              {messages.clientQuestions.editCancel}
            </Button>
            <Button
              color="primary"
              isLoading={isSaving}
              onPress={() => {
                void saveQuestion();
              }}
            >
              {messages.clientQuestions.editSave}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={Boolean(deletingQuestion)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDeletingQuestion(null);
          }
        }}
      >
        <ModalContent>
          <ModalHeader>{messages.clientQuestions.deleteButton}</ModalHeader>
          <ModalBody>{deletingQuestion?.description}</ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setDeletingQuestion(null)}>
              {messages.clientQuestions.editCancel}
            </Button>
            <Button
              color="danger"
              isLoading={isDeleting}
              onPress={() => {
                void archiveQuestion();
              }}
            >
              {messages.clientQuestions.deleteButton}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
}
