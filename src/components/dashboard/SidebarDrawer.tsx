import {
  Drawer,
  DrawerBody,
  DrawerContent,
  type DrawerProps,
} from "@heroui/react";
import type { ReactNode } from "react";

type SidebarDrawerProps = {
  isOpen: boolean;
  onOpenChange: DrawerProps["onOpenChange"];
  children: ReactNode;
};

export default function SidebarDrawer({ isOpen, onOpenChange, children }: SidebarDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="left"
      classNames={{
        base: "w-[278px] shadow-none",
        wrapper: "shadow-none",
      }}
    >
      <DrawerContent>
        {() => (
          <DrawerBody className="p-0 pt-3">{children}</DrawerBody>
        )}
      </DrawerContent>
    </Drawer>
  );
}
