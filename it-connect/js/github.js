// 2.6.3 JavaScript - Módulo de integración con GitHub API
// Mashup: Integración con API externa de GitHub para mostrar datos de desarrolladores

const githubModule = {
    // URL base de la API de GitHub
    API_BASE: 'https://api.github.com',
    
    /**
     * Obtiene información del usuario de GitHub
     * @param {string} username - Nombre de usuario en GitHub
     * @returns {Promise} Datos del usuario
     */
    getUserInfo: async (username) => {
        try {
            const response = await fetch(`${githubModule.API_BASE}/users/${username}`);
            if (!response.ok) throw new Error('Usuario no encontrado');
            return await response.json();
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return null;
        }
    },

    /**
     * Obtiene los repositorios públicos de un usuario
     * @param {string} username - Nombre de usuario en GitHub
     * @param {number} limit - Número de repos a obtener
     * @returns {Promise} Array de repositorios
     */
    getUserRepos: async (username, limit = 5) => {
        try {
            const response = await fetch(
                `${githubModule.API_BASE}/users/${username}/repos?sort=stars&order=desc&per_page=${limit}`
            );
            if (!response.ok) throw new Error('No se encontraron repositorios');
            return await response.json();
        } catch (error) {
            console.error('Error al obtener repositorios:', error);
            return [];
        }
    },

    /**
     * Obtiene los lenguajes de programación utilizados por el usuario
     * @param {string} username - Nombre de usuario en GitHub
     * @returns {Promise} Objeto con lenguajes y sus frecuencias
     */
    getUserLanguages: async (username) => {
        try {
            const repos = await githubModule.getUserRepos(username, 20);
            const languages = {};

            // Contar lenguajes de todos los repositorios
            repos.forEach(repo => {
                if (repo.language) {
                    languages[repo.language] = (languages[repo.language] || 0) + 1;
                }
            });

            // Ordenar por frecuencia
            return Object.entries(languages)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);
        } catch (error) {
            console.error('Error al obtener lenguajes:', error);
            return [];
        }
    },

    /**
     * Obtiene estadísticas del usuario
     * @param {string} username - Nombre de usuario en GitHub
     * @returns {Promise} Estadísticas compiladas
     */
    getUserStats: async (username) => {
        try {
            const userInfo = await githubModule.getUserInfo(username);
            if (!userInfo) return null;

            return {
                repos: userInfo.public_repos,
                followers: userInfo.followers,
                following: userInfo.following,
                gists: userInfo.public_gists,
                location: userInfo.location,
                bio: userInfo.bio,
                profileUrl: userInfo.html_url,
                avatarUrl: userInfo.avatar_url
            };
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return null;
        }
    },

    /**
     * Obtiene información completa del usuario (perfil + repos + lenguajes)
     * @param {string} username - Nombre de usuario en GitHub
     * @returns {Promise} Información consolidada
     */
    getCompleteUserInfo: async (username) => {
        try {
            const stats = await githubModule.getUserStats(username);
            const repos = await githubModule.getUserRepos(username, 3);
            const languages = await githubModule.getUserLanguages(username);

            if (!stats) return null;

            return {
                ...stats,
                topRepos: repos,
                topLanguages: languages
            };
        } catch (error) {
            console.error('Error al obtener información completa:', error);
            return null;
        }
    }
};

// Exportar el módulo
window.githubModule = githubModule;
