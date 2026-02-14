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
  Select,
  SelectItem,
  Spinner,
  Switch,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "../auth/authClient";
import { useAuth } from "../auth/AuthProvider";
import { getAuthToken } from "../auth/authStorage";
import {
  assistantsListRequest,
  type AssistantItem,
} from "../assistant/assistantClient";
import {
  catalogProductCreateRequest,
  catalogProductDeleteRequest,
  catalogProductsListRequest,
  catalogProductUpdateRequest,
  catalogServiceCreateRequest,
  catalogServiceDeleteRequest,
  catalogServicesListRequest,
  catalogServiceUpdateRequest,
  type CatalogProductItem,
  type CatalogServiceItem,
} from "../catalog/catalogClient";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useI18n } from "../i18n/useI18n";
import { usePageSeo } from "../seo/usePageSeo";

type ServiceSpecialistFormState = {
  name: string;
  price: string;
};

type ServiceFormState = {
  name: string;
  description: string;
  terms: string;
  price: string;
  currency: string;
  photoUrls: string;
  specialists: ServiceSpecialistFormState[];
  isActive: boolean;
};

type ProductFormState = {
  name: string;
  sku: string;
  description: string;
  terms: string;
  price: string;
  currency: string;
  productUrl: string;
  photoUrls: string;
  isUnlimitedStock: boolean;
  stockQuantity: string;
  isActive: boolean;
};

const DEFAULT_CURRENCY = "TJS";
const CURRENCY_OPTIONS: Array<{ key: string; label: string }> = [
  { key: "TJS", label: "TJS" },
  { key: "USD", label: "USD" },
  { key: "EUR", label: "EUR" },
  { key: "RUB", label: "RUB" },
  { key: "UZS", label: "UZS" },
  { key: "KZT", label: "KZT" },
];

function formatMoney(amount: number, currency: string, locale: "ru" | "en"): string {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
    + ` ${currency}`;
}

function parsePhotoUrls(value: string): string[] {
  if (value.trim() === "") {
    return [];
  }

  return value
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean);
}

function toServiceForm(item: CatalogServiceItem | null): ServiceFormState {
  if (!item) {
    return {
      name: "",
      description: "",
      terms: "",
      price: "",
      currency: DEFAULT_CURRENCY,
      photoUrls: "",
      specialists: [],
      isActive: true,
    };
  }

  return {
    name: item.name,
    description: item.description ?? "",
    terms: item.terms_conditions ?? "",
    price: String(item.price),
    currency: item.currency,
    photoUrls: (item.photo_urls ?? []).join("\n"),
    specialists: (item.specialists ?? []).map((specialist) => ({
      name: specialist.name,
      price: String(specialist.price),
    })),
    isActive: item.is_active,
  };
}

function toProductForm(item: CatalogProductItem | null): ProductFormState {
  if (!item) {
    return {
      name: "",
      sku: "",
      description: "",
      terms: "",
      price: "",
      currency: DEFAULT_CURRENCY,
      productUrl: "",
      photoUrls: "",
      isUnlimitedStock: true,
      stockQuantity: "",
      isActive: true,
    };
  }

  return {
    name: item.name,
    sku: item.sku ?? "",
    description: item.description ?? "",
    terms: item.terms_conditions ?? "",
    price: String(item.price),
    currency: item.currency,
    productUrl: item.product_url ?? "",
    photoUrls: (item.photo_urls ?? []).join("\n"),
    isUnlimitedStock: item.is_unlimited_stock,
    stockQuantity: item.stock_quantity !== null ? String(item.stock_quantity) : "",
    isActive: item.is_active,
  };
}

