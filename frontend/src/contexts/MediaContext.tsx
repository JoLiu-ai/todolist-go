import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Media, MediaType } from '../types/media';
import { mediaApi, GetMediaParams } from '../api/client';

interface MediaState {
  items: Media[];
  loading: boolean;
  error: string | null;
  selectedItem: Media | null;
}

type MediaAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Media[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_SELECTED_ITEM'; payload: Media | null }
  | { type: 'ADD_ITEM'; payload: Media }
  | { type: 'UPDATE_ITEM'; payload: Media }
  | { type: 'DELETE_ITEM'; payload: number }
  | { type: 'ADD_NOTE'; payload: Media }
  | { type: 'UPDATE_NOTE'; payload: Media }
  | { type: 'DELETE_NOTE'; payload: Media };

const initialState: MediaState = {
  items: [],
  loading: false,
  error: null,
  selectedItem: null,
};

function mediaReducer(state: MediaState, action: MediaAction): MediaState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_SELECTED_ITEM':
      return { ...state, selectedItem: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'ADD_NOTE':
    case 'UPDATE_NOTE':
    case 'DELETE_NOTE':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
        selectedItem:
          state.selectedItem?.id === action.payload.id
            ? action.payload
            : state.selectedItem,
      };
    default:
      return state;
  }
}

interface MediaContextType extends MediaState {
  fetchMedia: (params: GetMediaParams) => Promise<void>;
  getMediaById: (id: number) => Promise<void>;
  createMedia: (data: Partial<Media>) => Promise<void>;
  updateMedia: (id: number, data: Partial<Media>) => Promise<void>;
  deleteMedia: (id: number) => Promise<void>;
  addNote: (mediaId: number, content: string) => Promise<void>;
  updateNote: (mediaId: number, noteId: number, content: string) => Promise<void>;
  deleteNote: (mediaId: number, noteId: number) => Promise<void>;
  setSelectedItem: (item: Media | null) => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(mediaReducer, initialState);

  const fetchMedia = useCallback(async (params: GetMediaParams) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await mediaApi.getAll(params);
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    }
  }, []);

  const getMediaById = useCallback(async (id: number) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await mediaApi.getById(id);
      dispatch({ type: 'SET_SELECTED_ITEM', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    }
  }, []);

  const createMedia = useCallback(async (data: Partial<Media>) => {
    try {
      const response = await mediaApi.create(data);
      dispatch({ type: 'ADD_ITEM', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    }
  }, []);

  const updateMedia = useCallback(async (id: number, data: Partial<Media>) => {
    try {
      const response = await mediaApi.update(id, data);
      dispatch({ type: 'UPDATE_ITEM', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    }
  }, []);

  const deleteMedia = useCallback(async (id: number) => {
    try {
      await mediaApi.delete(id);
      dispatch({ type: 'DELETE_ITEM', payload: id });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    }
  }, []);

  const addNote = useCallback(async (mediaId: number, content: string) => {
    try {
      const response = await mediaApi.addNote(mediaId, content);
      dispatch({ type: 'ADD_NOTE', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    }
  }, []);

  const updateNote = useCallback(async (mediaId: number, noteId: number, content: string) => {
    try {
      const response = await mediaApi.updateNote(mediaId, noteId, content);
      dispatch({ type: 'UPDATE_NOTE', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    }
  }, []);

  const deleteNote = useCallback(async (mediaId: number, noteId: number) => {
    try {
      const response = await mediaApi.deleteNote(mediaId, noteId);
      dispatch({ type: 'DELETE_NOTE', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    }
  }, []);

  const setSelectedItem = useCallback((item: Media | null) => {
    dispatch({ type: 'SET_SELECTED_ITEM', payload: item });
  }, []);

  return (
    <MediaContext.Provider
      value={{
        ...state,
        fetchMedia,
        getMediaById,
        createMedia,
        updateMedia,
        deleteMedia,
        addNote,
        updateNote,
        deleteNote,
        setSelectedItem,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
} 