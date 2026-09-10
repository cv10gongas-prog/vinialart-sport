import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { PageHero, PageShell } from "@/components/sport/PageShell";
import { SportButton } from "@/components/sport/SportButton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contactos")({
  component: Contactos,
  head: () => ({
    meta: [
      { title: "Contactos — VinilArt Sport" },
      {
        name: "description",
        content:
          "Fala com a VinilArt Sport sobre personalização de equipamentos, artigos para adeptos e encomendas de equipa.",
      },
      { property: "og:title", content: "Contactos — VinilArt Sport" },
      {
        property: "og:description",
        content: "Pedidos de orçamento e personalização desportiva na VinilArt Sport.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contactos" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contactos" }],
  }),
});

const schema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("Endereço de email inválido."),
  telefone: z.string().optional(),
  clube: z.string().optional(),
  tipoPedido: z.string().min(1, "Seleciona um tipo de pedido."),
  mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres."),
});

type FormData = z.infer<typeof schema>;

const fieldClass =
  "h-11 w-full border border-input bg-surface px-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-cyan transition-colors";

const errorClass = "mt-1 text-[0.65rem] text-destructive";

function Contactos() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tipoPedido: "" },
  });

  function onSubmit(_data: FormData) {
    // NOTE: Form submission is not yet wired to a live backend.
    // Display an honest confirmation stating the order was prepared locally.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <PageShell>
        <PageHero eyebrow="Contactos" title="Pedido preparado com sucesso." />
        <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <div className="card-sport hover:!translate-y-0 p-8 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-cyan" aria-hidden="true" />
            <h2 className="mt-4 text-xl">Pedido preparado com sucesso.</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              O pedido foi preparado com sucesso. O envio online direto será ativado quando os dados de contacto e canais de receção da VinilArt Sport forem configurados.
            </p>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Contactos"
        title="Falar com a VinilArt Sport"
        text="Conta-nos o que queres personalizar. Entramos em contacto para te apresentar uma proposta."
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-label="Formulário de contacto"
          className="card-sport hover:!translate-y-0 grid gap-4 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="nome" className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                Nome <span aria-hidden="true" className="text-destructive">*</span>
              </label>
              <input
                id="nome"
                {...register("nome")}
                autoComplete="name"
                aria-required="true"
                aria-invalid={!!errors.nome}
                aria-describedby={errors.nome ? "nome-error" : undefined}
                className={cn("mt-2", fieldClass, errors.nome && "border-destructive")}
                placeholder="O teu nome"
              />
              {errors.nome && (
                <p id="nome-error" role="alert" className={errorClass}>
                  {errors.nome.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                Email <span aria-hidden="true" className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                autoComplete="email"
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={cn("mt-2", fieldClass, errors.email && "border-destructive")}
                placeholder="email@exemplo.pt"
              />
              {errors.email && (
                <p id="email-error" role="alert" className={errorClass}>
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="telefone" className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                Telefone <span className="text-muted-foreground/50">(opcional)</span>
              </label>
              <input
                id="telefone"
                type="tel"
                {...register("telefone")}
                autoComplete="tel"
                className={cn("mt-2", fieldClass)}
                placeholder="+351 900 000 000"
              />
            </div>
            <div>
              <label htmlFor="clube" className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                Clube / Empresa <span className="text-muted-foreground/50">(opcional)</span>
              </label>
              <input
                id="clube"
                {...register("clube")}
                className={cn("mt-2", fieldClass)}
                placeholder="Nome do clube ou empresa"
              />
            </div>
          </div>

          <div>
            <label htmlFor="tipoPedido" className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              Tipo de pedido <span aria-hidden="true" className="text-destructive">*</span>
            </label>
            <select
              id="tipoPedido"
              {...register("tipoPedido")}
              aria-required="true"
              aria-invalid={!!errors.tipoPedido}
              aria-describedby={errors.tipoPedido ? "tipo-error" : undefined}
              className={cn(
                "mt-2",
                fieldClass,
                errors.tipoPedido && "border-destructive",
              )}
            >
              <option value="">Seleciona…</option>
              <option value="Caneleiras">Caneleiras</option>
              <option value="Equipamentos">Equipamentos</option>
              <option value="Bandeiras">Bandeiras</option>
              <option value="Artigos para adeptos">Artigos para adeptos</option>
              <option value="Estampagem / Impressão">Estampagem / Impressão</option>
              <option value="Outro">Outro</option>
            </select>
            {errors.tipoPedido && (
              <p id="tipo-error" role="alert" className={errorClass}>
                {errors.tipoPedido.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="mensagem" className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              Mensagem <span aria-hidden="true" className="text-destructive">*</span>
            </label>
            <textarea
              id="mensagem"
              rows={6}
              {...register("mensagem")}
              aria-required="true"
              aria-invalid={!!errors.mensagem}
              aria-describedby={errors.mensagem ? "mensagem-error" : undefined}
              className={cn(
                "mt-2 w-full border border-input bg-surface p-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-cyan transition-colors",
                errors.mensagem && "border-destructive",
              )}
              placeholder="Descreve o que precisas: quantidades, tamanhos, prazos, referências visuais…"
            />
            {errors.mensagem && (
              <p id="mensagem-error" role="alert" className={errorClass}>
                {errors.mensagem.message}
              </p>
            )}
          </div>

          <SportButton
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="justify-self-start"
          >
            {isSubmitting ? "A preparar pedido…" : "Preparar pedido"}
          </SportButton>

          <p className="text-xs text-muted-foreground">
            Campos marcados com <span aria-label="obrigatório">*</span> são obrigatórios.
          </p>
        </form>

        <aside className="card-sport hover:!translate-y-0 h-fit p-6">
          <p className="font-display text-sm">Dados de contacto</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Dados de contacto direto a confirmar contigo antes de publicar.
          </p>
          <div className="brush-rule my-6" />
          <p className="font-display text-sm">Encomendas de equipa</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Para clubes, envia a lista de nomes, números e tamanhos junto com o pedido.
          </p>
        </aside>
      </section>
    </PageShell>
  );
}
