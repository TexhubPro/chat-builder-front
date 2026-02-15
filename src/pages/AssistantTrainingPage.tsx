import { Icon } from "@iconify/react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Switch,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { ApiError } from "../auth/authClient";
import { useAuth } from "../auth/AuthProvider";
import { getAuthToken } from "../auth/authStorage";
import {
  assistantDeleteFileRequest,
  assistantsCreateRequest,
  assistantsDeleteRequest,
  assistantsListRequest,
  assistantsStartRequest,
  assistantsStopRequest,
  assistantsUpdateRequest,
  assistantUploadFilesRequest,
  type AssistantItem,
  type AssistantLimits,
  type AssistantTrigger,
} from "../assistant/assistantClient";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

type TriggerRow = {
  id: string;
  trigger: string;
  response: string;
};

function uniqueRowId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatFileSize(size: number | null, locale: "ru" | "en"): string {
  if (!size || size <= 0) {
    return locale === "ru" ? "0 Б" : "0 B";
  }

  const units =
    locale === "ru" ? ["Б", "КБ", "МБ", "ГБ"] : ["B", "KB", "MB", "GB"];
  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[unitIndex]}`;
}

function normalizeTriggers(rows: TriggerRow[]): AssistantTrigger[] {
  return rows
    .map((row) => ({
      trigger: row.trigger.trim(),
      response: row.response.trim(),
    }))
    .filter((row) => row.trigger !== "" && row.response !== "");
}

function rowsFromTriggers(
  triggers: AssistantTrigger[] | undefined,
): TriggerRow[] {
  if (!triggers || triggers.length === 0) {
    return [];
  }

  return triggers.map((trigger) => ({
    id: uniqueRowId(),
    trigger: trigger.trigger ?? "",
    response: trigger.response ?? "",
  }));
}

export default function AssistantTrainingPage() {
  const { user, logout } = useAuth();
  const { locale, messages } = useI18n();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [actionAssistantId, setActionAssistantId] = useState<number | null>(
    null,
  );
  const [assistants, setAssistants] = useState<AssistantItem[]>([]);
  const [limits, setLimits] = useState<AssistantLimits | null>(null);
  const [selectedAssistantId, setSelectedAssistantId] = useState<number | null>(
    null,
  );

  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [conversationTone, setConversationTone] = useState("polite");
  const [enableFileSearch, setEnableFileSearch] = useState(true);
  const [enableFileAnalysis, setEnableFileAnalysis] = useState(false);
  const [enableVoice, setEnableVoice] = useState(false);
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [triggers, setTriggers] = useState<TriggerRow[]>([]);

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  const [globalWarning, setGlobalWarning] = useState<string | null>(null);

  const [newAssistantName, setNewAssistantName] = useState("");
  const [assistantIdToDelete, setAssistantIdToDelete] = useState<number | null>(
    null,
  );

  const {
    isOpen: isCreateOpen,
    onOpen: onOpenCreate,
    onOpenChange: onOpenCreateChange,
    onClose: onCloseCreate,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onOpenChange: onOpenDeleteChange,
    onClose: onCloseDelete,
  } = useDisclosure();

  const filesInputRef = useRef<HTMLInputElement | null>(null);

  usePageSeo({
    title: `${messages.assistantTraining.title} | ${messages.app.name}`,
    description: messages.assistantTraining.subtitle,
    locale,
  });

  const selectedAssistant = useMemo(
    () =>
      assistants.find((assistant) => assistant.id === selectedAssistantId) ??
      null,
    [assistants, selectedAssistantId],
  );

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const hydrateEditorFromAssistant = (assistant: AssistantItem | null) => {
    if (!assistant) {
      setName("");
      setInstructions("");
      setRestrictions("");
      setConversationTone("polite");
      setEnableFileSearch(true);
      setEnableFileAnalysis(false);
      setEnableVoice(false);
      setEnableWebSearch(false);
      setTriggers([]);

      return;
    }

    setName(assistant.name ?? "");
    setInstructions(assistant.instructions ?? "");
    setRestrictions(assistant.restrictions ?? "");
    setConversationTone(assistant.conversation_tone ?? "polite");
    setEnableFileSearch(Boolean(assistant.enable_file_search));
    setEnableFileAnalysis(Boolean(assistant.enable_file_analysis));
    // Voice mode and web search are not available yet.
    setEnableVoice(false);
    setEnableWebSearch(false);
    setTriggers(rowsFromTriggers(assistant.settings?.triggers));
  };

  const showApiError = (error: unknown, fallback: string) => {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        setGlobalError(messages.assistantTraining.unauthorized);
        return;
      }

      setGlobalError(error.message);
      return;
    }

    if (error instanceof Error) {
      setGlobalError(error.message);
      return;
    }

    setGlobalError(fallback);
  };

  const loadAssistants = async () => {
    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.assistantTraining.unauthorized);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setGlobalError(null);

    try {
      const response = await assistantsListRequest(token);
      setAssistants(response.assistants);
      setLimits(response.limits);
      setSelectedAssistantId((currentId) => {
        if (
          currentId !== null &&
          response.assistants.some((assistant) => assistant.id === currentId)
        ) {
          return currentId;
        }

        return null;
      });
    } catch (error) {
      showApiError(error, messages.assistantTraining.loadFailed);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAssistants();
  }, []);

  useEffect(() => {
    hydrateEditorFromAssistant(selectedAssistant);
  }, [selectedAssistant]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedAssistant) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.assistantTraining.unauthorized);
      return;
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setGlobalError(messages.assistantTraining.nameValidation);
      return;
    }

    setIsSaving(true);
    setGlobalError(null);
    setGlobalSuccess(null);
    setGlobalWarning(null);

    try {
      const response = await assistantsUpdateRequest(
        token,
        selectedAssistant.id,
        {
          name: trimmedName,
          instructions,
          restrictions,
          conversation_tone: conversationTone,
          enable_file_search: enableFileSearch,
          enable_file_analysis: enableFileAnalysis,
          enable_voice: false,
          enable_web_search: false,
          settings: {
            triggers: normalizeTriggers(triggers),
          },
        },
      );

      setAssistants((previous) =>
        previous.map((assistant) =>
          assistant.id === response.assistant.id
            ? response.assistant
            : assistant,
        ),
      );
      setLimits(response.limits);
      setGlobalSuccess(messages.assistantTraining.saveSuccess);

      if (response.warning) {
        setGlobalWarning(response.warning);
      }
    } catch (error) {
      showApiError(error, messages.assistantTraining.saveFailed);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateAssistant = async () => {
    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.assistantTraining.unauthorized);
      return;
    }

    const trimmedName = newAssistantName.trim();

    if (trimmedName.length < 2) {
      setGlobalError(messages.assistantTraining.nameValidation);
      return;
    }

    setIsCreating(true);
    setGlobalError(null);
    setGlobalSuccess(null);
    setGlobalWarning(null);

    try {
      const response = await assistantsCreateRequest(token, {
        name: trimmedName,
        conversation_tone: "polite",
        enable_file_search: true,
        enable_file_analysis: false,
        enable_voice: false,
        enable_web_search: false,
      });

      setAssistants((previous) => [response.assistant, ...previous]);
      setLimits(response.limits);
      setSelectedAssistantId(response.assistant.id);
      setNewAssistantName("");
      setGlobalSuccess(messages.assistantTraining.createSuccess);

      if (response.warning) {
        setGlobalWarning(response.warning);
      }

      onCloseCreate();
    } catch (error) {
      showApiError(error, messages.assistantTraining.createFailed);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStartStopAssistant = async (assistant: AssistantItem) => {
    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.assistantTraining.unauthorized);
      return;
    }

    setActionAssistantId(assistant.id);
    setGlobalError(null);
    setGlobalSuccess(null);
    setGlobalWarning(null);

    try {
      const response = assistant.is_active
        ? await assistantsStopRequest(token, assistant.id)
        : await assistantsStartRequest(token, assistant.id);

      setAssistants((previous) =>
        previous.map((currentAssistant) =>
          currentAssistant.id === response.assistant.id
            ? response.assistant
            : currentAssistant,
        ),
      );
      setLimits(response.limits);
      setGlobalSuccess(
        assistant.is_active
          ? messages.assistantTraining.stopSuccess
          : messages.assistantTraining.startSuccess,
      );

      if (response.warning) {
        setGlobalWarning(response.warning);
      }
    } catch (error) {
      showApiError(error, messages.assistantTraining.actionFailed);
    } finally {
      setActionAssistantId(null);
    }
  };

  const handleDeleteAssistant = async () => {
    if (!assistantIdToDelete) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.assistantTraining.unauthorized);
      return;
    }

    setIsDeleting(true);
    setGlobalError(null);
    setGlobalSuccess(null);
    setGlobalWarning(null);

    try {
      const response = await assistantsDeleteRequest(
        token,
        assistantIdToDelete,
      );

      setAssistants((previous) =>
        previous.filter((assistant) => assistant.id !== assistantIdToDelete),
      );
      setLimits(response.limits);
      setSelectedAssistantId((currentId) =>
        currentId === assistantIdToDelete ? null : currentId,
      );
      setGlobalSuccess(messages.assistantTraining.deleteSuccess);

      if (response.warning) {
        setGlobalWarning(response.warning);
      }

      setAssistantIdToDelete(null);
      onCloseDelete();
      await loadAssistants();
    } catch (error) {
      showApiError(error, messages.assistantTraining.actionFailed);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFilesSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (!selectedAssistant || selectedFiles.length === 0) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.assistantTraining.unauthorized);
      return;
    }

    setIsUploadingFiles(true);
    setGlobalError(null);
    setGlobalSuccess(null);
    setGlobalWarning(null);

    try {
      const response = await assistantUploadFilesRequest(
        token,
        selectedAssistant.id,
        selectedFiles,
      );

      setAssistants((previous) =>
        previous.map((assistant) =>
          assistant.id === response.assistant.id
            ? response.assistant
            : assistant,
        ),
      );
      setGlobalSuccess(messages.assistantTraining.filesUploadedSuccess);

      if (response.warning) {
        setGlobalWarning(response.warning);
      }
    } catch (error) {
      showApiError(error, messages.assistantTraining.actionFailed);
    } finally {
      setIsUploadingFiles(false);

      if (filesInputRef.current) {
        filesInputRef.current.value = "";
      }
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    if (!selectedAssistant) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.assistantTraining.unauthorized);
      return;
    }

    setGlobalError(null);
    setGlobalSuccess(null);
    setGlobalWarning(null);

    try {
      const response = await assistantDeleteFileRequest(
        token,
        selectedAssistant.id,
        fileId,
      );

      setAssistants((previous) =>
        previous.map((assistant) =>
          assistant.id === response.assistant.id
            ? response.assistant
            : assistant,
        ),
      );
      setGlobalSuccess(messages.assistantTraining.fileDeletedSuccess);

      if (response.warning) {
        setGlobalWarning(response.warning);
      }
    } catch (error) {
      showApiError(error, messages.assistantTraining.actionFailed);
    }
  };

  const canCreateAssistant = limits?.can_create ?? false;
  const assistantCount = assistants.length;
  const assistantLimit = limits?.assistant_limit ?? 0;
  const isAssistantSelected = selectedAssistant !== null;
  const compactAlertClassNames = {
    base: "h-auto min-h-0 flex-grow-0 items-center py-2 px-3",
    mainWrapper: "h-auto min-h-0 flex-grow-0 justify-start",
    title: "text-sm",
    description: "text-xs leading-5",
  } as const;

  return (
    <DashboardLayout
      title={messages.assistantTraining.title}
      user={user}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      defaultSelectedKey="assistant-training"
    >
      <div className="space-y-4">
        {globalError ? (
          <Alert
            color="danger"
            variant="flat"
            classNames={compactAlertClassNames}
            title={messages.assistantTraining.errorTitle}
            description={globalError}
          />
        ) : null}

        {globalWarning ? (
          <Alert
            color="warning"
            variant="flat"
            classNames={compactAlertClassNames}
            title={messages.assistantTraining.warningTitle}
            description={globalWarning}
          />
        ) : null}

        {globalSuccess ? (
          <Alert
            color="success"
            variant="flat"
            classNames={compactAlertClassNames}
            title={messages.assistantTraining.successTitle}
            description={globalSuccess}
          />
        ) : null}

        {isLoading ? (
          <Card shadow="none" className="border border-default-200 bg-white">
            <CardBody className="flex min-h-[320px] items-center justify-center">
              <Spinner label={messages.assistantTraining.loading} />
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[360px_minmax(0,1.1fr)]">
            <Card
              shadow="none"
              className={`order-2 border border-default-200 bg-white ${
                isAssistantSelected ? "block" : "hidden"
              } xl:block`}
            >
              <CardHeader className="flex items-start justify-between gap-3 p-5 pb-3">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-foreground sm:text-lg">
                    {messages.assistantTraining.trainingTitle}
                  </h2>
                  <p className="text-sm text-default-500">
                    {messages.assistantTraining.subtitle}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => setSelectedAssistantId(null)}
                  startContent={
                    <Icon icon="solar:alt-arrow-left-linear" width={16} />
                  }
                >
                  {messages.assistantTraining.backToAssistantsButton}
                </Button>
              </CardHeader>
              <CardBody className="space-y-4 p-5 pt-0">
                {!selectedAssistant ? (
                  <div className="flex min-h-[260px] items-center justify-center rounded-large border border-dashed border-default-300 bg-default-50 p-6 text-center">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {messages.assistantTraining.selectAssistantTitle}
                      </p>
                      <p className="max-w-sm text-sm text-default-600">
                        {messages.assistantTraining.selectAssistantHint}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={handleSave}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Input
                        label={messages.assistantTraining.nameLabel}
                        value={name}
                        onValueChange={setName}
                        maxLength={120}
                        isRequired
                      />

                      <Select
                        label={messages.assistantTraining.toneLabel}
                        selectedKeys={[conversationTone]}
                        onSelectionChange={(keys) => {
                          const tone = Array.from(keys)[0];

                          if (typeof tone === "string") {
                            setConversationTone(tone);
                          }
                        }}
                      >
                        <SelectItem key="polite">
                          {messages.assistantTraining.tonePolite}
                        </SelectItem>
                        <SelectItem key="friendly">
                          {messages.assistantTraining.toneFriendly}
                        </SelectItem>
                        <SelectItem key="concise">
                          {messages.assistantTraining.toneConcise}
                        </SelectItem>
                        <SelectItem key="formal">
                          {messages.assistantTraining.toneFormal}
                        </SelectItem>
                        <SelectItem key="custom">
                          {messages.assistantTraining.toneCustom}
                        </SelectItem>
                      </Select>
                    </div>

                    <Textarea
                      label={messages.assistantTraining.instructionsLabel}
                      value={instructions}
                      onValueChange={setInstructions}
                      minRows={5}
                      maxLength={20000}
                    />

                    <Textarea
                      label={messages.assistantTraining.restrictionsLabel}
                      value={restrictions}
                      onValueChange={setRestrictions}
                      minRows={4}
                      maxLength={12000}
                    />

                    <Card
                      shadow="none"
                      className="border border-default-200 bg-default-50"
                    >
                      <CardBody className="space-y-4 p-4">
                        <h3 className="text-sm font-semibold text-foreground">
                          {messages.assistantTraining.settingsTitle}
                        </h3>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <Switch
                            isSelected={enableFileSearch}
                            onValueChange={setEnableFileSearch}
                          >
                            {messages.assistantTraining.fileSearchLabel}
                          </Switch>
                          <Switch
                            isSelected={enableFileAnalysis}
                            onValueChange={setEnableFileAnalysis}
                          >
                            {messages.assistantTraining.fileAnalysisLabel}
                          </Switch>
                          <Switch
                            isSelected={enableVoice}
                            isDisabled
                            onValueChange={setEnableVoice}
                          >
                            <span className="flex items-center gap-2">
                              <span>{messages.assistantTraining.voiceLabel}</span>
                              <Chip size="sm" variant="flat" color="warning">
                                {messages.assistantTraining.comingSoonLabel}
                              </Chip>
                            </span>
                          </Switch>
                          <Switch
                            isSelected={enableWebSearch}
                            isDisabled
                            onValueChange={setEnableWebSearch}
                          >
                            <span className="flex items-center gap-2">
                              <span>{messages.assistantTraining.webSearchLabel}</span>
                              <Chip size="sm" variant="flat" color="warning">
                                {messages.assistantTraining.comingSoonLabel}
                              </Chip>
                            </span>
                          </Switch>
                        </div>
                      </CardBody>
                    </Card>

                    <div className="space-y-4">
                      <Card
                        shadow="none"
                        className="border border-default-200 bg-default-50"
                      >
                        <CardBody className="space-y-3 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-sm font-semibold text-foreground">
                              {messages.assistantTraining.triggersTitle}
                            </h3>
                            <Button
                              variant="light"
                              size="sm"
                              className="px-3 text-xs text-primary"
                              onPress={() =>
                                setTriggers((previous) => [
                                  ...previous,
                                  {
                                    id: uniqueRowId(),
                                    trigger: "",
                                    response: "",
                                  },
                                ])
                              }
                              startContent={
                                <Icon
                                  icon="solar:add-circle-linear"
                                  width={16}
                                />
                              }
                            >
                              {messages.assistantTraining.addTriggerButton}
                            </Button>
                          </div>

                          {triggers.length === 0 ? (
                            <p className="text-sm text-default-500">
                              {messages.assistantTraining.noTriggers}
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {triggers.map((triggerRow) => (
                                <div
                                  key={triggerRow.id}
                                  className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.5rem]"
                                >
                                  <Input
                                    size="sm"
                                    classNames={{
                                      inputWrapper: "h-10 min-h-10",
                                    }}
                                    aria-label={
                                      messages.assistantTraining.triggerLabel
                                    }
                                    placeholder={
                                      messages.assistantTraining.triggerLabel
                                    }
                                    value={triggerRow.trigger}
                                    onValueChange={(value) =>
                                      setTriggers((previous) =>
                                        previous.map((row) =>
                                          row.id === triggerRow.id
                                            ? { ...row, trigger: value }
                                            : row,
                                        ),
                                      )
                                    }
                                  />
                                  <Input
                                    size="sm"
                                    classNames={{
                                      inputWrapper: "h-10 min-h-10",
                                    }}
                                    aria-label={
                                      messages.assistantTraining
                                        .triggerResponseLabel
                                    }
                                    placeholder={
                                      messages.assistantTraining
                                        .triggerResponseLabel
                                    }
                                    value={triggerRow.response}
                                    onValueChange={(value) =>
                                      setTriggers((previous) =>
                                        previous.map((row) =>
                                          row.id === triggerRow.id
                                            ? { ...row, response: value }
                                            : row,
                                        ),
                                      )
                                    }
                                  />
                                  <Button
                                    color="danger"
                                    variant="light"
                                    isIconOnly
                                    className="h-10 min-h-10 w-10 self-stretch rounded-medium"
                                    onPress={() =>
                                      setTriggers((previous) =>
                                        previous.filter(
                                          (row) => row.id !== triggerRow.id,
                                        ),
                                      )
                                    }
                                    aria-label={
                                      messages.assistantTraining
                                        .removeTriggerButton
                                    }
                                  >
                                    <Icon
                                      icon="solar:trash-bin-trash-outline"
                                      width={18}
                                    />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardBody>
                      </Card>

                      <Card
                        shadow="none"
                        className="border border-default-200 bg-default-50"
                      >
                        <CardBody className="space-y-3 p-4">
                          <h3 className="text-sm font-semibold text-foreground">
                            {messages.assistantTraining.filesTitle}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              variant="flat"
                              color="primary"
                              size="sm"
                              onPress={() => filesInputRef.current?.click()}
                              isLoading={isUploadingFiles}
                              startContent={
                                <Icon icon="solar:upload-linear" width={16} />
                              }
                            >
                              {messages.assistantTraining.uploadFilesButton}
                            </Button>
                            <span className="text-xs text-default-500">
                              TXT, PDF, Word
                            </span>
                            <input
                              ref={filesInputRef}
                              type="file"
                              accept=".txt,.pdf,.doc,.docx,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              className="hidden"
                              multiple
                              onChange={handleFilesSelection}
                            />
                          </div>

                          {selectedAssistant.instruction_files.length === 0 ? (
                            <p className="text-sm text-default-500">
                              {messages.assistantTraining.noFiles}
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {selectedAssistant.instruction_files.map(
                                (file) => (
                                  <div
                                    key={file.id}
                                    className="flex items-center justify-between gap-3 rounded-large border border-default-200 bg-white px-3 py-2"
                                  >
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-medium text-foreground">
                                        {file.original_name}
                                      </p>
                                      <p className="text-xs text-default-500">
                                        {formatFileSize(file.size, locale)}
                                      </p>
                                    </div>
                                    <Button
                                      color="danger"
                                      variant="light"
                                      isIconOnly
                                      size="sm"
                                      onPress={() => handleDeleteFile(file.id)}
                                      aria-label={
                                        messages.assistantTraining
                                          .deleteFileButton
                                      }
                                    >
                                      <Icon
                                        icon="solar:trash-bin-trash-outline"
                                        width={18}
                                      />
                                    </Button>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    </div>

                    <Button type="submit" color="primary" isLoading={isSaving}>
                      {messages.assistantTraining.saveButton}
                    </Button>
                  </form>
                )}
              </CardBody>
            </Card>

            <Card
              shadow="none"
              className={`order-1 border border-default-200 bg-white ${
                isAssistantSelected ? "hidden xl:block" : "block"
              }`}
            >
              <CardHeader className="flex items-start justify-between gap-3 p-5 pb-3">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-foreground">
                    {messages.assistantTraining.listTitle}
                  </h2>
                  <p className="text-xs text-default-500">
                    {messages.assistantTraining.limitLabel}: {assistantCount}/
                    {assistantLimit}
                  </p>
                </div>
                <Button
                  size="sm"
                  color="primary"
                  onPress={onOpenCreate}
                  isDisabled={!canCreateAssistant}
                  startContent={
                    <Icon icon="solar:add-circle-linear" width={16} />
                  }
                >
                  {messages.assistantTraining.createButton}
                </Button>
              </CardHeader>
              <CardBody className="space-y-3 p-5 pt-0">
                {!limits?.has_active_subscription ? (
                  <Alert
                    color="warning"
                    variant="flat"
                    classNames={compactAlertClassNames}
                    title={messages.assistantTraining.inactiveSubscriptionTitle}
                    description={
                      messages.assistantTraining.inactiveSubscriptionDescription
                    }
                  />
                ) : null}

                {!canCreateAssistant && limits?.has_active_subscription ? (
                  <Alert
                    color="danger"
                    variant="flat"
                    classNames={compactAlertClassNames}
                    title={messages.assistantTraining.limitReachedTitle}
                    description={
                      messages.assistantTraining.limitReachedDescription
                    }
                  />
                ) : null}

                <Divider />

                {assistants.length === 0 ? (
                  <p className="text-sm text-default-500">
                    {messages.assistantTraining.noAssistants}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {assistants.map((assistant) => (
                      <Card
                        key={assistant.id}
                        shadow="none"
                        className={`border ${
                          assistant.id === selectedAssistantId
                            ? "border-primary bg-primary/5"
                            : "border-default-200 bg-white"
                        }`}
                      >
                        <CardBody className="space-y-2 p-3">
                          <button
                            type="button"
                            className="w-full text-left"
                            onClick={() => setSelectedAssistantId(assistant.id)}
                          >
                            <p className="truncate text-sm font-semibold text-foreground">
                              {assistant.name}
                            </p>
                            <p className="text-xs text-default-500">
                              ID: {assistant.id}
                            </p>
                          </button>

                          <div className="flex items-center justify-between gap-2">
                            <Chip
                              size="sm"
                              variant="flat"
                              color={
                                assistant.is_active ? "success" : "default"
                              }
                            >
                              {assistant.is_active
                                ? messages.assistantTraining.statusRunning
                                : messages.assistantTraining.statusStopped}
                            </Chip>

                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="light"
                                color={
                                  assistant.is_active ? "warning" : "success"
                                }
                                onPress={() =>
                                  handleStartStopAssistant(assistant)
                                }
                                isLoading={actionAssistantId === assistant.id}
                                startContent={
                                  <Icon
                                    icon={
                                      assistant.is_active
                                        ? "solar:pause-circle-linear"
                                        : "solar:play-circle-linear"
                                    }
                                    width={16}
                                  />
                                }
                              >
                                {assistant.is_active
                                  ? messages.assistantTraining.stopButton
                                  : messages.assistantTraining.startButton}
                              </Button>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="danger"
                                onPress={() => {
                                  setAssistantIdToDelete(assistant.id);
                                  onOpenDelete();
                                }}
                                aria-label={
                                  messages.assistantTraining.deleteButton
                                }
                              >
                                <Icon
                                  icon="solar:trash-bin-trash-outline"
                                  width={16}
                                />
                              </Button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        )}
      </div>

      <Modal isOpen={isCreateOpen} onOpenChange={onOpenCreateChange}>
        <ModalContent>
          <ModalHeader>
            {messages.assistantTraining.createModalTitle}
          </ModalHeader>
          <ModalBody>
            <Input
              label={messages.assistantTraining.createModalNameLabel}
              value={newAssistantName}
              onValueChange={setNewAssistantName}
              placeholder={
                messages.assistantTraining.createModalNamePlaceholder
              }
              maxLength={120}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCloseCreate}>
              {messages.assistantTraining.createModalCancel}
            </Button>
            <Button
              color="primary"
              onPress={handleCreateAssistant}
              isLoading={isCreating}
            >
              {messages.assistantTraining.createModalCreate}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onOpenChange={onOpenDeleteChange}>
        <ModalContent>
          <ModalHeader>
            {messages.assistantTraining.deleteModalTitle}
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-default-600">
              {messages.assistantTraining.deleteModalDescription}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCloseDelete}>
              {messages.assistantTraining.deleteModalCancel}
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteAssistant}
              isLoading={isDeleting}
            >
              {messages.assistantTraining.deleteModalConfirm}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
}
