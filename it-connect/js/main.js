// 2.6.4 JavaScript Implementation - Main Application Logic

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Check login status and update navigation
    utils.updateNavigation();

    // Mostrar/ocultar botón de logout según sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        if (utils.isLoggedIn()) {
            logoutBtn.style.display = 'inline-block';
        } else {
            logoutBtn.style.display = 'none';
        }
        logoutBtn.addEventListener('click', () => utils.logout());
    }

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

    // 2.5.9 Tab switching for login/register
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            switchTab(tabName);
        });
    });

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // 2.5.9 Register form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Profile page handling
    const profilePage = document.getElementById('userName');
    if (profilePage) {
        loadProfileData();
        initializeGithubSection();

        // Habilidades
        const addSkillForm = document.getElementById('addSkillForm');
        const skillsList = document.getElementById('skillsList');
        let skills = [];
        if (addSkillForm) {
            addSkillForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const skill = document.getElementById('newSkill').value.trim();
                if (skill) {
                    skills.push(skill);
                    renderSkills();
                    addSkillForm.reset();
                }
            });
        }
        function renderSkills() {
            skillsList.innerHTML = skills.map(s => `<span class="skill-tag">${s}</span>`).join(' ');
        }

        // Experiencia
        const addExpForm = document.getElementById('addExpForm');
        const experienceList = document.getElementById('experienceList');
        let experiences = [];
        if (addExpForm) {
            addExpForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const position = document.getElementById('newExpPosition').value.trim();
                const company = document.getElementById('newExpCompany').value.trim();
                const period = document.getElementById('newExpPeriod').value.trim();
                if (position && company && period) {
                    experiences.push({ position, company, period });
                    renderExperiences();
                    addExpForm.reset();
                }
            });
        }
        function renderExperiences() {
            experienceList.innerHTML = experiences.map(exp => `
                <div class="exp-item">
                    <strong>${exp.position}</strong> en ${exp.company} <span class="exp-period">(${exp.period})</span>
                </div>
            `).join('');
        }

        // Buscar contactos (solo frontend demo)
        const searchContactsInput = document.getElementById('searchContacts');
        const contactsList = document.getElementById('contactsList');
        let demoContacts = [
            { name: 'Ana Torres', skills: ['JavaScript', 'React'], title: 'Frontend Dev' },
            { name: 'Luis Gómez', skills: ['PHP', 'MySQL'], title: 'Backend Dev' },
            { name: 'Sofía Ruiz', skills: ['Python', 'Django'], title: 'Fullstack Dev' }
        ];
        function renderContactsList(contacts) {
            contactsList.innerHTML = contacts.map(c => `
                <div class="contact-card">
                    <h4>${c.name}</h4>
                    <p>${c.title}</p>
                    <div class="skills-tags">${c.skills.map(s => `<span class="skill-tag">${s}</span>`).join(' ')}</div>
                </div>
            `).join('');
        }
        if (searchContactsInput && contactsList) {
            renderContactsList(demoContacts);
            searchContactsInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = demoContacts.filter(c =>
                    c.name.toLowerCase().includes(query) ||
                    c.skills.some(s => s.toLowerCase().includes(query))
                );
                renderContactsList(filtered);
            });
        }
    }

    // Contacts page handling
    const contactsList = document.getElementById('contactsList');
    if (contactsList) {
        initializeContactsPage();
    }
});

// 2.5.9 Tab switching function
const switchTab = (tabName) => {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Activate selected button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Clear any previous error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
};

// 2.6.4 & 2.5.9 Login form handler - AJAX integration with backend
const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Client-side validation
    const validation = utils.validateLoginForm(email, password);
    if (!validation.isValid) {
        // Show errors
        Object.keys(validation.errors).forEach(key => {
            const input = document.getElementById(key);
            input.classList.add('error');
            const errorMsg = utils.createElement('span', 'error-message', validation.errors[key]);
            input.parentNode.appendChild(errorMsg);
        });
        return;
    }

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    try {
        // Call backend API for login
        const response = await fetch('backend/api/index.php?action=login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            // Login successful - save session
            utils.setLoggedIn(data.id);
            // Redirect to profile
            window.location.href = 'profile.html';
        } else {
            // Show error message
            const errorMsg = utils.createElement('div', 'error-message', data.message || 'Error al iniciar sesión');
            errorMsg.style.marginTop = '1rem';
            errorMsg.style.color = '#e74c3c';
            errorMsg.style.padding = '0.5rem';
            errorMsg.style.backgroundColor = '#fff5f5';
            errorMsg.style.borderRadius = '4px';
            document.querySelector('.login-form').appendChild(errorMsg);
        }
    } catch (error) {
        console.error('Error en login:', error);
        const errorMsg = utils.createElement('div', 'error-message', 'Error de conexión. Intenta más tarde.');
        errorMsg.style.marginTop = '1rem';
        errorMsg.style.color = '#e74c3c';
        errorMsg.style.padding = '0.5rem';
        errorMsg.style.backgroundColor = '#fff5f5';
        errorMsg.style.borderRadius = '4px';
        document.querySelector('.login-form').appendChild(errorMsg);
    }
};

