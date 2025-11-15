# 🚀 Next Steps Guide - IT Connect Development

**Date:** November 15, 2025  
**Phase:** 2 - Backend Integration (In Progress)  
**Priority:** Complete before proceeding to Phase 3

---

## 📌 Immediate Actions (Next 30 minutes)

### Task 1: Test Complete Login Flow
1. Open http://localhost/it-connect/login.html
2. Click "Registrarse" tab
3. Fill in form:
   - Nombre: "Your Name"
   - Email: "youremail@example.com"
   - Password: "yourpassword123"
   - Especialidad: Select one
4. Click "Crear Cuenta" button
5. Should see green success message
6. Should auto-switch to "Iniciar Sesión" tab
7. Login with your new credentials
8. Should be redirected to http://localhost/it-connect/profile.html

**Expected Outcome:** ✅ Successful redirect with user data loaded

---

### Task 2: Load User Data from API
**File:** `/it-connect/js/main.js` (function: `loadProfileData()`)

**Current Code:**
```javascript
const loadProfileData = () => {
    // Simulate loading user data
    const userData = dataModule.getUserById(1);
    
    document.getElementById('userName').textContent = userData.name;
    // ... etc
};
```

**New Code (Replace with):**
```javascript
const loadProfileData = async () => {
    try {
        // Fetch current user data from backend
        const response = await fetch('backend/api/index.php?action=get-user');
        const data = await response.json();

        if (!data.success || !data.user) {
            // Not authenticated, redirect to login
            window.location.href = 'login.html';
            return;
        }

        const userData = data.user;
        
        // Update DOM with real user data
        document.getElementById('userName').textContent = userData.nombre;
        document.getElementById('userTitle').textContent = userData.especialidad;
        document.getElementById('profileIcon').className = `user-icon icon-${userData.especialidad}`;

        // Load mock skills for now (will be replaced with DB data later)
        const skillsList = document.getElementById('skillsList');
        const mockSkills = ['JavaScript', 'HTML5', 'CSS3', 'Git'];
        mockSkills.forEach(skill => {
            const skillElement = utils.createElement('span', 'skill-tag', skill);
            skillsList.appendChild(skillElement);
        });

        // Load mock experience
        const experienceList = document.getElementById('experienceList');
        const mockExp = [
            { position: 'Desarrollador Junior', company: 'Tech Corp', period: '2024 - Presente' }
        ];
        mockExp.forEach(exp => {
            const expElement = utils.createElement('div', 'experience-item');
            expElement.innerHTML = `
                <h5>${exp.position}</h5>
                <p>${exp.company}</p>
                <span>${exp.period}</span>
            `;
            experienceList.appendChild(expElement);
        });
    } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to login
        window.location.href = 'login.html';
    }
};
```

**Verification:** After update, login and verify:
- ✅ Your name appears in profile header
- ✅ Your specialty appears as title
- ✅ Skills and experience load correctly
- ✅ No errors in browser console

---

### Task 3: Implement Contact Search AJAX
**File:** `/it-connect/js/main.js` (function: `filterAndRenderContacts()`)

**Update the function to call backend:**
```javascript
const filterAndRenderContacts = async (query, specialty) => {
    try {
        // Build query string
        let searchUrl = 'backend/api/index.php?action=search-contacts';
        if (query) searchUrl += '&query=' + encodeURIComponent(query);
        if (specialty) searchUrl += '&specialty=' + encodeURIComponent(specialty);

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.success && data.contacts) {
            renderContacts(data.contacts);
        } else {
            // Fallback to mock data if API not ready
            let filteredUsers = dataModule.getAllUsers();
            
            if (query) {
                filteredUsers = dataModule.searchUsers(query);
            }
            if (specialty) {
                filteredUsers = filteredUsers.filter(user => user.specialty === specialty);
            }
            
            renderContacts(filteredUsers);
        }
    } catch (error) {
        console.error('Error searching contacts:', error);
        // Fallback to mock data
        let filteredUsers = dataModule.getAllUsers();
        if (query) filteredUsers = dataModule.searchUsers(query);
        if (specialty) filteredUsers = filteredUsers.filter(u => u.specialty === specialty);
        renderContacts(filteredUsers);
    }
};
```

---

## 📋 Checklist for Phase 2 Completion

### Backend Ready ✅
- [x] Database created with 7 tables
- [x] User registration endpoint
- [x] User login endpoint
- [x] Session management
- [x] Password hashing with bcrypt
- [x] API returns clean JSON
- [x] Test suite all passing

### Frontend Ready ✅
- [x] Registration form with tabs
- [x] Login form
- [x] Error/success messages
- [x] Protected page redirects
- [x] Session storage (localStorage)
- [x] Logout button

