import { Icon } from "@iconify/react";
import { Button, ScrollShadow } from "@heroui/react";
import React from "react";
import type { SidebarSection } from "./sidebar-items";

type SidebarProps = {
  sections: SidebarSection[];
  selectedKey: string;
  onSelect: (key: string) => void;
};

function SidebarComponent({ sections, selectedKey, onSelect }: SidebarProps) {
  return (
    <ScrollShadow className="h-full">
      <div className="space-y-3 p-3">
        {sections.map((section) => (
          <section key={section.key}>
            <p className="mb-1.5 px-2 text-xs font-medium text-default-500">{section.title}</p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = selectedKey === item.key;

                return (
                  <Button
                    key={item.key}
                    variant={isActive ? "flat" : "light"}
                    className={`h-10 w-full justify-start px-3 text-sm ${
                      isActive
                        ? "bg-default-100 font-medium text-foreground"
                        : "font-normal text-default-600"
                    }`}
                    startContent={
                      <Icon
                        icon={item.icon}
                        width={20}
                        className={isActive ? "text-foreground" : "text-default-500"}
                      />
                    }
                    onPress={() => onSelect(item.key)}
                  >
                    {item.title}
                  </Button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </ScrollShadow>
  );
}

const Sidebar = React.memo(SidebarComponent);

export default Sidebar;
