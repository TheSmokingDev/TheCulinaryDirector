import { useState } from "react";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { App, Button, Input, Modal, Popconfirm, Select } from "antd";
import type { ToolEntry } from "../api/services/entries";
import { useEntries, useEntryMutations } from "../hooks/useEntries";
import BrandButton from "./BrandButton";

export interface SavedEntriesBarProps<T> {
  slug: string;
  /** Snapshot of the tool's current inputs, called when saving. */
  getData: () => T;
  /** Restore the tool's inputs from a saved entry. */
  onLoad: (entry: ToolEntry<T>) => void;
}

/**
 * Save/load bar shown at the top of every tool: pick a saved entry to load
 * it, save the current inputs under a name, update or delete the loaded one.
 */
export default function SavedEntriesBar<T>({
  slug,
  getData,
  onLoad,
}: SavedEntriesBarProps<T>) {
  const { message } = App.useApp();
  const { data: entries } = useEntries<T>(slug);
  const { create, update, remove } = useEntryMutations<T>(slug);

  const [loadedId, setLoadedId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");

  const loaded = entries?.find((e) => e.id === loadedId) ?? null;

  const handleSelect = (id: number | null) => {
    setLoadedId(id);
    if (id === null) return;
    const entry = entries?.find((e) => e.id === id);
    if (entry) {
      onLoad(entry);
      message.success(`Loaded "${entry.name}"`);
    }
  };

  const saveNew = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const entry = await create.mutateAsync({ name: trimmed, data: getData() });
    setLoadedId(entry.id);
    setModalOpen(false);
    message.success(`Saved "${trimmed}"`);
  };

  const overwrite = async () => {
    if (!loaded) return;
    const trimmed = name.trim() || loaded.name;
    await update.mutateAsync({ id: loaded.id, name: trimmed, data: getData() });
    setModalOpen(false);
    message.success(`Updated "${trimmed}"`);
  };

  const handleDelete = async () => {
    if (!loaded) return;
    await remove.mutateAsync(loaded.id);
    setLoadedId(null);
    message.success(`Deleted "${loaded.name}"`);
  };

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-sand pb-6">
      <span className="brand-label text-[11px] text-ink/50">Saved entries</span>
      <Select
        className="min-w-56 flex-1 sm:flex-none"
        placeholder={
          entries?.length ? "Load a saved entry…" : "Nothing saved yet"
        }
        allowClear
        value={loadedId}
        onChange={(v) => handleSelect(v ?? null)}
        options={(entries ?? []).map((e) => ({
          value: e.id,
          label: `${e.name} — ${new Date(e.updated_at).toLocaleDateString("en-AU")}`,
        }))}
      />
      <BrandButton
        icon={<SaveOutlined />}
        className="!h-9 !px-5 !text-xs"
        onClick={() => {
          setName(loaded?.name ?? "");
          setModalOpen(true);
        }}
      >
        Save
      </BrandButton>
      {loaded && (
        <Popconfirm
          title={`Delete "${loaded.name}"?`}
          okText="Delete"
          okButtonProps={{ danger: true }}
          onConfirm={handleDelete}
        >
          <Button type="text" icon={<DeleteOutlined />} danger />
        </Popconfirm>
      )}

      <Modal
        title="Save entry"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={
          <div className="flex justify-end gap-3">
            {loaded && (
              <BrandButton
                variantStyle="outline"
                loading={update.isPending}
                onClick={overwrite}
              >
                Update “{loaded.name}”
              </BrandButton>
            )}
            <BrandButton
              loading={create.isPending}
              disabled={!name.trim()}
              onClick={saveNew}
            >
              Save as new
            </BrandButton>
          </div>
        }
      >
        <Input
          className="my-4"
          placeholder="e.g. Chicken parmigiana"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onPressEnter={saveNew}
          autoFocus
        />
      </Modal>
    </div>
  );
}
