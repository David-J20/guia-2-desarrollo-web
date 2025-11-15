// 2.6.4 JavaScript Implementation - Main Application Logic

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Check login status and update navigation
    utils.updateNavigation();

    // Redirect if trying to access protected pages while not logged in
    const currentPage = window.location.pathname;
    if ((currentPage.includes('profile.html') || currentPage.includes('contacts.html')) && !utils.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Redirect if trying to access login while logged in
    if (currentPage.includes('login.html') && utils.isLoggedIn()) {
        window.location.href = 'profile.html';
        return;
    }

    // Logout button handling
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => utils.logout());
    }

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Profile page handling
    const profilePage = document.getElementById('userName');
    if (profilePage) {
        loadProfileData();
        initializeGithubSection();
    }

    // Contacts page handling
    const contactsList = document.getElementById('contactsList');
    if (contactsList) {
        initializeContactsPage();
    }
});

// 2.6.4 Login form handler
const handleLogin = (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const validation = utils.validateLoginForm(email, password);
    if (validation.isValid) {
        // Simulate login - in a real app, this would verify credentials with a server
        utils.setLoggedIn('1'); // Using '1' as a dummy user ID
        window.location.href = 'profile.html';
    } else {
        // Show errors
        Object.keys(validation.errors).forEach(key => {
            const input = document.getElementById(key);
            input.classList.add('error');
            const errorMsg = utils.createElement('span', 'error-message', validation.errors[key]);
            input.parentNode.appendChild(errorMsg);
        });
    }
};

// 2.6.4 Profile page handler
const loadProfileData = () => {
    // Simulate loading user data
    const userData = dataModule.getUserById(1);
    
    document.getElementById('userName').textContent = userData.name;
    document.getElementById('userTitle').textContent = userData.title;
    document.getElementById('profileIcon').className = `user-icon ${userData.icon}`;

    // Load skills
    const skillsList = document.getElementById('skillsList');
    userData.skills.forEach(skill => {
        const skillElement = utils.createElement('span', 'skill-tag', skill);
        skillsList.appendChild(skillElement);
    });

    // Load experience
    const experienceList = document.getElementById('experienceList');
    userData.experience.forEach(exp => {
        const expElement = utils.createElement('div', 'experience-item');
        expElement.innerHTML = `
            <h5>${exp.position}</h5>
            <p>${exp.company}</p>
            <span>${exp.period}</span>
        `;
        experienceList.appendChild(expElement);
    });
};

// 2.6.4 Contacts page handler
const initializeContactsPage = () => {
    const searchInput = document.getElementById('searchContacts');
    const specialtyFilter = document.getElementById('filterSpecialty');
    const contactsList = document.getElementById('contactsList');

    // Initialize with all contacts
    renderContacts(dataModule.getAllUsers());

    // Add search functionality with debounce
    searchInput.addEventListener('input', utils.debounce((e) => {
        const query = e.target.value;
        const specialty = specialtyFilter.value;
        filterAndRenderContacts(query, specialty);
    }, 300));

    // Add filter functionality
    specialtyFilter.addEventListener('change', (e) => {
        const specialty = e.target.value;
        const query = searchInput.value;
        filterAndRenderContacts(query, specialty);
    });
};

// 2.6.4 Filter and render contacts
const filterAndRenderContacts = (query, specialty) => {
    let filteredUsers = dataModule.getAllUsers();

    // Apply search filter
    if (query) {
        filteredUsers = dataModule.searchUsers(query);
    }

    // Apply specialty filter
    if (specialty) {
        filteredUsers = filteredUsers.filter(user => user.specialty === specialty);
    }

    renderContacts(filteredUsers);
};

// 2.6.4 Render contacts
const renderContacts = (users) => {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '';

    users.forEach(user => {
        const contactCard = utils.createElement('article', 'contact-card');
        contactCard.innerHTML = `
            <i class="user-icon ${user.icon}"></i>
            <h3>${user.name}</h3>
            <p>${user.title}</p>
            <div class="skills-tags">
                ${user.skills.slice(0, 3).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        `;
        contactsList.appendChild(contactCard);
    });
};

