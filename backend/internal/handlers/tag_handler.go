package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"cute-todo/backend/internal/core/services"

	"github.com/gorilla/mux"
)

type TagHandler struct {
	service *services.TagService
}

func NewTagHandler(service *services.TagService) *TagHandler {
	return &TagHandler{service: service}
}

func (h *TagHandler) RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/api/tags", h.GetAllTags).Methods("GET")
	r.HandleFunc("/api/tags", h.CreateTag).Methods("POST")
	r.HandleFunc("/api/tags/{id}", h.UpdateTag).Methods("PUT")
	r.HandleFunc("/api/tags/{id}", h.DeleteTag).Methods("DELETE")
	r.HandleFunc("/api/media/{mediaId}/tags", h.GetMediaTags).Methods("GET")
	r.HandleFunc("/api/media/{mediaId}/tags/{tagId}", h.AddMediaTag).Methods("POST")
	r.HandleFunc("/api/media/{mediaId}/tags/{tagId}", h.RemoveMediaTag).Methods("DELETE")
}

type createTagRequest struct {
	Name string `json:"name"`
}

type updateTagRequest struct {
	Name string `json:"name"`
}

func (h *TagHandler) GetAllTags(w http.ResponseWriter, r *http.Request) {
	tags, err := h.service.GetAllTags()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tags)
}

func (h *TagHandler) CreateTag(w http.ResponseWriter, r *http.Request) {
	var req createTagRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	tag, err := h.service.CreateTag(req.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(tag)
}

func (h *TagHandler) UpdateTag(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "invalid tag id", http.StatusBadRequest)
		return
	}

	var req updateTagRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	tag, err := h.service.UpdateTag(id, req.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tag)
}

func (h *TagHandler) DeleteTag(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "invalid tag id", http.StatusBadRequest)
		return
	}

	if err := h.service.DeleteTag(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *TagHandler) GetMediaTags(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	mediaID, err := strconv.Atoi(vars["mediaId"])
	if err != nil {
		http.Error(w, "invalid media id", http.StatusBadRequest)
		return
	}

	tags, err := h.service.GetMediaTags(mediaID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tags)
}

func (h *TagHandler) AddMediaTag(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	mediaID, err := strconv.Atoi(vars["mediaId"])
	if err != nil {
		http.Error(w, "invalid media id", http.StatusBadRequest)
		return
	}

	tagID, err := strconv.Atoi(vars["tagId"])
	if err != nil {
		http.Error(w, "invalid tag id", http.StatusBadRequest)
		return
	}

	if err := h.service.AddMediaTag(mediaID, tagID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *TagHandler) RemoveMediaTag(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	mediaID, err := strconv.Atoi(vars["mediaId"])
	if err != nil {
		http.Error(w, "invalid media id", http.StatusBadRequest)
		return
	}

	tagID, err := strconv.Atoi(vars["tagId"])
	if err != nil {
		http.Error(w, "invalid tag id", http.StatusBadRequest)
		return
	}

	if err := h.service.RemoveMediaTag(mediaID, tagID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
