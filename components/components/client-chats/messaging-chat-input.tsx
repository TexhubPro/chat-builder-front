import type { InputProps } from '@heroui/react';

import React from 'react';
import { Button, Input, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

export interface MessagingChatInputProps extends InputProps {
    onSend?: (message: string) => void;
}

const MessagingChatInput = React.forwardRef<HTMLInputElement, MessagingChatInputProps>((props, ref) => {
    const { onSend, ...inputProps } = props;
    const [message, setMessage] = React.useState<string>('');

    const submit = () => {
        if (!message.trim()) return;
        onSend?.(message.trim());
        setMessage('');
    };

    return (
        <Input
            ref={ref}
            aria-label="message"
            classNames={{
                innerWrapper: 'items-center',
                label: 'hidden',
                input: 'py-4 text-medium',
                inputWrapper: 'h-15 py-[10px]',
            }}
            endContent={
                <div className="flex">
                    {!message && (
                        <Tooltip showArrow content="Диктовка">
                            <Button isIconOnly radius="full" variant="light">
                                <Icon className="text-default-500" icon="solar:microphone-3-linear" width={20} />
                            </Button>
                        </Tooltip>
                    )}
                    <Tooltip showArrow content="Отправить сообщение">
                        <div className="flex h-10 flex-col justify-center">
                            <Button isIconOnly className="h-[30px] w-[30px] min-w-[30px] bg-foreground leading-[30px]" radius="lg" onPress={submit}>
                                <Icon className="cursor-pointer text-default-50 [&>path]:stroke-[2px]" icon="solar:arrow-up-linear" width={20} />
                            </Button>
                        </div>
                    </Tooltip>
                </div>
            }
            placeholder="Напишите сообщение..."
            radius="lg"
            startContent={
                <Tooltip showArrow content="Добавить файл">
                    <Button isIconOnly radius="full" variant="light">
                        <Icon className="text-default-500" icon="solar:paperclip-linear" width={20} />
                    </Button>
                </Tooltip>
            }
            value={message}
            variant="bordered"
            onValueChange={setMessage}
            onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    submit();
                }
            }}
            {...inputProps}
        />
    );
});

MessagingChatInput.displayName = 'MessagingChatInput';

export default MessagingChatInput;