// 2.6.4 Mashup: Inicializar sección de GitHub
const initializeGithubSection = () => {
    const loadGithubBtn = document.getElementById('loadGithubBtn');
    const githubInput = document.getElementById('githubUsername');

    if (loadGithubBtn && githubInput) {
        loadGithubBtn.addEventListener('click', () => {
            const username = githubInput.value.trim();
            if (username) {
                loadGithubProfile(username);
            } else {
                showGithubError('Por favor ingresa un nombre de usuario de GitHub');
            }
        });

        // Permitir cargar con Enter
        githubInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loadGithubBtn.click();
            }
        });
    }
};

// 2.6.4 Mashup: Cargar datos de GitHub
const loadGithubProfile = async (username) => {
    const githubContent = document.getElementById('githubContent');
    githubContent.innerHTML = '<p>Cargando datos de GitHub...</p>';

    try {
        const userInfo = await githubModule.getCompleteUserInfo(username);

        if (!userInfo) {
            showGithubError(`Usuario "${username}" no encontrado en GitHub`);
            return;
        }

        // Construir HTML con datos de GitHub
        let html = '<div class="github-stats">';
        html += `<div class="github-stat">
            <div class="stat-number">${userInfo.repos}</div>
            <div class="stat-label">Repositorios</div>
        </div>`;
        html += `<div class="github-stat">
            <div class="stat-number">${userInfo.followers}</div>
            <div class="stat-label">Seguidores</div>
        </div>`;
        html += `<div class="github-stat">
            <div class="stat-number">${userInfo.gists}</div>
            <div class="stat-label">Gists</div>
        </div>`;
        html += '</div>';

        // Mostrar ubicación si está disponible
        if (userInfo.location) {
            html += `<p><strong>Ubicación:</strong> ${userInfo.location}</p>`;
        }

        // Mostrar bio si está disponible
        if (userInfo.bio) {
            html += `<p><strong>Bio:</strong> ${userInfo.bio}</p>`;
        }

        // Mostrar repositorios destacados
        if (userInfo.topRepos && userInfo.topRepos.length > 0) {
            html += '<div class="github-repos"><h5>⭐ Repositorios Destacados</h5>';
            userInfo.topRepos.forEach(repo => {
                html += `
                    <div class="repo-item">
                        <h6><a href="${repo.html_url}" target="_blank">${repo.name}</a></h6>
                        <p>${repo.description || 'Sin descripción'}</p>
                        <div class="repo-stats">
                            ⭐ ${repo.stargazers_count} stars | 
                            🍴 ${repo.forks_count} forks | 
                            ${repo.language || 'Sin lenguaje específico'}
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }

        // Mostrar lenguajes principales
        if (userInfo.topLanguages && userInfo.topLanguages.length > 0) {
            html += '<div class="github-languages"><h5>💻 Lenguajes Principales</h5><div class="language-tags">';
            userInfo.topLanguages.forEach(([lang, count]) => {
                html += `<span class="language-tag">${lang}</span>`;
            });
            html += '</div></div>';
        }

        // Agregar enlace al perfil
        html += `<p><a href="${userInfo.profileUrl}" target="_blank" class="btn-primary" style="display: inline-block; margin-top: 1rem;">Ver Perfil en GitHub →</a></p>`;

        githubContent.innerHTML = html;
    } catch (error) {
        console.error('Error al cargar perfil de GitHub:', error);
        showGithubError('Error al cargar los datos de GitHub. Intenta más tarde.');
    }
};

// 2.6.4 Mostrar error de GitHub
const showGithubError = (message) => {
    const githubContent = document.getElementById('githubContent');
    githubContent.innerHTML = `<div class="github-error">${message}</div>`;
};