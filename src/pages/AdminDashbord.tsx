import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Save, Plus, Trash, Pencil } from "lucide-react";
import { Product, getProducts, upsertProduct, deleteProduct } from "@/data/products";

const empty: Product = {
  id: "",
  name: "",
  description: "",
  price: 0,
  rating: 4.5,
  reviewCount: 0,
  image: "",
  badge: "",
  category: "",
};

const AdminDashboard = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Product>(empty);
  const [q, setQ] = useState("");

  useEffect(() => { setItems(getProducts()); }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return items.filter(p => p.name.toLowerCase().includes(s) || (p.category||"").toLowerCase().includes(s));
  }, [items, q]);

  const addNew = () => {
    if (!form.name.trim()) return;
    const toSave: Product = {
      ...form,
      id: crypto.randomUUID(),
      price: Number(form.price || 0),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
    };
    upsertProduct(toSave);
    setItems(getProducts());
    setForm(empty);
  };

  const startEdit = (p: Product) => setEditing({ ...p });
  const cancelEdit = () => setEditing(null);
  const saveEdit = () => {
    if (!editing) return;
    upsertProduct(editing);
    setItems(getProducts());
    setEditing(null);
  };
  const remove = (id: string) => {
    deleteProduct(id);
    setItems(getProducts());
    if (editing?.id === id) setEditing(null);
  };

  const handleUpload = (file: File, target: "new" | "edit") => {
    const r = new FileReader();
    r.onload = () => {
      const dataUrl = r.result as string;
      if (target === "new") setForm(prev => ({ ...prev, image: dataUrl }));
      if (target === "edit" && editing) setEditing({ ...editing, image: dataUrl });
    };
    r.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 lg:px-8 py-10">
        <h1 className="text-3xl font-serif font-bold mb-8 text-foreground">Admin Dashboard</h1>

        {/* Add Product */}
        <Card className="mb-10">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Add Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="border border-border rounded px-3 py-2 bg-background" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input className="border border-border rounded px-3 py-2 bg-background" placeholder="Category" value={form.category || ""} onChange={e => setForm({ ...form, category: e.target.value })} />
              <input className="border border-border rounded px-3 py-2 bg-background" placeholder="Price" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
              <input className="border border-border rounded px-3 py-2 bg-background" placeholder="Original Price (optional)" type="number" step="0.01" value={form.originalPrice || ""} onChange={e => setForm({ ...form, originalPrice: e.target.value ? Number(e.target.value) : undefined })} />
              <input className="border border-border rounded px-3 py-2 bg-background" placeholder="Badge (optional)" value={form.badge || ""} onChange={e => setForm({ ...form, badge: e.target.value })} />
              <input className="border border-border rounded px-3 py-2 bg-background" placeholder="Rating (0-5)" type="number" step="0.1" value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} />
            </div>
            <textarea className="w-full border border-border rounded px-3 py-2 bg-background" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <div className="flex items-center gap-3">
              <input className="flex-1 border border-border rounded px-3 py-2 bg-background" placeholder="Image URL (or upload below)" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files[0], "new")} />
                <span className="text-sm">Upload</span>
              </label>
            </div>
            <Button variant="premium" onClick={addNew}><Plus className="w-4 h-4 mr-2" />Add Product</Button>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="mb-6">
          <input className="w-full md:w-96 border border-border rounded px-3 py-2 bg-background" placeholder="Search by name or category..." value={q} onChange={e => setQ(e.target.value)} />
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <Card key={p.id} className="overflow-hidden">
              <CardContent className="p-0">
                <img src={(editing?.id === p.id ? editing.image : p.image) || ""} alt={p.name} className="w-full h-48 object-cover" />
                <div className="p-4 space-y-2">
                  {editing?.id === p.id ? (
                    <>
                      <input className="w-full border border-border rounded px-3 py-2 bg-background" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
                      <textarea className="w-full border border-border rounded px-3 py-2 bg-background" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
                      <div className="grid grid-cols-2 gap-2">
                        <input className="border border-border rounded px-3 py-2 bg-background" type="number" step="0.01" value={editing.price} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })} />
                        <input className="border border-border rounded px-3 py-2 bg-background" type="number" step="0.01" value={editing.originalPrice || 0} onChange={e => setEditing({ ...editing, originalPrice: Number(e.target.value) })} />
                        <input className="border border-border rounded px-3 py-2 bg-background" type="number" step="0.1" value={editing.rating} onChange={e => setEditing({ ...editing, rating: Number(e.target.value) })} />
                        <input className="border border-border rounded px-3 py-2 bg-background" type="number" value={editing.reviewCount} onChange={e => setEditing({ ...editing, reviewCount: Number(e.target.value) })} />
                      </div>
                      <div className="flex items-center gap-3">
                        <input className="flex-1 border border-border rounded px-3 py-2 bg-background" placeholder="Image URL" value={editing.image} onChange={e => setEditing({ ...editing, image: e.target.value })} />
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <Upload className="w-4 h-4" />
                          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files[0], "edit")} />
                          <span className="text-sm">Upload</span>
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="premium" onClick={saveEdit}><Save className="w-4 h-4 mr-2" />Save</Button>
                        <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold">{p.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">${p.price}</span>
                        {p.originalPrice && <span className="text-muted-foreground line-through">${p.originalPrice}</span>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="minimal" onClick={() => setEditing(p)}><Pencil className="w-4 h-4 mr-2" />Edit</Button>
                        <Button variant="destructive" onClick={() => remove(p.id)}><Trash className="w-4 h-4 mr-2" />Delete</Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