export default function ProductsServicesPage() {
  const { user, logout } = useAuth();
  const { locale, messages } = useI18n();
  const serviceModal = useDisclosure();
  const productModal = useDisclosure();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingAssistants, setIsLoadingAssistants] = useState(true);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
  const [assistants, setAssistants] = useState<AssistantItem[]>([]);
  const [selectedAssistantId, setSelectedAssistantId] = useState<number | null>(null);
  const [services, setServices] = useState<CatalogServiceItem[]>([]);
  const [products, setProducts] = useState<CatalogProductItem[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<CatalogServiceItem | null>(null);
  const [editingProduct, setEditingProduct] = useState<CatalogProductItem | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceFormState>(toServiceForm(null));
  const [productForm, setProductForm] = useState<ProductFormState>(toProductForm(null));

  usePageSeo({
    title: `${messages.catalog.title} | ${messages.app.name}`,
    description: messages.catalog.subtitle,
    locale,
  });

  const selectedAssistant = useMemo(
    () => assistants.find((item) => item.id === selectedAssistantId) ?? null,
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

  const loadAssistants = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.catalog.unauthorized);
      setIsLoadingAssistants(false);
      return;
    }

    setIsLoadingAssistants(true);
    setGlobalError(null);

    try {
      const response = await assistantsListRequest(token);
      setAssistants(response.assistants);
      setSelectedAssistantId((prev) => {
        if (prev && response.assistants.some((assistant) => assistant.id === prev)) {
          return prev;
        }

        return null;
      });
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.catalog.loadAssistantsFailed,
      );
    } finally {
      setIsLoadingAssistants(false);
    }
  }, [messages.catalog.loadAssistantsFailed, messages.catalog.unauthorized]);

  const loadCatalog = useCallback(async (assistantId: number) => {
    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.catalog.unauthorized);
      return;
    }

    setIsLoadingCatalog(true);
    setGlobalError(null);

    try {
      const [servicesResponse, productsResponse] = await Promise.all([
        catalogServicesListRequest(token, assistantId),
        catalogProductsListRequest(token, assistantId),
      ]);

      setServices(servicesResponse.services);
      setProducts(productsResponse.products);
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.catalog.loadCatalogFailed,
      );
    } finally {
      setIsLoadingCatalog(false);
    }
  }, [messages.catalog.loadCatalogFailed, messages.catalog.unauthorized]);

  useEffect(() => {
    void loadAssistants();
  }, [loadAssistants]);

  useEffect(() => {
    if (!selectedAssistantId) {
      setServices([]);
      setProducts([]);
      return;
    }

    void loadCatalog(selectedAssistantId);
  }, [loadCatalog, selectedAssistantId]);

  const submitService = async () => {
    if (!selectedAssistantId) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.catalog.unauthorized);
      return;
    }

    const name = serviceForm.name.trim();
    const basePrice = Number(serviceForm.price);

    if (name.length < 2) {
      setGlobalError(messages.catalog.validationName);
      return;
    }

    if (Number.isNaN(basePrice) || basePrice < 0) {
      setGlobalError(messages.catalog.validationPrice);
      return;
    }

    const specialists: Array<{ name: string; price: number }> = [];
    for (const specialist of serviceForm.specialists) {
      const specialistName = specialist.name.trim();
      const specialistPriceRaw = specialist.price.trim();

      if (specialistName === "" && specialistPriceRaw === "") {
        continue;
      }

      if (specialistName.length < 2) {
        setGlobalError(messages.catalog.validationSpecialistName);
        return;
      }

      if (specialistPriceRaw === "") {
        specialists.push({ name: specialistName, price: basePrice });
        continue;
      }

      const specialistPrice = Number(specialistPriceRaw);
      if (Number.isNaN(specialistPrice) || specialistPrice < 0) {
        setGlobalError(messages.catalog.validationSpecialistPrice);
        return;
      }

      specialists.push({ name: specialistName, price: specialistPrice });
    }

    setIsSaving(true);
    setGlobalError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        assistant_id: selectedAssistantId,
        name,
        description: serviceForm.description.trim(),
        terms_conditions: serviceForm.terms.trim(),
        price: basePrice,
        currency: serviceForm.currency.trim().toUpperCase() || DEFAULT_CURRENCY,
        photo_urls: parsePhotoUrls(serviceForm.photoUrls),
        specialists,
        is_active: serviceForm.isActive,
      };

      if (editingService) {
        await catalogServiceUpdateRequest(token, editingService.id, payload);
        setSuccessMessage(messages.catalog.serviceUpdated);
      } else {
        await catalogServiceCreateRequest(token, payload);
        setSuccessMessage(messages.catalog.serviceCreated);
      }

      await loadCatalog(selectedAssistantId);
      serviceModal.onClose();
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.catalog.saveFailed,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const submitProduct = async () => {
    if (!selectedAssistantId) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setGlobalError(messages.catalog.unauthorized);
      return;
    }

    const name = productForm.name.trim();
    const price = Number(productForm.price);
    const stockQuantity = Number(productForm.stockQuantity);
    const productUrl = productForm.productUrl.trim();

    if (name.length < 2) {
      setGlobalError(messages.catalog.validationName);
      return;
    }

    if (Number.isNaN(price) || price < 0) {
      setGlobalError(messages.catalog.validationPrice);
      return;
    }

    if (!productForm.isUnlimitedStock && (Number.isNaN(stockQuantity) || stockQuantity < 0)) {
      setGlobalError(messages.catalog.validationStock);
      return;
    }

    if (productUrl !== "") {
      try {
        new URL(productUrl);
      } catch {
        setGlobalError(messages.catalog.validationProductLink);
        return;
      }
    }

    setIsSaving(true);
    setGlobalError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        assistant_id: selectedAssistantId,
        name,
        sku: productForm.sku.trim(),
        description: productForm.description.trim(),
        terms_conditions: productForm.terms.trim(),
        price,
        currency: productForm.currency.trim().toUpperCase() || DEFAULT_CURRENCY,
        product_url: productUrl === "" ? undefined : productUrl,
        photo_urls: parsePhotoUrls(productForm.photoUrls),
        is_unlimited_stock: productForm.isUnlimitedStock,
        stock_quantity: productForm.isUnlimitedStock ? undefined : Math.floor(stockQuantity),
        is_active: productForm.isActive,
      };

      if (editingProduct) {
        await catalogProductUpdateRequest(token, editingProduct.id, payload);
        setSuccessMessage(messages.catalog.productUpdated);
      } else {
        await catalogProductCreateRequest(token, payload);
        setSuccessMessage(messages.catalog.productCreated);
      }

      await loadCatalog(selectedAssistantId);
      productModal.onClose();
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.catalog.saveFailed,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteService = async (serviceId: number) => {
    if (!selectedAssistantId) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setGlobalError(messages.catalog.unauthorized);
      return;
    }

    setGlobalError(null);
    setSuccessMessage(null);

    try {
      await catalogServiceDeleteRequest(token, serviceId);
      setSuccessMessage(messages.catalog.serviceDeleted);
      await loadCatalog(selectedAssistantId);
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.catalog.deleteFailed,
      );
    }
  };

  const deleteProduct = async (productId: number) => {
    if (!selectedAssistantId) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setGlobalError(messages.catalog.unauthorized);
      return;
    }

    setGlobalError(null);
    setSuccessMessage(null);

    try {
      await catalogProductDeleteRequest(token, productId);
      setSuccessMessage(messages.catalog.productDeleted);
      await loadCatalog(selectedAssistantId);
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : messages.catalog.deleteFailed,
      );
    }
  };

  const handleAssistantSelect = (assistantId: number) => {
    setSelectedAssistantId(assistantId);
    setIsMobileDetailsOpen(true);
  };

  const handleBackToAssistants = () => {
    setSelectedAssistantId(null);
    setServices([]);
    setProducts([]);
    setIsMobileDetailsOpen(false);
    setGlobalError(null);
    setSuccessMessage(null);
  };

  return (
    <DashboardLayout
      title={messages.catalog.title}
      user={user}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      defaultSelectedKey="products-services"
    >
      <div className="space-y-4">
        <p className="text-sm text-default-500">{messages.catalog.subtitle}</p>

        {globalError ? (
          <Alert
            color="danger"
            variant="faded"
            title={messages.catalog.errorTitle}
            description={globalError}
          />
        ) : null}

        {successMessage ? (
          <Alert
            color="success"
            variant="faded"
            title={messages.catalog.successTitle}
            description={successMessage}
          />
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Card
            shadow="none"
            className={`border border-default-200 bg-white ${
              isMobileDetailsOpen ? "hidden lg:flex" : "flex"
            }`}
          >
            <CardBody className="gap-3">
              <div>
                <p className="text-base font-semibold">{messages.catalog.assistantsTitle}</p>
                <p className="text-sm text-default-500">{messages.catalog.assistantsSubtitle}</p>
              </div>

              {isLoadingAssistants ? (
                <div className="flex min-h-[160px] items-center justify-center">
                  <Spinner size="sm" />
                </div>
              ) : assistants.length === 0 ? (
                <p className="text-sm text-default-500">{messages.catalog.noAssistants}</p>
              ) : (
                <div className="space-y-2">
                  {assistants.map((assistant) => (
                    <button
                      key={assistant.id}
                      type="button"
                      onClick={() => {
                        handleAssistantSelect(assistant.id);
                      }}
                      className={`w-full rounded-large border px-3 py-2 text-left transition ${
                        selectedAssistantId === assistant.id
                          ? "border-primary bg-primary-50"
                          : "border-default-200 bg-white hover:bg-default-100"
                      }`}
                    >
                      <p className="truncate text-sm font-semibold text-foreground">{assistant.name}</p>
                      <p className="text-xs text-default-500">ID: {assistant.id}</p>
                    </button>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card
            shadow="none"
            className={`border border-default-200 bg-white ${
              !isMobileDetailsOpen ? "hidden lg:flex" : "flex"
            }`}
          >
            <CardBody>
              {!selectedAssistant ? (
                <div className="flex min-h-[280px] items-center justify-center rounded-large border border-dashed border-default-300 bg-default-50 text-sm text-default-500">
                  {messages.catalog.selectAssistant}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={handleBackToAssistants}
                        aria-label={messages.catalog.backToAssistants}
                      >
                        <Icon icon="solar:alt-arrow-left-linear" width={18} />
                      </Button>
                      <div>
                        <p className="text-base font-semibold text-foreground">{selectedAssistant.name}</p>
                        <p className="text-sm text-default-500">
                          {messages.catalog.selectedAssistantPrefix} #{selectedAssistant.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<Icon icon="solar:add-circle-linear" width={16} />}
                        onPress={() => {
                          setEditingService(null);
                          setServiceForm(toServiceForm(null));
                          serviceModal.onOpen();
                        }}
                      >
                        {messages.catalog.addService}
                      </Button>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        startContent={<Icon icon="solar:add-circle-linear" width={16} />}
                        onPress={() => {
                          setEditingProduct(null);
                          setProductForm(toProductForm(null));
                          productModal.onOpen();
                        }}
                      >
                        {messages.catalog.addProduct}
                      </Button>
                    </div>
                  </div>

                  {isLoadingCatalog ? (
                    <div className="flex min-h-[220px] items-center justify-center">
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    <Tabs radius="full" size="sm" variant="bordered">
                      <Tab key="services" title={`${messages.catalog.servicesTab} (${services.length})`}>
                        {services.length === 0 ? (
                          <p className="py-4 text-sm text-default-500">{messages.catalog.emptyServices}</p>
                        ) : (
                          <div className="grid gap-3 py-1">
                            {services.map((service) => (
                              <Card key={service.id} shadow="none" className="border border-default-200">
                                <CardBody className="gap-2 p-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-semibold text-foreground">{service.name}</p>
                                      <p className="text-xs text-default-600">
                                        {formatMoney(service.price, service.currency, locale)}
                                      </p>
                                      {service.specialists.length > 0 ? (
                                        <p className="text-xs text-default-500">
                                          {messages.catalog.specialistsTitle}: {service.specialists.length}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Chip
                                        size="sm"
                                        variant="flat"
                                        color={service.is_active ? "success" : "default"}
                                      >
                                        {service.is_active
                                          ? messages.catalog.statusActive
                                          : messages.catalog.statusInactive}
                                      </Chip>
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        onPress={() => {
                                          setEditingService(service);
                                          setServiceForm(toServiceForm(service));
                                          serviceModal.onOpen();
                                        }}
                                      >
                                        <Icon icon="solar:pen-new-square-linear" width={18} />
                                      </Button>
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                          void deleteService(service.id);
                                        }}
                                      >
                                        <Icon icon="solar:trash-bin-trash-linear" width={18} />
                                      </Button>
                                    </div>
                                  </div>

                                  {service.description ? (
                                    <p className="line-clamp-2 text-xs text-default-500">{service.description}</p>
                                  ) : null}
                                  {service.specialists.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {service.specialists.slice(0, 4).map((specialist, index) => (
                                        <Chip key={`${specialist.name}-${index}`} size="sm" variant="flat">
                                          {specialist.name}
                                        </Chip>
                                      ))}
                                    </div>
                                  ) : null}
                                </CardBody>
                              </Card>
                            ))}
                          </div>
                        )}
                      </Tab>

                      <Tab key="products" title={`${messages.catalog.productsTab} (${products.length})`}>
                        {products.length === 0 ? (
                          <p className="py-4 text-sm text-default-500">{messages.catalog.emptyProducts}</p>
                        ) : (
                          <div className="grid gap-3 py-1">
                            {products.map((product) => (
                              <Card key={product.id} shadow="none" className="border border-default-200">
                                <CardBody className="gap-2 p-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
                                      <p className="text-xs text-default-600">
                                        {formatMoney(product.price, product.currency, locale)}
                                      </p>
                                      {product.sku ? (
                                        <p className="text-xs text-default-500">SKU: {product.sku}</p>
                                      ) : null}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Chip
                                        size="sm"
                                        variant="flat"
                                        color={product.is_active ? "success" : "default"}
                                      >
                                        {product.is_active
                                          ? messages.catalog.statusActive
                                          : messages.catalog.statusInactive}
                                      </Chip>
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        onPress={() => {
                                          setEditingProduct(product);
                                          setProductForm(toProductForm(product));
                                          productModal.onOpen();
                                        }}
                                      >
                                        <Icon icon="solar:pen-new-square-linear" width={18} />
                                      </Button>
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                          void deleteProduct(product.id);
                                        }}
                                      >
                                        <Icon icon="solar:trash-bin-trash-linear" width={18} />
                                      </Button>
                                    </div>
                                  </div>

                                  <p className="text-xs text-default-500">
                                    {product.is_unlimited_stock
                                      ? messages.catalog.unlimitedStock
                                      : `${messages.catalog.stockLabel}: ${product.stock_quantity ?? 0}`}
                                  </p>

                                  {product.product_url ? (
                                    <Button
                                      as="a"
                                      href={product.product_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      size="sm"
                                      variant="light"
                                      className="justify-start px-0"
                                      startContent={<Icon icon="solar:link-minimalistic-2-linear" width={16} />}
                                    >
                                      {messages.catalog.openProductLink}
                                    </Button>
                                  ) : null}
                                </CardBody>
                              </Card>
                            ))}
                          </div>
                        )}
                      </Tab>
                    </Tabs>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal isOpen={serviceModal.isOpen} onOpenChange={serviceModal.onOpenChange} size="2xl">
        <ModalContent>
          <ModalHeader>
            {editingService ? messages.catalog.editServiceTitle : messages.catalog.newServiceTitle}
          </ModalHeader>
          <ModalBody className="gap-3">
            <Input
              label={messages.catalog.nameLabel}
              value={serviceForm.name}
              onValueChange={(value) => {
                setServiceForm((prev) => ({ ...prev, name: value }));
              }}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label={messages.catalog.priceLabel}
                value={serviceForm.price}
                onValueChange={(value) => {
                  setServiceForm((prev) => ({ ...prev, price: value }));
                }}
              />
              <Select
                label={messages.catalog.currencyLabel}
                selectedKeys={[serviceForm.currency]}
                onSelectionChange={(keys) => {
                  const value = String(Array.from(keys)[0] ?? DEFAULT_CURRENCY);
                  setServiceForm((prev) => ({ ...prev, currency: value }));
                }}
              >
                {CURRENCY_OPTIONS.map((currency) => (
                  <SelectItem key={currency.key}>{currency.label}</SelectItem>
                ))}
              </Select>
            </div>

            <Textarea
              label={messages.catalog.descriptionLabel}
              value={serviceForm.description}
              onValueChange={(value) => {
                setServiceForm((prev) => ({ ...prev, description: value }));
              }}
              minRows={2}
            />

            <Textarea
              label={messages.catalog.termsLabel}
              value={serviceForm.terms}
              onValueChange={(value) => {
                setServiceForm((prev) => ({ ...prev, terms: value }));
              }}
              minRows={2}
            />

            <Textarea
              label={messages.catalog.photoUrlsLabel}
              value={serviceForm.photoUrls}
              onValueChange={(value) => {
                setServiceForm((prev) => ({ ...prev, photoUrls: value }));
              }}
              minRows={2}
            />

            <div className="space-y-2 rounded-large border border-default-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{messages.catalog.specialistsTitle}</p>
                <Button
                  size="sm"
                  variant="flat"
                  startContent={<Icon icon="solar:add-circle-linear" width={16} />}
                  onPress={() => {
                    setServiceForm((prev) => ({
                      ...prev,
                      specialists: [...prev.specialists, { name: "", price: "" }],
                    }));
                  }}
                >
                  {messages.catalog.addSpecialist}
                </Button>
              </div>

              {serviceForm.specialists.length === 0 ? (
                <p className="text-xs text-default-500">{messages.catalog.noSpecialists}</p>
              ) : (
                <div className="space-y-2">
                  {serviceForm.specialists.map((specialist, index) => (
                    <div key={`specialist-${index}`} className="grid grid-cols-[1fr,1fr,40px] gap-2">
                      <Input
                        label={messages.catalog.specialistNameLabel}
                        value={specialist.name}
                        onValueChange={(value) => {
                          setServiceForm((prev) => ({
                            ...prev,
                            specialists: prev.specialists.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, name: value } : item),
                          }));
                        }}
                      />
                      <Input
                        label={messages.catalog.specialistPriceLabel}
                        value={specialist.price}
                        onValueChange={(value) => {
                          setServiceForm((prev) => ({
                            ...prev,
                            specialists: prev.specialists.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, price: value } : item),
                          }));
                        }}
                      />
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        className="self-end"
                        onPress={() => {
                          setServiceForm((prev) => ({
                            ...prev,
                            specialists: prev.specialists.filter((_, itemIndex) => itemIndex !== index),
                          }));
                        }}
                      >
                        <Icon icon="solar:trash-bin-trash-linear" width={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Switch
              isSelected={serviceForm.isActive}
              onValueChange={(value) => {
                setServiceForm((prev) => ({ ...prev, isActive: value }));
              }}
            >
              {messages.catalog.activeLabel}
            </Switch>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={serviceModal.onClose}>
              {messages.common.cancel}
            </Button>
            <Button color="primary" onPress={() => { void submitService(); }} isLoading={isSaving}>
              {messages.catalog.saveButton}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={productModal.isOpen} onOpenChange={productModal.onOpenChange} size="2xl">
        <ModalContent>
          <ModalHeader>
            {editingProduct ? messages.catalog.editProductTitle : messages.catalog.newProductTitle}
          </ModalHeader>
          <ModalBody className="gap-3">
            <Input
              label={messages.catalog.nameLabel}
              value={productForm.name}
              onValueChange={(value) => {
                setProductForm((prev) => ({ ...prev, name: value }));
              }}
            />

            <Input
              label={messages.catalog.skuLabel}
              value={productForm.sku}
              onValueChange={(value) => {
                setProductForm((prev) => ({ ...prev, sku: value }));
              }}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label={messages.catalog.priceLabel}
                value={productForm.price}
                onValueChange={(value) => {
                  setProductForm((prev) => ({ ...prev, price: value }));
                }}
              />
              <Select
                label={messages.catalog.currencyLabel}
                selectedKeys={[productForm.currency]}
                onSelectionChange={(keys) => {
                  const value = String(Array.from(keys)[0] ?? DEFAULT_CURRENCY);
                  setProductForm((prev) => ({ ...prev, currency: value }));
                }}
              >
                {CURRENCY_OPTIONS.map((currency) => (
                  <SelectItem key={currency.key}>{currency.label}</SelectItem>
                ))}
              </Select>
            </div>

            <Input
              label={messages.catalog.productLinkLabel}
              value={productForm.productUrl}
              onValueChange={(value) => {
                setProductForm((prev) => ({ ...prev, productUrl: value }));
              }}
            />

            <Switch
              isSelected={productForm.isUnlimitedStock}
              onValueChange={(value) => {
                setProductForm((prev) => ({ ...prev, isUnlimitedStock: value }));
              }}
            >
              {messages.catalog.unlimitedStockLabel}
            </Switch>

            {!productForm.isUnlimitedStock ? (
              <Input
                label={messages.catalog.stockLabel}
                value={productForm.stockQuantity}
                onValueChange={(value) => {
                  setProductForm((prev) => ({ ...prev, stockQuantity: value }));
                }}
              />
            ) : null}

            <Textarea
              label={messages.catalog.descriptionLabel}
              value={productForm.description}
              onValueChange={(value) => {
                setProductForm((prev) => ({ ...prev, description: value }));
              }}
              minRows={2}
            />

            <Textarea
              label={messages.catalog.termsLabel}
              value={productForm.terms}
              onValueChange={(value) => {
                setProductForm((prev) => ({ ...prev, terms: value }));
              }}
              minRows={2}
            />

            <Textarea
              label={messages.catalog.photoUrlsLabel}
              value={productForm.photoUrls}
              onValueChange={(value) => {
                setProductForm((prev) => ({ ...prev, photoUrls: value }));
              }}
              minRows={2}
            />

            <Switch
              isSelected={productForm.isActive}
              onValueChange={(value) => {
                setProductForm((prev) => ({ ...prev, isActive: value }));
              }}
            >
              {messages.catalog.activeLabel}
            </Switch>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={productModal.onClose}>
              {messages.common.cancel}
            </Button>
            <Button color="primary" onPress={() => { void submitProduct(); }} isLoading={isSaving}>
              {messages.catalog.saveButton}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
}
