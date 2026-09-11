// ================= STATE REPOSITORY =================
let currentUser = null;
let currentPassword = "password123"; // Baseline password for session
let allActivities = [];

// ================= GOOGLE IDENTITY SERVICES CONFIGURATION =================
const GOOGLE_CLIENT_ID = "859755446396-6b8ao8jobi1gcq4ip2g5fsi2h6ah3e8r.apps.googleusercontent.com";

window.addEventListener('load', () => {
  if (window.google && window.google.accounts) {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredentialResponse,
      auto_select: false
    });

    google.accounts.id.renderButton(
      document.getElementById("google-btn-container"),
      {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        width: 380,
        text: "signin_with"
      }
    );
  }
});

function decodeJwtResponse(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT parse error:", e);
    return null;
  }
}

function handleGoogleCredentialResponse(response) {
  const payload = decodeJwtResponse(response.credential);
  if (payload) {
    const googleName = payload.name || payload.given_name || "Google Citizen";
    const googleEmail = payload.email || "citizen@gmail.com";
    loginUser(googleEmail, googleName, "United States");
  }
}

// ================= GLOBAL RESCUE DIRECTORY (150+ COUNTRIES) =================
const rescueDirectory = [
  // Asia & Pacific
  { country: "Afghanistan", disaster: "112 (ANDMA)", police: "119", ambulance: "102 / 112", emergency: "112" },
  { country: "Armenia", disaster: "911 (MES)", police: "102", ambulance: "103", emergency: "911 / 112" },
  { country: "Australia", disaster: "132 500 (SES Storm/Flood)", police: "000", ambulance: "000", emergency: "000 / 112" },
  { country: "Azerbaijan", disaster: "112 (FHN Civil Defense)", police: "102", ambulance: "103", emergency: "112" },
  { country: "Bahrain", disaster: "999 (Civil Defense)", police: "999", ambulance: "999", emergency: "999 / 112" },
  { country: "Bangladesh", disaster: "1090 (Disaster Line)", police: "999", ambulance: "999", emergency: "999" },
  { country: "Bhutan", disaster: "112 (DDM Bhutan)", police: "113", ambulance: "112", emergency: "112" },
  { country: "Brunei", disaster: "995 (Fire & Rescue)", police: "993", ambulance: "991", emergency: "995" },
  { country: "Cambodia", disaster: "118 (National Rescue)", police: "117", ambulance: "119", emergency: "119" },
  { country: "China", disaster: "119 (Emergency Rescue)", police: "110", ambulance: "120", emergency: "110 / 120" },
  { country: "Cyprus", disaster: "112 (Civil Defence)", police: "112 / 199", ambulance: "112 / 199", emergency: "112" },
  { country: "Fiji", disaster: "910 (DISMAC / Fire)", police: "917", ambulance: "911", emergency: "911" },
  { country: "Georgia", disaster: "112 (Emergency Situations)", police: "112", ambulance: "112", emergency: "112" },
  { country: "India", disaster: "1078 / 1070 (NDRF / SDMA)", police: "112 / 100", ambulance: "102 / 108", emergency: "112" },
  { country: "Indonesia", disaster: "115 (BASARNAS)", police: "110", ambulance: "118 / 119", emergency: "112" },
  { country: "Iran", disaster: "112 (Red Crescent Relief)", police: "110", ambulance: "115", emergency: "112" },
  { country: "Iraq", disaster: "115 (Civil Defence)", police: "104", ambulance: "122", emergency: "112 / 911" },
  { country: "Israel", disaster: "104 (Home Front Command)", police: "100", ambulance: "101 (MDA)", emergency: "112 / 100" },
  { country: "Japan", disaster: "171 (Disaster Message Board)", police: "110", ambulance: "119", emergency: "110 / 119" },
  { country: "Jordan", disaster: "911 (Civil Defense)", police: "911", ambulance: "911", emergency: "911" },
  { country: "Kazakhstan", disaster: "112 (Emergency Situations)", police: "102", ambulance: "103", emergency: "112" },
  { country: "Kuwait", disaster: "112 (Civil Defence)", police: "112", ambulance: "112", emergency: "112" },
  { country: "Kyrgyzstan", disaster: "112 (MES Disaster Rescue)", police: "102", ambulance: "103", emergency: "112" },
  { country: "Laos", disaster: "1190 (Fire & Rescue)", police: "1191", ambulance: "1195", emergency: "1190" },
  { country: "Lebanon", disaster: "125 (Civil Defense)", police: "112", ambulance: "140 (Red Cross)", emergency: "112" },
  { country: "Malaysia", disaster: "999 (NADMA / 991 Civil)", police: "999", ambulance: "999", emergency: "999 / 112" },
  { country: "Maldives", disaster: "115 (MNDF Disaster Relief)", police: "119", ambulance: "102", emergency: "119 / 102" },
  { country: "Mongolia", disaster: "105 (NEMA Disaster Agency)", police: "102", ambulance: "103", emergency: "105" },
  { country: "Myanmar", disaster: "191 (Fire & Rescue)", police: "199", ambulance: "192", emergency: "199" },
  { country: "Nepal", disaster: "1155 (NEOC Operations)", police: "100", ambulance: "102", emergency: "100 / 102" },
  { country: "New Zealand", disaster: "0800 22 22 00 (Civil Defence)", police: "111", ambulance: "111", emergency: "111" },
  { country: "Oman", disaster: "9999 (Civil Defence & Ambulance)", police: "9999", ambulance: "9999", emergency: "9999 / 112" },
  { country: "Pakistan", disaster: "1078 (NDMA Pakistan)", police: "15", ambulance: "1122 (Rescue 1122)", emergency: "1122 / 15" },
  { country: "Papua New Guinea", disaster: "111 (Disaster Center)", police: "112 / 000", ambulance: "111", emergency: "111" },
  { country: "Philippines", disaster: "(02) 8911-5061 (NDRRMC)", police: "911 / 117", ambulance: "911", emergency: "911" },
  { country: "Qatar", disaster: "999 (Civil Defense)", police: "999", ambulance: "999", emergency: "999 / 112" },
  { country: "Saudi Arabia", disaster: "998 (General Civil Defense)", police: "999 / 911", ambulance: "997", emergency: "911" },
  { country: "Singapore", disaster: "995 (SCDF Rescue)", police: "999", ambulance: "995", emergency: "995 / 999" },
  { country: "South Korea", disaster: "119 (National Fire Agency)", police: "112", ambulance: "119", emergency: "119 / 112" },
  { country: "Sri Lanka", disaster: "117 (Disaster Management Center)", police: "119", ambulance: "1990 (Suwa Seriya)", emergency: "117 / 119" },
  { country: "Syria", disaster: "113 (Civil Defence)", police: "112", ambulance: "110", emergency: "112" },
  { country: "Taiwan", disaster: "119 (NFA Disaster Relief)", police: "110", ambulance: "119", emergency: "119 / 112" },
  { country: "Tajikistan", disaster: "112 (CoES Committee)", police: "102", ambulance: "103", emergency: "112" },
  { country: "Thailand", disaster: "1784 (DDPM Disaster Hotline)", police: "191", ambulance: "1669", emergency: "191 / 1669" },
  { country: "Turkey", disaster: "112 (AFAD Emergency)", police: "112", ambulance: "112", emergency: "112" },
  { country: "Turkmenistan", disaster: "112 (Civil Protection)", police: "02", ambulance: "03", emergency: "112" },
  { country: "United Arab Emirates", disaster: "997 / 998 (Civil Defense)", police: "999", ambulance: "998", emergency: "999 / 112" },
  { country: "Uzbekistan", disaster: "1050 (Ministry of Emergency)", police: "102", ambulance: "103", emergency: "112" },
  { country: "Vietnam", disaster: "114 (VDEMA Rescue)", police: "113", ambulance: "115", emergency: "114 / 115" },
  { country: "Yemen", disaster: "191 (Civil Defence)", police: "194", ambulance: "195", emergency: "199" },

  // Europe
  { country: "Albania", disaster: "112 (Civil Protection)", police: "129", ambulance: "127", emergency: "112" },
  { country: "Austria", disaster: "112 (Katastrophenhilfe)", police: "133", ambulance: "144", emergency: "112" },
  { country: "Belarus", disaster: "112 (EMERCOM Belarus)", police: "102", ambulance: "103", emergency: "112" },
  { country: "Belgium", disaster: "112 (Federal Crisis Center)", police: "101", ambulance: "112", emergency: "112" },
  { country: "Bosnia and Herzegovina", disaster: "121 (Civil Protection)", police: "122", ambulance: "124", emergency: "112" },
  { country: "Bulgaria", disaster: "112 (Civil Protection)", police: "112", ambulance: "112", emergency: "112" },
  { country: "Croatia", disaster: "112 (Civil Protection Directorate)", police: "192", ambulance: "194", emergency: "112" },
  { country: "Czech Republic", disaster: "150 (Fire & Rescue Service)", police: "158", ambulance: "155", emergency: "112" },
  { country: "Denmark", disaster: "112 (Beredskabsstyrelsen)", police: "114", ambulance: "112", emergency: "112" },
  { country: "Estonia", disaster: "112 (Rescue Board Päästeamet)", police: "112", ambulance: "112", emergency: "112" },
  { country: "Finland", disaster: "112 (Pelastustoimi)", police: "112", ambulance: "112", emergency: "112" },
  { country: "France", disaster: "112 (Sécurité Civile / 18 Sapeurs)", police: "17", ambulance: "15 (SAMU)", emergency: "112" },
  { country: "Germany", disaster: "0228 99550-0 (BBK Disaster Agency)", police: "110", ambulance: "112", emergency: "112" },
  { country: "Greece", disaster: "112 (Civil Protection GSCP)", police: "100", ambulance: "166 (EKAB)", emergency: "112" },
  { country: "Hungary", disaster: "112 (Katasztrófavédelem)", police: "107", ambulance: "104", emergency: "112" },
  { country: "Iceland", disaster: "112 (Department of Civil Protection)", police: "112", ambulance: "112", emergency: "112" },
  { country: "Ireland", disaster: "999 / 112 (National Emergency Directorate)", police: "999 / 112", ambulance: "999 / 112", emergency: "112" },
  { country: "Italy", disaster: "800 840 840 (Protezione Civile)", police: "113 / 112", ambulance: "118", emergency: "112" },
  { country: "Kosovo", disaster: "112 (Emergency Management)", police: "192", ambulance: "194", emergency: "112" },
  { country: "Latvia", disaster: "112 (State Fire & Rescue VUGD)", police: "110", ambulance: "113", emergency: "112" },
  { country: "Lithuania", disaster: "112 (Fire and Rescue PAGD)", police: "112", ambulance: "112", emergency: "112" },
  { country: "Luxembourg", disaster: "112 (CGDIS Rescue Corps)", police: "113", ambulance: "112", emergency: "112" },
  { country: "Malta", disaster: "112 (Civil Protection Department)", police: "112", ambulance: "112", emergency: "112" },
  { country: "Moldova", disaster: "112 (Inspectorate Emergencies)", police: "112", ambulance: "112", emergency: "112" },
  { country: "Montenegro", disaster: "112 (Emergency Sector)", police: "122", ambulance: "124", emergency: "112" },
  { country: "Netherlands", disaster: "112 (Crisis.nl / Veiligheidsregio)", police: "0900-8844", ambulance: "112", emergency: "112" },
  { country: "North Macedonia", disaster: "112 (Crisis Management Center)", police: "192", ambulance: "194", emergency: "112" },
  { country: "Norway", disaster: "110 (DSB Civil Protection)", police: "112", ambulance: "113", emergency: "112" },
  { country: "Poland", disaster: "112 (State Fire Service PSP)", police: "997", ambulance: "999", emergency: "112" },
  { country: "Portugal", disaster: "112 (ANEPC Civil Protection)", police: "112", ambulance: "112 (INEM)", emergency: "112" },
  { country: "Romania", disaster: "112 (DSU Emergency Situations)", police: "112", ambulance: "112 (SMURD)", emergency: "112" },
  { country: "Russia", disaster: "112 (EMERCOM / MChS Rossii)", police: "102", ambulance: "103", emergency: "112" },
  { country: "Serbia", disaster: "193 (Emergency Management)", police: "192", ambulance: "194", emergency: "112" },
  { country: "Slovakia", disaster: "112 (Crisis Management Section)", police: "158", ambulance: "155", emergency: "112" },
  { country: "Slovenia", disaster: "112 (URSZR Protection & Rescue)", police: "113", ambulance: "112", emergency: "112" },
  { country: "Spain", disaster: "112 (Protección Civil)", police: "091", ambulance: "061", emergency: "112" },
  { country: "Sweden", disaster: "112 (MSB Civil Contingencies)", police: "114 14", ambulance: "112", emergency: "112" },
  { country: "Switzerland", disaster: "118 (Civil Protection)", police: "117", ambulance: "144", emergency: "112" },
  { country: "Ukraine", disaster: "101 (State Emergency Service SESU)", police: "102", ambulance: "103", emergency: "112" },
  { country: "United Kingdom", disaster: "0345 988 1188 (Floodline / Civil)", police: "999 / 101", ambulance: "999 / 111", emergency: "999 / 112" },

  // Americas
  { country: "Argentina", disaster: "103 (Defensa Civil)", police: "101 / 911", ambulance: "107 (SAME)", emergency: "911" },
  { country: "Bahamas", disaster: "322-6731 (NEMA Bahamas)", police: "911 / 919", ambulance: "911", emergency: "911" },
  { country: "Barbados", disaster: "(246) 438-7575 (DEM)", police: "211", ambulance: "511", emergency: "911" },
  { country: "Belize", disaster: "936 (NEMO Emergency Ops)", police: "911", ambulance: "911", emergency: "911" },
  { country: "Bolivia", disaster: "119 (Defensa Civil)", police: "110", ambulance: "118", emergency: "911" },
  { country: "Brazil", disaster: "199 (Defesa Civil Nacional)", police: "190", ambulance: "192 (SAMU)", emergency: "190 / 192" },
  { country: "Canada", disaster: "1-800-O-Canada (Public Safety)", police: "911", ambulance: "911", emergency: "911" },
  { country: "Chile", disaster: "132 (SENAPRED / Bomberos)", police: "133", ambulance: "131 (SAMU)", emergency: "133" },
  { country: "Colombia", disaster: "144 (Defensa Civil Colombiana)", police: "123", ambulance: "125 / 123", emergency: "123" },
  { country: "Costa Rica", disaster: "911 (CNE Emergencias)", police: "911", ambulance: "911 (Cruz Roja)", emergency: "911" },
  { country: "Cuba", disaster: "105 (Defensa Civil)", police: "106", ambulance: "104", emergency: "106" },
  { country: "Dominican Republic", disaster: "809-472-8614 (COE / Defensa Civil)", police: "911", ambulance: "911", emergency: "911" },
  { country: "Ecuador", disaster: "911 (ECU 911 / Riesgos)", police: "911", ambulance: "911", emergency: "911" },
  { country: "El Salvador", disaster: "2281-0888 (Protección Civil)", police: "911", ambulance: "132", emergency: "911" },
  { country: "Guatemala", disaster: "119 (CONRED)", police: "110", ambulance: "122 / 123", emergency: "110" },
  { country: "Guyana", disaster: "226-1114 (Civil Defence Commission)", police: "911", ambulance: "913", emergency: "911" },
  { country: "Haiti", disaster: "113 (Protection Civile)", police: "114", ambulance: "116", emergency: "114" },
  { country: "Honduras", disaster: "113 (COPECO Contingencias)", police: "911", ambulance: "195 (Cruz Roja)", emergency: "911" },
  { country: "Jamaica", disaster: "876-906-9674 (ODPEM)", police: "119", ambulance: "110", emergency: "119" },
  { country: "Mexico", disaster: "911 (Protección Civil / CNPC)", police: "911", ambulance: "065 (Cruz Roja)", emergency: "911" },
  { country: "Nicaragua", disaster: "100 (SINAPRED)", police: "118", ambulance: "128 (Cruz Roja)", emergency: "118" },
  { country: "Panama", disaster: "911 / *335 (SINAPROC)", police: "104", ambulance: "911", emergency: "911" },
  { country: "Paraguay", disaster: "021-440-997 (SEN Emergencias)", police: "911", ambulance: "141 (SEME)", emergency: "911" },
  { country: "Peru", disaster: "115 (INDECI Defensa Civil)", police: "105", ambulance: "106 (SAMU)", emergency: "911 / 112" },
  { country: "Suriname", disaster: "115 (NCCR Rampenbeheersing)", police: "115", ambulance: "113", emergency: "115" },
  { country: "Trinidad and Tobago", disaster: "800-6326 (ODPM Operations)", police: "999", ambulance: "811", emergency: "999" },
  { country: "United States", disaster: "1-800-621-3362 (FEMA Operations)", police: "911", ambulance: "911", emergency: "911" },
  { country: "Uruguay", disaster: "911 (SINAE Emergencias)", police: "911", ambulance: "105", emergency: "911" },
  { country: "Venezuela", disaster: "0800-724831 (Protección Civil)", police: "911", ambulance: "911", emergency: "911" },

  // Africa
  { country: "Algeria", disaster: "1021 (Protection Civile)", police: "17 / 1548", ambulance: "14", emergency: "112 / 14" },
  { country: "Angola", disaster: "115 (Protecção Civil e Bombeiros)", police: "113", ambulance: "112", emergency: "112" },
  { country: "Benin", disaster: "118 (Sapeurs-Pompiers)", police: "117", ambulance: "112", emergency: "117" },
  { country: "Botswana", disaster: "998 (NDMO Disaster Ops)", police: "999", ambulance: "997", emergency: "999" },
  { country: "Burkina Faso", disaster: "18 (BNSP Protection Civile)", police: "17", ambulance: "112", emergency: "17" },
  { country: "Cameroon", disaster: "118 (Corps National Sapeurs)", police: "117", ambulance: "119", emergency: "112" },
  { country: "Chad", disaster: "18 (Sapeurs-Pompiers)", police: "17", ambulance: "2251-1237", emergency: "17" },
  { country: "DR Congo", disaster: "118 (Protection Civile)", police: "112", ambulance: "118", emergency: "112" },
  { country: "Egypt", disaster: "180 (Civil Protection Department)", police: "122", ambulance: "123", emergency: "112 / 122" },
  { country: "Ethiopia", disaster: "939 (EDRMC Commission)", police: "991", ambulance: "907", emergency: "911" },
  { country: "Gabon", disaster: "18 (Protection Civile)", police: "177", ambulance: "1300", emergency: "177" },
  { country: "Gambia", disaster: "118 (Fire and Rescue Service)", police: "117", ambulance: "116", emergency: "112" },
  { country: "Ghana", disaster: "0302-772926 (NADMO)", police: "191 / 18555", ambulance: "193", emergency: "112" },
  { country: "Guinea", disaster: "18 (Protection Civile)", police: "117", ambulance: "442-020", emergency: "117" },
  { country: "Ivory Coast", disaster: "180 (ONPC Protection Civile)", police: "111 / 170", ambulance: "185 (SAMU)", emergency: "112" },
  { country: "Kenya", disaster: "0800 721 546 (National Disaster NDOC)", police: "999 / 112", ambulance: "999", emergency: "999 / 112" },
  { country: "Liberia", disaster: "911 (NDMA Disaster Agency)", police: "911", ambulance: "911", emergency: "911" },
  { country: "Libya", disaster: "193 (Civil Defense)", police: "1515", ambulance: "191", emergency: "193" },
  { country: "Madagascar", disaster: "118 (BNGRC Gestion Risques)", police: "117", ambulance: "124", emergency: "117" },
  { country: "Malawi", disaster: "01 774 250 (DoDMA Affairs)", police: "997", ambulance: "998", emergency: "999" },
  { country: "Mali", disaster: "18 (Protection Civile)", police: "17", ambulance: "15", emergency: "17" },
  { country: "Mauritius", disaster: "115 (NDRPMC Disaster Mgmt)", police: "999 / 112", ambulance: "114 (SAMU)", emergency: "112" },
  { country: "Morocco", disaster: "150 (Protection Civile)", police: "19", ambulance: "15", emergency: "112" },
  { country: "Mozambique", disaster: "198 (INGD Desastres)", police: "119", ambulance: "117", emergency: "112" },
  { country: "Namibia", disaster: "061 203 2348 (Disaster Risk)", police: "10111", ambulance: "203 2276", emergency: "112" },
  { country: "Niger", disaster: "18 (Protection Civile)", police: "17", ambulance: "15", emergency: "17" },
  { country: "Nigeria", disaster: "0800 2255 6262 (NEMA Agency)", police: "112", ambulance: "112", emergency: "112" },
  { country: "Rwanda", disaster: "112 (MIDIMAR Disaster)", police: "112", ambulance: "912 (SAMU)", emergency: "112" },
  { country: "Senegal", disaster: "18 (Brigade Sapeurs-Pompiers)", police: "17", ambulance: "15 (SAMU)", emergency: "112" },
  { country: "Sierra Leone", disaster: "+232 76 612 775 (NDMA)", police: "019 / 112", ambulance: "117", emergency: "112" },
  { country: "Somalia", disaster: "999 (SODMA Disaster Agency)", police: "888", ambulance: "999", emergency: "999" },
  { country: "South Africa", disaster: "012 334 0055 (NDMC Disaster Centre)", police: "10111", ambulance: "10177", emergency: "112" },
  { country: "South Sudan", disaster: "999 (Humanitarian Affairs)", police: "777", ambulance: "999", emergency: "999" },
  { country: "Sudan", disaster: "998 (Civil Defence)", police: "999", ambulance: "333", emergency: "999" },
  { country: "Tanzania", disaster: "112 (Disaster Mgmt Dept)", police: "112", ambulance: "114", emergency: "112" },
  { country: "Togo", disaster: "118 (Sapeurs-Pompiers)", police: "117", ambulance: "8200", emergency: "117" },
  { country: "Tunisia", disaster: "198 (Office Protection Civile)", police: "197", ambulance: "190 (SAMU)", emergency: "198" },
  { country: "Uganda", disaster: "0800 177 777 (Emergency Relief OPM)", police: "999 / 112", ambulance: "911", emergency: "112" },
  { country: "Zambia", disaster: "0211 252 687 (DMMU Disaster Unit)", police: "991", ambulance: "992", emergency: "112" },
  { country: "Zimbabwe", disaster: "0242 791 288 (Civil Protection Unit)", police: "995", ambulance: "994", emergency: "999" }
];

