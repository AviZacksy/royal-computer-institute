"use client";

import { useState } from "react";
import { updateMarqueeItems, type MarqueeItemData } from "@/actions/admin/settings";
import { Plus, Trash2, Save, GripVertical } from "lucide-react";

export function MarqueeForm({ initialItems }: { initialItems: MarqueeItemData[] }) {
  const [items, setItems] = useState<MarqueeItemData[]>(
    initialItems.length > 0 ? initialItems : [{ id: "1", icon: "", highlight: "", color: "red", text: "" }]
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = (index: number, field: keyof MarqueeItemData, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleAdd = () => {
    setItems([...items, { id: Date.now().toString(), icon: "📌", highlight: "", color: "blue", text: "" }]);
  };

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [{ id: Date.now().toString(), icon: "", highlight: "", color: "red", text: "" }]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      const validItems = items.filter(item => item.text.trim() !== "" || item.highlight.trim() !== "");
      await updateMarqueeItems(validItems);
      setItems(validItems.length > 0 ? validItems : [{ id: Date.now().toString(), icon: "", highlight: "", color: "red", text: "" }]);
      setMessage("Saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Marquee Text (News Ticker)</h3>
          <p className="text-sm text-gray-500 mt-1">Manage the scrolling text at the top of the website. Simply fill in the details below, no HTML needed!</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[var(--ui-accent)] text-[var(--ui-primary)] px-4 py-2 rounded-lg font-bold hover:scale-105 transition-transform disabled:opacity-70 disabled:hover:scale-100"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      
      <div className="p-5 space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-start gap-3 p-4 border border-gray-100 bg-white rounded-xl shadow-sm relative group">
            <div className="pt-2 text-gray-300 cursor-move">
              <GripVertical className="w-5 h-5" />
            </div>
            
            <div className="flex-1 grid grid-cols-12 gap-3">
              <div className="col-span-12 sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Emoji / Icon</label>
                <input
                  type="text"
                  value={item.icon}
                  onChange={(e) => handleUpdate(index, "icon", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ui-accent)] text-sm text-center"
                  placeholder="e.g. 🎉"
                />
              </div>
              <div className="col-span-12 sm:col-span-3">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Highlight Text</label>
                <input
                  type="text"
                  value={item.highlight}
                  onChange={(e) => handleUpdate(index, "highlight", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ui-accent)] text-sm font-bold"
                  placeholder="e.g. NEW BATCH"
                />
              </div>
              <div className="col-span-12 sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Color</label>
                <select
                  value={item.color}
                  onChange={(e) => handleUpdate(index, "color", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ui-accent)] text-sm"
                >
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                  <option value="purple">Purple</option>
                  <option value="black">Black</option>
                </select>
              </div>
              <div className="col-span-12 sm:col-span-5">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Message Text</label>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleUpdate(index, "text", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ui-accent)] text-sm"
                  placeholder="STARTS: 15th July..."
                />
              </div>
            </div>

            <button
              onClick={() => handleRemove(index)}
              className="absolute -right-2 -top-2 bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors shadow-sm opacity-0 group-hover:opacity-100"
              title="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        <div className="pt-2">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 text-sm font-semibold text-[var(--ui-secondary)] hover:opacity-80 transition-opacity bg-blue-50 px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add another item
          </button>
        </div>
        
        {message && (
          <div className={`p-3 rounded-lg text-sm font-semibold ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
