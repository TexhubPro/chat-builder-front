import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Button, Card, CardBody, CardHeader, Chip, Divider, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';

import DashboardLayout from '../components/dashboard/DashboardLayout';

type IntegrationItem = {
  key: string;
  title: string;
  description: string;
  status: 'connected' | 'pending' | 'disabled';
  badge: string;
  icon: string;
  action: string;
};

const integrations: IntegrationItem[] = [
  {
    key: 'web',
    title: 'Веб-сайт',
    description: 'Виджет чата для сайта, подключение за 3 минуты.',
    status: 'connected',
    badge: 'Connected',
    icon: 'solar:globe-linear',
    action: 'View integration',
  },
  {
    key: 'instagram',
    title: 'Instagram',
    description: 'Автоответы в Direct и комментариях.',
    status: 'pending',
    badge: 'Не подключено',
    icon: 'mdi:instagram',
    action: 'Подключить',
  },
  {
    key: 'telegram',
    title: 'Telegram',
    description: 'Подключите бота и отвечайте клиентам из единой панели.',
    status: 'disabled',
    badge: 'Отключено',
    icon: 'mdi:telegram',
    action: 'Подключить',
  },
  {
    key: 'whatsapp',
    title: 'WhatsApp',
    description: 'Скоро. Оставьте заявку на ранний доступ.',
    status: 'disabled',
    badge: 'Скоро',
    icon: 'mdi:whatsapp',
    action: 'Записаться',
  },
];

type AssistantItem = {
  id: string;
  name: string;
  status: 'active' | 'paused';
  scenarios: number;
  files: number;
  sync: number;
};

export default function IntegrationsPage() {
  const { props } = usePage<{ assistants?: AssistantItem[] }>();
  const assistants = props.assistants ?? [];
  const [selectedAssistant, setSelectedAssistant] = React.useState<AssistantItem | null>(null);

  React.useEffect(() => {
    if (assistants.length === 0) {
      setSelectedAssistant(null);
      return;
    }

    if (selectedAssistant && assistants.some((item) => item.id === selectedAssistant.id)) {
      return;
    }

    setSelectedAssistant(null);
  }, [assistants, selectedAssistant]);

  return (
    <>
      <Head title="Интеграции" />
      <DashboardLayout title="Интеграции" defaultSelectedKey="integrations" fullBleed hideHeader>
        <div className="relative h-full overflow-hidden rounded-large border-small border-default-200 bg-white/85 p-6 dark:bg-[#1f1f24]/90">
          <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 translate-x-1/4 -translate-y-1/4 rounded-full bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-to-tr from-blue-400/20 via-blue-400/10 to-transparent blur-3xl" />

          <div className="relative z-10 grid gap-6 lg:grid-cols-[340px_1fr]">
            <Card className="border border-default-200/80 bg-white/95 shadow-sm dark:border-[#2a2a32]/80 dark:bg-[#17171b]">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-default-400">Ассистенты</p>
                  <h2 className="text-lg font-semibold text-default-900 dark:text-default-100">Выберите ассистента</h2>
                </div>
              </CardHeader>
              <CardBody className="flex flex-col gap-4">
                {assistants.map((assistant) => {
                  const isActive = assistant.status === 'active';
                  const isSelected = selectedAssistant?.id === assistant.id;

                  return (
                    <button
                      key={assistant.id}
                      type="button"
                      onClick={() => setSelectedAssistant(assistant)}
                      className={`flex w-full flex-col gap-3 rounded-large border px-4 py-3 text-left transition ${
                        isSelected
                          ? 'border-blue-500/40 bg-blue-50/70 shadow-sm dark:border-blue-400/30 dark:bg-blue-500/10'
                          : 'border-default-200/80 bg-white hover:border-blue-200 dark:border-[#2a2a32]/80 dark:bg-[#17171b]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-blue-600">
                            <Icon icon="solar:cpu-bolt-linear" width={20} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-default-900 dark:text-default-100">{assistant.name}</div>
                            <div className="text-xs text-default-500">
                              Сценарии: {assistant.scenarios} • Файлы: {assistant.files}
                            </div>
                          </div>
                        </div>
                        <Chip color="primary" variant="flat" size="sm">
                          {isActive ? 'Активен' : 'Остановлен'}
                        </Chip>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-default-400">
                        <span>Синхронизация каналов</span>
                        <span>{assistant.sync}%</span>
                      </div>
                      <Progress size="sm" value={assistant.sync} classNames={{ track: 'bg-default-100', indicator: 'bg-blue-500' }} />
                    </button>
                  );
                })}

                {assistants.length === 0 && (
                  <div className="rounded-large border border-dashed border-default-200 px-4 py-6 text-center text-sm text-default-500">
                    Ассистентов пока нет. Создайте ассистента в разделе обучения.
                  </div>
                )}
              </CardBody>
            </Card>

            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-xl font-semibold text-default-900 dark:text-default-100">Интеграции ассистента</h1>
                <p className="text-sm text-default-500">
                  {selectedAssistant ? `Каналы для ассистента: ${selectedAssistant.name}.` : 'Выберите ассистента слева.'}
                </p>
              </div>

              {selectedAssistant ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  {integrations.map((item) => (
                    <Card
                      key={item.key}
                      className="border border-default-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#2a2a32] dark:bg-[#17171b]"
                    >
                      <CardBody className="flex flex-col gap-5 p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-default-200 bg-default-50 text-default-700 dark:border-[#2a2a32] dark:bg-[#1f1f24]">
                            <Icon icon={item.icon} width={22} />
                          </div>
                          <Chip
                            size="sm"
                            variant={item.status === 'connected' ? 'bordered' : 'flat'}
                            color={item.status === 'connected' ? 'primary' : 'default'}
                            startContent={item.status === 'connected' ? <Icon icon="solar:check-circle-linear" width={14} /> : undefined}
                          >
                            {item.badge}
                          </Chip>
                        </div>

                        <div>
                          <p className="text-2xl font-semibold tracking-tight text-default-900 dark:text-default-100">{item.title}</p>
                          <p className="mt-2 text-sm leading-6 text-default-500">{item.description}</p>
                        </div>

                        <Button
                          size="lg"
                          className="w-full font-semibold"
                          variant={item.status === 'connected' ? 'bordered' : 'solid'}
                          color={item.status === 'connected' ? 'default' : 'primary'}
                        >
                          {item.action}
                        </Button>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border border-dashed border-default-200/80 bg-white/80 p-8 text-center shadow-sm dark:border-[#2a2a32]/80 dark:bg-[#17171b]">
                  <CardBody className="flex flex-col items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                      <Icon icon="solar:link-circle-linear" width={26} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-default-900 dark:text-default-100">Выберите ассистента</p>
                      <p className="text-sm text-default-500">Чтобы настроить интеграции, выберите ассистента слева.</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-default-400">
                      <Icon icon="solar:info-circle-linear" width={14} />
                      Интеграции будут показаны после выбора.
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
