// pages/buildings/Buildings.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Building2, MapPin, Layers } from "lucide-react";
import { useQuery, useMutation } from "../../hooks/useSupabase";
import { useAuth } from "../../context/AuthContext";
import {
  PageHeader,
  Card,
  Badge,
  Modal,
  Empty,
  Spinner,
} from "../../components/ui/index.jsx";
import { Button } from "../../components/ui/Button";
import { Input, Select, Textarea } from "../../components/ui/Input";
import { capitalize } from "../../lib/utils";

function BuildingForm({ initial = {}, onSave, loading }) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    area: "",
    city: "",
    type: "apartment",
    total_floors: "",
    description: "",
    ...initial,
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="space-y-4"
    >
      <Input
        label="Building name"
        value={form.name}
        onChange={set("name")}
        required
        placeholder="Green Valley Tower"
        icon={Building2} // Pass component reference, not JSX
      />
      <Input
        label="Full address"
        value={form.address}
        onChange={set("address")}
        required
        placeholder="123 Main Road, Chittagong"
        icon={MapPin} // Pass component reference
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Area / Thana"
          value={form.area}
          onChange={set("area")}
          placeholder="Hathazari"
        />
        <Input
          label="City"
          value={form.city}
          onChange={set("city")}
          placeholder="Chittagong"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Building type"
          value={form.type}
          onChange={set("type")}
          required
        >
          <option value="apartment">Apartment</option>
          <option value="cottage">Cottage / Hostel</option>
          <option value="mixed">Mixed</option>
        </Select>
        <Input
          label="Total floors"
          type="number"
          value={form.total_floors}
          onChange={set("total_floors")}
          placeholder="6"
        />
      </div>
      <Textarea
        label="Description"
        value={form.description}
        onChange={set("description")}
        rows={3}
        placeholder="Optional notes…"
      />
      <Button type="submit" loading={loading} className="w-full">
        {initial.id ? "Save changes" : "Add building"}
      </Button>
    </form>
  );
}

export function BuildingsPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const {
    data: buildings,
    loading,
    refetch,
  } = useQuery("buildings", {
    order: { column: "created_at", ascending: false },
  });
  const { insert, update, loading: saving } = useMutation("buildings");
  const [modal, setModal] = useState(null); // 'create' | { edit: building }

  const handleCreate = async (form) => {
    const { error } = await insert({ ...form, owner_id: profile.id });
    if (!error) {
      refetch();
      setModal(null);
    }
  };

  const handleUpdate = async (form) => {
    const { error } = await update(modal.edit.id, form);
    if (!error) {
      refetch();
      setModal(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Buildings"
        subtitle={`${buildings?.length || 0} registered`}
        actions={
          <Button icon={Plus} onClick={() => setModal("create")}>
            Add building
          </Button>
        }
      />

      {!buildings || buildings.length === 0 ? (
        <Empty
          message="No buildings yet. Add your first property."
          action={
            <Button onClick={() => setModal("create")}>Add building</Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {buildings.map((b) => (
            <Card
              key={b.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/buildings/${b.id}`)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 size={24} className="text-blue-600" />
                  </div>
                  <Badge
                    status={b.is_active ? "success" : "warning"}
                    label={b.is_active ? "Active" : "Inactive"}
                    size="sm"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {b.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                  <MapPin size={13} /> {b.address}
                </p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Layers size={13} /> {b.total_floors ?? "—"} floors
                  </span>
                  <Badge
                    status={
                      b.type === "apartment"
                        ? "info"
                        : b.type === "cottage"
                          ? "purple"
                          : "teal"
                    }
                    label={capitalize(b.type)}
                    size="sm"
                  />
                </div>
                <div className="flex gap-2 mt-4 pt-2">
                  <button
                    className="flex-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal({ edit: b });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/buildings/${b.id}`);
                    }}
                  >
                    View →
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal
        open={modal === "create"}
        onClose={() => setModal(null)}
        title="Add building"
        size="lg"
      >
        <BuildingForm onSave={handleCreate} loading={saving} />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!modal?.edit}
        onClose={() => setModal(null)}
        title="Edit building"
        size="lg"
      >
        {modal?.edit && (
          <BuildingForm
            initial={modal.edit}
            onSave={handleUpdate}
            loading={saving}
          />
        )}
      </Modal>
    </div>
  );
}
