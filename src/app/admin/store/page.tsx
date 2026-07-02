import { prisma } from "@/lib/prisma";
import { createProduct, deleteProduct } from "../actions";
import { Badge } from "@/components/ui";
import {
  AdminForm,
  Field,
  TextareaField,
  SelectField,
  CheckboxField,
  DeleteButton,
  PageTitle,
} from "@/components/admin/ui";

const STATUS_LABEL: Record<string, { label: string; tone: "green" | "cyan" | "neutral" }> = {
  AVAILABLE: { label: "Disponible", tone: "green" },
  BETA: { label: "Beta", tone: "cyan" },
  COMING_SOON: { label: "Próximamente", tone: "neutral" },
};

export default async function AdminStore() {
  const products = await prisma.product.findMany({
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <PageTitle>Tienda</PageTitle>

      <AdminForm action={createProduct} title="Nuevo producto" submit="Crear producto">
        <Field label="Nombre" name="name" required placeholder="App StarBooks" />
        <Field label="Ícono (emoji)" name="icon" placeholder="📚" />
        <Field label="Tagline" name="tagline" span placeholder="Micro-resúmenes de libros en tu bolsillo" />
        <TextareaField label="Descripción" name="description" />
        <SelectField
          label="Categoría"
          name="category"
          options={[
            { value: "APP", label: "App" },
            { value: "SERVICE", label: "Servicio" },
          ]}
        />
        <SelectField
          label="Estado"
          name="status"
          options={[
            { value: "AVAILABLE", label: "Disponible" },
            { value: "BETA", label: "Beta" },
            { value: "COMING_SOON", label: "Próximamente" },
          ]}
        />
        <Field label="Precio (texto)" name="price" placeholder="Gratis · $9/mes · Incluido en Family Pass" />
        <Field label="URL externa (opcional)" name="url" placeholder="Si se deja vacío, el botón abre WhatsApp" />
        <Field label="Posición (orden)" name="position" type="number" defaultValue={0} />
        <CheckboxField label="Destacado" name="featured" />
      </AdminForm>

      <div className="space-y-2">
        {products.map((p) => {
          const s = STATUS_LABEL[p.status] ?? STATUS_LABEL.COMING_SOON;
          return (
            <div
              key={p.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-surface-line bg-paper px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-navy">
                  {p.icon ? `${p.icon} ` : ""}
                  {p.name}
                  {p.featured ? " ★" : ""}
                </p>
                <p className="truncate text-xs text-muted">
                  {p.category === "APP" ? "App" : "Servicio"} · {p.tagline}
                  {p.price ? ` · ${p.price}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Badge tone={s.tone}>{s.label}</Badge>
                <DeleteButton action={deleteProduct} id={p.id} />
              </div>
            </div>
          );
        })}
        {products.length === 0 && (
          <p className="text-sm text-muted">Aún no hay productos en la tienda.</p>
        )}
      </div>
    </div>
  );
}
