import { StateCreator } from 'zustand';

export interface UISlice {
  // Preview settings
  previewWidth: number;
  setPreviewWidth: (width: number) => void;

  previewHeight: number;
  setPreviewHeight: (height: number) => void;

  // SVG Viewport settings (internal viewBox)
  desktopViewBoxWidth: number;
  setDesktopViewBoxWidth: (width: number) => void;
  desktopViewBoxHeight: number;
  setDesktopViewBoxHeight: (height: number) => void;

  mobileViewBoxWidth: number;
  setMobileViewBoxWidth: (width: number) => void;
  mobileViewBoxHeight: number;
  setMobileViewBoxHeight: (height: number) => void;

  previewDevice: 'viewport' | 'mobile' | 'tablet' | 'desktop';
  setPreviewDevice: (device: 'viewport' | 'mobile' | 'tablet' | 'desktop') => void;

  colorblindMode:
    | 'none'
    | 'protanopia'
    | 'deuteranopia'
    | 'tritanopia'
    | 'achromatopsia';
  setColorblindMode: (
    mode:
      | 'none'
      | 'protanopia'
      | 'deuteranopia'
      | 'tritanopia'
      | 'achromatopsia'
  ) => void;

  darkModePreview: 'light' | 'dark';
  setDarkModePreview: (mode: 'light' | 'dark') => void;

  // Zoom settings
  zoomDomain: { x: [number, number] | null; y: [number, number] | null } | null;
  setZoomDomain: (domain: { x: [number, number] | null; y: [number, number] | null } | null) => void;
  resetZoom: () => void;
  
  showZoomControls: boolean;
  setShowZoomControls: (show: boolean) => void;

  // UI state
  isDataPanelOpen: boolean;
  toggleDataPanel: () => void;

  isConfigPanelOpen: boolean;
  toggleConfigPanel: () => void;

  isExporting: boolean;
  setIsExporting: (value: boolean) => void;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  // Preview settings
  previewWidth: 1920,
  setPreviewWidth: (width) => set({ previewWidth: width }),

  previewHeight: 1080,
  setPreviewHeight: (height) => set({ previewHeight: height }),

  // SVG Viewport defaults
  desktopViewBoxWidth: 800,
  setDesktopViewBoxWidth: (width) => set({ desktopViewBoxWidth: width }),
  desktopViewBoxHeight: 600,
  setDesktopViewBoxHeight: (height) => set({ desktopViewBoxHeight: height }),

  mobileViewBoxWidth: 400,
  setMobileViewBoxWidth: (width) => set({ mobileViewBoxWidth: width }),
  mobileViewBoxHeight: 400,
  setMobileViewBoxHeight: (height) => set({ mobileViewBoxHeight: height }),

  previewDevice: 'viewport',
  setPreviewDevice: (device) => set({ previewDevice: device }),

  colorblindMode: 'none',
  setColorblindMode: (mode) => set({ colorblindMode: mode }),

  darkModePreview: 'light',
  setDarkModePreview: (mode) => set({ darkModePreview: mode }),

  // Zoom settings
  zoomDomain: null,
  setZoomDomain: (domain) => set({ zoomDomain: domain }),
  resetZoom: () => set({ zoomDomain: null }),
  
  showZoomControls: true,
  setShowZoomControls: (show) => set({ showZoomControls: show }),

  // Initial UI state
  isDataPanelOpen: true,
  toggleDataPanel: () =>
    set((state) => ({ isDataPanelOpen: !state.isDataPanelOpen })),

  isConfigPanelOpen: true,
  toggleConfigPanel: () =>
    set((state) => ({ isConfigPanelOpen: !state.isConfigPanelOpen })),

  isExporting: false,
  setIsExporting: (value) => set({ isExporting: value }),
});
