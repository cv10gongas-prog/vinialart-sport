import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

import {
  AdminPage,
  Btn,
  Card,
  Field,
  OrderButtons,
  SelectInput,
  TextInput,
  Toggle,
} from "@/components/admin/AdminUI";
import { moveItem, newId, nextOrder } from "@/lib/cms/helpers";
import { useCms } from "@/lib/cms/store";
import type { CmsContactChannel, ContactChannelType } from "@/lib/cms/types";

export const Route = createFileRoute("/admin/contactos")({
  component: AdminContactos,
});

const channelTypes: { value: ContactChannelType; label: string }[] = [
  { value: "telefone", label: "Telefone" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "website", label: "Site" },
  { value: "endereco", label: "Endereço" },
  { value: "custom", label: "Outro" },
];

function labelFor(type: ContactChannelType): string {
  return channelTypes.find((entry) => entry.value === type)?.label ?? "Outro";
}

function AdminContactos() {
  const { content, update } = useCms();
  const channels = [...content.contacts].sort((a, b) => a.order - b.order);

  const patch = (id: string, changes: Partial<CmsContactChannel>) =>
    update((current) => ({
      ...current,
      contacts: current.contacts.map((channel) =>
        channel.id === id ? { ...channel, ...changes } : channel,
      ),
    }));

  const move = (id: string, direction: -1 | 1) =>
    update((current) => ({ ...current, contacts: moveItem(current.contacts, id, direction) }));

  const remove = (id: string) =>
    update((current) => ({
      ...current,
      contacts: current.contacts.filter((channel) => channel.id !== id),
    }));

  const add = () =>
    update((current) => ({
      ...current,
      contacts: [
        ...current.contacts,
        {
          id: newId("ch"),
          type: "custom",
          label: "Novo canal",
          value: "",
          order: nextOrder(current.contacts),
          visible: false,
        },
      ],
    }));

  return (
    <AdminPage
      eyebrow="Contactos"
      title="Canais de contacto"
      description="Preenche telefone, email, redes sociais e outros canais. Só aparecem no site os canais preenchidos e marcados como visíveis."
      actions={<Btn onClick={add}>Novo canal</Btn>}
    >
      <div className="space-y-4">
        {channels.map((channel) => (
          <Card key={channel.id}>
            <div className="grid gap-4 lg:grid-cols-4">
              <Field label="Tipo">
                <SelectInput
                  value={channel.type}
                  onChange={(value) =>
                    patch(channel.id, {
                      type: value as ContactChannelType,
                      label: channel.label || labelFor(value as ContactChannelType),
                    })
                  }
                  options={channelTypes}
                />
              </Field>
              <Field label="Nome (opcional)">
                <TextInput
                  value={channel.label}
                  onChange={(value) => patch(channel.id, { label: value })}
                  placeholder={labelFor(channel.type)}
                />
              </Field>
              <div className="lg:col-span-2">
                <Field label="Valor" hint="Número, email, endereço ou ligação completa.">
                  <TextInput
                    value={channel.value}
                    onChange={(value) => patch(channel.id, { value })}
                  />
                </Field>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="w-full sm:w-72">
                <Toggle
                  label="Mostrar no site"
                  checked={channel.visible}
                  onChange={(checked) => patch(channel.id, { visible: checked })}
                />
              </div>
              <div className="flex items-center gap-2">
                <OrderButtons onUp={() => move(channel.id, -1)} onDown={() => move(channel.id, 1)} />
                <Btn
                  variant="danger"
                  onClick={() => remove(channel.id)}
                  ariaLabel={`Apagar canal ${channel.label}`}
                >
                  <Trash2 size={13} />
                </Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AdminPage>
  );
}
