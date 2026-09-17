import { createFileRoute } from "@tanstack/react-router";

import {
  AdminPage,
  Card,
  Field,
  OrderButtons,
  StatusChip,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/AdminUI";
import { moveItem } from "@/lib/cms/helpers";
import { useCms } from "@/lib/cms/store";
import type { CmsHomeSection } from "@/lib/cms/types";

export const Route = createFileRoute("/admin/inicio")({
  component: AdminInicio,
});

function AdminInicio() {
  const { content, update } = useCms();
  const sections = [...content.homeSections].sort((a, b) => a.order - b.order);

  const patch = (id: string, changes: Partial<CmsHomeSection>) =>
    update((current) => ({
      ...current,
      homeSections: current.homeSections.map((section) =>
        section.id === id ? { ...section, ...changes } : section,
      ),
    }));

  const move = (id: string, direction: -1 | 1) =>
    update((current) => ({
      ...current,
      homeSections: moveItem(current.homeSections, id, direction),
    }));

  return (
    <AdminPage
      eyebrow="Início"
      title="Página inicial"
      description="Mostra, esconde e reordena as secções da página inicial e ajusta os títulos e textos de cada uma. O desenho aprovado mantém-se."
    >
      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <p className="font-display text-lg uppercase tracking-wide text-white">
                  {section.label}
                </p>
                <StatusChip tone={section.visible ? "ok" : "off"}>
                  {section.visible ? "Visível" : "Escondida"}
                </StatusChip>
              </div>
              <OrderButtons onUp={() => move(section.id, -1)} onDown={() => move(section.id, 1)} />
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <Field label="Título" hint="Deixa vazio para manter o texto atual do site.">
                <TextInput
                  value={section.title}
                  onChange={(value) => patch(section.id, { title: value })}
                />
              </Field>
              <div className="flex items-end">
                <Toggle
                  label="Mostrar esta secção"
                  checked={section.visible}
                  onChange={(checked) => patch(section.id, { visible: checked })}
                />
              </div>
              <div className="lg:col-span-2">
                <Field label="Texto de apoio">
                  <TextArea
                    value={section.subtitle}
                    rows={3}
                    onChange={(value) => patch(section.id, { subtitle: value })}
                  />
                </Field>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AdminPage>
  );
}
