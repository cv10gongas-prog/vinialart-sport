import { useState } from "react";
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
  component: AdminProdutos;
});

function AdminProdutos() {
  return null;
}
