import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

import {
  AdminPage,
  Btn,
  Card,
  Field,
  MediaField,
  OrderButtons,
  StatusChip,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/AdminUI";
import { moveItem, newId, nextOrder } from "@/lib/cms/helpers";
import { useCms } from "@/lib/cms/store";
import type { CmsPortfolioItem } from "@/lib/cms/types";

export const Route = createFileRoute("/admin/portfolio")({
  component: AdminPortfolio,
});

function AdminPortfolio() {
  const { content, update } = useCms();
  const items = [...content.portfolio].sort((a, b) => a.order - b.order);

  const patch = (id: string, changes: Partial<CmsPortfolioItem>) =>
    update((current) => ({
      ...current,
      portfolio: current.portfolio.map((item) =>
        item.id === id ? { ...item, ...changes } : item,
      ),
    }));

  const move = (id: string, direction: -1 | 1) =>
    update((current) => ({ ...current, portfolio: moveItem(current.portfolio, id, direction) }));

  const remove = (id: string) =>
    update((current) => ({
      ...current,
      portfolio: current.portfolio.filter((item) => item.id !== id),
    }));

  const add = () =>
    update((current) => ({
      ...current,
      portfolio: [
        ...current.portfolio,
        {
          id: newId("port"),
          title: "Novo trabalho",
          categoryName: "",
          description: "",
          image: "",
          gallery: [],
          featured: false,
          order: nextOrder(current.portfolio),
          visible: false,
        },
      ],
    }));

  return (
    <AdminPage
      eyebrow="Portefólio"
      title="Trabalhos realizados"
      description="Cada trabalho pode ter título, categoria, descrição, imagem principal e mais imagens. Nada está fixo no código."
      actions={<Btn onClick={add}>Novo trabalho</Btn>}
    >
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#080c11]">
                  {item.image ? (
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center font-mono text-[0.5rem] uppercase text-zinc-600">
                      sem img
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-display text-lg uppercase tracking-wide text-white">
                    {item.title}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <StatusChip tone={item.visible ? "ok" : "off"}>
                      {item.visible ? "Visível" : "Escondido"}
                    </StatusChip>
                    {item.featured && <StatusChip tone="warn">Destaque</StatusChip>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <OrderButtons onUp={() => move(item.id, -1)} onDown={() => move(item.id, 1)} />
                <Btn variant="danger" onClick={() => remove(item.id)} ariaLabel={`Apagar ${item.title}`}>
                  <Trash2 size={13} />
                </Btn>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <Field label="Título">
                <TextInput value={item.title} onChange={(value) => patch(item.id, { title: value })} />
              </Field>
              <Field label="Categoria">
                <TextInput
                  value={item.categoryName}
                  onChange={(value) => patch(item.id, { categoryName: value })}
                />
              </Field>
              <div className="lg:col-span-2">
                <Field label="Descrição">
                  <TextArea
                    value={item.description}
                    rows={3}
                    onChange={(value) => patch(item.id, { description: value })}
                  />
                </Field>
              </div>
              <MediaField
                label="Imagem principal"
                value={item.image}
                onChange={(value) => patch(item.id, { image: value })}
              />
              <Field label="Mais imagens" hint="Um caminho de imagem por linha.">
                <TextArea
                  value={item.gallery.join("\n")}
                  rows={4}
                  onChange={(value) =>
                    patch(item.id, {
                      gallery: value.split("\n").map((line) => line.trim()).filter(Boolean),
                    })
                  }
                />
              </Field>
              <Toggle
                label="Visível no site"
                checked={item.visible}
                onChange={(checked) => patch(item.id, { visible: checked })}
              />
              <Toggle
                label="Trabalho em destaque"
                checked={item.featured}
                onChange={(checked) => patch(item.id, { featured: checked })}
              />
            </div>
          </Card>
        ))}
      </div>
    </AdminPage>
  );
}
