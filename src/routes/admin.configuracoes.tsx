import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

import {
  AdminPage,
  Btn,
  Card,
  Field,
  MediaField,
  OrderButtons,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/AdminUI";
import { moveItem, newId, nextOrder } from "@/lib/cms/helpers";
import { useCms } from "@/lib/cms/store";
import type { CmsNavLink, CmsSettings } from "@/lib/cms/types";

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminConfiguracoes,
});

function AdminConfiguracoes() {
  const { content, update, reset } = useCms();
  const settings = content.settings;

  const patchSettings = (changes: Partial<CmsSettings>) =>
    update((current) => ({ ...current, settings: { ...current.settings, ...changes } }));

  const area = (key: "headerLinks" | "footerLinks") => ({
    links: [...content[key]].sort((a, b) => a.order - b.order),
    patch: (id: string, changes: Partial<CmsNavLink>) =>
      update((current) => ({
        ...current,
        [key]: current[key].map((link) => (link.id === id ? { ...link, ...changes } : link)),
      })),
    move: (id: string, direction: -1 | 1) =>
      update((current) => ({ ...current, [key]: moveItem(current[key], id, direction) })),
    remove: (id: string) =>
      update((current) => ({ ...current, [key]: current[key].filter((link) => link.id !== id) })),
    add: () =>
      update((current) => ({
        ...current,
        [key]: [
          ...current[key],
          {
            id: newId("link"),
            label: "Nova ligação",
            to: "/",
            order: nextOrder(current[key]),
            visible: false,
          },
        ],
      })),
  });

  const header = area("headerLinks");
  const footer = area("footerLinks");

  return (
    <AdminPage
      eyebrow="Configurações"
      title="Configurações gerais"
      description="Nome da marca, logótipo, ligações do menu e do rodapé, moeda e mensagens do pedido."
    >
      <Card>
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Nome da marca">
            <TextInput value={settings.brandName} onChange={(v) => patchSettings({ brandName: v })} />
          </Field>
          <Field label="Frase da marca">
            <TextInput value={settings.tagline} onChange={(v) => patchSettings({ tagline: v })} />
          </Field>
          <MediaField
            label="Logótipo"
            value={settings.logo}
            onChange={(v) => patchSettings({ logo: v })}
          />
          <MediaField
            label="Ícone do site (favicon)"
            value={settings.favicon}
            onChange={(v) => patchSettings({ favicon: v })}
          />
          <Field label="Moeda">
            <TextInput value={settings.currency} onChange={(v) => patchSettings({ currency: v })} />
          </Field>
          <Field label="Ligação para a VinilArt">
            <TextInput
              value={settings.mainSiteUrl}
              onChange={(v) => patchSettings({ mainSiteUrl: v })}
            />
          </Field>
          <Field label="Texto da ligação para a VinilArt">
            <TextInput
              value={settings.mainSiteLabel}
              onChange={(v) => patchSettings({ mainSiteLabel: v })}
            />
          </Field>
          <div className="lg:col-span-2">
            <Field label="Mensagem do carrinho / pedido">
              <TextArea
                value={settings.cartNote}
                rows={2}
                onChange={(v) => patchSettings({ cartNote: v })}
              />
            </Field>
          </div>
          <div className="lg:col-span-2">
            <Field label="Texto do rodapé">
              <TextArea
                value={settings.footerText}
                rows={2}
                onChange={(v) => patchSettings({ footerText: v })}
              />
            </Field>
          </div>
        </div>
      </Card>

      {[
        { title: "Ligações do menu", data: header },
        { title: "Ligações do rodapé", data: footer },
      ].map(({ title, data }) => (
        <Card key={title}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg uppercase tracking-wide text-white">{title}</h2>
            <Btn variant="outline" onClick={data.add}>
              Adicionar
            </Btn>
          </div>

          <div className="mt-5 space-y-3">
            {data.links.map((link) => (
              <div
                key={link.id}
                className="grid gap-3 rounded-xl border border-white/10 bg-[#080c11] p-4 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-end"
              >
                <Field label="Texto">
                  <TextInput
                    value={link.label}
                    onChange={(value) => data.patch(link.id, { label: value })}
                  />
                </Field>
                <Field label="Destino">
                  <TextInput
                    value={link.to}
                    onChange={(value) => data.patch(link.id, { to: value })}
                  />
                </Field>
                <div className="lg:w-40">
                  <Toggle
                    label="Visível"
                    checked={link.visible}
                    onChange={(checked) => data.patch(link.id, { visible: checked })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <OrderButtons
                    onUp={() => data.move(link.id, -1)}
                    onDown={() => data.move(link.id, 1)}
                  />
                  <Btn
                    variant="danger"
                    onClick={() => data.remove(link.id)}
                    ariaLabel={`Apagar ligação ${link.label}`}
                  >
                    <Trash2 size={13} />
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Card>
        <h2 className="font-display text-lg uppercase tracking-wide text-white">
          Reiniciar conteúdo
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Volta a colocar todo o conteúdo como estava de origem. As tuas alterações neste
          navegador são perdidas.
        </p>
        <div className="mt-4">
          <Btn variant="danger" onClick={reset}>
            Reiniciar conteúdo
          </Btn>
        </div>
      </Card>
    </AdminPage>
  );
}
