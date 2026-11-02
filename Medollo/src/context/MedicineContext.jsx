import React, { createContext, useState, useContext } from "react";

// Create the context
const MedicineContext = createContext();

// Create provider component
export const MedicineProvider = ({ children }) => {
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  return (
    <MedicineContext.Provider value={{ selectedMedicine, setSelectedMedicine }}>
      {children}
    </MedicineContext.Provider>
  );
};

// Custom hook for easy use
export const useMedicine = () => useContext(MedicineContext);
