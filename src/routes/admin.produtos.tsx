import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Trash2 } from "lucide-react";

import {
  AdminPage,
  Btn,
  Card,
  Field,
  MediaField,
  OrderButtons,
  SelectInput,
  StatusChip,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/AdminUI";
import { moveItem, newId, nextOrder, slugify } from "@/lib/cms/helpers";
import { useCms } from "@/lib/cms/store";
import type { CmsProduct } from "@/lib/cms/types";

export const Route = createFileRoute("/admin/produtos")({
  component: AdminProdutos,
});

function AdminProdutos() {
  const { content, update } = useCms();
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = [...content.categories].sort((a, b) => a.order - b.order);
  const products = useMemo(() => {
    const term = search.trim().toLowerCase();
    return [...content.products]
      .sort((a, b) => a.order - b.order)
      .filter((product) =>
        term === ""
          ? true
          : `${product.name} ${product.slug}`.toLowerCase().includes(term),
      );
  }, [content.products, search]);

  const patch = (id: string, changes: Partial<CmsProduct>) =>
    update((current) => ({
      ...current,
      products: current.products.map((product) =>
        product.id === id ? { ...product, ...changes } : product,
      ),
    }));

  const move = (id: string, direction: -1 | 1) =>
    update((current) => ({ ...current, products: moveItem(current.products, id, direction) }));

  const remove = (id: string) =>
    update((current) => ({
      ...current,
      products: current.products.filter((product) => product.id !== id),
    }));

  const add = () => {
    const id = newId("prod");
    update((current) => ({
      ...current,
      products: [
        ...current.products,
        {
          id,
          slug: `produto-${current.products.length + 1}`,
          name: "Novo produto",
          categoryId: current.categories[0]?.id ?? "",
          shortDescription: "",
          longDescription: "",
          image: "",
          gallery: [],
          priceMode: "quote",
          price: "",
          badge: "",
          featured: false,
          order: nextOrder(current.products),
          status: "draft",
          showInShop: true,
          showInHome: false,
          customizable: false,
          customizerConfigId: id,
          variants: { sizes: [], colors: [] },
        },
      ],
    }));
    setOpenId(id);
  };

  const duplicate = (product: CmsProduct) => {
    const id = newId("prod");
    update((current) => ({
      ...current,
      products: [
        ...current.products,
        {
          ...product,
          id,
          slug: `${product.slug}-copia`,
          name: `${product.name} (cópia)`,
          status: "draft",
          featured: false,
          showInHome: false,
          order: nextOrder(current.products),
          gallery: [...product.gallery],
          variants: {
            sizes: [...product.variants.sizes],
            colors: [...product.variants.colors],
          },
        },
      ],
    }));
    setOpenId(id);
  };

  return (
    <AdminPage
      eyebrow="Produtos"
      title="Gestão de produtos"
      description="Cada produto existe uma única vez: o que editares aqui aparece na loja, na página do produto, no personalizador e nos pedidos."
      actions={<Btn onClick={add}>Novo produto</Btn>}
    >
      <Card>
        <Field label="Procurar produto">
          <TextInput value={search} onChange={setSearch} placeholder="Nome ou endereço" />
        </Field>
      </Card>

      <div className="space-y-4">
        {products.map((product) => {
          const isOpen = openId === product.id;
          const categoryName =
            categories.find((category) => category.id === product.categoryId)?.name ?? "Sem categoria";

          return (
            <Card key={product.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#080c11]">
                    {product.image ? (
                      <img src={product.image} alt="" className="h-full w-full object-contain" />
                    ) : (
                      <span className="flex h-full items-center justify-center font-mono text-[0.5rem] uppercase text-zinc-600">
                        sem img
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-display text-lg uppercase tracking-wide text-white">
                      {product.name}
                    </p>
                    <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-zinc-500">
                      {categoryName} · /{product.slug}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusChip tone={product.status === "published" ? "ok" : "off"}>
                        {product.status === "published" ? "Publicado" : "Rascunho"}
                      </StatusChip>
                      {product.featured && <StatusChip tone="warn">Destaque</StatusChip>}
                      {product.customizable && <StatusChip tone="ok">Personalizável</StatusChip>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <OrderButtons onUp={() => move(product.id, -1)} onDown={() => move(product.id, 1)} />
                  <Btn variant="outline" onClick={() => duplicate(product)}>
                    <Copy size={13} />
                    Duplicar
                  </Btn>
                  <Btn variant="outline" onClick={() => setOpenId(isOpen ? null : product.id)}>
                    {isOpen ? "Fechar" : "Editar"}
                  </Btn>
                  <Btn
                    variant="danger"
                    onClick={() => remove(product.id)}
                    ariaLabel={`Apagar ${product.name}`}
                  >
                    <Trash2 size={13} />
                  </Btn>
                </div>
              </div>

              {isOpen && (
                <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 lg:grid-cols-2">
                  <Field label="Nome">
                    <TextInput
                      value={product.name}
                      onChange={(value) =>
                        patch(product.id, {
                          name: value,
                          slug: slugify(value) || product.slug,
                        })
                      }
                    />
                  </Field>

                  <Field label="Endereço (slug)" hint="Gerado a partir do nome, podes ajustar.">
                    <TextInput
                      value={product.slug}
                      onChange={(value) => patch(product.id, { slug: slugify(value) })}
                    />
                  </Field>

                  <Field label="Categoria">
                    <SelectInput
                      value={product.categoryId}
                      onChange={(value) => patch(product.id, { categoryId: value })}
                      options={categories.map((category) => ({
                        value: category.id,
                        label: category.name,
                      }))}
                    />
                  </Field>

                  <Field label="Etiqueta (opcional)" hint="Ex.: Novo, Mais popular">
                    <TextInput
                      value={product.badge}
                      onChange={(value) => patch(product.id, { badge: value })}
                    />
                  </Field>

                  <div className="lg:col-span-2">
                    <Field label="Descrição curta">
                      <TextArea
                        value={product.shortDescription}
                        rows={2}
                        onChange={(value) => patch(product.id, { shortDescription: value })}
                      />
                    </Field>
                  </div>

                  <div className="lg:col-span-2">
                    <Field label="Descrição completa">
                      <TextArea
                        value={product.longDescription}
                        rows={4}
                        onChange={(value) => patch(product.id, { longDescription: value })}
                      />
                    </Field>
                  </div>

                  <MediaField
                    label="Imagem principal"
                    value={product.image}
                    onChange={(value) => patch(product.id, { image: value })}
                  />

                  <Field
                    label="Galeria"
                    hint="Um caminho de imagem por linha."
                  >
                    <TextArea
                      value={product.gallery.join("\n")}
                      rows={4}
                      onChange={(value) =>
                        patch(product.id, {
                          gallery: value
                            .split("\n")
                            .map((line) => line.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </Field>

                  <Field label="Preço">
                    <SelectInput
                      value={product.priceMode}
                      onChange={(value) =>
                        patch(product.id, { priceMode: value === "price" ? "price" : "quote" })
                      }
                      options={[
                        { value: "quote", label: "Sob consulta" },
                        { value: "price", label: "Preço indicado" },
                      ]}
                    />
                  </Field>

                  <Field label="Valor a mostrar" hint='Ex.: "Desde 19,90€". Só é usado com preço indicado.'>
                    <TextInput
                      value={product.price}
                      onChange={(value) => patch(product.id, { price: value })}
                    />
                  </Field>

                  <Field label="Tamanhos" hint="Separados por vírgula.">
                    <TextInput
                      value={product.variants.sizes.join(", ")}
                      onChange={(value) =>
                        patch(product.id, {
                          variants: {
                            ...product.variants,
                            sizes: value.split(",").map((v) => v.trim()).filter(Boolean),
                          },
                        })
                      }
                    />
                  </Field>

                  <Field label="Cores" hint="Separadas por vírgula.">
                    <TextInput
                      value={product.variants.colors.join(", ")}
                      onChange={(value) =>
                        patch(product.id, {
                          variants: {
                            ...product.variants,
                            colors: value.split(",").map((v) => v.trim()).filter(Boolean),
                          },
                        })
                      }
                    />
                  </Field>

                  <div className="grid gap-3 lg:col-span-2 sm:grid-cols-2 xl:grid-cols-3">
                    <Toggle
                      label="Publicado"
                      checked={product.status === "published"}
                      onChange={(checked) =>
                        patch(product.id, { status: checked ? "published" : "draft" })
                      }
                    />
                    <Toggle
                      label="Mostrar na loja"
                      checked={product.showInShop}
                      onChange={(checked) => patch(product.id, { showInShop: checked })}
                    />
                    <Toggle
                      label="Mostrar na página inicial"
                      checked={product.showInHome}
                      onChange={(checked) => patch(product.id, { showInHome: checked })}
                    />
                    <Toggle
                      label="Produto em destaque"
                      checked={product.featured}
                      onChange={(checked) => patch(product.id, { featured: checked })}
                    />
                    <Toggle
                      label="Permite personalização"
                      checked={product.customizable}
                      onChange={(checked) => patch(product.id, { customizable: checked })}
                    />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </AdminPage>
  );
}
