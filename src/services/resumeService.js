import { API_URL, getHeaders } from './api';

export const resumeService = {
    // Save a new resume
    saveResume: async (resumeData, title = 'Untitled Resume') => {
        try {
            const response = await fetch(`${API_URL}/resumes`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    title,
                    data: resumeData
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(errorData.message || 'Failed to save resume');
                error.status = response.status;
                throw error;
            }

            return await response.json();
        } catch (error) {
            console.error("Error saving resume:", error);
            throw error;
        }
    },

    // Update an existing resume
    updateResume: async (resumeId, resumeData, title) => {
        try {
            const body = { data: resumeData };
            if (title) body.title = title;

            const response = await fetch(`${API_URL}/resumes/${resumeId}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(errorData.message || 'Failed to update resume');
                error.status = response.status;
                throw error;
            }

            return await response.json();
        } catch (error) {
            console.error("Error updating resume:", error);
            throw error;
        }
    },

    // Get all resumes for the logged-in user
    getUserResumes: async () => {
        try {
            const response = await fetch(`${API_URL}/resumes`, {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch resumes');
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching user resumes:", error);
            throw error;
        }
    },

    // Get a single resume by ID
    getResumeById: async (resumeId) => {
        try {
            const response = await fetch(`${API_URL}/resumes/${resumeId}`, {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error('Resume not found');
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching resume:", error);
            throw error;
        }
    },

    // Delete a resume (Soft Delete)
    deleteResume: async (resumeId) => {
        try {
            const response = await fetch(`${API_URL}/resumes/${resumeId}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to delete resume');
            }

            return true;
        } catch (error) {
            console.error("Error deleting resume:", error);
            throw error;
        }
    },

    // Get trashed resumes
    getTrashResumes: async () => {
        try {
            const response = await fetch(`${API_URL}/resumes/trash/history`, {
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch trash history');
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching trash history:", error);
            throw error;
        }
    },

    // Restore a resume
    restoreResume: async (resumeId) => {
        try {
            const response = await fetch(`${API_URL}/resumes/${resumeId}/restore`, {
                method: 'POST',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to restore resume');
            }

            return await response.json();
        } catch (error) {
            console.error("Error restoring resume:", error);
            throw error;
        }
    },

    // Permanent delete
    permanentDeleteResume: async (resumeId) => {
        try {
            const response = await fetch(`${API_URL}/resumes/${resumeId}/permanent`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to permanently delete resume');
            }

            return true;
        } catch (error) {
            console.error("Error permanently deleting resume:", error);
            throw error;
        }
    }
};
