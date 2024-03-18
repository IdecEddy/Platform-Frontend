// contexts/DataContext.js
import React, { createContext } from 'react';

// Define the context's type for TypeScript, if you're using it
interface DataItem {
  id: number;
  user_id: number;
  config_data: string;
  config_label: string;
  config_user: string;
  config_server: string;
  config_description: string;
}

interface DataContextType {
  data: DataItem[];
  setData: React.Dispatch<React.SetStateAction<DataItem[]>>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