// ================= AUTHENTICATION & REGISTRATION HANDLERS =================
const authModal = document.getElementById('auth-modal');
const topBar = document.getElementById('top-bar');
const appContainer = document.getElementById('app-container');

const tabSignIn = document.getElementById('tab-signin');
const tabSignUp = document.getElementById('tab-signup');
const authForm = document.getElementById('auth-form');
const btnSubmitAuth = document.getElementById('btn-submit-auth');

const signupExtraFields = document.getElementById('signup-extra-fields');
const regNameInput = document.getElementById('reg-name');
const regCountryInput = document.getElementById('reg-country');
const authEmailInput = document.getElementById('auth-email');
const authPasswordInput = document.getElementById('auth-password');

const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('logout-btn');

let authMode = 'signin';

tabSignIn.addEventListener('click', () => {
  authMode = 'signin';
  tabSignIn.classList.add('active');
  tabSignUp.classList.remove('active');
  signupExtraFields.classList.add('hidden');
  
  regNameInput.removeAttribute('required');
  regCountryInput.removeAttribute('required');
  btnSubmitAuth.textContent = 'Access Monitor';
});

tabSignUp.addEventListener('click', () => {
  authMode = 'signup';
  tabSignUp.classList.add('active');
  tabSignIn.classList.remove('active');
  signupExtraFields.classList.remove('hidden');
  
  regNameInput.setAttribute('required', 'true');
  regCountryInput.setAttribute('required', 'true');
  btnSubmitAuth.textContent = 'Create Citizen Account';
});

authForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = authEmailInput.value.trim();
  const password = authPasswordInput.value;

  if (authMode === 'signup') {
    const name = regNameInput.value.trim();
    const country = regCountryInput.value.trim();

    if (!name || !country || !email || !password) {
      alert("All fields (Name, Country, Email, and Password) are strictly mandatory.");
      return;
    }

    currentPassword = password;
    loginUser(email, name, country);
  } else {
    // Sign In Mode
    const defaultName = email.split('@')[0];
    loginUser(email, defaultName, "India");
  }
});

logoutBtn.addEventListener('click', () => {
  currentUser = null;
  topBar.classList.add('hidden');
  appContainer.classList.add('hidden');
  authModal.classList.remove('hidden');
  authForm.reset();
});

function loginUser(email, name, country) {
  currentUser = email;
  userDisplay.textContent = name;

  // Populate Account screen demographics
  document.getElementById('prof-email').value = email;
  document.getElementById('prof-name').value = name;
  document.getElementById('prof-country').value = country;

  authModal.classList.add('hidden');
  topBar.classList.remove('hidden');
  appContainer.classList.remove('hidden');

  fetchHazardFeeds();
  loadLiveHumidity();
  renderRescueDirectory(rescueDirectory);
}

// ================= ACCOUNT PROFILE & SECURITY MANAGEMENT =================
const profileForm = document.getElementById('profile-form');
const passwordForm = document.getElementById('password-form');

profileForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const updatedName = document.getElementById('prof-name').value.trim();
  userDisplay.textContent = updatedName;
  alert("Profile personal details successfully saved!");
});

passwordForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const cur = document.getElementById('pwd-current').value;
  const next = document.getElementById('pwd-new').value;
  const conf = document.getElementById('pwd-confirm').value;

  if (cur !== currentPassword) {
    alert("Current password does not match our records.");
    return;
  }

  if (next !== conf) {
    alert("New password and confirm password do not match.");
    return;
  }

  if (next.length < 6) {
    alert("New password must be at least 6 characters long.");
    return;
  }

  currentPassword = next;
  passwordForm.reset();
  alert("Security credentials updated. Your new password is now active.");
});

// ================= NAVIGATION & PAGE ROUTING =================
const hamburgerBtn = document.getElementById('hamburger-btn');
const navDrawer = document.getElementById('nav-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const closeDrawerBtn = document.getElementById('close-drawer-btn');
const navItems = document.querySelectorAll('.nav-item');
const pageTitleEl = document.getElementById('page-current-title');

function toggleDrawer(open) {
  if (open) {
    navDrawer.classList.remove('closed');
    drawerOverlay.classList.remove('hidden');
  } else {
    navDrawer.classList.add('closed');
    drawerOverlay.classList.add('hidden');
  }
}

hamburgerBtn.addEventListener('click', () => toggleDrawer(true));
closeDrawerBtn.addEventListener('click', () => toggleDrawer(false));
drawerOverlay.addEventListener('click', () => toggleDrawer(false));

navItems.forEach(btn => {
  btn.addEventListener('click', () => {
    const modalTarget = btn.getAttribute('data-modal');
    if (modalTarget === 'modal-precautions') {
      document.getElementById('modal-precautions').classList.remove('hidden');
      toggleDrawer(false);
      return;
    }

    const pageId = btn.getAttribute('data-page');
    if (!pageId) return;

    navItems.forEach(i => i.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.page-view').forEach(p => p.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');

    pageTitleEl.textContent = btn.innerText.trim();
    toggleDrawer(false);
  });
});

// ================= QUICK SEARCH (HOME PAGE) =================
const quickSearchInput = document.getElementById('quick-search-input');
const quickSearchResultsBox = document.getElementById('quick-search-results-box');
const quickSearchPlaceholder = document.getElementById('quick-search-placeholder');
const quickSearchBody = document.getElementById('quick-search-body');
const clearSearchBtn = document.getElementById('clear-search-btn');

quickSearchInput.addEventListener('input', () => {
  const query = quickSearchInput.value.toLowerCase().trim();

  if (!query) {
    quickSearchResultsBox.classList.add('hidden');
    quickSearchPlaceholder.classList.remove('hidden');
    quickSearchBody.innerHTML = '';
    return;
  }

  const matches = allActivities.filter(ev => ev.place.toLowerCase().includes(query));

  quickSearchPlaceholder.classList.add('hidden');
  quickSearchResultsBox.classList.remove('hidden');

  if (matches.length === 0) {
    quickSearchBody.innerHTML = `<tr><td colspan="5" class="loading-cell">No active disaster events detected for "${escapeHtml(query)}".</td></tr>`;
    return;
  }

  quickSearchBody.innerHTML = matches.map(item => createRowHTML(item)).join('');
});

clearSearchBtn.addEventListener('click', () => {
  quickSearchInput.value = '';
  quickSearchResultsBox.classList.add('hidden');
  quickSearchPlaceholder.classList.remove('hidden');
  quickSearchBody.innerHTML = '';
});

// ================= ACTIVITIES PAGE FILTERING =================
const activitiesSearch = document.getElementById('activities-search');
const activitiesTypeFilter = document.getElementById('activities-type-filter');
const activitiesSevFilter = document.getElementById('activities-sev-filter');
const activitiesTableBody = document.getElementById('activities-table-body');
const refreshFeedBtn = document.getElementById('refresh-feed-btn');

function renderActivitiesPage(list) {
  if (list.length === 0) {
    activitiesTableBody.innerHTML = `<tr><td colspan="5" class="loading-cell">No matching hazard records found.</td></tr>`;
    return;
  }
  activitiesTableBody.innerHTML = list.slice(0, 60).map(item => createRowHTML(item)).join('');
}

function applyActivitiesFilters() {
  const term = activitiesSearch.value.toLowerCase().trim();
  const type = activitiesTypeFilter.value;
  const sev = activitiesSevFilter.value;

  const filtered = allActivities.filter(ev => {
    const matchTerm = ev.place.toLowerCase().includes(term);
    const matchType = (type === 'all') || (ev.type === type);
    const matchSev = (sev === 'all') || (ev.severity === sev);
    return matchTerm && matchType && matchSev;
  });

  renderActivitiesPage(filtered);
}

activitiesSearch.addEventListener('input', applyActivitiesFilters);
activitiesTypeFilter.addEventListener('change', applyActivitiesFilters);
activitiesSevFilter.addEventListener('change', applyActivitiesFilters);
refreshFeedBtn.addEventListener('click', fetchHazardFeeds);

// ================= RESCUE DIRECTORY PAGE =================
const rescueBody = document.getElementById('rescue-directory-body');
const rescueCountrySearch = document.getElementById('rescue-country-search');

function renderRescueDirectory(list) {
  if (list.length === 0) {
    rescueBody.innerHTML = `<tr><td colspan="5" class="loading-cell">No emergency services found for this query.</td></tr>`;
    return;
  }
  rescueBody.innerHTML = list.map(item => `
    <tr>
      <td><strong>${item.country}</strong></td>
      <td><code>${item.disaster}</code></td>
      <td><code>${item.police}</code></td>
      <td><code>${item.ambulance}</code></td>
      <td><span class="badge badge-red">${item.emergency}</span></td>
    </tr>
  `).join('');
}

rescueCountrySearch.addEventListener('input', () => {
  const q = rescueCountrySearch.value.toLowerCase().trim();
  const matched = rescueDirectory.filter(r => r.country.toLowerCase().includes(q));
  renderRescueDirectory(matched);
});

// ================= MULTI-HAZARD FETCHER (QUAKES, TSUNAMIS, CYCLONES, VOLCANOES, FLOODS) =================
const quakeCountEl = document.getElementById('quake-count');
const tsunamiCountEl = document.getElementById('tsunami-count');
const cycloneCountEl = document.getElementById('cyclone-count');
const volcanoCountEl = document.getElementById('volcano-count');

async function fetchHazardFeeds() {
  activitiesTableBody.innerHTML = `<tr><td colspan="5" class="loading-cell">Contacting global hazard monitors...</td></tr>`;

  try {
    const [usgsRes, nasaStormRes, nasaVolcanoRes, nasaFloodRes] = await Promise.all([
      fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'),
      fetch('https://eonet.gsfc.nasa.gov/api/v3/events?category=severeStorms&status=open&limit=25'),
      fetch('https://eonet.gsfc.nasa.gov/api/v3/events?category=volcanoes&status=open&limit=25'),
      fetch('https://eonet.gsfc.nasa.gov/api/v3/events?category=floods&status=open&limit=20')
    ]);

    const usgsData = await usgsRes.json();
    const stormData = await nasaStormRes.json();
    const volcanoData = await nasaVolcanoRes.json();
    const floodData = await nasaFloodRes.json();

    // 1. Quakes & Tsunamis
    const quakes = usgsData.features.map(f => {
      const isTsunami = f.properties.tsunami === 1;
      const mag = f.properties.mag !== null ? Number(f.properties.mag) : 0;
      let sev = 'Minor';
      if (mag >= 5.0 || isTsunami) sev = 'Critical';
      else if (mag >= 4.0) sev = 'Moderate';

      return {
        id: f.id,
        type: isTsunami ? 'Tsunami' : 'Earthquake',
        place: f.properties.place || 'Seismic Sector',
        metric: `M ${mag.toFixed(1)}`,
        severity: sev,
        time: new Date(f.properties.time),
        url: f.properties.url
      };
    });

    // 2. Cyclones
    const cyclones = (stormData.events || []).map(ev => {
      const geom = ev.geometry?.length ? ev.geometry[ev.geometry.length - 1] : null;
      const metric = geom?.magnitudeValue ? `${geom.magnitudeValue} ${geom.magnitudeUnit || 'kts'}` : 'Active Storm';
      return {
        id: ev.id,
        type: 'Cyclone',
        place: ev.title,
        metric: `Wind: ${metric}`,
        severity: 'Critical',
        time: geom?.date ? new Date(geom.date) : new Date(),
        url: ev.sources?.[0]?.url || `https://eonet.gsfc.nasa.gov/events/${ev.id}`
      };
    });

    // 3. Volcanoes
    const volcanoes = (volcanoData.events || []).map(ev => {
      const geom = ev.geometry?.length ? ev.geometry[ev.geometry.length - 1] : null;
      return {
        id: ev.id,
        type: 'Volcano',
        place: ev.title,
        metric: 'Eruption Alert',
        severity: 'Critical',
        time: geom?.date ? new Date(geom.date) : new Date(),
        url: ev.sources?.[0]?.url || `https://eonet.gsfc.nasa.gov/events/${ev.id}`
      };
    });

    // 4. Floods
    const floods = (floodData.events || []).map(ev => {
      const geom = ev.geometry?.length ? ev.geometry[ev.geometry.length - 1] : null;
      return {
        id: ev.id,
        type: 'Flood',
        place: ev.title,
        metric: 'Inundation Warning',
        severity: 'Moderate',
        time: geom?.date ? new Date(geom.date) : new Date(),
        url: ev.sources?.[0]?.url || `https://eonet.gsfc.nasa.gov/events/${ev.id}`
      };
    });

    allActivities = [...quakes, ...cyclones, ...volcanoes, ...floods].sort((a, b) => b.time - a.time);

    // Update Home Metrics
    quakeCountEl.textContent = allActivities.filter(a => a.type === 'Earthquake').length;
    tsunamiCountEl.textContent = allActivities.filter(a => a.type === 'Tsunami').length;
    cycloneCountEl.textContent = allActivities.filter(a => a.type === 'Cyclone').length;
    volcanoCountEl.textContent = allActivities.filter(a => a.type === 'Volcano').length;

    renderActivitiesPage(allActivities);

  } catch (err) {
    activitiesTableBody.innerHTML = `<tr><td colspan="5" class="loading-cell alert-red">Connection error: ${err.message}</td></tr>`;
  }
}

// Table Row Helper
function createRowHTML(item) {
  let typeBadge = 'badge-green', icon = '🌐';
  if (item.type === 'Cyclone') { typeBadge = 'badge-cyan'; icon = '🌀'; }
  if (item.type === 'Tsunami') { typeBadge = 'badge-purple'; icon = '🌊'; }
  if (item.type === 'Volcano') { typeBadge = 'badge-red'; icon = '🌋'; }
  if (item.type === 'Flood') { typeBadge = 'badge-cyan'; icon = '🌧️'; }

  let sevBadge = 'badge-green';
  if (item.severity === 'Critical') sevBadge = 'badge-red';
  else if (item.severity === 'Moderate') sevBadge = 'badge-yellow';

  return `
    <tr>
      <td><span class="badge ${typeBadge}">${icon} ${item.type}</span></td>
      <td><strong>${escapeHtml(item.place)}</strong></td>
      <td><span class="badge ${sevBadge}">${item.metric}</span></td>
      <td>${item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${item.time.toLocaleDateString()}</td>
      <td><a href="${item.url}" target="_blank" rel="noopener noreferrer" class="table-link">Report ↗</a></td>
    </tr>
  `;
}

// ================= HUMIDITY TELEMETRY =================
async function loadLiveHumidity() {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.20&current=relative_humidity_2m&timezone=auto');
    const data = await res.json();
    document.getElementById('humidity-val').textContent = `${data.current.relative_humidity_2m}%`;
  } catch {
    document.getElementById('humidity-val').textContent = "54%";
  }
}

// ================= PRECAUTIONS MODAL TABS =================
const precModal = document.getElementById('modal-precautions');
const closePrecBtn = document.getElementById('close-precautions-btn');
const precTabBtns = document.querySelectorAll('.prec-tab-btn');
const precPanes = document.querySelectorAll('.prec-content');

closePrecBtn.addEventListener('click', () => precModal.classList.add('hidden'));
precModal.addEventListener('click', (e) => {
  if (e.target === precModal) precModal.classList.add('hidden');
});

precTabBtns.forEach(tab => {
  tab.addEventListener('click', () => {
    precTabBtns.forEach(t => t.classList.remove('active'));
    precPanes.forEach(p => p.classList.add('hidden'));

    tab.classList.add('active');
    const hazard = tab.getAttribute('data-hazard');
    document.getElementById(`prec-${hazard}`).classList.remove('hidden');
  });
});

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, t => 
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t] || t)
  );
}
