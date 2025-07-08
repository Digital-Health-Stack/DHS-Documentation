import React from "react";

export default function WarningBar() {
  return (
    <div className="bg-yellow-100 border-b border-yellow-200 py-3 px-4">
      <div className="max-w-7xl mx-auto text-center text-sm font-medium text-yellow-800">
        ⚠️ This is not official documentation. Still under active development.
      </div>
    </div>
  );
}
