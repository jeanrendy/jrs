import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface MultiSelectBadgesProps {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    allowCustom?: boolean;
    placeholder?: string;
    label?: string;
}

export function MultiSelectBadges({
    options: initialOptions,
    selected,
    onChange,
    allowCustom = true,
    placeholder = "Add custom...",
    label
}: MultiSelectBadgesProps) {
    const [customInput, setCustomInput] = useState("");
    const [customOptions, setCustomOptions] = useState<string[]>([]);

    // Combine predefined options with any custom selected ones that aren't in the list
    // efficiently to avoid duplicates
    const allOptions = Array.from(new Set([...initialOptions, ...customOptions]));

    const toggleSelection = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const handleAddCustom = () => {
        if (!customInput.trim()) return;
        const newVal = customInput.trim();
        if (!allOptions.includes(newVal)) {
            setCustomOptions([...customOptions, newVal]);
        }
        if (!selected.includes(newVal)) {
            onChange([...selected, newVal]);
        }
        setCustomInput("");
    };

    return (
        <div className="space-y-3">
            {label && <label className="text-sm font-medium text-gray-900">{label}</label>}

            <div className="flex flex-wrap gap-2 mb-3">
                {selected.map(item => (
                    <Badge
                        key={item}
                        variant="default"
                        className="bg-black text-white hover:bg-gray-800 cursor-pointer pl-3 pr-1 py-1 text-sm flex items-center gap-1"
                        onClick={() => toggleSelection(item)}
                    >
                        {item}
                        <div className="hover:bg-gray-700 rounded-full p-0.5">
                            <X size={12} />
                        </div>
                    </Badge>
                ))}
            </div>

            <div className="border rounded-md p-4 bg-gray-50/50 border-gray-100">
                <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto mb-4">
                    {allOptions.filter(opt => !selected.includes(opt)).map(option => (
                        <Badge
                            key={option}
                            variant="outline"
                            className="text-gray-600 bg-white border-gray-200 hover:border-black hover:text-black cursor-pointer transition-all"
                            onClick={() => toggleSelection(option)}
                        >
                            {option}
                        </Badge>
                    ))}
                    {allOptions.filter(opt => !selected.includes(opt)).length === 0 && (
                        <p className="text-xs text-gray-400 italic p-2">All options selected</p>
                    )}
                </div>

                {allowCustom && (
                    <div className="flex gap-2 items-center">
                        <Input
                            placeholder={placeholder}
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddCustom();
                                }
                            }}
                            className="bg-white text-black border-gray-200 h-9"
                        />
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleAddCustom}
                            className="h-9 px-3 border-gray-200 text-black hover:bg-gray-100 bg-white"
                        >
                            <Plus size={16} />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
