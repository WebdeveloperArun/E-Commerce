import { useState } from "react";


const defaultColors = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080", // Purple
    "#808080", // Gray
    "#000000", // Black
    "#FFFFFF", // White
];

const ColorSelector = ({control, errors}: any) => {
    const [customColor, setCustomColor] = useState<string[]>([]);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [newColor, setNewColor] = useState("#ffffff");

  return (
    <div className="mt-2">
        <label className="block font-semibold text-gray-300 mb-1">
            Colors
        </label>
    </div>
  );
};