import { Loader2 } from "lucide-react";
import React from "react";

export const Loading = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-90">
        <Loader2 className="h-8 w-8 animate-spin" color="gray" />
        <h2 className="text-xl font-semibold text-gray-500 ">
          Carregando...
        </h2>
      </div>
    </div>
  );
};
