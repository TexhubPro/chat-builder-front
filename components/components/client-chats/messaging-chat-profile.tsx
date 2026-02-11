import React from 'react';
import { Avatar, Switch, Button, ScrollShadow, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, Checkbox, Select, SelectItem } from '@heroui/react';
import { Icon } from '@iconify/react';

import MessagingChatHeader from './messaging-chat-header';
export type MessagingChatProfileProps = React.HTMLAttributes<HTMLDivElement> & {
  paginate?: (direction: number) => void;
  name?: string;
  phone?: string;
  channel?: string;
  assistantEnabled?: boolean;
  onToggleAssistant?: (enabled: boolean) => void;
  onCreateOrder?: (payload: {
    name: string;
    phone?: string | null;
    service?: string | null;
    amount?: number | null;
    source?: string | null;
    notes?: string | null;
    add_to_calendar?: boolean;
    date?: string | null;
    time?: string | null;
    duration?: string | null;
  }) => Promise<void> | void;
};

const MessagingChatProfile = React.forwardRef<HTMLDivElement, MessagingChatProfileProps>(
  ({ paginate, name, phone, channel = 'web', assistantEnabled = true, onToggleAssistant, onCreateOrder, className, ...props }, ref) => {
    const channelLabel =
      channel === 'telegram' ? 'Telegram' : channel === 'instagram' ? 'Instagram' : channel === 'assistant' ? 'Assistant' : 'Web';
    const channelIcon =
      channel === 'telegram'
        ? 'mdi:telegram'
        : channel === 'instagram'
          ? 'mdi:instagram'
          : channel === 'assistant'
            ? 'solar:robot-2-linear'
            : 'solar:globe-linear';

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [form, setForm] = React.useState({
      name: name ?? '',
      phone: phone ?? '',
      service: '',
      amount: '',
      source: channelLabel,
      addToCalendar: true,
      date: '',
      time: '',
      duration: '30 мин',
      notes: '',
    });

    React.useEffect(() => {
      setForm((prev) => ({
        ...prev,
        name: name ?? '',
        phone: phone ?? '',
        source: channelLabel,
      }));
    }, [name, phone, channelLabel]);

    const handleChange = (key: keyof typeof form, value: string | boolean) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
      if (!onCreateOrder) return;
      await onCreateOrder({
        name: form.name,
        phone: form.phone || null,
        service: form.service || null,
        amount: form.amount ? Number(form.amount) : null,
        source: form.source,
        notes: form.notes || null,
        add_to_calendar: form.addToCalendar,
        date: form.addToCalendar ? form.date || null : null,
        time: form.addToCalendar ? form.time || null : null,
        duration: form.addToCalendar ? form.duration || null : null,
      });
      setIsModalOpen(false);
    };

  return (
    <div ref={ref} {...props} className={`flex h-full min-h-0 flex-col ${className ?? ''}`}>
      <div className="flex h-full min-h-0 flex-col border-default-200 lg:border-l-small">
        <MessagingChatHeader className="hidden sm:flex lg:hidden" paginate={paginate} />
        <div className="h-full w-full overflow-visible border-t-small border-default-200 lg:border-none">
          <ScrollShadow className="flex h-full max-h-full flex-col gap-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between text-base font-semibold text-foreground">
              <span>Информация</span>
              <button
                type="button"
                className="rounded-full p-1 text-default-400 hover:text-default-600 lg:hidden"
                onClick={() => paginate?.(-1)}
              >
                <Icon icon="solar:close-circle-linear" width={20} />
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
              <Avatar className="h-20 w-20" name={name ?? 'Клиент'} />
              <h3 className="mt-4 text-base font-semibold text-foreground">{name ?? 'Клиент'}</h3>
              <p className="text-small text-default-500">{phone ?? '—'}</p>
              <div className="mt-3 flex gap-3 text-default-400">
                <Icon icon="solar:user-rounded-linear" width={20} />
                <Icon icon="solar:map-point-linear" width={20} />
                <Icon icon="solar:phone-rounded-linear" width={20} />
              </div>
            </div>

            <div className="mt-6 rounded-large border border-default-200 bg-content1 px-4 py-4">
              <div className="text-xs font-semibold uppercase text-default-400">AI Assistant</div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-small font-semibold text-default-900">{assistantEnabled ? 'Включен' : 'Отключен'}</div>
                  <div className="text-xs text-default-400">Для этого чата</div>
                </div>
                <Switch size="sm" isSelected={assistantEnabled} onValueChange={(value) => onToggleAssistant?.(value)} />
              </div>
            </div>

            <div className="mt-6 border-t border-default-200 pt-4">
              <div className="text-xs font-semibold uppercase text-default-400">Источник</div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-default-100 text-default-600">
                  <Icon icon={channelIcon} width={16} />
                </div>
                <div className="text-small font-semibold text-default-900">{channelLabel}</div>
              </div>
            </div>

            <Button className="mt-8" color="primary" onPress={() => setIsModalOpen(true)}>
              Создать заявку
            </Button>
          </ScrollShadow>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} size="lg" placement="center">
        <ModalContent>
          <ModalHeader className="flex items-center justify-between">Добавить заявку</ModalHeader>
          <ModalBody className="gap-4">
            <Input
              labelPlacement="outside"
              placeholder="Имя клиента"
              value={form.name}
              onValueChange={(value) => handleChange('name', value)}
              variant="bordered"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                labelPlacement="outside"
                placeholder="Телефон"
                value={form.phone}
                onValueChange={(value) => handleChange('phone', value)}
                variant="bordered"
              />
              <Input
                labelPlacement="outside"
                placeholder="Услуга"
                value={form.service}
                onValueChange={(value) => handleChange('service', value)}
                variant="bordered"
              />
              <Input
                labelPlacement="outside"
                placeholder="Сумма"
                value={form.amount}
                onValueChange={(value) => handleChange('amount', value)}
                variant="bordered"
                type="number"
              />
              <Select
                aria-label="Источник"
                selectedKeys={[form.source]}
                onSelectionChange={(keys) => handleChange('source', Array.from(keys)[0] as string)}
                variant="bordered"
              >
                {['Telegram', 'Instagram', 'Web', 'Assistant'].map((item) => (
                  <SelectItem key={item}>{item}</SelectItem>
                ))}
              </Select>
            </div>
            <Checkbox isSelected={form.addToCalendar} onValueChange={(value) => handleChange('addToCalendar', value)}>
              Добавить запись в календарь
            </Checkbox>
            {form.addToCalendar ? (
              <div className="rounded-large border border-default-200 bg-content1 p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    labelPlacement="outside"
                    placeholder="ДД.ММ.ГГГГ"
                    value={form.date}
                    onValueChange={(value) => handleChange('date', value)}
                    variant="bordered"
                  />
                  <Input
                    labelPlacement="outside"
                    placeholder="--:--"
                    value={form.time}
                    onValueChange={(value) => handleChange('time', value)}
                    variant="bordered"
                  />
                </div>
                <Select
                  aria-label="Длительность"
                  className="mt-4"
                  selectedKeys={[form.duration]}
                  onSelectionChange={(keys) => handleChange('duration', Array.from(keys)[0] as string)}
                  variant="bordered"
                >
                  {['15 мин', '30 мин', '45 мин', '60 мин'].map((item) => (
                    <SelectItem key={item}>{item}</SelectItem>
                  ))}
                </Select>
              </div>
            ) : null}
            <Textarea
              labelPlacement="outside"
              placeholder="Заметки"
              value={form.notes}
              onValueChange={(value) => handleChange('notes', value)}
              variant="bordered"
              minRows={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" className="w-full" onPress={handleSubmit}>
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
});

MessagingChatProfile.displayName = 'MessagingChatProfile';

export default MessagingChatProfile;