// 2.5.9 Register form handler - AJAX integration with backend
const handleRegister = async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('reg-nombre').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const especialidad = document.getElementById('reg-especialidad').value;

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    // Basic validation
    if (!nombre || !email || !password || !especialidad) {
        const errorMsg = utils.createElement('div', 'error-message', 'Por favor completa todos los campos');
        errorMsg.style.marginTop = '1rem';
        errorMsg.style.color = '#e74c3c';
        errorMsg.style.padding = '0.5rem';
        errorMsg.style.backgroundColor = '#fff5f5';
        errorMsg.style.borderRadius = '4px';
        document.querySelector('#registerForm').appendChild(errorMsg);
        return;
    }

    try {
        // Call backend API for registration
        const response = await fetch('backend/api/index.php?action=register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                email: email,
                password: password,
                especialidad: especialidad
            })
        });

        const data = await response.json();

        if (data.success) {
            // Registration successful - show success message and switch to login tab
            const successMsg = utils.createElement('div', 'success-message', '✅ Cuenta creada con éxito. Ahora puedes iniciar sesión.');
            successMsg.style.marginTop = '1rem';
            successMsg.style.color = '#27ae60';
            successMsg.style.padding = '0.5rem';
            successMsg.style.backgroundColor = '#f0fdf4';
            successMsg.style.borderRadius = '4px';
            document.querySelector('#registerForm').appendChild(successMsg);

            // Reset form
            document.getElementById('registerForm').reset();

            // Switch to login tab after 2 seconds
            setTimeout(() => {
                switchTab('login');
            }, 2000);
        } else {
            // Show error message
            const errorMsg = utils.createElement('div', 'error-message', data.message || 'Error al crear la cuenta');
            errorMsg.style.marginTop = '1rem';
            errorMsg.style.color = '#e74c3c';
            errorMsg.style.padding = '0.5rem';
            errorMsg.style.backgroundColor = '#fff5f5';
            errorMsg.style.borderRadius = '4px';
            document.querySelector('#registerForm').appendChild(errorMsg);
        }
    } catch (error) {
        console.error('Error en registro:', error);
        const errorMsg = utils.createElement('div', 'error-message', 'Error de conexión. Intenta más tarde.');
        errorMsg.style.marginTop = '1rem';
        errorMsg.style.color = '#e74c3c';
        errorMsg.style.padding = '0.5rem';
        errorMsg.style.backgroundColor = '#fff5f5';
        errorMsg.style.borderRadius = '4px';
        document.querySelector('#registerForm').appendChild(errorMsg);
    }
};

// 2.6.4 Profile page handler
const loadProfileData = async () => {
    try {
        const response = await fetch('backend/api/index.php?action=get-user', {
            method: 'GET',
            credentials: 'same-origin'
        });
        const data = await response.json();
        if (!data.success || !data.user) {
            window.location.href = 'login.html';
            return;
        }
        const userData = data.user;
        document.getElementById('userName').textContent = userData.nombre;
        document.getElementById('userTitle').textContent = userData.especialidad;
        document.getElementById('profileIcon').className = `user-icon`;
        // Puedes personalizar el icono según especialidad si lo deseas
        // Limpiar skills y experiencia
        document.getElementById('skillsList').innerHTML = '';
        document.getElementById('experienceList').innerHTML = '';
        // Si tienes skills/experiencia en la base de datos, aquí puedes agregarlas
        // Por ahora solo muestra nombre y especialidad
    } catch (error) {
        window.location.href = 'login.html';
    }
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