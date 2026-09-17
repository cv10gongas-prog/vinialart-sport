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
import { moveItem, newId, nextOrder, slugify } from "@/lib/cms/helpers";
import { useCms } from "@/lib/cms/store";
import type { CmsCategory } from "@/lib/cms/types";

export const Route = createFileRoute("/admin/categorias")({
  component: AdminCategorias,
});

function AdminCategorias() {
  const { content, update } = useCms();
  const categories = [...content.categories].sort((a, b) => a.order - b.order);

  const patch = (id: string, changes: Partial<CmsCategory>) =>
    update((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category.id === id ? { ...category, ...changes } : category,
      ),
    }));

  const add = () =>
    update((current) => ({
      ...current,
      categories: [
        ...current.categories,
        {
          id: newId("cat"),
          name: "Nova categoria",
          slug: `categoria-${current.categories.length + 1}`,
          description: "",
          image: undefined,
          order: nextOrder(current.categories),
          active: false,
        },
      ],
    }));

  const remove = (id: string) =>
    update((current) => ({
      ...current,
      categories: current.categories.filter((category) => category.id !== id),
    }));

  const move = (id: string, direction: -1 | 1) =>
    update((current) => ({ ...current, categories: moveItem(current.categories, id, direction) }));

  return (
    <AdminPage
      eyebrow="Categorias"
      title="Categorias da loja"
      description="Cria, edita, ordena e ativa categorias. A loja e os produtos usam automaticamente estas categorias."
      actions={<Btn onClick={add}>Nova categoria</Btn>}
    >
      <div className="space-y-4">
        {categories.map((category) => {
          const usedBy = content.products.filter((p) => p.categoryId === category.id).length;

          return (
            <Card key={category.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg uppercase tracking-wide text-white">
                    {category.name}
                  </p>
                  <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-zinc-500">
                    /{category.slug} · {usedBy} produto(s)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <OrderButtons
                    onUp={() => move(category.id, -1)}
                    onDown={() => move(category.id, 1)}
                  />
                  <Btn
                    variant="danger"
                    onClick={() => remove(category.id)}
                    ariaLabel={`Apagar categoria ${category.name}`}
                  >
                    <Trash2 size={13} />
                    Apagar
                  </Btn>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <Field label="Nome">
                  <TextInput
                    value={category.name}
                    onChange={(value) =>
                      patch(category.id, { name: value, slug: slugify(value) || category.slug })
                    }
                  />
                </Field>

                <Field label="Endereço (slug)">
                  <TextInput
                    value={category.slug}
                    onChange={(value) => patch(category.id, { slug: slugify(value) })}
                  />
                </Field>

                <div className="lg:col-span-2">
                  <Field label="Descrição">
                    <TextArea
                      value={category.description}
                      rows={3}
                      onChange={(value) => patch(category.id, { description: value })}
                    />
                  </Field>
                </div>

                <MediaField
                  label="Imagem (opcional)"
                  value={category.image ?? ""}
                  onChange={(value) => patch(category.id, { image: value || undefined })}
                />

                <div className="flex items-end">
                  <Toggle
                    label="Categoria ativa na loja"
                    checked={category.active}
                    onChange={(checked) => patch(category.id, { active: checked })}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </AdminPage>
  );
}
