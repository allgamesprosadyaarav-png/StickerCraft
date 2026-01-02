import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomDesign } from '../types';

interface DesignState {
  designs: CustomDesign[];
  saveDesign: (design: CustomDesign) => void;
  deleteDesign: (id: string) => void;
  getDesignsByUserId: (userId: string) => CustomDesign[];
}

export const useDesignStore = create<DesignState>()(
  persist(
    (set, get) => ({
      designs: [],
      saveDesign: (design) =>
        set((state) => ({
          designs: [...state.designs, design],
        })),
      deleteDesign: (id) =>
        set((state) => ({
          designs: state.designs.filter((d) => d.id !== id),
        })),
      getDesignsByUserId: (userId) => {
        const state = get();
        return state.designs;
      },
    }),
    {
      name: 'design-storage',
    }
  )
);