### Frontend Integration (In Progress)
- [ ] Load user data from API in profile.html
- [ ] Search contacts from API in contacts.html
- [ ] Add contact functionality
- [ ] Remove contact functionality
- [ ] Display GitHub data if available

---

## 🔄 Implementation Order (Priority)

### Week 1 - Session Setup (Done)
- ✅ LAMP environment
- ✅ Database design & creation
- ✅ User registration endpoint
- ✅ User login endpoint
- ✅ Frontend forms with AJAX

### Week 2 - User Data & Contacts (Current)
1. **Load user data in profile** (from API instead of mock)
2. **Implement contact search** (query backend)
3. **Add contact management** (add/remove)
4. **GitHub profile integration** (enhanced mashup)

### Week 3 - Analytics & Polish
1. **Visitor counter** implementation
2. **Session validation** improvements
3. **Error handling** refinement
4. **Mobile optimization**

### Week 4 - Testing & Documentation
1. **Full test suite** (all features)
2. **User documentation**
3. **API documentation**
4. **Deployment guide**

---

## 🐛 Known Issues & Workarounds

### Issue 1: Profile Shows Mock Data Instead of DB Data
**Solution:** Complete Task 2 above to load from API

### Issue 2: Contacts Search Not Connected to Backend
**Solution:** Complete Task 3 above to implement AJAX search

### Issue 3: GitHub Data Not Saved/Retrieved
**Current:** Demo page works via GitHub API directly  
**Future:** Save GitHub data in `github_data` table, retrieve from API

---

## 💻 Testing Commands

### Test User Registration
```bash
curl -X POST "http://localhost/it-connect/backend/api/index.php?action=register" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "especialidad": "backend"
  }'
```

### Test User Login
```bash
curl -X POST "http://localhost/it-connect/backend/api/index.php?action=login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Get User (requires session)
```bash
curl "http://localhost/it-connect/backend/api/index.php?action=get-user"
```

---

## 📚 Documentation References

| Document | Purpose |
|----------|---------|
| COMPLETION-REPORT.md | Summary of Phase 1 work |
| PROGRESS-UPDATE.md | Latest status & timeline |
| BACKEND-SETUP.md | Backend architecture |
| PLAN-PHP-MYSQL.md | Original planning |

---

## 🎯 Success Criteria for Phase 2

✅ **Must Have:**
1. User can register with validation
2. User can login with credentials
3. Session persists across page navigation
4. User data loads in profile page
5. Users can search for other users
6. All API endpoints return clean JSON
7. No JavaScript errors in console
8. No SQL errors in PHPMyAdmin logs

🟡 **Should Have:**
1. Contact add/remove functionality
2. GitHub data cached in database
3. Visitor counter tracking
4. Form input sanitization

🔵 **Nice to Have:**
1. Email verification
2. Password reset functionality
3. User profile picture upload
4. Advanced search filters

---

## 📞 Support & Debugging

### Enable Debug Mode
Add to `backend/config/Database.php`:
```php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

### Check Browser Console
Press F12 → Console tab → Look for errors

### Check Server Logs
```bash
tail -f /Applications/XAMPP/logs/apache2_error_log
tail -f /Applications/XAMPP/logs/mysql_error.log
```

### PHPMyAdmin Access
http://localhost/phpmyadmin
- Username: root
- Password: (empty)
- Database: it_connect_db

---

## 📌 Quick Reference

### File Locations
```
Project Root: /Users/dataicomacbook8/Documents/guia-2-desarrollo web/it-connect/
XAMPP Copy:   /Applications/XAMPP/xamppfiles/htdocs/it-connect/
Database:     it_connect_db
```

### Key Files to Edit Next
1. `js/main.js` - AJAX calls for API integration
2. `profile.html` - Display user data
3. `contacts.html` - Search functionality
4. `backend/models/ContactModel.php` - Contact queries
5. `backend/controllers/ContactsController.php` - Contact endpoints

### API Status
- ✅ Register endpoint working
- ✅ Login endpoint working
- ✅ Get user endpoint ready
- ⏳ Contact endpoints (schema ready, needs frontend)
- ⏳ Visitor tracking (schema ready, implementation pending)

---

## ✅ Final Checklist

Before moving to Phase 3:
- [ ] Complete Tasks 1-3 above
- [ ] Test complete user registration flow
- [ ] Test complete user login flow
- [ ] Verify user data loads in profile
- [ ] Test contact search from API
- [ ] No console errors
- [ ] No database errors
- [ ] All required endpoints working

---

**Next Review Date:** November 20, 2025  
**Estimated Completion:** November 30, 2025  
**Final Deployment:** December 5, 2025

Good luck! 🚀
