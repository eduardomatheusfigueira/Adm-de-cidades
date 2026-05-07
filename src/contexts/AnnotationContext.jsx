import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AnnotationContext = createContext();

// Clear legacy localStorage data (annotations are now managed via profile save/load)
const LEGACY_STORAGE_KEY = 'map-annotations-visualizations';

export const AnnotationProvider = ({ children }) => {
  // Clear any old localStorage data on mount
  useEffect(() => {
    try { localStorage.removeItem(LEGACY_STORAGE_KEY); } catch (e) { /* ignore */ }
  }, []);

  // --- State (starts empty, restored via profile load) ---
  const [visualizations, setVisualizations] = useState([]);
  const [annotations, setAnnotations] = useState([]);

  // --- Session state ---
  const [activeVisualizationId, setActiveVisualizationId] = useState(null);
  const [drawingMode, setDrawingMode] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tempCoordinates, setTempCoordinates] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(null);
  const [currentColor, setCurrentColor] = useState('#FFFFFF');
  const [isViewMode, setIsViewMode] = useState(false);
  const getActiveAnnotations = useCallback(() => {
    if (!activeVisualizationId) return [];
    return annotations.filter(a => a.visualizationId === activeVisualizationId);
  }, [annotations, activeVisualizationId]);

  const getNextNumber = useCallback(() => {
    const active = annotations.filter(a => a.visualizationId === activeVisualizationId);
    if (active.length === 0) return 1;
    return Math.max(...active.map(a => a.number)) + 1;
  }, [annotations, activeVisualizationId]);

  // --- Drawing controls ---
  const startDrawing = useCallback((type) => {
    // If no active visualization, create a temporary one
    if (!activeVisualizationId) {
      const newViz = {
        id: `viz-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: '',
        createdAt: new Date().toISOString(),
      };
      setVisualizations(prev => [...prev, newViz]);
      setActiveVisualizationId(newViz.id);
    }
    setDrawingMode(type);
    setIsDrawing(false);
    setTempCoordinates([]);
    setCursorPosition(null);
  }, [activeVisualizationId]);

  const cancelDrawing = useCallback(() => {
    setDrawingMode(null);
    setIsDrawing(false);
    setTempCoordinates([]);
    setCursorPosition(null);
  }, []);

  // Called on every map click when drawingMode is active
  const handleMapClick = useCallback((lngLat) => {
    if (!drawingMode) return false; // not handled

    const coord = [lngLat.lng, lngLat.lat];

    if (drawingMode === 'point') {
      // Immediately create annotation
      const num = getNextNumber();
      const annotation = {
        id: `ann-${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${num}`,
        number: num,
        type: 'point',
        coordinates: coord,
        color: currentColor,
        description: '',
        visualizationId: activeVisualizationId,
      };
      setAnnotations(prev => [...prev, annotation]);
      // Stay in point mode for rapid placement
      return true;
    }

    if (drawingMode === 'line' || drawingMode === 'polygon') {
      const newCoords = [...tempCoordinates, coord];
      setTempCoordinates(newCoords);
      setIsDrawing(true);
      return true;
    }

    return false;
  }, [drawingMode, tempCoordinates, getNextNumber, activeVisualizationId]);

  // Called on double-click to finalize line/polygon
  const handleMapDoubleClick = useCallback((lngLat) => {
    if (!drawingMode || drawingMode === 'point') return false;

    const coord = [lngLat.lng, lngLat.lat];
    let finalCoords = [...tempCoordinates, coord];

    if (finalCoords.length < 2) {
      cancelDrawing();
      return true;
    }

    const num = getNextNumber();

    if (drawingMode === 'line') {
      const annotation = {
        id: `ann-${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${num}`,
        number: num,
        type: 'line',
        coordinates: finalCoords,
        color: currentColor,
        lineColor: currentColor,
        lineWidth: 2.5,
        lineStyle: 'solid',
        description: '',
        visualizationId: activeVisualizationId,
      };
      setAnnotations(prev => [...prev, annotation]);
    } else if (drawingMode === 'polygon') {
      if (finalCoords.length < 3) {
        cancelDrawing();
        return true;
      }
      // Close the polygon
      finalCoords = [...finalCoords, finalCoords[0]];
      const annotation = {
        id: `ann-${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${num}`,
        number: num,
        type: 'polygon',
        coordinates: finalCoords,
        color: currentColor,
        fillColor: currentColor,
        fillOpacity: 0.15,
        strokeColor: '#000000',
        strokeWidth: 2.5,
        strokeStyle: 'solid',
        description: '',
        visualizationId: activeVisualizationId,
      };
      setAnnotations(prev => [...prev, annotation]);
    }

    // Reset drawing state but keep mode active
    setTempCoordinates([]);
    setIsDrawing(false);
    setCursorPosition(null);
    return true;
  }, [drawingMode, tempCoordinates, getNextNumber, activeVisualizationId, cancelDrawing]);

  // --- Annotation CRUD ---
  const updateAnnotationDescription = useCallback((id, description) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, description } : a));
  }, []);

  const updateAnnotationColor = useCallback((id, color) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, color } : a));
  }, []);

  const updateAnnotationColors = useCallback((id, colorUpdates) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, ...colorUpdates } : a));
  }, []);

  const removeAnnotation = useCallback((id) => {
    setAnnotations(prev => {
      const updated = prev.filter(a => a.id !== id);
      // Re-number remaining annotations within the same visualization
      const vizId = prev.find(a => a.id === id)?.visualizationId;
      if (!vizId) return updated;
      let counter = 1;
      return updated.map(a => {
        if (a.visualizationId === vizId) {
          return { ...a, number: counter++ };
        }
        return a;
      });
    });
  }, []);

  // --- Visualization CRUD ---
  const createVisualization = useCallback(() => {
    // Cancel any ongoing drawing
    cancelDrawing();
    const newViz = {
      id: `viz-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: '',
      createdAt: new Date().toISOString(),
    };
    setVisualizations(prev => [...prev, newViz]);
    setActiveVisualizationId(newViz.id);
    return newViz.id;
  }, [cancelDrawing]);

  const saveVisualization = useCallback((name) => {
    if (!activeVisualizationId) return;
    setVisualizations(prev => prev.map(v =>
      v.id === activeVisualizationId ? { ...v, name: name.trim() || `Visualização ${prev.indexOf(v) + 1}` } : v
    ));
    cancelDrawing();
  }, [activeVisualizationId, cancelDrawing]);

  const loadVisualization = useCallback((id) => {
    cancelDrawing();
    setActiveVisualizationId(id);
  }, [cancelDrawing]);

  const deleteVisualization = useCallback((id) => {
    setVisualizations(prev => prev.filter(v => v.id !== id));
    setAnnotations(prev => prev.filter(a => a.visualizationId !== id));
    if (activeVisualizationId === id) {
      cancelDrawing();
      setActiveVisualizationId(null);
    }
  }, [activeVisualizationId, cancelDrawing]);

  const closeAnnotationPanel = useCallback(() => {
    cancelDrawing();
    setActiveVisualizationId(null);
  }, [cancelDrawing]);

  const value = {
    // State
    annotations,
    setAnnotations,
    visualizations,
    setVisualizations,
    activeVisualizationId,
    drawingMode,
    isDrawing,
    tempCoordinates,
    cursorPosition,
    // Derived
    getActiveAnnotations,
    // Drawing
    startDrawing,
    cancelDrawing,
    handleMapClick,
    handleMapDoubleClick,
    setCursorPosition,
    // Annotation CRUD
    updateAnnotationDescription,
    updateAnnotationColor,
    updateAnnotationColors,
    removeAnnotation,
    // Color
    currentColor,
    setCurrentColor,
    // View mode
    isViewMode,
    setIsViewMode,
    // Visualization CRUD
    createVisualization,
    saveVisualization,
    loadVisualization,
    deleteVisualization,
    closeAnnotationPanel,
    setActiveVisualizationId,
  };

  return (
    <AnnotationContext.Provider value={value}>
      {children}
    </AnnotationContext.Provider>
  );
};
