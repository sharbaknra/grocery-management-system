const API_BASE_URL = '/api';

class Api {
    static getToken() {
        return localStorage.getItem('token');
    }

    static setToken(token) {
        localStorage.setItem('token', token);
    }

    static removeToken() {
        localStorage.removeItem('token');
    }

    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    static async request(endpoint, method = 'GET', body = null, isFileUpload = false) {
        const headers = {};
        const token = this.getToken();

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers,
        };

        if (body) {
            if (isFileUpload) {
                // For FormData, do not set Content-Type header, browser does it automatically
                config.body = body;
            } else {
                headers['Content-Type'] = 'application/json';
                config.body = JSON.stringify(body);
            }
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

            if (response.status === 401) {
                // Unauthorized, clear token and redirect to login
                this.removeToken();
                window.location.href = '/index.html';
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    static get(endpoint) {
        return this.request(endpoint, 'GET');
    }

    static post(endpoint, body) {
        return this.request(endpoint, 'POST', body);
    }

    static postFile(endpoint, formData) {
        return this.request(endpoint, 'POST', formData, true);
    }

    static put(endpoint, body) {
        return this.request(endpoint, 'PUT', body);
    }

    static putFile(endpoint, formData) {
        return this.request(endpoint, 'PUT', formData, true);
    }

    static delete(endpoint) {
        return this.request(endpoint, 'DELETE');
    }
}

// Auth Helper
const Auth = {
    login: async (email, password) => {
        const response = await Api.post('/users/login', { email, password });
        if (response.token) {
            Api.setToken(response.token);
            // Decode token or fetch user details if needed.
            // For now, let's assume the response might have user info or we just store token.
            // If the API returns user object, store it.
            if (response.user) {
                Api.setUser(response.user);
            }
            return true;
        }
        return false;
    },
    logout: () => {
        Api.removeToken();
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    },
    isAuthenticated: () => {
        return !!Api.getToken();
    },
    requireAuth: () => {
        if (!Auth.isAuthenticated()) {
            window.location.href = '/index.html';
        }
    }
};
