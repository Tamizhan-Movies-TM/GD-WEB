// Software: GDI-tm
// Version: 2.3.6
// Author: Professor
// Website: https://tamizhan-movies.site

// add multiple serviceaccounts as {}, {}, {}, random account will be selected by each time app is opened.

// =============================================================================
// OPTIMIZATION: Conditional Logging
// =============================================================================
const DEBUG = false; // ⚠️ SET TO FALSE IN PRODUCTION TO SAVE 104,000 EVENTS/DAY
const log = (...args) => DEBUG && console.log(...args);
const logError = (...args) => DEBUG && console.error(...args);

const environment = 'production'; // This Variable Decides the environment of the app. 'production' or 'development' or 'local'

function safeParseSecret(secret, name) {
  try {
    if (typeof secret === 'undefined') { console.error(`Secret ${name} is not set in Cloudflare Dashboard`); return []; }
    const parsed = JSON.parse(secret);
    if (!Array.isArray(parsed)) { console.error(`Secret ${name} must be a JSON array`); return []; }
    return parsed;
  } catch(e) {
    console.error(`Secret ${name} JSON parse error:`, e.message);
    return [];
  }
}
const serviceaccounts = [
  ...safeParseSecret(typeof SA_1 !== 'undefined' ? SA_1 : undefined, 'SA_1'),
  ...safeParseSecret(typeof SA_2 !== 'undefined' ? SA_2 : undefined, 'SA_2'),
  ...safeParseSecret(typeof SA_3 !== 'undefined' ? SA_3 : undefined, 'SA_3'),
  ...safeParseSecret(typeof SA_4 !== 'undefined' ? SA_4 : undefined, 'SA_4'),
  ...safeParseSecret(typeof SA_5 !== 'undefined' ? SA_5 : undefined, 'SA_5'),
  ...safeParseSecret(typeof SA_6 !== 'undefined' ? SA_6 : undefined, 'SA_6'),
  ...safeParseSecret(typeof SA_7 !== 'undefined' ? SA_7 : undefined, 'SA_7'),
  ...safeParseSecret(typeof SA_8 !== 'undefined' ? SA_8 : undefined, 'SA_8'),
  ...safeParseSecret(typeof SA_9 !== 'undefined' ? SA_9 : undefined, 'SA_9'),
  ...safeParseSecret(typeof SA_10 !== 'undefined' ? SA_10 : undefined, 'SA_10'),
];
if (serviceaccounts.length === 0) { throw new Error('FATAL: No valid service accounts found. Check SA_1 through SA_10 secrets in Cloudflare Dashboard.'); }

const IMAGE_PATHS = {
  '/favicon.ico': 'https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/tm-icon.png',
  '/logo.png': 'https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/tm-icon.png',
  '/login-logo.png': 'https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/tm-icon.png',
  '/pattern-32.svg': 'https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/pattern-32-inv.svg',
  '/pattern-33.svg':'https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/pattern-33.svg',
};
const randomserviceaccount = serviceaccounts[Math.floor(Math.random() * serviceaccounts.length)]; // Used as module-level fallback only
// ⚠️ NOTE: randomserviceaccount above is fixed at Worker cold-start time, not per-request.
// Per-request rotation is handled by getRandomServiceAccount() called inside handleRequest.
function getRandomServiceAccount() {
  return serviceaccounts[Math.floor(Math.random() * serviceaccounts.length)];
}
// =============================================================================
// DOWNLOAD DOMAINS — DYNAMIC GENERATION
// =============================================================================
// Generates all 50 download domains automatically (10 servers × 5 base domains).
// To override with a custom list: add a DOWNLOAD_DOMAINS secret in Cloudflare Dashboard
// (Settings → Variables & Secrets) containing a JSON array of domain strings.
// If the secret is missing or invalid, the full generated list is used as fallback.

function generateDownloadDomains() {
  const domains = [];
  const baseDomains = ['play-streamz', 'play-stream', 'play-streams', 'play-streamx', 'play-streamo'];
  for (let server = 1; server <= 10; server++) {
    baseDomains.forEach((base, index) => {
      domains.push(`https://download${index + 1}-server${server}.${base}.workers.dev`);
    });
  }
  return domains;
}

// Load from DOWNLOAD_DOMAINS secret if set, otherwise auto-generate
let domains_for_dl;
try {
  domains_for_dl = (typeof DOWNLOAD_DOMAINS !== 'undefined' && DOWNLOAD_DOMAINS)
    ? JSON.parse(DOWNLOAD_DOMAINS)
    : generateDownloadDomains();
} catch (e) {
  // Secret exists but contains invalid JSON — fall back to generated list
  domains_for_dl = generateDownloadDomains();
}
const blocked_region = ['PK']; // add regional codes seperated by comma, eg. ['IN', 'US', 'PK']
const blocked_asn = []; // add ASN numbers from http://www.bgplookingglass.com/list-of-autonomous-system-numbers, eg. [16509, 12345]
const authConfig = {
  // ✅ SECURITY: Loaded from Cloudflare Secrets — never hardcoded in source
  // Dashboard → Workers & Pages → Your Worker → Settings → Variables & Secrets → + Add (type: Secret)
  //   GOOGLE_CLIENT_ID      → your client_id value
  //   GOOGLE_CLIENT_SECRET  → your client_secret value
  //   GOOGLE_REFRESH_TOKEN  → your refresh_token value
  "client_id":     typeof GOOGLE_CLIENT_ID     !== 'undefined' ? GOOGLE_CLIENT_ID     : '',  // Cloudflare Secret
  "client_secret": typeof GOOGLE_CLIENT_SECRET !== 'undefined' ? GOOGLE_CLIENT_SECRET : '',  // Cloudflare Secret
  "refresh_token": typeof GOOGLE_REFRESH_TOKEN !== 'undefined' ? GOOGLE_REFRESH_TOKEN : '',  // Cloudflare Secret
  "service_account": true, // true if you're using Service Account instead of user account
  "service_account_json": randomserviceaccount, // don't touch this one
  "files_list_page_size": 100,
  "search_result_list_page_size": 100,
  "enable_cors_file_down": true,
  "enable_password_file_verify": true, // support for .password file in Google Drive folders
  "direct_link_protection": false, // protects direct links with Display UI
  "disable_anonymous_download": false, // disables direct links without session
  "file_link_expiry": 1, // expire file link in set number of days
  "search_all_drives": true, // search all of your drives instead of current drive if set to true
  "enable_login": true, // set to true if you want to add login system
  "enable_signup": false, // set to true if you want to add signup system
  "enable_social_login": false, // set to true if you want to add social login system
  "google_client_id_for_login": "", // Google Client ID for Login
  "google_client_secret_for_login": "", // Google Client Secret for Login
  "redirect_domain": "https://tamizhan-movies.site", // Domain for login redirect eg. https://example.com
  "login_database": "Local", // KV or Local
  "login_days": 30, // days to keep logged in
  "enable_ip_lock": false, // Disabled: IP lock breaks cross-worker downloads (different Cloudflare edge IPs per domain)
  "single_session": false, // set to true if you want to allow only one session per user
  "ip_changed_action": false, // set to true if you want to logout user if IP changed
  "password_expiry_days": 30, // ADD THIS: Global password expiry in days
  "enable_password_expiry": true, // ADD THIS: Enable/disable password expiry
  "users_list": (function() {
    // ── users_list loaded from USERS_JSON secret ───────────────────────────────
    // ✅ Store passwords securely in Cloudflare Dashboard — never in source code.
    // Dashboard → Workers & Pages → Your Worker → Settings → Variables & Secrets → + Add
    //   Name : USERS_JSON   Type : Secret
    //   Value: JSON array — example:
    //   [
    //     {"username":"karthick36","password":"enter_your_password"},
    //     {"username":"Elango","password":"enter_your_password","password_created_date":"2026-02-07"}
    //   ]
    try {
      if (typeof USERS_JSON === 'undefined' || !USERS_JSON) {
        console.error('USERS_JSON secret is not set — no users will be able to log in.');
        return [];
      }
      const list = JSON.parse(USERS_JSON);
      if (!Array.isArray(list)) { console.error('USERS_JSON must be a JSON array'); return []; }
      return list;
    } catch(e) {
      console.error('USERS_JSON parse error:', e.message);
      return [];
    }
  })(),
  "roots": [
    {
      "id": "14DRJFbhpK_y2AAQUWO3RRaBa6PWCyIkl",
      "name": "Tamizhan&nbsp;&nbsp;Movies",
      "protect_file_link": true,
  },
    { "id": "17DgpXJrsq7vERleJtNuuEDy9Mj4HIYpv",
       "name": "TM&nbsp;&nbsp;Drive",
       "protect_file_link": true,
},
  ]
};
const crypto_base_key = typeof CRYPTO_BASE_KEY !== 'undefined' ? CRYPTO_BASE_KEY : 'a3f5e7c891b2d4f6a8c0e2d4b6a8f0d2'; // Example 128 bit key used, generate your own.
const hmac_base_key   = typeof HMAC_BASE_KEY   !== 'undefined' ? HMAC_BASE_KEY   : '3d8f01c25a7b9e4f2a6c5d8e0f1b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0'; // Example 256 bit key used, generate your own.
const encrypt_iv      = typeof ENCRYPT_IV       !== 'undefined'
  ? new Uint8Array(ENCRYPT_IV.split(',').map(Number))
  : new Uint8Array([162, 93, 77, 201, 45, 120, 211, 103, 55, 189, 34, 12, 78, 99, 45, 23]); // Example 128 bit IV used, generate your own.
const uiConfig = {
  "siteName": "Tamizhan&nbsp;Movies", // Website name
  "theme": "darkly",  // switch between themes, default set to slate, select from https://gitlab.com/GoogleDriveIndex/Google-Drive-Index
  "version": "2.3.6", // don't touch this one. get latest code using generator at https://bdi-generator.hashhackers.com
  // If you're using Image then set to true, If you want text then set it to false
  "logo_image": true, // true if you're using image link in next option.
  "logo_height": "40px", // only if logo_image is true
  "logo_width": "40px", // only if logo_image is true
  "favicon": "/favicon.ico",  // if logo is true then link otherwise just text for name
  "logo_link_name": "/logo.png",
  "login_image": "/login-logo.png", // Login page logo image
  "fixed_header": true, // If you want the footer to be flexible or fixed.
  "header_padding": "103", // Value 80 for fixed header, Value 20 for flexible header. Required to be changed accordingly in some themes.
  "nav_link_1": "Home", // change navigation link name
  "nav_link_2": "Search", // change navigation link name
  "nav_link_3": "Current Path", // change navigation link name
  "nav_link_4": "Contact", // change navigation link name
  "fixed_footer": false, // If you want the footer to be flexible or fixed.
  "hide_footer": false, // hides the footer from site entirely.
  "header_style_class": "navbar-dark bg-dark-info-transparent", // navbar-dark bg-primary || navbar-dark bg-dark || navbar-light bg-light
  "footer_style_class": "bg-dark bg-transparent", // bg-primary || bg-dark || bg-light
  "css_a_tag_color": "white", // Color Name or Hex Code eg. #ffffff
  "css_p_tag_color": "white", // Color Name or Hex Code eg. #ffffff
  "folder_text_color": "white", // Color Name or Hex Code eg. #ffffff
  "loading_spinner_class": "text-light", // https://getbootstrap.com/docs/5.0/components/spinners/#colors
  "search_button_class": "btn btn-outline-success", // https://getbootstrap.com/docs/5.0/components/buttons/#examples
  "path_nav_alert_class": "alert alert-primary", // https://getbootstrap.com/docs/4.0/components/alerts/#examples
  "file_view_alert_class": "", // https://getbootstrap.com/docs/4.0/components/alerts/#examples
  "file_count_alert_class": "alert alert-secondary", // https://getbootstrap.com/docs/4.0/components/alerts/#examples
  "contact_link": "https://telegram.me/tamizhan_movies", // Link to Contact Button on Menu
  "copyright_year": "2026", // year of copyright, can be anything like 2015 - 2020 or just 2020
  "company_name": "Tamizhan Movies", // Name next to copyright
  "company_link": "https://telegram.me/tamizhan_updates", // link of copyright name
  "credit": true, // Set this to true to give us credit
  "display_size": true, // Set this to false to hide display file size
  "display_time": false, // Set this to false to hide display created time for folder and files
  "display_download": false, // Set this to false to hide download icon for folder and files on main index
  "display_drive_link": true, // This will add a Link Button to Google Drive of that particular file.
  "disable_player": false, // Set this to true to hide audio and video players
  "disable_video_download": false, // Remove Download, Copy Button on Videos
  "allow_selecting_files": false, // Disable Selecting Files to Download in Bulk
  "random_domain_for_dl": true, // If you want to display other URL for Downloading to protect your main domain.
  "poster": "https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/poster.jpg", // Video poster URL or see Readme to how to load from Drive
  "audioposter": "https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/music.jpg", // Video poster URL or see Readme to how to load from Drive
  "jsdelivr_cdn_src": "https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB", // If Project is Forked, then enter your GitHub repo
  "render_head_md": true, // Render Head.md
  "render_readme_md": true, // Render Readme.md
  "unauthorized_owner_link": "https://telegram.dog/Telegram", // Unauthorized Error Page Link to Owner
  "unauthorized_owner_email": "abuse@telegram.org", // Unauthorized Error Page Owner Email
  "downloaddomain": "", // Special value indicating we should rotate domains
  "show_logout_button": authConfig.enable_login ? true : false, // set to true if you want to add logout button
  "allow_file_copy": false, // set to false if you want to disable file copy
  "show_url_shortener": true,  // true  = Show Get2Short and Nowshort buttons (for non-login users) and set false = Show "Open in Chrome" button (for login users)
};


const player_config = {
  "player": "videojs", // videojs || plyr || dplayer || jwplayer
  "videojs_version": "8.3.0", // Change videojs version in future when needed.
  "plyr_io_version": "3.7.8",
  "jwplayer_version": "8.16.2"
}

// ── SHA-256 helper ────────────────────────────────────────────────────────────
async function sha256Hex(str) {
  const data = _textEncoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper: get plain password for a user from users_list.
function getUserPasswordHash(username) {
  const user = authConfig.users_list.find(u => u.username === username);
  return user ? user.password : null;
}

// ✅ SECURITY: Secure password verification using SHA-256.
// Both the input and stored passwords are hashed at runtime — nothing plain is ever persisted.
async function verifyPassword(inputPassword, storedPassword) {
  if (!storedPassword) return false;
  const inputHash  = await sha256Hex(inputPassword);
  const storedHash = await sha256Hex(storedPassword);
  return inputHash === storedHash;
}

// Helper: get SHA-256 hash of the user's password for session embedding.
async function resolvePasswordHash(user) {
  if (!user || !user.password) return null;
  return await sha256Hex(user.password);
}

// =============================================================================
// PASSWORD EXPIRY HELPER FUNCTIONS
// =============================================================================

// Check if password has expired
function isPasswordExpired(user) {
  if (!authConfig.enable_password_expiry) return false;
  if (!user.password_created_date) return false;

  const createdDate = new Date(user.password_created_date);
  const expiryDays = authConfig.password_expiry_days || 30;
  const expiryDate = new Date(createdDate);
  expiryDate.setDate(expiryDate.getDate() + expiryDays);

  return new Date() > expiryDate;
}

// Get days remaining until password expires
function getPasswordDaysRemaining(user) {
  if (!user.password_created_date) return null;

  const createdDate = new Date(user.password_created_date);
  const expiryDays = authConfig.password_expiry_days || 30;
  const expiryDate = new Date(createdDate);
  expiryDate.setDate(expiryDate.getDate() + expiryDays);

  const daysRemaining = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
  return daysRemaining;
}

// Get user object by username
function getUserObject(username) {
  for (let i = 0; i < authConfig.users_list.length; i++) {
    if (authConfig.users_list[i].username === username) {
      return authConfig.users_list[i];
    }
  }
  return null;
}

// Load Balancer for Download Workers
class DownloadLoadBalancer {
  constructor() {
      this.workers = domains_for_dl;
      this.workerStats = new Map();
      this.initializeStats();
  }

  initializeStats() {
      this.workers.forEach(worker => {
          this.workerStats.set(worker, {
              requests: 0,
              errors: 0,
              lastUsed: 0,
              responseTime: 0,
              health: 'healthy'
          });
      });
  }

  getRoundRobinWorker() {
      const sortedWorkers = [...this.workers].sort((a, b) => {
          const statsA = this.workerStats.get(a);
          const statsB = this.workerStats.get(b);
          return statsA.requests - statsB.requests;
      });

      const selectedWorker = sortedWorkers[0];
      this.updateWorkerStats(selectedWorker, 'request');
      return selectedWorker;
  }

  getLeastConnectionsWorker() {
      let minConnections = Infinity;
      let selectedWorker = this.workers[0];

      this.workers.forEach(worker => {
          const stats = this.workerStats.get(worker);
          if (stats.requests < minConnections && stats.health === 'healthy') {
              minConnections = stats.requests;
              selectedWorker = worker;
          }
      });

      this.updateWorkerStats(selectedWorker, 'request');
      return selectedWorker;
  }

  getWeightedWorker() {
      const weightedWorkers = this.workers.map(worker => {
          const stats = this.workerStats.get(worker);
          let weight = 10;

          if (stats.health === 'unhealthy') weight = 0;
          if (stats.errors > 0) weight -= stats.errors;
          if (stats.responseTime > 1000) weight -= 2;

          return { worker, weight: Math.max(1, weight) };
      });

      const totalWeight = weightedWorkers.reduce((sum, w) => sum + w.weight, 0);
      let random = Math.random() * totalWeight;

      for (const { worker, weight } of weightedWorkers) {
          random -= weight;
          if (random <= 0) {
              this.updateWorkerStats(worker, 'request');
              return worker;
          }
      }

      return this.workers[0];
  }

  getRandomWorker() {
      const healthyWorkers = this.workers.filter(worker => {
          const stats = this.workerStats.get(worker);
          return stats.health === 'healthy';
      });

      if (healthyWorkers.length === 0) {
          const selectedWorker = this.workers[Math.floor(Math.random() * this.workers.length)];
          this.updateWorkerStats(selectedWorker, 'request');
          return selectedWorker;
      }

      const selectedWorker = healthyWorkers[Math.floor(Math.random() * healthyWorkers.length)];
      this.updateWorkerStats(selectedWorker, 'request');
      return selectedWorker;
  }

  updateWorkerStats(worker, type, responseTime = 0) {
      const stats = this.workerStats.get(worker);
      if (stats) {
          if (type === 'request') {
              stats.requests++;
              stats.lastUsed = Date.now();
              if (responseTime > 0) {
                  stats.responseTime = (stats.responseTime + responseTime) / 2;
              }
          } else if (type === 'error') {
              stats.errors++;
              if (stats.errors > 5) stats.health = 'unhealthy';
          } else if (type === 'success') {
              stats.errors = Math.max(0, stats.errors - 1);
              if (stats.errors === 0) stats.health = 'healthy';
          }
      }
  }

  async healthCheck() {
      const healthChecks = this.workers.map(async (worker) => {
          try {
              const startTime = Date.now();
              const response = await fetch(`${worker}/health`, {
                  method: 'GET',
                  headers: { 'User-Agent': 'LoadBalancer-HealthCheck/1.0' },
                  signal: AbortSignal.timeout(10000)
              });
              const responseTime = Date.now() - startTime;

              if (response.ok) {
                  this.updateWorkerStats(worker, 'success', responseTime);
                  return { worker, status: 'healthy', responseTime };
              } else {
                  this.updateWorkerStats(worker, 'error');
                  return { worker, status: 'unhealthy', responseTime };
              }
          } catch (error) {
              this.updateWorkerStats(worker, 'error');
              return { worker, status: 'unhealthy', error: error.message };
          }
      });

      return Promise.all(healthChecks);
  }

  getStats() {
      const stats = {};
      this.workerStats.forEach((value, key) => {
          stats[key] = value;
      });
      return stats;
  }

  getWorkerCounts() {
      const healthy = this.workers.filter(worker => {
          const stats = this.workerStats.get(worker);
          return stats.health === 'healthy';
      }).length;

      return {
          total: this.workers.length,
          healthy: healthy,
          unhealthy: this.workers.length - healthy
      };
  }
}

const loadBalancer = new DownloadLoadBalancer();

var gds = [];
const drive_list = authConfig.roots.map(it => it.id)
let app_js_file
if (environment === 'production') {
app_js_file = '/app.min.js'
} else if (environment === 'development') {
app_js_file = uiConfig.jsdelivr_cdn_src + '@' + 'master/src/appnew.min.js'
} else if (environment === 'local') {
app_js_file = uiConfig.jsdelivr_cdn_src + '@' + 'master/src/appsxnew.min.js'
}

function html(current_drive_order = 0, model = {}) {
return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no"/>
<title>${uiConfig.siteName}</title>
<meta name="robots" content="noindex" />
<link rel="icon" href="${uiConfig.favicon}">
<style>
.navbar-brand {font-size: 30px;}.footer-text {font-size: 40px;}a {color:white;}p {color:white;} .logo_new {font-size: 50px;color:white;} .loading {position: fixed;z-index: 999;height: 2em;width: 2em;overflow: show;margin: auto;top: 0;left: 0;bottom: 0;right: 0;}.loading:before {content: '';display: block;position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: radial-gradient(rgba(20, 20, 20,.8), rgba(0, 0, 0, .8));background: -webkit-radial-gradient(rgba(20, 20, 20,.8), rgba(0, 0, 0,.8));}.loading:not(:required) {font: 0/0 a;color: transparent;text-shadow: none;background-color: transparent;border: 0;}.loading:not(:required):after {content: '';display: block;font-size: 10px;width: 1em;height: 1em;margin-top: -0.5em;-webkit-animation: spinner 150ms infinite linear;-moz-animation: spinner 150ms infinite linear;-ms-animation: spinner 150ms infinite linear;-o-animation: spinner 150ms infinite linear;animation: spinner 150ms infinite linear;border-radius: 0.5em;-webkit-box-shadow: rgba(255,255,255, 0.75) 1.5em 0 0 0, rgba(255,255,255, 0.75) 1.1em 1.1em 0 0, rgba(255,255,255, 0.75) 0 1.5em 0 0, rgba(255,255,255, 0.75) -1.1em 1.1em 0 0, rgba(255,255,255, 0.75) -1.5em 0 0 0, rgba(255,255,255, 0.75) -1.1em -1.1em 0 0, rgba(255,255,255, 0.75) 0 -1.5em 0 0, rgba(255,255,255, 0.75) 1.1em -1.1em 0 0;box-shadow: rgba(255,255,255, 0.75) 1.5em 0 0 0, rgba(255,255,255, 0.75) 1.1em 1.1em 0 0, rgba(255,255,255, 0.75) 0 1.5em 0 0, rgba(255,255,255, 0.75) -1.1em 1.1em 0 0, rgba(255,255,255, 0.75) -1.5em 0 0 0, rgba(255,255,255, 0.75) -1.1em -1.1em 0 0, rgba(255,255,255, 0.75) 0 -1.5em 0 0, rgba(255,255,255, 0.75) 1.1em -1.1em 0 0;}@-webkit-keyframes spinner {0% {-webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);-ms-transform: rotate(0deg);-o-transform: rotate(0deg);transform: rotate(0deg);}100% {-webkit-transform: rotate(360deg);-moz-transform: rotate(360deg);-ms-transform: rotate(360deg);-o-transform: rotate(360deg);transform: rotate(360deg);}}@-moz-keyframes spinner {0% {-webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);-ms-transform: rotate(0deg);-o-transform: rotate(0deg);transform: rotate(0deg);}100% {-webkit-transform: rotate(360deg);-moz-transform: rotate(360deg);-ms-transform: rotate(360deg);-o-transform: rotate(360deg);transform: rotate(360deg);}}@-o-keyframes spinner {0% {-webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);-ms-transform: rotate(0deg);-o-transform: rotate(0deg);transform: rotate(0deg);}100% {-webkit-transform: rotate(360deg);-moz-transform: rotate(360deg);-ms-transform: rotate(360deg);-o-transform: rotate(360deg);transform: rotate(360deg);}}@keyframes spinner {0% {-webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);-ms-transform: rotate(0deg);-o-transform: rotate(0deg);transform: rotate(0deg);}100% {-webkit-transform: rotate(360deg);-moz-transform: rotate(360deg);-ms-transform: rotate(360deg);-o-transform: rotate(360deg);transform: rotate(360deg);}}	  </style>
<script>
window.drive_names = JSON.parse('${JSON.stringify(authConfig.roots.map(it => it.name))}');
window.MODEL = JSON.parse('${JSON.stringify(model)}');
window.current_drive_order = ${current_drive_order};
window.UI = JSON.parse('${JSON.stringify(uiConfig)}');
window.player_config = JSON.parse('${JSON.stringify(player_config)}');
// DEBUG flag controlled from worker-tm.js — no need to touch app-tm.js
window.DEBUG = ${DEBUG};
</script>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.2/dist/${uiConfig.theme}/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous"><script>
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  document.addEventListener('keydown', function(e) {
    if (
      e.code === 'F12' ||
      (e.ctrlKey && e.shiftKey && e.code === 'KeyI') ||
      (e.ctrlKey && e.code === 'KeyU') ||
      e.code === 'PrintScreen' ||
      (e.altKey && e.code === 'F12') ||
      (e.metaKey && e.altKey && e.code === 'KeyU')
    ) {
      e.preventDefault();
    }

    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
      e.preventDefault();
    }
  });

  var touchStartTime;
  document.addEventListener('touchstart', function(e) {
    touchStartTime = Date.now();
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('touchend', function(e) {
    if (Date.now() - touchStartTime > 500) {
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  if (window.self !== window.top) {
    window.top.location = window.self.location;
  }
});
  </script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer">
<style>
   body.modal-open {
     padding-right: 0px !important;
   }
   .bg-zers {
       position: relative;
   }
   .bg-zers::before {
       content: '';
       position: fixed;
       width: 100%;
       height: 100vh;
       top: 0;
       left: 0;
       background-image: url('/pattern-32.svg'),
           linear-gradient(#61045F, transparent),
           linear-gradient(to top left, lime, transparent),
           linear-gradient(to top right, blue, transparent);
       background-size: contain;
       background-position: left;
       background-repeat: repeat-x;
       background-blend-mode: darken;
       will-change: transform;
   }
   .back-to-top {
     background: rgba(0,0,0,.4);
     position: fixed;
     bottom: 85px;
     right: -5px;
     display: none;
     z-index: 2;
   }
   .breadcrumb {
     margin-bottom: 0;
     background: transparent;
     overflow: auto;
     white-space: nowrap;
     display: block;
   }
   .breadcrumb .breadcrumb-item {
     display: inline;
   }
   .breadcrumb-item+.breadcrumb-item::before {
     float: none;
   }
   .card {
       background: rgba(0, 0, 0, 0.65);
       box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
   }
   .list-group-item, .list-group-item.disabled, .list-group-item:disabled {
       background: transparent;
   }
   .list-group-item-action:focus, .list-group-item-action:hover {
       background-color: rgb(216 216 216 / 20%);
   }
   .card-header, .card-footer {
       background-color: rgba(0, 0, 0, 0.40);
       border-color: rgba(140, 130, 115, 0.13);
   }
   .modal-header, .modal-footer, .list-group-item, .input-group-text {
       border-color: rgba(140, 130, 115, 0.13);
   }
   .navbar {
     border-radius: 0 0 .5rem .5rem;
     border: 0.5px solid rgba(140, 130, 115, 0.13);
     box-shadow: 0 16px 48px 0 rgba(0, 0, 0, 0.5);
     border-top: none;
     background: rgba(24, 26, 27, 0.5);
   }
   .navbar::before {
     content: '';
     position: absolute;
     width: 100%;
     height: 100%;
     top: 0;
     left: 0;
     backdrop-filter: blur(5px);
     -webkit-backdrop-filter: blur(5px);
     z-index: -1;
     border-radius: 0 0 .5rem .5rem;
   }
   .alert, .card, .dropdown-menu, .modal-content {
       border-radius: .5rem;
       border-color: rgba(140, 130, 115, 0.13);
   }
   .dropdown-item:focus, .dropdown-item:hover {
     background-color: #007053;
   }
   .donate {
     position: relative;
     width: fit-content;
     margin: auto;
   }
   .donate .qrcode {
       display: none;
       position: absolute;
       z-index: 99;
       bottom: 2.8em;
       overflow: hidden;
       border-radius: .5rem;
       width: max-content;
       left: 50%;
       transform: translateX(-50%);
   }
   .donate:hover .qrcode {
       display: block
   }
   .dropdown-menu, .qrcode {
       box-shadow: 0px 16px 48px 0px rgba(0,0,0,0.5)
   }
   .fa, .fab, .fas, .fa-regular, .fa-solid {
       margin-right: 0.5rem;
   }
   .form-control, .form-select, .form-control:disabled, .form-control:read-only, .form-control:focus {
     color: rgb(189, 183, 175);
     background: transparent;
     border-color: rgba(140, 130, 115, 0.13);
     box-shadow: none;
   }
   footer {
       border-radius: .4rem .4rem 0 0;
       border: 1px solid rgba(140, 130, 115, 0.13);
       box-shadow: 0 -16px 48px 0 rgba(0, 0, 0, 0.5);
       margin-top: auto;
   }
   footer, .dropdown-menu, .modal-content, .qrcode {
       background: rgba(24, 26, 27, 0.2);
       backdrop-filter: blur(5px);
       -webkit-backdrop-filter: blur(5px);
   }
   .hover-overlay {
     position: absolute;
     width: 100%;
     height: 100%;
     background: rgba(0, 0, 0);
     opacity: 0;
    }
   .hover-overlay:hover {
     opacity: .9;
   }
   .overlay {
     position: absolute;
     width: 100%;
     height: 100%;
     background: rgba(0, 0, 0);
     opacity: .9;
   }
   table {
       word-break: break-word;
   }
   .table {
       --bs-table-bg: unset;
   }
   .table th {
       min-width: 8rem;
   }
   .table td, .table th {
       border-color: rgba(140, 130, 115, 0.13);
   }
   tr:first-child th, tr:first-child td {
       border-top: none;
       padding-top: 0;
   }
   .video-js, .vjs-tech, div.vjs-poster > picture > img {
     border-radius: 0.375rem;
     height: 100%!important;
   }
   .video-js .vjs-control-bar {
     border-bottom-left-radius: 0.375rem;
     border-bottom-right-radius: 0.375rem;
   }
   .vjs-poster img {
     -o-object-fit: cover!important;
     object-fit: cover!important;
   }
   @media (max-width: 540px) {
       .btn-block {
           width: 100%;
       }
       .table th {
           min-width: auto;
           width: 30px !important;
       }
       .tth {
           display: none;
       }
   }
   @media (max-width: 768px) {
       .table th {
           width: 8rem;
       }
       .table td, .table th {
           padding: .75rem 0;
       }
       td {
           max-width: 200px;
       }
   }
   a {
     text-decoration: none!important;
   }
 </style>
  <script src="${app_js_file}"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked@5.1.1/lib/marked.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
</head>
<body class="d-flex flex-column min-vh-100 bg-zers">
</body>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-p34f1UUtsS3wqzfto5wAAmdvj+osOnFyQFpp4Ua3gs/ZVWx6oOypYoCJhGGScy+8" crossorigin="anonymous"></script>
  </html>`;
};

const homepage = `<!DOCTYPE html>
<html>
 <head>
 <meta charset="utf-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no">
 <title>${uiConfig.siteName}</title>
 <meta name="robots" content="noindex">
 <link rel="icon" href="${uiConfig.favicon}">
 <script>
   window.drive_names = JSON.parse('${JSON.stringify(authConfig.roots.map(it => it.name))}');
   window.UI = JSON.parse('${JSON.stringify(uiConfig)}');
 </script>
 <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
 <link href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.2/dist/${uiConfig.theme}/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous"><script>
 document.addEventListener('DOMContentLoaded', function() {
   document.addEventListener('contextmenu', function(e) {
     e.preventDefault();
   });

   document.addEventListener('keydown', function(e) {
     if (
       e.code === 'F12' ||
       (e.ctrlKey && e.shiftKey && e.code === 'KeyI') ||
       (e.ctrlKey && e.code === 'KeyU') ||
       e.code === 'PrintScreen' ||
       (e.altKey && e.code === 'F12') ||
       (e.metaKey && e.altKey && e.code === 'KeyU')
     ) {
       e.preventDefault();
     }

     if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
       e.preventDefault();
     }
   });

   var touchStartTime;
   document.addEventListener('touchstart', function(e) {
     touchStartTime = Date.now();
     if (e.touches.length > 1) {
       e.preventDefault();
     }
   }, { passive: false });

   document.addEventListener('touchend', function(e) {
     if (Date.now() - touchStartTime > 500) {
       e.preventDefault();
     }
   });

   document.addEventListener('dragstart', function(e) {
     if (e.target.tagName === 'IMG') {
       e.preventDefault();
     }
   });

   if (window.self !== window.top) {
     window.top.location = window.self.location;
   }
 });
  </script>
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer">
 <style>
   body.modal-open {
     padding-right: 0px !important;
   }
   .bg-zers {
       position: relative;
   }
   .bg-zers::before {
       content: '';
       position: fixed;
       width: 100%;
       height: 100vh;
       top: 0;
       left: 0;
       background-image: url('/pattern-32.svg'),
           linear-gradient(#61045F, transparent),
           linear-gradient(to top left, lime, transparent),
           linear-gradient(to top right, blue, transparent);
       background-size: contain;
       background-position: left;
       background-repeat: repeat-x;
       background-blend-mode: darken;
       will-change: transform;
   }
   .back-to-top {
     background: rgba(0,0,0,.4);
     position: fixed;
     bottom: 85px;
     right: -5px;
     display: none;
     z-index: 2;
   }
   .breadcrumb {
     margin-bottom: 0;
     background: transparent;
     overflow: auto;
     white-space: nowrap;
     display: block;
   }
   .breadcrumb .breadcrumb-item {
     display: inline;
   }
   .breadcrumb-item+.breadcrumb-item::before {
     float: none;
   }
   .card {
       background: rgba(0, 0, 0, 0.65);
       box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
   }
   .list-group-item, .list-group-item.disabled, .list-group-item:disabled {
       background: transparent;
   }
   .list-group-item-action:focus, .list-group-item-action:hover {
       background-color: rgb(216 216 216 / 20%);
   }
   .card-header, .card-footer {
       background-color: rgba(0, 0, 0, 0.40);
       border-color: rgba(140, 130, 115, 0.13);
   }
   .modal-header, .modal-footer, .list-group-item, .input-group-text {
       border-color: rgba(140, 130, 115, 0.13);
   }
   .navbar {
     border-radius: 0 0 .5rem .5rem;
     border: 0.5px solid rgba(140, 130, 115, 0.13);
     box-shadow: 0 16px 48px 0 rgba(0, 0, 0, 0.5);
     border-top: none;
     background: rgba(24, 26, 27, 0.5);
   }
   .navbar::before {
     content: '';
     position: absolute;
     width: 100%;
     height: 100%;
     top: 0;
     left: 0;
     backdrop-filter: blur(5px);
     -webkit-backdrop-filter: blur(5px);
     z-index: -1;
     border-radius: 0 0 .5rem .5rem;
   }
   .alert, .card, .dropdown-menu, .modal-content {
       border-radius: .5rem;
       border-color: rgba(140, 130, 115, 0.13);
   }
   .dropdown-item:focus, .dropdown-item:hover {
     background-color: #007053;
   }
   .donate {
     position: relative;
     width: fit-content;
     margin: auto;
   }
   .donate .qrcode {
       display: none;
       position: absolute;
       z-index: 99;
       bottom: 2.8em;
       overflow: hidden;
       border-radius: .5rem;
       width: max-content;
       left: 50%;
       transform: translateX(-50%);
   }
   .donate:hover .qrcode {
       display: block
   }
   .dropdown-menu, .qrcode {
       box-shadow: 0px 16px 48px 0px rgba(0,0,0,0.5)
   }
   .fa, .fab, .fas, .fa-regular, .fa-solid {
       margin-right: 0.5rem;
   }
   .form-control, .form-select, .form-control:disabled, .form-control:read-only, .form-control:focus {
     color: rgb(189, 183, 175);
     background: transparent;
     border-color: rgba(140, 130, 115, 0.13);
     box-shadow: none;
   }
   footer {
       border-radius: .4rem .4rem 0 0;
       border: 1px solid rgba(140, 130, 115, 0.13);
       box-shadow: 0 -16px 48px 0 rgba(0, 0, 0, 0.5);
       margin-top: auto;
   }
   footer, .dropdown-menu, .modal-content, .qrcode {
       background: rgba(24, 26, 27, 0.2);
       backdrop-filter: blur(5px);
       -webkit-backdrop-filter: blur(5px);
   }
   .hover-overlay {
     position: absolute;
     width: 100%;
     height: 100%;
     background: rgba(0, 0, 0);
     opacity: 0;
    }
   .hover-overlay:hover {
     opacity: .9;
   }
   .overlay {
     position: absolute;
     width: 100%;
     height: 100%;
     background: rgba(0, 0, 0);
     opacity: .9;
   }
   table {
       word-break: break-word;
   }
   .table {
       --bs-table-bg: unset;
   }
   .table th {
       min-width: 8rem;
   }
   .table td, .table th {
       border-color: rgba(140, 130, 115, 0.13);
   }
   tr:first-child th, tr:first-child td {
       border-top: none;
       padding-top: 0;
   }
   .video-js, .vjs-tech, div.vjs-poster > picture > img {
     border-radius: 0.375rem;
     height: 100%!important;
   }
   .video-js .vjs-control-bar {
     border-bottom-left-radius: 0.375rem;
     border-bottom-right-radius: 0.375rem;
   }
   .vjs-poster img {
     -o-object-fit: cover!important;
     object-fit: cover!important;
   }
   @media (max-width: 540px) {
       .btn-block {
           width: 100%;
       }
       .table th {
           min-width: auto;
           width: 30px !important;
       }
       .tth {
           display: none;
       }
   }
   @media (max-width: 768px) {
       .table th {
           width: 8rem;
       }
       .table td, .table th {
           padding: .75rem 0;
       }
       td {
           max-width: 200px;
       }
   }
   a {
     text-decoration: none!important;
   }
 </style>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
 </head>
 <body class="d-flex flex-column min-vh-100 bg-zers">
 <header>
 <div id="nav">
 <nav class="navbar navbar-expand-lg${uiConfig.fixed_header ?' fixed-top': ''} ${uiConfig.header_style_class} container">
 <div class="container-fluid mx-2">
 <a class="navbar-brand d-flex align-items-center gap-2" href="/">${uiConfig.logo_image ? '<img border="0" alt="'+uiConfig.company_name+'" src="'+uiConfig.logo_link_name+'" height="'+uiConfig.logo_height+'" width="'+uiConfig.logo_width+'">'+uiConfig.siteName : uiConfig.logo_link_name}</a>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
  <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
   <ul class="navbar-nav me-auto mb-2 mb-lg-0">
    <li class="nav-item">
      <a class="nav-link" href="/"><i class="fas fa-home fa-fw"></i>${uiConfig.nav_link_1}</a>
    </li>
    <li class="nav-item dropdown">
        <div class="dropdown-menu" aria-labelledby="navbarDropdown"><a class="dropdown-item" href="/">&gt; ${uiConfig.nav_link_1}</a></div>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="${uiConfig.contact_link}" target="_blank"><i class="fas fa-paper-plane fa-fw"></i>${uiConfig.nav_link_4}</a>
    </li>
         ${uiConfig.show_logout_button ?'<li class="nav-item"><a class="nav-link" href="/logout"><i class="fa-solid fa-arrow-right-from-bracket fa-fw"></i>Logout</a></li>': ''}
        </ul>
        <form class="d-flex" method="get" action="/0:search">
        <div class="input-group">
        <input class="form-control" name="q" type="search" placeholder="Search" aria-label="Search" value="" required="" aria-describedby="button-addon2" style="border-right:0;">
        <button class="btn ${uiConfig.search_button_class}" onclick="if($('#search_bar_form>input').val()) $('#search_bar_form').submit();" type="submit" id="button-addon2" style="border-color: rgba(140, 130, 115, 0.13); border-left:0;"><i class="fas fa-search" style="margin: 0;color:success"></i></button>
        </div>
       </form>
       </div>
      </div>
   </nav>
  </div>
 </header>
 <div class="container flex-grow-1" style="margin-top: ${uiConfig.header_padding}px; margin-bottom: 60px;">
 <div class="row align-items-start g-3">
 <div class="col-md-12">
 <div class="card" style="padding: 0 0 0.3rem 0;border-radius:.5rem;width:100%;overflow:hidden;">
 <div style="display: flex; justify-content: center; align-items: center; height: 40px; overflow: hidden;">
 <marquee behavior="scroll" direction="left" scrollamount="6" style="color:white; font-weight:bold; font-size: 16px; text-shadow: 0 0 5px rgba(0,0,0,0.7); line-height: 40px; width: 100%;">
   ִֶָ 𓂃˖˳·˖ ִֶָ ⋆🌷͙⋆ ִֶָ˖·˳˖𓂃 ִֶָ&nbsp;&nbsp;&nbsp;வணக்கம்&nbsp;&nbsp;&nbsp;நண்பர்களே,&nbsp;&nbsp;&nbsp;⋆.˚🦋༘⋆&nbsp;&nbsp;&nbsp;தமிழன்&nbsp;&nbsp;&nbsp;திரைப்படங்களுக்கு&nbsp;&nbsp;&nbsp;˙✧˖°🍿 ༘ 🎬⋆｡°&nbsp;&nbsp;&nbsp;உங்களை&nbsp;&nbsp;&nbsp;அன்புடன்&nbsp;&nbsp;&nbsp;வரவேற்கிறோம்!&nbsp;&nbsp;&nbsp;⊱🪷⊰˚&nbsp;&nbsp;&nbsp;உங்கள்&nbsp;&nbsp;&nbsp;அன்பு&nbsp;&nbsp;&nbsp;மற்றும்&nbsp;&nbsp;&nbsp;ஆதரவுக்கு&nbsp;&nbsp;&nbsp;நன்றி.&nbsp;&nbsp;&nbsp;༄˖°.🍂.ೃ࿔*:･🙌
 </marquee>
 </div>
  </div>
    </div>
     <div class="col-md-12">
       <div id="content">
       <div id="list" class="list-group text-break">
       </div>
       </div>
     </div>
   </div>

   <div class="modal fade" id="SearchModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="SearchModelLabel" aria-hidden="true">
     <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
       <div class="modal-content">
         <div class="modal-header">
         <h5 class="modal-title" id="SearchModelLabel"></h5>
         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
         <span aria-hidden="true"></span>
         </button>
         </div>
         <div class="modal-body" id="modal-body-space">
         </div>
         <div class="modal-footer justify-content-center" id="modal-body-space-buttons">
         </div>
       </div>
     </div>
   </div>
  </div>
  <button id="back-to-top" class="btn btn-secondary btn-lg back-to-top shadow border border-light" style="--bs-border-opacity: .4;" role="button"><i class="fas fa-chevron-up m-0"></i></button>

   <footer class="footer text-center mt-auto container" style="display:block;">
       <div class="container" style="padding-top: 15px;">
           <div class="row">
               <div class="col-lg-4 col-md-12 text-lg-start">
                   <i class="fa-brands fa-pied-piper-alt"></i> ${uiConfig.copyright_year} - <a href="${uiConfig.company_link}" target="_blank">${uiConfig.company_name}</a> with ❤️
               </div>
               <div class="col-lg-4 col-md-12">
                   <a href="/dmca" title="Please allow us up to 48 hours to process DMCA requests.">DMCA</a>
                   ${uiConfig.credit ? '<span>© All Copy Rights Reserved ®™</span>' : ''}
               </div>
               <div class="col-lg-4 col-md-12 text-lg-end">
                   <p>
                       <a href="#"><img id="hits" src=""/></a>
                   </p>
                   <script>document.getElementById("hits").src="https://hitscounter.dev/api/hit?url=https%3A%2F%2F" + window.location.host + "&label=hits&icon=bar-chart-fill&color=%23198754";</script>
               </div>
           </div>
       </div>
     </footer>
      </body>
     <script src="/assets/homepage.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-p34f1UUtsS3wqzfto5wAAmdvj+osOnFyQFpp4Ua3gs/ZVWx6oOypYoCJhGGScy+8" crossorigin="anonymous"></script>
    </html>`;

const dmca_page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  <title>DMCA Copyright Policy - Tamizhan Movies</title>
  <link rel="icon" href="/favicon.ico">
  <link href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.2/dist/darkly/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" crossorigin="anonymous">
  <style>
      * {-webkit-tap-highlight-color: transparent;}
      body {margin: 0;padding: 0;min-height: 100vh;color: #fff;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;overflow-x: hidden;}
      body.modal-open {padding-right: 0px !important;}
      .bg-zers {position: relative;min-height: 100vh;}
      .bg-zers::before {content: '';position: fixed;width: 100%;height: 100vh;top: 0;left: 0;background-image: url('/pattern-33.svg'),linear-gradient(#61045F, transparent),linear-gradient(to top left, red, transparent),linear-gradient(to top right, blue, transparent);background-size: contain;background-position: left;background-repeat: repeat-x;background-blend-mode: darken;will-change: transform;}
      .back-to-top {background: rgba(0,0,0,.4);position: fixed;bottom: 85px;right: -5px;display: none;z-index: 2;}
      .navbar {border-radius: 0 0 .5rem .5rem;border: 1px solid rgba(140, 130, 115, 0.13);box-shadow: 0 16px 48px 0 rgba(0, 0, 0, 0.5);border-top: none;background: rgba(24, 26, 27, 0.5);}
      .navbar::before {content: '';position: absolute;width: 100%;height: 100%;top: 0;left: 0;backdrop-filter: blur(5px);-webkit-backdrop-filter: blur(5px);z-index: -1;border-radius: 0 0 .5rem .5rem;}
      .card {background: rgba(0, 0, 0, 0.65);box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);border-radius: .5rem;border-color: rgba(140, 130, 115, 0.13);}
      footer {border-radius: .5rem .5rem 0 0;border: 1px solid rgba(140, 130, 115, 0.13);box-shadow: 0 -16px 48px 0 rgba(0, 0, 0, 0.5);background: rgba(24, 26, 27, 0.2);backdrop-filter: blur(5px);-webkit-backdrop-filter: blur(5px);}
      a {text-decoration: none !important;}
      .dmca-content {padding: 40px;animation: fadeIn 0.5s ease-in;margin-bottom: 0;}
      @keyframes fadeIn {from {opacity: 0;transform: translateY(20px);} to {opacity: 1;transform: translateY(0);}}
      .dmca-content h1 {font-size: 2.5rem;font-weight: 700;margin-bottom: 30px;color: #fff;text-align: center;text-shadow: 2px 2px 4px rgba(0,0,0,0.5);}
      .dmca-content h2 {font-size: 1.5rem;font-weight: 600;margin: 30px 0 15px;color: #26d0ce;border-bottom: 2px solid #26d0ce;padding-bottom: 8px;}
      .dmca-content h3 {font-size: 1.2rem;font-weight: 600;margin: 20px 0 10px;}
      .dmca-content p {line-height: 1.8;margin-bottom: 20px;color: rgba(255, 255, 255, 0.9);font-size: 1.05rem;}
      .dmca-content ol {padding-left: 25px;margin-bottom: 25px;}
      .dmca-content ol li {margin-bottom: 15px;line-height: 1.8;color: rgba(255, 255, 255, 0.9);font-size: 1.05rem;}
      .dmca-content ol li strong {color: #26d0ce;display: block;margin-bottom: 5px;}
      .highlight-section {background: linear-gradient(135deg, rgba(38, 208, 206, 0.1), rgba(97, 4, 95, 0.1));border-left: 4px solid #26d0ce;padding: 25px;margin: 30px 0;border-radius: 8px;border: 1px solid rgba(38, 208, 206, 0.3);}
      .email-link {color: #26d0ce;text-decoration: none;font-weight: 600;font-size: 1.1rem;word-break: break-all;transition: all 0.3s ease;}
      .email-link:hover {color: #1fa09e;text-decoration: underline;}
      .contact-info {background: rgba(255, 255, 255, 0.05);padding: 20px;border-radius: 8px;margin: 20px 0;border: 1px solid rgba(255, 255, 255, 0.1);}
      .warning-box {background: linear-gradient(135deg, rgba(255, 87, 87, 0.1), rgba(255, 87, 87, 0.05));border: 1px solid rgba(255, 87, 87, 0.3);border-left: 4px solid #ff5757;padding: 20px;border-radius: 8px;margin: 25px 0;}
      .warning-box h3 {color: #ff5757;margin-top: 0;}
      code {background: rgba(255, 255, 255, 0.1);padding: 3px 8px;border-radius: 4px;font-size: 0.9em;color: #26d0ce;word-break: break-all;}
      @media (max-width: 768px) {.dmca-content {padding: 25px 18px;}.dmca-content h1 {font-size: 1.8rem;margin-bottom: 20px;}.dmca-content h2 {font-size: 1.3rem;margin: 20px 0 12px;}.dmca-content h3 {font-size: 1.1rem;}.dmca-content p,.dmca-content ol li {font-size: 0.95rem;line-height: 1.6;}.highlight-section,.warning-box {padding: 15px;margin: 18px 0;}.contact-info {padding: 15px;}.email-link {font-size: 1rem;}.dmca-content ol {padding-left: 15px;}}
      @media (max-width: 480px) {.dmca-content {padding: 20px 15px;}.dmca-content h1 {font-size: 1.5rem;}.dmca-content h2 {font-size: 1.2rem;}.dmca-content h3 {font-size: 1rem;}.dmca-content p,.dmca-content ol li {font-size: 0.9rem;}}
      @media (hover: none) and (pointer: coarse) {.email-link:active,.back-to-top:active {opacity: 0.7;}}
  </style>
</head>
<body class="d-flex flex-column min-vh-100 bg-zers">
<header>
  <div id="nav">
      <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark-info-transparent container">
          <div class="container-fluid mx-2">
              <a class="navbar-brand d-flex align-items-center gap-2">
                  <img border="0" alt="Tamizhan Movies" src="/logo.png" height="40px" width="40px">
                  Tamizhan&nbsp;Movies
              </a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                      <li class="nav-item">
                          <a class="nav-link" href="/"><i class="fas fa-home fa-fw"></i>&nbsp;&nbsp;Home</a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link" href="https://telegram.me/TM_Links_Provide_bot" target="_blank"><i class="fas fa-paper-plane fa-fw"></i>&nbsp;&nbsp;Contact</a>
                      </li>
                  </ul>
              </div>
          </div>
      </nav>
  </div>
</header>

<div class="container" style="margin-top: 103px; margin-bottom: 0;">
  <div class="row align-items-start g-3">
      <div class="col-md-12">
          <div class="card" style="padding: 0;border-radius:.5rem;width:100%;overflow:hidden;">
              <div style="display: flex; justify-content: center; align-items: center; height: 40px; overflow: hidden;">
                  <marquee behavior="scroll" direction="left" scrollamount="6" style="color:white; font-weight:bold; font-size: 16px; text-shadow: 0 0 5px rgba(0,0,0,0.7); line-height: 40px; width: 100%;">
                  ִֶָ 𓂃˖˳·˖ ִֶָ ⋆🌷͙⋆ ִֶָ˖·˳˖𓂃 ִֶָ&nbsp;&nbsp;&nbsp;வணக்கம்&nbsp;&nbsp;&nbsp;நண்பர்களே,&nbsp;&nbsp;&nbsp;⋆.˚🦋༘⋆&nbsp;&nbsp;&nbsp;தமிழன்&nbsp;&nbsp;&nbsp;திரைப்படங்களுக்கு&nbsp;&nbsp;&nbsp;˙✧˖°🍿 ༘ 🎬⋆｡°&nbsp;&nbsp;&nbsp;உங்களை&nbsp;&nbsp;&nbsp;அன்புடன்&nbsp;&nbsp;&nbsp;வரவேற்கிறோம்!&nbsp;&nbsp;&nbsp;⊱🪷⊰˚&nbsp;&nbsp;&nbsp;உங்கள்&nbsp;&nbsp;&nbsp;அன்பு&nbsp;&nbsp;&nbsp;மற்றும்&nbsp;&nbsp;&nbsp;ஆதரவுக்கு&nbsp;&nbsp;&nbsp;நன்றி.&nbsp;&nbsp;&nbsp;༄˖°.🍂.ೃ࿔*:･🙌
                  </marquee>
              </div>
          </div>
      </div>
  </div>
</div>

<div class="container" style="padding-top: 15px; padding-bottom: 30px; margin-bottom: 0;">
  <div class="row align-items-start g-3">
      <div class="col-md-12">
          <div class="card" style="padding: 0;border-radius:.5rem;width:100%;overflow:hidden;">
              <div class="dmca-content">
                  <h1><i class="fas fa-copyright"></i> DMCA Copyright Policy</h1>

                  <div class="warning-box">
                      <h3><i class="fas fa-exclamation-triangle"></i> Important Notice</h3>
                      <p>Tamizhan Movies respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act ("DMCA"), we will respond expeditiously to claims of copyright infringement.</p>
                  </div>

                  <h2><i class="fas fa-gavel"></i> Copyright Infringement Notification</h2>
                  <p>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible through our service, you may notify our copyright agent as set forth in the DMCA.</p>

                  <p>To file a copyright infringement notification with us, you will need to send a written communication that includes substantially the following:</p>

                  <ol>
                      <li><strong>Identification of the copyrighted work:</strong> A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                      <li><strong>Identification of the infringing material:</strong> Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works at a single online site are covered by a single notification, a representative list of such works at that site.</li>
                      <li><strong>Location of infringing material:</strong> Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit the service provider to locate the material.</li>
                      <li><strong>Contact information:</strong> Information reasonably sufficient to permit the service provider to contact the complaining party, such as an address, telephone number, and, if available, an electronic mail address at which the complaining party may be contacted.</li>
                      <li><strong>Good faith statement:</strong> A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
                      <li><strong>Accuracy statement:</strong> A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                  </ol>

                  <div class="highlight-section">
                      <h3><i class="fas fa-paper-plane"></i> Submit Your DMCA Notice</h3>
                      <p><strong>Please provide the complete URL when filing a DMCA complaint:</strong></p>
                      <p>Example: <code>https://tamizhan-movies.site/fallback?id=xxxxxxxxxxxxxxxx&a=view</code></p>
                      <p>Written notice should be sent to our designated agent at:</p>
                      <div class="contact-info">
                          <p><i class="fas fa-envelope"></i> <strong>Email:</strong> <a href="mailto:tamizhan-movies@googlegroups.com" class="email-link">tamizhan-movies@googlegroups.com</a></p>
                          <p><i class="fas fa-clock"></i> <strong>Response Time:</strong> Please allow us up to 48 hours to process your request.</p>
                      </div>
                  </div>

                  <h2><i class="fas fa-user-shield"></i> Counter-Notification</h2>
                  <p>If you believe that your material has been removed by mistake or misidentification, you may file a counter-notification. Please provide:</p>
                  <ol>
                      <li>Your physical or electronic signature</li>
                      <li>Identification of the material that has been removed</li>
                      <li>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake</li>
                      <li>Your name, address, and telephone number</li>
                      <li>A statement consenting to the jurisdiction of your local Federal District Court</li>
                  </ol>

                  <div class="warning-box">
                      <h3><i class="fas fa-exclamation-circle"></i> False Claims Warning</h3>
                      <p>Please note that under 17 U.S.C. § 512(f), any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability. Please consider whether fair use, fair dealing, or a similar exception to copyright applies before you send a takedown notice.</p>
                  </div>

                  <h2><i class="fas fa-sync-alt"></i> Repeat Infringer Policy</h2>
                  <p>In accordance with the DMCA and other applicable law, Tamizhan Movies has adopted a policy of terminating, in appropriate circumstances and at our sole discretion, users who are deemed to be repeat infringers. We may also at our sole discretion limit access to the service and/or terminate the accounts of any users who infringe any intellectual property rights of others, whether or not there is any repeat infringement.</p>
              </div>
          </div>
      </div>
  </div>
</div>

<button id="back-to-top" class="btn btn-secondary btn-lg back-to-top shadow border border-light" style="--bs-border-opacity: .4;" role="button"><i class="fas fa-chevron-up m-0"></i></button>

<footer class="footer text-center mt-auto container" style="display:block;">
  <div class="container" style="padding-top: 15px;">
      <div class="row">
          <div class="col-lg-4 col-md-12 text-lg-start">
              <i class="fa-brands fa-pied-piper-alt"></i> ${uiConfig.copyright_year} - <a href="${uiConfig.company_link}" target="_blank">${uiConfig.company_name}</a> with ❤️
          </div>
          <div class="col-lg-4 col-md-12">
              <a href="/dmca" title="Please allow us up to 48 hours to process DMCA requests.">DMCA</a>
              ${uiConfig.credit ? '<span>© All Copy Rights Reserved ®™</span>' : ''}
          </div>
          <div class="col-lg-4 col-md-12 text-lg-end">
              <p>
                  <a href="#"><img id="hits" src=""/></a>
              </p>
              <script>document.getElementById("hits").src="https://hitscounter.dev/api/hit?url=https%3A%2F%2F" + window.location.host + "&label=hits&icon=bar-chart-fill&color=%23198754";</script>
          </div>
      </div>
  </div>
</footer>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js" type="text/javascript"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
<script>
  let btt = document.getElementById("back-to-top");
  window.onscroll = function () { scrollFunction(); };
  function scrollFunction() {
      if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
          btt.style.display = "block";
      } else { btt.style.display = "none"; }
  }
  btt.addEventListener("click", backToTop);
  function backToTop() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
  }
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
  document.addEventListener('keydown', function(e) {
      if ( e.code === 'F12' || (e.ctrlKey && e.shiftKey && e.code === 'KeyI') || (e.ctrlKey && e.code === 'KeyU') || e.code === 'PrintScreen' || (e.altKey && e.code === 'F12') || (e.metaKey && e.altKey && e.code === 'KeyU') ) { e.preventDefault(); }
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') { e.preventDefault(); }
  });
  var touchStartTime;
  document.addEventListener('touchstart', function(e) {
      touchStartTime = Date.now();
      if (e.touches.length > 1) { e.preventDefault(); }
  }, { passive: false });
  document.addEventListener('touchend', function(e) {
      if (Date.now() - touchStartTime > 500) { e.preventDefault(); }
  });
  document.addEventListener('dragstart', function(e) {
      if (e.target.tagName === 'IMG') { e.preventDefault(); }
  });
  if (window.self !== window.top) { window.top.location = window.self.location; }
</script>
</body>
</html>`;

const login_html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  <title>${uiConfig.siteName} - Login</title>
  <meta name="robots" content="noindex">
  <link rel="icon" href="${uiConfig.favicon}">
  <link href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.2/dist/darkly/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" crossorigin="anonymous">
  <style>
      * {
          -webkit-tap-highlight-color: transparent;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
      }

      body {
          margin: 0;
          padding: 0;
          min-height: 100vh;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          overflow-x: hidden;
      }

      body.modal-open {
          padding-right: 0px !important;
      }

      /* Original Background */
      .bg-zers {
          position: relative;
          min-height: 100vh;
      }

      .bg-zers::before {
          content: '';
          position: fixed;
          width: 100%;
          height: 100vh;
          top: 0;
          left: 0;
          background-image: url('/pattern-32.svg'),
              linear-gradient(#61045F, transparent),
              linear-gradient(to top left, lime, transparent),
              linear-gradient(to top right, blue, transparent);
          background-size: contain;
          background-position: left;
          background-repeat: repeat-x;
          background-blend-mode: darken;
          will-change: transform;
      }

      /* Header Styles */
      .navbar {
        border-radius: 0 0 .5rem .5rem;
        border: 1px solid rgba(140, 130, 115, 0.13);
        box-shadow: 0 16px 48px 0 rgba(0, 0, 0, 0.5);
        border-top: none;
        background: rgba(24, 26, 27, 0.5);
      }
      .navbar::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        z-index: -1;
        border-radius: 0 0 .5rem .5rem;
      }

      /* Card Styles */
      .card {
          background: rgba(0, 0, 0, 0.65);
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
          border-radius: .5rem;
          border-color: rgba(140, 130, 115, 0.13);
      }

      /* Footer */
      footer {
          border-radius: .5rem .5rem 0 0;
          border: 1px solid rgba(140, 130, 115, 0.13);
          box-shadow: 0 -16px 48px 0 rgba(0, 0, 0, 0.5);
          background: rgba(24, 26, 27, 0.2);
          backdrop-filter: blur(5px);
      }

      a {
          text-decoration: none !important;
      }

      /* Login Modal */
      .login-modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          z-index: 2000;
          align-items: center;
          justify-content: center;
      }

      .login-modal.active {
          display: flex;
      }

      .login-card {
          background: rgba(30, 30, 46, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 40px;
          max-width: 400px;
          width: 90%;
          backdrop-filter: blur(20px);
          position: relative;
      }

      .close-modal {
          position: absolute;
          right: 20px;
          top: 20px;
          font-size: 24px;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: color 0.3s ease;
      }

      .close-modal:hover {
          color: #ffffff;
      }

      .modal-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
          text-align: center;
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
      }

      .modal-subtitle {
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 30px;
          font-size: 16px;
          line-height: 1.5;
      }

      .form-group {
          margin-bottom: 20px;
      }

      .form-label {
          display: block;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
      }

      .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #ffffff;
          padding: 12px 16px;
          font-size: 16px;
          transition: border-color 0.3s ease;
      }

      .form-input:focus {
          outline: none;
          border-color: #007bff;
      }

      .submit-btn {
          width: 100%;
          background: #007bff;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
          margin-top: 10px;
      }

      .submit-btn:hover {
          background: #0056b3;
      }

      .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
      }

      .error-message {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.3);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
          color: #dc3545;
          display: none;
      }

      .loading {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
      }

      @keyframes spin {
          to { transform: rotate(360deg); }
      }

      /* Search Section */
      .main-content {
          min-height: 60vh;
          padding: 40px 20px;
      }

      .search-box {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 8px;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          transition: all 0.3s ease;
      }

      .search-box:focus-within {
          border-color: #28a745;
          box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.25);
      }

      .search-form {
          display: flex;
          gap: 8px;
      }

      .search-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          padding: 12px 16px;
          font-size: 16px;
          outline: none;
      }

      .search-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
      }

      .search-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
      }

      .search-btn:hover {
          background: #218838;
          transform: translateY(-1px);
      }

      /* Enhanced Movie Grid with Professional Cards */
      .trending-section {
          margin-bottom: 40px;
      }

      .section-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #fff;
          text-align: center;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      }

      .section-subtitle {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 25px;
          font-size: 14px;
      }

      /* Professional Movie Grid */
      .movies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
      }

      .movie-card {
          background: linear-gradient(135deg, rgba(38, 208, 206, 0.1), rgba(97, 4, 95, 0.1));
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid rgba(38, 208, 206, 0.2);
          position: relative;
          aspect-ratio: 2/3;
      }

      .movie-card:hover {
          transform: translateY(-8px) scale(1.03);
          border-color: #26d0ce;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
      }

      .movie-poster-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
      }

      .movie-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
      }

      .movie-card:hover .movie-poster {
          transform: scale(1.1);
      }

      .movie-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.9) 90%);
          display: flex;
          align-items: flex-end;
          padding: 15px;
          opacity: 1;
          transition: opacity 0.3s ease;
      }

      .movie-info {
          width: 100%;
          transform: translateY(0);
          transition: transform 0.3s ease;
      }

      .movie-card:hover .movie-info {
          transform: translateY(-5px);
      }

      .movie-title {
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: #ffffff;
          line-height: 1.3;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
      }

      .movie-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
      }

      .movie-year {
          color: #28a745;
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(40, 167, 69, 0.2);
          padding: 3px 8px;
          border-radius: 10px;
          border: 1px solid rgba(40, 167, 69, 0.3);
      }

      .quality-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 6px;
          border-radius: 6px;
          text-transform: uppercase;
      }

      .quality-4k {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
      }

      .quality-hd {
          background: linear-gradient(135deg, #4834d4, #686de0);
          color: white;
      }

      .quality-hdr {
          background: linear-gradient(135deg, #e1b12c, #fbc531);
          color: black;
      }

      .movie-quality {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
      }

      /* Golden Premium Features */
      .highlight-section {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(218, 165, 32, 0.1));
          border-left: 4px solid #FFD700;
          padding: 20px;
          margin: 30px 0;
          border-radius: 8px;
          border: 1px solid rgba(255, 215, 0, 0.3);
      }

      .highlight-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #FFD700;
          display: flex;
          align-items: center;
          gap: 10px;
      }

      .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
      }

      .feature-list li {
          padding: 6px 0;
          color: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
      }

      .feature-list li i {
          color: #FFD700;
          font-size: 0.8rem;
      }

      /* Back to Top */
      .back-to-top {
          background: rgba(0,0,0,.4);
          position: fixed;
          bottom: 85px;
          right: -5px;
          display: none;
          z-index: 2;
      }

      /* Lazy loading styles */
      .lazy-load {
          opacity: 0;
          transition: opacity 0.3s ease;
      }

      .lazy-load.loaded {
          opacity: 1;
      }

      .loading-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 8px;
      }

      @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
      }

      @media (max-width: 768px) {
          .search-form {
              flex-direction: column;
          }

          .search-btn {
              width: 100%;
          }

          .section-title {
              font-size: 1.5rem;
          }

          .movies-grid {
              grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
              gap: 15px;
          }

          .movie-title {
              font-size: 0.8rem;
          }

          .login-card {
              padding: 30px 20px;
          }

          .main-content {
              padding: 20px;
          }
      }

      @media (max-width: 480px) {
          .movies-grid {
              grid-template-columns: repeat(2, 1fr);
          }

          .section-title {
              font-size: 1.3rem;
          }
      }
  </style>
</head>
<body class="d-flex flex-column min-vh-100 bg-zers">
<header>
<div id="nav">
      <nav class="navbar navbar-expand-lg fixed-top ${uiConfig.header_style_class} container">
          <div class="container-fluid mx-2">
              <a class="navbar-brand d-flex align-items-center gap-2">
                  <img border="0" alt="Tamizhan Movies" src="/logo.png" height="40px" width="40px">
                  Tamizhan&nbsp;Movies
              </a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                      <li class="nav-item">
                          <a class="nav-link" href="/"><i class="fas fa-home fa-fw"></i>&nbsp;&nbsp;Home</a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link" href="https://telegram.me/TM_Links_Provide_bot" target="_blank"><i class="fas fa-paper-plane fa-fw"></i>&nbsp;&nbsp;Contact</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#" id="openLoginModal" style="cursor: pointer;">
                        <i class="fa-solid fa-user fa-fw"></i>&nbsp;&nbsp;Login
                       </a>
                     </li>
                  </ul>
              </div>
          </div>
      </nav>
  </div>
</header>

<div class="container" style="margin-top: 103px; margin-bottom: 0;">
  <div class="row align-items-start g-3">
      <div class="col-md-12">
          <div class="card" style="padding: 0;border-radius:.5rem;width:100%;overflow:hidden;">
              <div style="display: flex; justify-content: center; align-items: center; height: 40px; overflow: hidden;">
                  <marquee behavior="scroll" direction="left" scrollamount="6" style="color:white; font-weight:bold; font-size: 16px; text-shadow: 0 0 5px rgba(0,0,0,0.7); line-height: 40px; width: 100%;">
                  ִֶָ 𓂃˖˳·˖ ִֶָ ⋆🌷͙⋆ ִֶָ˖·˳˖𓂃 ִֶָ&nbsp;&nbsp;&nbsp;வணக்கம்&nbsp;&nbsp;&nbsp;நண்பர்களே,&nbsp;&nbsp;&nbsp;⋆.˚🦋༘⋆&nbsp;&nbsp;&nbsp;தமிழன்&nbsp;&nbsp;&nbsp;திரைப்படங்களுக்கு&nbsp;&nbsp;&nbsp;˙✧˖°🍿 ༘ 🎬⋆｡°&nbsp;&nbsp;&nbsp;உங்களை&nbsp;&nbsp;&nbsp;அன்புடன்&nbsp;&nbsp;&nbsp;வரவேற்கிறோம்!&nbsp;&nbsp;&nbsp;⊱🪷⊰˚&nbsp;&nbsp;&nbsp;உங்கள்&nbsp;&nbsp;&nbsp;அன்பு&nbsp;&nbsp;&nbsp;மற்றும்&nbsp;&nbsp;&nbsp;ஆதரவுக்கு&nbsp;&nbsp;&nbsp;நன்றி.&nbsp;&nbsp;&nbsp;༄˖°.🍂.ೃ࿔*:･🙌
                  </marquee>
              </div>
          </div>
      </div>
  </div>
</div>

<!-- Main Content Area -->
<div class="container" style="padding-top: 15px; padding-bottom: 30px; margin-bottom: 0;">
  <div class="row align-items-start g-3">
      <div class="col-md-12">
          <div class="card" style="padding: 0;border-radius:.5rem;width:100%;overflow:hidden;">
              <div class="main-content">
                  <!-- Search Box -->
                  <div class="search-box">
                      <form class="search-form" id="searchForm">
                          <input
                              type="text"
                              class="search-input"
                              placeholder="Search Movies, Web Series, Documentaries..."
                              id="searchInput"
                              autocomplete="off"
                          >
                          <button type="submit" class="search-btn">
                              <i class="fas fa-search"></i>
                              Search
                          </button>
                      </form>
                  </div>

                  <!-- Enhanced Movie Grid -->
                  <section class="trending-section">
                      <h2 class="section-title"><i class="fas fa-fire"></i> Latest Tamil Movies 2025</h2>
                      <p class="section-subtitle">New releases & upcoming blockbusters</p>

                      <div class="movies-grid" id="moviesGrid">
                          <!-- Movie 1: Kantara -->
                          <div class="movie-card" onclick="searchContent('Kantara A Legend Chapter 1')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://m.media-amazon.com/images/M/MV5BNDU2ZTYxYTMtMjhlZC00ZjEwLThhNDUtMzdlNWM4ZDcyYTM1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
                                      alt="Kantara A Legend Chapter 1"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/1a2980/ffffff?text=Kantara+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">Kantara A Legend: Chapter 1</div>
                                          <div class="movie-meta">
                                              <span class="movie-year">2025</span>
                                              <div class="movie-quality">
                                                  <span class="quality-badge quality-4k">4K</span>
                                                  <span class="quality-badge quality-hdr">SDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 2: Lokah -->
                          <div class="movie-card" onclick="searchContent('Lokah Chapter 1 Chandra')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://m.media-amazon.com/images/M/MV5BNWFkMGFmNTQtOTUwYS00NDFkLWFkNDAtZjA4ODliYTc2MmFmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
                                      alt="Lokah Chapter 1 Chandra"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/26d0ce/ffffff?text=Lokah+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">Lokah Chapter 1: Chandra</div>
                                          <div class="movie-meta">
                                              <span class="movie-year">2025</span>
                                              <div class="movie-quality">
                                              <span class="quality-badge quality-4k">4K</span>
                                              <span class="quality-badge quality-hdr">SDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 3: aan paavam pollathathu -->
                          <div class="movie-card" onclick="searchContent('aan paavam pollathathu')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://i.ibb.co/7d16qgGs/1000784256.jpg"
                                      alt="aan paavam pollathathu"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/26d0ce/ffffff?text=aan+paavam+pollathathu+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">aan paavam pollathathu</div>
                                          <div class="movie-meta">
                                          <span class="movie-year">2025</span>
                                              <div class="movie-quality">
                                              <span class="quality-badge quality-4k">4K</span>
                                              <span class="quality-badge quality-hdr">SDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 3: Dude -->
                          <div class="movie-card" onclick="searchContent('Dude')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://static.moviecrow.com/gallery/20251021/251698-Dude%20Pradeep%20Ranganathan%20Diwali%20Blockbuster%202025.jpg"
                                      alt="Dude"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/26d0ce/ffffff?text=Dude+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">Dude</div>
                                          <div class="movie-meta">
                                          <span class="movie-year">2025</span>
                                              <div class="movie-quality">
                                              <span class="quality-badge quality-4k">4K</span>
                                              <span class="quality-badge quality-hdr">SDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 3: aaryan -->
                          <div class="movie-card" onclick="searchContent('aaryan 2025')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://i.ibb.co/5g9xLrsC/aaryan-poster.jpg"
                                      alt="aaryan"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/ff1493/ffffff?text=aaryan+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">aaryan</div>
                                          <div class="movie-meta">
                                              <span class="movie-year">2025</span>
                                              <div class="movie-quality">
                                              <span class="quality-badge quality-4k">4K</span>
                                              <span class="quality-badge quality-hdr">SDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 3: kiss -->
                          <div class="movie-card" onclick="searchContent('Kiss 2025')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://m.media-amazon.com/images/M/MV5BOTIwMmQ0M2ItYzkxMy00NzdkLTgwODQtZjYzZjZmYTk4Nzg4XkEyXkFqcGc@._V1_.jpg"
                                      alt="Kiss"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/ff1493/ffffff?text=Kiss+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">Kiss</div>
                                          <div class="movie-meta">
                                              <span class="movie-year">2025</span>
                                              <div class="movie-quality">
                                              <span class="quality-badge quality-4k">4K</span>
                                              <span class="quality-badge quality-hdr">SDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 4: Bad Girl -->
                          <div class="movie-card" onclick="searchContent('Bad Girl 2025')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://i.ibb.co/Sw4R3NS0/250671-Bad-Girl-Tamil-Nadu-Distributor-Romeo-Pictures.jpg"
                                      alt="Idli Kadai"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/ff1493/ffffff?text=Bad+Girl+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">Bad Girl</div>
                                          <div class="movie-meta">
                                              <span class="movie-year">2025</span>
                                              <div class="movie-quality">
                                              <span class="quality-badge quality-4k">4K</span>
                                              <span class="quality-badge quality-hdr">SDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 5: Idli Kadai -->
                          <div class="movie-card" onclick="searchContent('Idli Kadai')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://i.ibb.co/XrWCYRrz/573606820-18433296655110094-8501239182792413103-n.jpg"
                                      alt="Idli Kadai"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/ff1493/ffffff?text=Idli+Kadai+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">Idli Kadai</div>
                                          <div class="movie-meta">
                                              <span class="movie-year">2025</span>
                                              <div class="movie-quality">
                                              <span class="quality-badge quality-4k">4K</span>
                                              <span class="quality-badge quality-hdr">SDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 6: Shakthi Thirumagan -->
                          <div class="movie-card" onclick="searchContent('Shakthi Thirumagan')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://m.media-amazon.com/images/M/MV5BNjI3MmI3ZDktNWRjMy00ZWYzLTliZGUtMTE0ZDg1NDE1ZjE1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
                                      alt="Shakthi Thirumagan"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/00bfff/ffffff?text=Shakthi+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">Shakthi Thirumagan</div>
                                          <div class="movie-meta">
                                          <span class="movie-year">2025</span>
                                          <div class="movie-quality">
                                          <span class="quality-badge quality-4k">4K</span>
                                          <span class="quality-badge quality-hdr">SDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 7: Stranger Things -->
                          <div class="movie-card" onclick="searchContent('Stranger Things S5 2025')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://i.ibb.co/S45Xrjnw/572161266-18519214237066899-5599337900277484662-n.jpg"
                                      alt="Stranger Things S05"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/8a2be2/ffffff?text=Stranger+Things+2025+S05'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">Stranger Things S05</div>
                                          <div class="movie-meta">
                                              <span class="movie-year">2025</span>
                                              <div class="movie-quality">
                                              <span class="quality-badge quality-hd">HD</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 8: F1 -->
                          <div class="movie-card" onclick="searchContent('F1 2025')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://m.media-amazon.com/images/M/MV5BOTA5YWE3ODAtNWI5YS00NWIxLTk4NjYtZDQ2NTdlZDU3YWY0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
                                      alt="F1"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/8a2be2/ffffff?text=F1+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">F1: The Movie</div>
                                          <div class="movie-meta">
                                              <span class="movie-year">2025</span>
                                              <div class="movie-quality">
                                                  <span class="quality-badge quality-4k">4K</span>
                                                  <span class="quality-badge quality-hdr">HDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 9: Thunderbolts -->
                          <div class="movie-card" onclick="searchContent('Thunderbolts 2025')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://m.media-amazon.com/images/M/MV5BYWE2NmNmYTItZGY0ZC00MmY2LTk1NDAtMGUyMGEzMjcxNWM0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
                                      alt="Thunderbolts"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/ff1493/ffffff?text=Thunderbolts+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">Thunderbolts</div>
                                          <div class="movie-meta">
                                          <span class="movie-year">2025</span>
                                          <div class="movie-quality">
                                          <span class="quality-badge quality-4k">4K</span>
                                          <span class="quality-badge quality-hdr">SDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 12: Madharaasi -->
                          <div class="movie-card" onclick="searchContent('Madharaasi')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://m.media-amazon.com/images/M/MV5BZGJlNmY3NzctZDYwMC00NTE0LWJmZTMtMzllNmRmYzJmZDNhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
                                      alt="Madharaasi"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/00bfff/ffffff?text=Madharaasi+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">Madharaasi</div>
                                          <div class="movie-meta">
                                          <span class="movie-year">2025</span>
                                          <div class="movie-quality">
                                          <span class="quality-badge quality-4k">4K</span>
                                          <span class="quality-badge quality-hdr">SDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 13: Thalaivan Thalaivii -->
                          <div class="movie-card" onclick="searchContent('Thalaivan Thalaivii')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://m.media-amazon.com/images/M/MV5BM2JhMzY2YTMtMTNjMi00ZWFhLTk5M2ItYjMzZGQyMWVmN2FiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
                                      alt="Thalaivan Thalaivii"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/ff1493/ffffff?text=Thalaivan+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">Thalaivan Thalaivii</div>
                                          <div class="movie-meta">
                                          <span class="movie-year">2025</span>
                                          <div class="movie-quality">
                                          <span class="quality-badge quality-4k">4K</span>
                                          <span class="quality-badge quality-hdr">SDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 14: Maareesan -->
                          <div class="movie-card" onclick="searchContent('Maareesan')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://m.media-amazon.com/images/M/MV5BYTI2Zjg5ZmEtOTgyYi00YWNlLTg4OGQtYjQ1NjVmNDYzYjM2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
                                      alt="Maareesan"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/8a2be2/ffffff?text=Maareesan+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">Maareesan</div>
                                          <div class="movie-meta">
                                          <span class="movie-year">2025</span>
                                          <div class="movie-quality">
                                          <span class="quality-badge quality-4k">4K</span>
                                          <span class="quality-badge quality-hdr">SDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 15: Kuberaa -->
                          <div class="movie-card" onclick="searchContent('Kuberaa')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://m.media-amazon.com/images/M/MV5BM2Q3ZWUxOGEtODU4OS00NjU0LTllZWYtODAxZmRkNDZmYmE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
                                      alt="Kuberaa"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/1a2980/ffffff?text=Kuberaa+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">Kuberaa</div>
                                          <div class="movie-meta">
                                              <span class="movie-year">2025</span>
                                              <div class="movie-quality">
                                                  <span class="quality-badge quality-4k">4K</span>
                                                  <span class="quality-badge quality-hdr">HDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 16: Maargan -->
                          <div class="movie-card" onclick="searchContent('Maargan')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://m.media-amazon.com/images/M/MV5BMDExODdkNTAtNmYwYi00MDM4LWJjNGItNGM0YjA4NzYwODQxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
                                      alt="Maargan"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/26d0ce/ffffff?text=Maargan+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">Maargan</div>
                                          <div class="movie-meta">
                                          <span class="movie-year">2025</span>
                                          <div class="movie-quality">
                                          <span class="quality-badge quality-4k">4K</span>
                                          <span class="quality-badge quality-hdr">SDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Movie 17: Coolie  -->
                          <div class="movie-card" onclick="searchContent('Coolie 2025')">
                              <div class="movie-poster-container">
                                  <img
                                      src="https://i.ibb.co/mCLxFR5J/Screenshot-2025-11-04-093528.png"
                                      alt="Thug Life"
                                      class="movie-poster lazy-load"
                                      loading="lazy"
                                      onerror="this.src='https://via.placeholder.com/300x450/1a2980/ffffff?text=Coolie+2025'; this.classList.add('loaded')"
                                  >
                                  <div class="movie-overlay">
                                      <div class="movie-info">
                                          <div class="movie-title">Coolie</div>
                                          <div class="movie-meta">
                                              <span class="movie-year">2025</span>
                                              <div class="movie-quality">
                                                  <span class="quality-badge quality-4k">4K</span>
                                                  <span class="quality-badge quality-hdr">HDR</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </section>


                  <!-- Golden Premium Features Section -->
                  <div class="highlight-section">
                      <h3 class="highlight-title"><i class="fas fa-crown"></i> Premium Features</h3>
                      <ul class="feature-list">
                          <li><i class="fas fa-play-circle"></i> 4K Ultra HD Quality Streaming</li>
                          <li><i class="fas fa-bolt"></i> Latest Movies & TV Series</li>
                          <li><i class="fas fa-download"></i> Multiple Download Options</li>
                          <li><i class="fas fa-mobile-alt"></i> Cross Platform Compatibility</li>
                          <li><i class="fas fa-sync"></i> Regular Content Updates</li>
                          <li><i class="fas fa-shield-alt"></i> Secure & Private Streaming</li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>
  </div>
</div>

<!-- Login Modal -->
<div class="login-modal" id="loginModal">
    <div class="login-card">
        <span class="close-modal" id="closeModal">
            <i class="fas fa-times"></i>
        </span>

        <div class="form-header">
            <h2 class="modal-title">Welcome Back</h2>
            <p class="modal-subtitle">Sign in to access premium content</p>
        </div>

        <div class="error-message" id="errorMessage"></div>

        <form id="loginForm">
            <div class="form-group">
                <label class="form-label" for="username">
                    <i class="fas fa-user"></i>&nbsp;&nbsp; Username
                </label>
                <input
                    type="text"
                    id="username"
                    class="form-input"
                    placeholder="Enter your username"
                    required
                >
            </div>

            <div class="form-group">
                <label class="form-label" for="password">
                    <i class="fas fa-lock"></i>&nbsp;&nbsp; Password
                </label>
                <input
                    type="password"
                    id="password"
                    class="form-input"
                    placeholder="Enter your password"
                    required
                >
            </div>

            <button type="submit" class="submit-btn" id="submitBtn">
                <i class="fas fa-sign-in-alt"></i> Sign In
            </button>
        </form>
    </div>
</div>

<button id="back-to-top" class="btn btn-secondary btn-lg back-to-top shadow border border-light" style="--bs-border-opacity: .4;" role="button"><i class="fas fa-chevron-up m-0"></i></button>

<footer class="footer text-center mt-auto container" style="display:block;">
  <div class="container" style="padding-top: 15px;">
      <div class="row">
          <div class="col-lg-4 col-md-12 text-lg-start">
              <i class="fa-brands fa-pied-piper-alt"></i> ${uiConfig.copyright_year} - <a href="${uiConfig.company_link}" target="_blank">${uiConfig.company_name}</a> with ❤️
          </div>
          <div class="col-lg-4 col-md-12">
              <a href="/dmca" title="Please allow us up to 48 hours to process DMCA requests.">DMCA</a>
              ${uiConfig.credit ? '<span>© All Copy Rights Reserved ®™</span>' : ''}
          </div>
          <div class="col-lg-4 col-md-12 text-lg-end">
              <p>
                  <a href="#"><img id="hits" src=""/></a>
              </p>
              <script>document.getElementById("hits").src="https://hitscounter.dev/api/hit?url=https%3A%2F%2F" + window.location.host + "&label=hits&icon=bar-chart-fill&color=%23198754";</script>
          </div>
      </div>
  </div>
</footer>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js" type="text/javascript"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
<script>
  // Search function
  function searchContent(query) {
      window.location.href = '/0:search?q=' + encodeURIComponent(query);
  }

  // DOM elements
  const loginModal = document.getElementById('loginModal');
  const openLoginModalBtn = document.getElementById('openLoginModal');
  const closeModalBtn = document.getElementById('closeModal');
  const loginForm = document.getElementById('loginForm');
  const searchForm = document.getElementById('searchForm');
  const errorMessage = document.getElementById('errorMessage');
  const submitBtn = document.getElementById('submitBtn');
  const searchInput = document.getElementById('searchInput');

  // Modal functionality
  function openLoginModal() {
      loginModal.classList.add('active');
      document.body.style.overflow = 'hidden';
  }

  function closeLoginModal() {
      loginModal.classList.remove('active');
      document.body.style.overflow = 'auto';
  }

  // Event listeners for modal
  openLoginModalBtn.addEventListener('click', openLoginModal);
  closeModalBtn.addEventListener('click', closeLoginModal);

  loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
          closeLoginModal();
      }
  });

  // Handle search form
  searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
          searchContent(query);
      }
  });

  // Handle login form
  loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      if (!username || !password) {
          showError('Please fill in all fields');
          return;
      }

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading"></span> Signing in...';

      try {
          const formData = new URLSearchParams();
          formData.append('username', username);
          formData.append('password', password);

          const response = await fetch('/login', {
              method: 'POST',
              credentials: 'include', // ✅ Required — browser saves Set-Cookie from fetch()
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: formData.toString()
          });

          const data = await response.json();

          if (data.ok) {
            // Success - redirect to home or reload page
            showError('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            showError('Invalid username or password');
        }
    } catch (error) {
        showError('Network error. Please try again.');
        console.error('Login error:', error);
    } finally {
          // Reset button state
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
      }
  });

  // Show error message function
    function showError(message, type = 'error') {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';

        if (type === 'success') {
            errorMessage.style.background = 'rgba(40, 167, 69, 0.1)';
            errorMessage.style.borderColor = 'rgba(40, 167, 69, 0.3)';
            errorMessage.style.color = '#28a745';
        } else {
            errorMessage.style.background = 'rgba(220, 53, 69, 0.1)';
            errorMessage.style.borderColor = 'rgba(220, 53, 69, 0.3)';
            errorMessage.style.color = '#dc3545';
        }

        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

  // Enhanced lazy loading for images
  function initLazyLoading() {
      const lazyImages = document.querySelectorAll('.lazy-load');
      // Native loading="lazy" handles the actual lazy loading.
      // This just adds the 'loaded' class for the fade-in CSS transition.
      lazyImages.forEach(img => {
          if (img.complete) {
              img.classList.add('loaded');
          } else {
              img.addEventListener('load', () => img.classList.add('loaded'));
              img.addEventListener('error', () => img.classList.add('loaded'));
          }
      });
  }

  // Auto-focus search input when page loads
  document.addEventListener('DOMContentLoaded', () => {
      searchInput.focus();
      initLazyLoading();

      // Check for URL error parameters and auto-open modal
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      if (error) {
          openLoginModal();
          showError(decodeURIComponent(error));
      }
  });

  // Back to top button
  let btt = document.getElementById("back-to-top");
  window.onscroll = function () { scrollFunction(); };
  function scrollFunction() {
      if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
          btt.style.display = "block";
      } else { btt.style.display = "none"; }
  }
  btt.addEventListener("click", backToTop);
  function backToTop() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
  }

  // Security measures
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
  document.addEventListener('keydown', function(e) {
      if ( e.code === 'F12' || (e.ctrlKey && e.shiftKey && e.code === 'KeyI') || (e.ctrlKey && e.code === 'KeyU') || e.code === 'PrintScreen' || (e.altKey && e.code === 'F12') || (e.metaKey && e.altKey && e.code === 'KeyU') ) { e.preventDefault(); }
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') { e.preventDefault(); }

      // Escape to close modal
      if (e.key === 'Escape' && loginModal.classList.contains('active')) {
          closeLoginModal();
      }
  });
  var touchStartTime;
  document.addEventListener('touchstart', function(e) {
      touchStartTime = Date.now();
      if (e.touches.length > 1) { e.preventDefault(); }
  }, { passive: false });
  document.addEventListener('touchend', function(e) {
      if (Date.now() - touchStartTime > 500) { e.preventDefault(); }
  });
  document.addEventListener('dragstart', function(e) {
      if (e.target.tagName === 'IMG') { e.preventDefault(); }
  });
  if (window.self !== window.top) { window.top.location = window.self.location; }
</script>
</body>
</html>`;

const signup_html = `<html>
 <head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <title>Sign UP - ${uiConfig.siteName}</title>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta name="robots" content="noindex, nofollow">
  <meta name="googlebot" content="noindex, nofollow">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="${uiConfig.favicon}">
  <script type="text/javascript" src="//code.jquery.com/jquery-3.3.1.slim.min.js"></script>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
  <style id="compiled-css" type="text/css">.login,.image{min-height:100vh}.bg-image{background-image:url('https://cdn.jsdelivr.net/gh/logingateway/images@1.0/background.jpg');background-size:cover;background-position:center center}#error-message{display:none}</style>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
  <style>
   .logo { font-family: 'Orbitron', sans-serif; color: #007bff; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
  <script>
   $(document).ready(function(){
    $("#btn-login").click(function() {
      const formData = new URLSearchParams();
      formData.append('username', $("#email").val());
      formData.append('password', $("#password").val());

      fetch('/signup_api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      })
        .then(res => res.json())
        .then(data => {
        if (!data.ok) {
          document.getElementById("error-message").style.display = "block";
          document.getElementById("error-message").innerHTML = "Failed to Create Account, Error: " + data.error;
        } else {
          document.getElementById("error-message").style.display = "block";
          document.getElementById("error-message").innerHTML = "Account Created, Please Login";
        }
        });
    });
    const queryparams = new URLSearchParams(window.location.search);
    if (queryparams.get('error')) {
       document.getElementById("error-message").style.display = "block";
       document.getElementById("error-message").innerHTML = queryparams.get('error');
    }
   });
  </script>
 </head>
 <body>
  <div class="container-fluid">
   <div class="row no-gutter">
    <div class="col-md-6 d-none d-md-flex bg-image"></div>
    <div class="col-md-6 bg-light">
       <div class="login d-flex align-items-center py-5">
        <div class="container">
         <div class="row">
          <div class="col-lg-10 col-xl-7 mx-auto">
             <h3 class="logo text-center mb-3">${uiConfig.siteName}</h3>
             <div id="error-message" class="alert alert-danger"></div>
             <form onsubmit="return false;" method="post">
              <p id="error" style="color:red;"></p>
              <div class="form-group mb-3">
               <input id="email" type="text" placeholder="Username" autofocus="" class="form-control rounded-pill border-0 shadow-sm px-4" required>
              </div>
              <div class="form-group mb-3">
               <input id="password" type="password" placeholder="Password" class="form-control rounded-pill border-0 shadow-sm px-4 text-primary" required>
              </div>
              <button id="btn-login" type="submit" class="btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm">SIGNUP</button>
              <a href="/login" class="btn btn-outline-danger btn-block text-uppercase mb-2 rounded-pill shadow-sm">LOGIN</a>
             </form>
             <hr class="solid">
             ${authConfig.enable_social_login ? `<div id="allsociallogins" style="display:block;">
            <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=`+authConfig.google_client_id_for_login+`&redirect_uri=`+authConfig.redirect_domain+`/google_callback&response_type=code&scope=email%20profile&response_mode=query" id="btn-google" class="btn btn-block btn-social btn-google"><span class="fa fa-google"></span> Sign in with Google</a>
             </div>` : ''}
          </div>
         </div>
        </div>
       </div>
       <center><p>&copy; <script>document.write(new Date().getFullYear())</script> ${uiConfig.company_name}</p></center>
    </div>
   </div>
  </div>
 </body>
</html>`;

const not_found = `<!DOCTYPE html>
<html lang=en>
<meta charset=utf-8>
<meta name=viewport content="initial-scale=1, minimum-scale=1, width=device-width">
<title>Error 404 (Not Found)!!1</title>
<style>
*{margin:0;padding:0}html,code{font:15px/22px arial,sans-serif}html{background:#fff;color:#222;padding:15px}body{margin:7% auto 0;max-width:390px;min-height:180px;padding:30px 0 15px}* > body{background:url(//www.google.com/images/errors/robot.png) 100% 5px no-repeat;padding-right:205px}p{margin:11px 0 22px;overflow:hidden}ins{color:#777;text-decoration:none}a img{border:0}@media screen and (max-width:772px){body{background:none;margin-top:0;max-width:none;padding-right:0}}#logo{background:url(//www.google.com/images/branding/googlelogo/1x/googlelogo_color_150x54dp.png) no-repeat;margin-left:-5px}@media only screen and (min-resolution:192dpi){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat 0% 0%/100% 100%;-moz-border-image:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) 0}}@media only screen and (-webkit-min-device-pixel-ratio:2){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat;-webkit-background-size:100% 100%}}#logo{display:inline-block;height:54px;width:150px}
</style>
<a href=//www.google.com/><span id=logo aria-label=Google></span></a>
<p><b>404.</b> <ins>That’s an error.</ins>
<p id="status"></p>
<script>
document.getElementById("status").innerHTML ="The requested URL <code>" + window.location.pathname + "</code> was not found on this server.  <ins>That’s all we know.</ins>";
</script>`;

const asn_blocked = `<html>
<head>
<title>Access Denied</title>
<link href='https://fonts.googleapis.com/css?family=Lato:100' rel='stylesheet' type='text/css'>
<style>
body{ margin:0; padding:0; width:100%; height:100%; color:#b0bec5; display:table; font-weight:100; font-family:Lato }
.container{ text-align:center; display:table-cell; vertical-align:middle }
.content{ text-align:center; display:inline-block }
.message{ font-size:80px; margin-bottom:40px }
a{ text-decoration:none; color:#3498db }
</style>
</head>
<body>
<div class="container">
<div class="content">
<div class="message">Access Denied</div>
</div>
</div>
</body>
</html>`;

const directlink = `
<html>
<head>
<title>Access Denied</title>
<script src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs" type="module"></script>
<style>
body { margin: 0; padding: 0; min-height: 100vh; font-family: 'Segoe UI', system-ui, sans-serif; display: flex; justify-content: center; align-items: center; background: linear-gradient(-45deg, #1a2980, #26d0ce); background-size: 400% 400%; animation: gradientBG 15s ease infinite; color: white; overflow: hidden; }
@keyframes gradientBG { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
.container { text-align: center; width: 90%; max-width: 700px; padding: 50px; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(12px); border-radius: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.3); z-index: 10; position: relative; }
.title { font-size: 4rem; font-weight: 800; margin-bottom: 20px; text-shadow: 3px 3px 6px rgba(0,0,0,0.3); }
.message { font-size: 1.3rem; margin: 30px 0 40px; line-height: 1.6; text-shadow: 1px 1px 3px rgba(0,0,0,0.2); }
#proceed-btn { background: rgba(255,255,255,0.25); color: white; border: 2px solid white; padding: 18px 45px; font-size: 1.2rem; font-weight: 600; border-radius: 50px; cursor: pointer; transition: all 0.4s; backdrop-filter: blur(5px); box-shadow: 0 5px 25px rgba(0,0,0,0.15); }
#proceed-btn:hover { background: rgba(255,255,255,0.35); transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.25); }
dotlottie-player { margin: 30px auto; width: 400px; height: 400px; filter: drop-shadow(0 8px 20px rgba(0,0,0,0.2)); }
.particle { position: absolute; background: rgba(255,255,255,0.7); border-radius: 50%; animation: float linear infinite; z-index: 1; }
@keyframes float { to { transform: translateY(-100vh) rotate(360deg); opacity: 0; } }
.btn-loader { display: inline-block; animation: spin 1s linear infinite; margin-right: 8px; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
</head>
<body>
<div class="container">
<h1 class="title">ACCESS DENIED</h1>
<dotlottie-player src="https://lottie.host/d48e8af6-9e35-4434-9594-ee1a550b7a1e/Rx9zFyer5A.lottie" background="transparent" speed="1" loop autoplay></dotlottie-player>
<div class="message">You don't have permission to access this resource.<br>Please verify your credentials or contact support.</div>
<center><a href=""><button id="proceed-btn">Click Here to Proceed!</button></a></center>
</div>
<script>
function createParticles() {
  const colors = ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.4)'];
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 15 + 5;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + 100 + '%';
    particle.style.animationDuration = Math.random() * 30 + 15 + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(particle);
  }
}
document.getElementById('proceed-btn').addEventListener('click', function() {
  this.innerHTML = '<span class="btn-loader">↻</span> Processing...';
  this.disabled = true;
  document.querySelector('dotlottie-player').speed = 2.5;
  setTimeout(function() { window.location.href = '/'; }, 2000);
});
createParticles();
</script>
</body>
</html>`;

const SearchFunction = {
formatSearchKeyword: function(keyword) {
  let nothing = "";
  let space = " ";
  if (!keyword) return nothing;
  return keyword.replace(/(!=)|['"=<>/\\:]/g, nothing)
    .replace(/[,，|(){}]/g, space)
    .trim()
}
};

const DriveFixedTerms = new(class {
default_file_fields = 'parents,id,name,mimeType,createdTime,fileExtension,thumbnailLink,size,md5Checksum,driveId';
gd_root_type = { user_drive: 0, share_drive: 1 };
folder_mime_type = 'application/vnd.google-apps.folder';
})();

const JSONWebToken = {
header: { alg: 'RS256', typ: 'JWT' },
importKey: async function(pemKey) {
  // FIX: Normalize literal \n (backslash-n from JSON encoding) to actual newlines
  pemKey = pemKey.replace(/\\n/g, '\n');
  var pemDER = this.textUtils.base64ToArrayBuffer(pemKey.split('\n').map(s => s.trim()).filter(l => l.length && !l.startsWith('---')).join(''));
  return crypto.subtle.importKey('pkcs8', pemDER, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
},
createSignature: async function(text, key) {
  const textBuffer = this.textUtils.stringToArrayBuffer(text);
  return crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, textBuffer)
},
generateGCPToken: async function(serviceAccount) {
  const iat = parseInt(Date.now() / 1000);
  var payload = { "iss": serviceAccount.client_email, "scope": "https://www.googleapis.com/auth/drive", "aud": "https://oauth2.googleapis.com/token", "exp": iat + 3600, "iat": iat };
  const encPayload = btoa(JSON.stringify(payload));
  const encHeader = btoa(JSON.stringify(this.header));
  var key = await this.importKey(serviceAccount.private_key);
  var signed = await this.createSignature(encHeader + "." + encPayload, key);
  return encHeader + "." + encPayload + "." + this.textUtils.arrayBufferToBase64(signed).replace(/\//g, '_').replace(/\+/g, '-');
},
textUtils: {
  base64ToArrayBuffer: function(base64) {
    var binary_string = atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) { bytes[i] = binary_string.charCodeAt(i); }
    return bytes.buffer;
  },
  stringToArrayBuffer: function(str) {
    var len = str.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) { bytes[i] = str.charCodeAt(i); }
    return bytes.buffer;
  },
  arrayBufferToBase64: function(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) { binary += String.fromCharCode(bytes[i]); }
    return btoa(binary);
  }
}
};

// ─── Cached crypto keys ───────────────────────────────────────────────────────
// importKey is expensive. Cache encrypt/decrypt keys at module scope so they are
// created only ONCE per Worker isolate instead of once per file per request.
const _textEncoder = new TextEncoder();
let _encryptKeyCache = null;
let _decryptKeyCache = null;
const _cryptoKeyRaw = _textEncoder.encode(crypto_base_key);

async function _getEncryptKey() {
  if (!_encryptKeyCache) {
    _encryptKeyCache = await crypto.subtle.importKey("raw", _cryptoKeyRaw, "AES-CBC", false, ["encrypt"]);
  }
  return _encryptKeyCache;
}

async function _getDecryptKey() {
  if (!_decryptKeyCache) {
    _decryptKeyCache = await crypto.subtle.importKey("raw", _cryptoKeyRaw, "AES-CBC", false, ["decrypt"]);
  }
  return _decryptKeyCache;
}
// ─────────────────────────────────────────────────────────────────────────────

// NOTE: the `iv` parameter was previously accepted but never used — encrypt_iv (module constant) is always used.
async function encryptString(string) {
const key = await _getEncryptKey();
const encodedId = _textEncoder.encode(string);
const encryptedData = await crypto.subtle.encrypt({ name: "AES-CBC", iv: encrypt_iv }, key, encodedId);
const encryptedString = btoa(Array.from(new Uint8Array(encryptedData), (byte) => String.fromCharCode(byte)).join(""));
return encryptedString;
}

async function decryptString(encryptedString) {
const key = await _getDecryptKey();
const encryptedBytes = Uint8Array.from(atob(encryptedString), (char) => char.charCodeAt(0));
const decryptedData = await crypto.subtle.decrypt({ name: "AES-CBC", iv: encrypt_iv }, key, encryptedBytes);
const decryptedString = new TextDecoder().decode(decryptedData);
return decryptedString;
}

async function genIntegrity(data) {
const dataBuffer = _textEncoder.encode(data);
const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
return hashHex;
}

async function checkintegrity(text1, text2) {
return text1 === text2;
}

function toBase64Url(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
function fromBase64Url(str) {
  return atob(str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + (4 - str.length % 4) % 4, '='));
}

// ── Improved generateLink — clean URL format ─────────────────────────────────
// New format: /dl/{exp}/{sig}/{filetoken}
//   exp       — plain Unix timestamp in seconds (readable, debuggable)
//   sig       — HMAC-SHA256 over "filetoken|exp|ip" (or "filetoken|exp" without IP lock)
//   filetoken — AES-CBC encrypted file ID, base64url encoded (no visible file info)
//
// Benefits over old format:
//   ✅ No encrypted expiry in URL — exp is plain and easy to debug
//   ✅ IP is NOT exposed in URL at all — extracted server-side from request
//   ✅ Shorter, cleaner URL structure (path segments not query params)
//   ✅ filetoken is base64url (no ugly %2F %2B encoding)
//   ✅ sig is compact hex — single integrity check covers everything
async function generateLink(file_id, user_ip) {
  // 1. Encrypt file ID → base64url token (hides file ID, no URL encoding needed)
  const encrypted_id = await encryptString(file_id);
  const filetoken = toBase64Url(encrypted_id);

  // 2. Expiry as plain Unix seconds (easy to read / debug)
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * authConfig.file_link_expiry;

  // 3. HMAC covers filetoken + exp + ip (IP not stored in URL — verified server-side)
  const sigData = authConfig['enable_ip_lock'] && user_ip
    ? `${filetoken}|${exp}|${user_ip}`
    : `${filetoken}|${exp}`;
  const sig = await genIntegrity(sigData);

  // 4. Build clean path-based URL
  const baseUrl = uiConfig.random_domain_for_dl ? loadBalancer.getWeightedWorker() : '';
  const url = `${baseUrl}/dl/${exp}/${sig}/${filetoken}`;
  return url.replace(/([^:]\/)\/+/g, '$1');
}

async function handleLoadBalancerRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  if (path === '/lb/health') {
      const health = await loadBalancer.healthCheck();
      return new Response(JSON.stringify({
          status: 'success',
          health_checks: health,
          worker_counts: loadBalancer.getWorkerCounts(),
          timestamp: new Date().toISOString()
      }), { headers: corsHeaders });
  }

  if (path === '/lb/stats') {
      return new Response(JSON.stringify({
          status: 'success',
          stats: loadBalancer.getStats(),
          algorithm: 'weighted-round-robin',
          worker_counts: loadBalancer.getWorkerCounts()
      }), { headers: corsHeaders });
  }

  if (path === '/lb/workers') {
      return new Response(JSON.stringify({
          total_workers: domains_for_dl.length,
          workers: domains_for_dl,
          worker_counts: loadBalancer.getWorkerCounts()
      }), { headers: corsHeaders });
  }

  if (path === '/lb/test') {
      const testResults = [];
      for (const worker of domains_for_dl) {
          try {
              const startTime = Date.now();
              const response = await fetch(`${worker}/health`);
              const responseTime = Date.now() - startTime;

              testResults.push({ worker: worker, status: response.status, response_time: responseTime, healthy: response.ok });
          } catch (error) {
              testResults.push({ worker: worker, status: 'error', response_time: null, healthy: false, error: error.message });
          }
      }

      return new Response(JSON.stringify({
          test_results: testResults,
          summary: {
              total: testResults.length,
              healthy: testResults.filter(r => r.healthy).length,
              unhealthy: testResults.filter(r => !r.healthy).length
          }
      }), { headers: corsHeaders });
  }

  return new Response(JSON.stringify({ error: 'Endpoint not found' }), { status: 404, headers: corsHeaders });
}

function formatFilename(filename) {
  const lastDotIndex = filename.lastIndexOf('.');
  const extension = lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '';
  let nameWithoutExt = lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;

  nameWithoutExt = nameWithoutExt.replace(/_/g, ' ');
  nameWithoutExt = nameWithoutExt.replace(/(\S)\(/g, '$1 (');
  nameWithoutExt = nameWithoutExt.replace(/\)(\S)/g, ') $1');
  nameWithoutExt = nameWithoutExt.replace(/(\S)-/g, '$1 -');
  nameWithoutExt = nameWithoutExt.replace(/-(\S)/g, '- $1');
  nameWithoutExt = nameWithoutExt.replace(/\s+/g, ' ').trim();

  return nameWithoutExt + extension;
}

function login() {
  return new Response(login_html, {
    status: 200, // ✅ FIX: 401 causes browser auth dialogs; 200 renders the login HTML page correctly
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
}

async function handleRequest(request, event) {
const region = request.headers.get('cf-ipcountry');
const asn_servers = request.cf.asn;
const referer = request.headers.get("Referer");
var user_ip = request.headers.get("CF-Connecting-IP");
let url = new URL(request.url);
let path = url.pathname;
let hostname = url.hostname;
// ✅ SECURITY FIX:
// BLOCK  (login required):  /1:/folder/file.mkv?a=view  — direct drive path URLs
// ALLOW  (no login needed): /fallback?id=...&a=view  and  /0:search?q=...
// Old: any ?a=view URL bypassed login. New: only non-drive-path URLs bypass login.
const isDirectDrivePath = /^\/\d+:\//.test(path);
let is_public_file_view = !isDirectDrivePath && (url.searchParams.get('a') === 'view');

if (hostname === 'tm.play-streams.workers.dev') {
    const newUrl = new URL(request.url);
    newUrl.hostname = 'tamizhan-movies.site';
    return Response.redirect(newUrl.toString(), 301);
}

if (path.startsWith('/lb/')) { return handleLoadBalancerRequest(request); }

if (IMAGE_PATHS[path]) { return fetchImageWithCache(IMAGE_PATHS[path], event); }

const isSearchRequest = path.match(/^\/(\d+):search\/?$/);

if (path === '/health-check') {
  return new Response('OK', { status: 200, headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' } });
}

if (path == '/dmca') {
  return new Response(dmca_page, { status: 200, headers: { "content-type": "text/html;charset=UTF-8" } });
}

if (path.startsWith('/fallback') && authConfig['direct_link_protection']) {
    if (!referer || !referer.includes(hostname)) {
    return new Response(directlink, { headers: {'content-type': 'text/html;charset=UTF-8'}, status: 401 });
  }
}

if (path == '/app.min.js') {
  const jsUrl = `${uiConfig.jsdelivr_cdn_src}@master/assets/apps.min.js`;
  const js = await fetch(jsUrl, { method: 'GET' });
  const data = await js.text();
  return new Response(data, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}

if (path == '/assets/homepage.js') {
  const homepageJsUrl = `${uiConfig.jsdelivr_cdn_src}@master/assets/homepage.js`;
  const js = await fetch(homepageJsUrl, { method: 'GET' })
  const data = await js.text()
  return new Response(data, {
    status: 200,
    headers: { 'Content-Type': 'application/javascript; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Cache-Control': 'no-store, no-cache, must-revalidate' }
  });
}

if (path == '/logout') {
  return new Response(null, {
    status: 302,
    headers: {
      'Set-Cookie': 'session=; path=/; Secure; SameSite=None; Max-Age=0',
      'Location': '/?error=Logged+Out'
    }
  });
}

// ADD THE Get2Short ENDPOINT HERE (NEW CODE STARTS)
if (path == '/generate-get2short' && request.method === 'POST') {
  const requestData = await request.json();
  const url = requestData.url;

  if (!url) {
    return new Response(JSON.stringify({ success: false, error: 'No URL provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    // ⚠️ SECURITY: Move API token to a Cloudflare Secret named GET2SHORT_API_TOKEN for production
    const apiToken = typeof GET2SHORT_API_TOKEN !== 'undefined' ? GET2SHORT_API_TOKEN : 'f9f34e19801393301af04153a947703fc6fd3882';
    const encodedUrl = encodeURIComponent(url);

    // Get2Short API call - generates a short link
    const get2shortApiUrl = `https://get2short.com/api?api=${apiToken}&url=${encodedUrl}`;

    const get2shortResponse = await fetch(get2shortApiUrl, { method: 'GET' });

    if (!get2shortResponse.ok) { throw new Error(`Get2Short API error: ${get2shortResponse.status}`); }

    const responseData = await get2shortResponse.json();

    if (responseData.status === 'error') {
      throw new Error(responseData.message || 'Get2Short API returned error');
    }

    const shortUrl = responseData.shortenedUrl || responseData.short_link || responseData.shortened_url;

    if (!shortUrl || !shortUrl.startsWith('http')) {
      throw new Error('Invalid response from Get2Short API');
    }

    return new Response(JSON.stringify({ success: true, short_url: shortUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    logError('Get2Short generation error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

// ADD THE Nowshort ENDPOINT HERE (NEW CODE STARTS)
if (path == '/generate-nowshort' && request.method === 'POST') {
  const requestData = await request.json();
  const url = requestData.url;

  if (!url) {
    return new Response(JSON.stringify({ success: false, error: 'No URL provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    // ⚠️ SECURITY: Move API token to a Cloudflare Secret named NOWSHORT_API_TOKEN for production
    const apiToken = typeof NOWSHORT_API_TOKEN !== 'undefined' ? NOWSHORT_API_TOKEN : '999d01517dd9cc99b802726288266da064728e59';
    const encodedUrl = encodeURIComponent(url);

    // Nowshort API call - generates a short link
    const nowshortApiUrl = `https://nowshort.com/api?api=${apiToken}&url=${encodedUrl}`;

    const nowshortResponse = await fetch(nowshortApiUrl, { method: 'GET' });

    if (!nowshortResponse.ok) { throw new Error(`Nowshort API error: ${nowshortResponse.status}`); }

    const responseData = await nowshortResponse.json();

    if (responseData.status === 'error') {
      throw new Error(responseData.message || 'Nowshort API returned error');
    }

    const shortUrl = responseData.shortenedUrl || responseData.short_link || responseData.shortened_url;

    if (!shortUrl || !shortUrl.startsWith('http')) {
      throw new Error('Invalid response from Nowshort API');
    }

    return new Response(JSON.stringify({ success: true, short_url: shortUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    logError('Nowshort generation error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}


if (path == '/findpath') {
  const params = url.searchParams;
  const id = params.get('id');
  const view = params.get('view') || 'false';
  return Response.redirect(url.protocol + '//' + hostname + '/0:findpath?id=' + id + '&view=' + view, 307);
}

if (authConfig.enable_login && !isSearchRequest && !path.startsWith('/fallback')) {
  const login_database = authConfig.login_database.toLowerCase();
  if (path == '/download' && !authConfig.disable_anonymous_download) {
    log("Anonymous Download")
  } else if (path == '/google_callback') {
    const code = url.searchParams.get('code')
    if (!code) { return new Response('Missing authorization code.', { status: 400 }); }

    if (command === 'search') {
      if (request.method === 'POST') {
        return handleSearch(request, gd, user_ip);
      } else {
        const params = url.searchParams;
        return new Response(html(gd.order, {
          q: params.get("q")?.replace(/'/g, "").replace(/"/g, "") || '',
          is_search_page: true,
          root_type: gd.root_type
        }), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code, client_id: authConfig.google_client_id_for_login,
        client_secret: authConfig.google_client_secret_for_login,
        redirect_uri: authConfig.redirect_domain + '/google_callback',
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();
    log(JSON.stringify(data));
    if (response.ok) {
      const idToken = data.id_token;
      const decodedIdToken = await decodeJwtToken(idToken);
      const username = decodedIdToken.email;
      let kv_key
      let user_found = false;
      if (login_database == 'kv') {
        kv_key = await ENV.get(username);
        if (kv_key == null) { user_found = false; } else { user_found = true; }
      } else if (login_database == 'mongodb') {
      } else {
        for (let i = 0; i < authConfig.users_list.length; i++) {
          if (authConfig.users_list[i].username == username) {
            user_found = true; log("User Found"); break;
          }
        }
      }
      if (!user_found) {
        if (authConfig.enable_signup && login_database == 'kv') {
          await ENV.put(username, Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
          kv_key = await ENV.get(username);
          if (kv_key == null) { user_found = false; } else { user_found = true; }
        } else {
          let response = new Response('Invalid User! Google Login', {});
          response.headers.set('Set-Cookie', `session=; Secure; SameSite=None;`);
          response.headers.set("Refresh", "1; url=/?error=Invalid User");
          return response;
        }
      }

      // Get user password hash for session (always store SHA-256 hex, never plain text)
      const userObjForSession = getUserObject(username);
      const userPasswordHash = userObjForSession ? await resolvePasswordHash(userObjForSession) : null;
      if (!userPasswordHash) {
        let response = new Response('Invalid User Configuration!', {});
        response.headers.set('Set-Cookie', `session=; Secure; SameSite=None;`);
        response.headers.set("Refresh", "1; url=/?error=Invalid User Configuration");
        return response;
      }

      const current_time = Date.now();
      const session_time = current_time + 86400000 * authConfig.login_days;
      const encryptedSession = `${await encryptString(username)}|${await encryptString(kv_key)}|${await encryptString(session_time.toString())}|${await encryptString(userPasswordHash)}`;
      if (authConfig.single_session) { await ENV.put(username + '_session', encryptedSession); }
      if (authConfig.ip_changed_action && user_ip) { await ENV.put(username + '_ip', user_ip); }
      let response = new Response("", {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Set-Cookie': `session=${encryptedSession}; path=/; Secure; SameSite=None`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Refresh': '0; url=/',
        }
      });
      return response;
    } else {
      let response = new Response('Invalid Token!', {});
      response.headers.set('Set-Cookie', `session=; Secure; SameSite=None;`);
      response.headers.set("Refresh", "1; url=/?error=Invalid Token");
      return response;
    }
  } else if (authConfig.enable_login && request.method === 'POST' && path === '/login') {
    log("POST Request for Login")
    const formdata = await request.formData();
    const username = formdata.get('username');
    const password = formdata.get('password');
    if (login_database == 'kv') {
      const kv_key = await ENV.get(username);
      if (kv_key == null) { var user_found = false; } else {
        if (kv_key == password) { var user_found = true; } else { var user_found = false; }
      }
    } else if (login_database == 'mongodb') {
    } else {
      // ✅ FIX #3 SECURITY: Compare SHA-256 hash instead of plain-text password.
      // Supports both password_hash (legacy) and plain password field (USERS_JSON secret).
      for (let i = 0; i < authConfig.users_list.length; i++) {
        if (authConfig.users_list[i].username == username) {
          const storedValue = getUserPasswordHash(username); // handles both plain & hash
          const passwordMatches = await verifyPassword(password, storedValue);
          if (passwordMatches) {
            var user_found = true;
            break;
          }
        }
      }
    }

    // ===== ADD PASSWORD EXPIRY CHECK HERE =====
    if (user_found) {
      const userObj = getUserObject(username);
      if (userObj && isPasswordExpired(userObj)) {
        const daysExpired = Math.abs(getPasswordDaysRemaining(userObj));
        const jsonResponse = {
          ok: false,
          error: `Password expired ${daysExpired} days ago. Contact administrator.`
        };
        return new Response(JSON.stringify(jsonResponse), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }
    // ===== END OF ADDED CHECK =====

    if (!user_found) {
      const jsonResponse = { ok: false }
      let response = new Response(JSON.stringify(jsonResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true' }
      });
      return response;
    }
    if (user_found) {
      // Get user password hash for session (always store SHA-256 hex, never plain text)
      const userObj = getUserObject(username);
      const userPasswordHash = userObj ? await resolvePasswordHash(userObj) : null;
      if (!userPasswordHash) {
        const jsonResponse = { ok: false }
        return new Response(JSON.stringify(jsonResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true' }
        });
      }

      const current_time = Date.now();
      const session_time = current_time + 86400000 * authConfig.login_days;
      const encryptedSession = `${await encryptString(username)}|${await encryptString(password)}|${await encryptString(session_time.toString())}|${await encryptString(userPasswordHash)}`;
      if (authConfig.single_session) { await ENV.put(username + '_session', encryptedSession); }
      if (authConfig.ip_changed_action && user_ip) { await ENV.put(username + '_ip', user_ip); }
      const jsonResponse = { ok: true }
      let response = new Response(JSON.stringify(jsonResponse), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Set-Cookie': `session=${encryptedSession}; path=/; Secure; SameSite=None`,
          'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true'
        }
      });
      return response;
    }
  } else if (path == '/signup' && authConfig.enable_signup) {
    return new Response(signup_html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true' }
    });
  } else if (authConfig.enable_signup && request.method === 'POST' && path === '/signup_api') {
    if (login_database == 'kv') {
      const formdata = await request.formData();
      const username = formdata.get('username');
      const password = formdata.get('password');
      if (username == null || password == null) {
        const jsonResponse = { ok: false, error: "Username or Password is null" }
        let response = new Response(JSON.stringify(jsonResponse), {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Set-Cookie': `session=; path=/; Secure; SameSite=None`,
            'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true'
          }
        });
        return response;
      } else if (username.length > 8 && password.length > 8) {
        const checkKey = await ENV.get(username);
        let jsonResponse;
        if (checkKey != null) {
          jsonResponse = { ok: false, error: "User Already Exists" }
        } else {
          await ENV.put(username, password);
          jsonResponse = { ok: true, error: "User Created" }
        }
        let response = new Response(JSON.stringify(jsonResponse), {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Set-Cookie': `session=; path=/; Secure; SameSite=None`,
            'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true'
          }
        });
        return response;
      } else {
        const jsonResponse = { ok: false, error: "Username or Password length is less than 8 characters" }
        let response = new Response(JSON.stringify(jsonResponse), {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Set-Cookie': `session=; path=/; Secure; SameSite=None`,
            'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true'
          }
        });
        return response;
      }
    } else if (login_database == 'mongodb') {
    } else {
      return new Response("Signup is not supported with local database", {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true' }
      });
    }
  } else if (request.method === 'GET') {
    const cookie = request.headers.get('cookie');
    if (cookie && cookie.includes('session=')) {
      const session = cookie.split('session=').pop().split(';').shift().trim();
      if (session == 'null' || session == '' || session == null) { return login() }

      const sessionParts = session.split('|');
      if (sessionParts.length < 4) {
        // Old session format without password hash - force logout
        let response = new Response('Session format outdated', {});
        response.headers.set('Set-Cookie', `session=; Secure; SameSite=None;`);
        response.headers.set("Refresh", "1; url=/?error=Session format outdated");
        return response;
      }

      const username = await decryptString(sessionParts[0]);
      const password = await decryptString(sessionParts[1]);
      const session_time = await decryptString(sessionParts[2]);
      const session_password_hash = await decryptString(sessionParts[3]);

      // ===== ADD PASSWORD EXPIRY CHECK HERE =====
      const userObj = getUserObject(username);
      if (userObj && isPasswordExpired(userObj)) {
        let response = new Response('Password Expired', {});
        response.headers.set('Set-Cookie', `session=; Secure; SameSite=None;`);
        response.headers.set("Refresh", "1; url=/?error=Your password has expired. Contact administrator.");
        return response;
      }
      // ===== END OF ADDED CHECK =====

      // ===== OPTIONAL: Add password expiry warning =====
      if (userObj) {
        const daysRemaining = getPasswordDaysRemaining(userObj);
        if (daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0) {
          log(`⚠️ Password for ${username} expires in ${daysRemaining} days`);
          // You could set a response header here to show in UI
        }
      }

      // Get current password hash for this user (always SHA-256 hex for comparison)
      const currentPasswordHash = userObj ? await resolvePasswordHash(userObj) : null;

      // Check if password hash matches current version
      // Skip check if currentPasswordHash is null (user not found in list — don't boot them)
      if (currentPasswordHash && session_password_hash !== currentPasswordHash) {
        let response = new Response('Password changed - Please login again', {});
        response.headers.set('Set-Cookie', `session=; Secure; SameSite=None;`);
        response.headers.set("Refresh", "1; url=/?error=Password changed - Please login again");
        return response;
      }

      let kv_session
      if (authConfig.single_session) {
        kv_session = await ENV.get(username + '_session');
        if (kv_session != session) {
          let response = new Response('User Logged in Someplace Else!', { headers: { 'Set-Cookie': `session=; Secure; SameSite=None;` } });
          response.headers.set("Refresh", "1; url=/?error=User Logged in Someplace Else!");
          return response;
        }
      }
      if (authConfig.ip_changed_action && user_ip) {
        const kv_ip = await ENV.get(username + '_ip');
        if (kv_ip != user_ip) {
          let response = new Response('IP Changed! Login Required', {
            headers: {
              'Set-Cookie': `session=; Secure; SameSite=None;`,
            }
          });
          response.headers.set("Refresh", "1; url=/?error=IP Changed! Login Required");
          return response;
        }
      }

      log("User: " + username + " | Session Time: " + session_time)
      const current_time = Date.now();
      if (Number(session_time) < current_time) {
        let response = new Response('Session Expired!', { headers: { 'Set-Cookie': `session=; Secure; SameSite=None;` } });
        response.headers.set("Refresh", "1; url=/?error=Session Expired!");
        return response;
      }
      if (login_database == 'kv') {
        const kv_key = await ENV.get(username);
        if (kv_key == null) { var user_found = false; } else {
          if (kv_key == password) { var user_found = true; } else { var user_found = false; }
        }
      } else if (login_database == 'mongodb') {
      } else {
        // ✅ Verify session password against stored user password
        // Supports plain password field (USERS_JSON secret).
        for (let i = 0; i < authConfig.users_list.length; i++) {
          if (authConfig.users_list[i].username == username) {
            const storedValue = getUserPasswordHash(username);
            const passwordMatches = storedValue
              ? await verifyPassword(password, storedValue)
              : true; // no password stored — trust the session hash check above
            if (passwordMatches) { var user_found = true; break; }
          }
        }
        // If user not in list but session hash was valid above, allow access
        if (!user_found && !currentPasswordHash) { var user_found = true; }
      }
      if (user_found) { log("User Found") } else {
        let response = new Response('Invalid User! Something Wrong', {});
        response.headers.set('Set-Cookie', `session=; Secure; SameSite=None;`);
        response.headers.set("Refresh", "1; url=/?error=Invalid User");
        return response;
      }
    } else if (!is_public_file_view) { return login() }
  }
}

if (request.method === "POST" && path == "/copy") {
  try {
    let form = await request.formData();
    let time = parseInt(form.get('time'), 10);
    if (isNaN(time) || time < Math.floor(Date.now() / 1000)) {
      return new Response('{"error":"Invalid Time"}', {
        status: 404,
        headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*", "Cache-Control": "max-age=0" }
      });
    }
    let user_drive = form.get('root_id') || "null";
    if (user_drive == "null") {
      return new Response('{"error":"404"}', {
        status: 200,
        headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*", "Cache-Control": "max-age=0" }
      });
    }
    let public_drive_id = await decryptString(form.get('id')) || "null";
    let user_folder_id = form.get('root_id') || "null";
    let resourcekey = form.get('resourcekey') || "null";
    let file = await copyItemById(public_drive_id, resourcekey, user_folder_id);
    return new Response(JSON.stringify(file), {
      status: 200,
      headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*", "Cache-Control": "max-age=0" }
    });
  } catch (e) {
    return new Response(e, {
      status: 200,
      headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*", "Cache-Control": "max-age=0" }
    });
  }
}

if (gds.length === 0) {
  for (let i = 0; i < authConfig.roots.length; i++) {
    const gd = new googleDrive(authConfig, i);
    await gd.init();
    gds.push(gd)
  }
  let tasks = [];
  gds.forEach(gd => { tasks.push(gd.initRootType()); });
  for (let task of tasks) { await task; }
}

let gd;

function redirectToIndexPage() {
  return new Response('', { status: 307, headers: { 'Location': `${url.origin}/0:/` } });
}

if (region && blocked_region.includes(region.toUpperCase())) {
  return new Response(asn_blocked, { status: 403, headers: { "content-type": "text/html;charset=UTF-8" } })
} else if (asn_servers && blocked_asn.includes(asn_servers)) {
  return new Response(asn_blocked, { headers: { 'content-type': 'text/html;charset=UTF-8' }, status: 401 });
} else if (path == '/') {
  return new Response(homepage, { status: 200, headers: { "content-type": "text/html;charset=UTF-8", "Cache-Control": "no-store, no-cache, must-revalidate" } })
} else if (path == '/fallback') {
  return new Response(html(0, { is_search_page: false, root_type: 1 }), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store, no-cache, must-revalidate' }
  });
// ── New clean download endpoint: /dl/{exp}/{sig}/{filetoken} ─────────────────
} else if (path.startsWith('/dl/')) {
  log("Download started (new /dl/ endpoint)");
  try {
    // Parse path segments: /dl/{exp}/{sig}/{filetoken}
    const parts = path.split('/').filter(Boolean); // ['dl', exp, sig, filetoken]
    if (parts.length !== 4) {
      return new Response(JSON.stringify({ error: 'Invalid download link', message: 'Expected /dl/{exp}/{sig}/{filetoken}' }), {
        status: 400, headers: { 'content-type': 'application/json' }
      });
    }
    const [, exp, sig, filetoken] = parts;

    // 1. Check expiry (plain Unix seconds — no decryption needed)
    const expInt = parseInt(exp, 10);
    if (isNaN(expInt) || Math.floor(Date.now() / 1000) > expInt) {
      return new Response(JSON.stringify({ error: 'Link expired', message: 'This download link has expired. Please generate a new one.' }), {
        status: 410, headers: { 'content-type': 'application/json' }
      });
    }

    // 2. Decrypt file ID from base64url filetoken
    let file_id;
    try {
      const encrypted_id = fromBase64Url(filetoken);
      file_id = await decryptString(encrypted_id);
      if (!file_id || file_id.trim() === '') {
        throw new Error('Decrypted file ID is empty');
      }
      file_id = file_id.trim();
      log('dl: decrypted file_id =', file_id);
    } catch (decryptErr) {
      logError('dl: decryption failed:', decryptErr.message);
      return new Response(JSON.stringify({ error: 'Invalid download link', message: 'Could not decrypt file token: ' + decryptErr.message }), {
        status: 400, headers: { 'content-type': 'application/json' }
      });
    }

    // 3. Verify HMAC — IP is read from the live request (not stored in URL)
    const sigData = authConfig['enable_ip_lock'] && user_ip
      ? `${filetoken}|${exp}|${user_ip}`
      : `${filetoken}|${exp}`;
    const expected_sig = await genIntegrity(sigData);
    const integrity_result = await checkintegrity(sig, expected_sig);

    if (!integrity_result) {
      logError('dl: HMAC mismatch — possible IP change or tampered URL');
      // If IP lock is on and IP may have changed, give a helpful message
      const ipMsg = authConfig['enable_ip_lock']
        ? 'Your IP address may have changed. Please reload the page and try again.'
        : 'Invalid request signature.';
      return new Response(JSON.stringify({ error: 'Invalid Request', message: ipMsg }), {
        status: 401, headers: { 'content-type': 'application/json' }
      });
    }

    // 4. Stream file
    const range = request.headers.get('Range');
    const inline = url.searchParams.get('inline') === 'true';
    log('dl: streaming file_id =', file_id, '| range =', range || 'none');
    return download(file_id, range, inline);

  } catch (err) {
    logError('dl: unhandled error:', err.message, err.stack);
    return new Response(JSON.stringify({ error: 'Download failed', message: err.message }), {
      status: 500, headers: { 'content-type': 'application/json' }
    });
  }

// ── Legacy /download endpoint — kept for backward compatibility ───────────────
} else if (path == '/download') {
  log("Download started (legacy /download endpoint)");
  const file = await decryptString(url.searchParams.get('file'));
  log(file)
  const expiry = await decryptString(url.searchParams.get('expiry'));
  let integrity_result = false;
  if (authConfig['enable_ip_lock'] && user_ip) {
    const integrity = await genIntegrity(`${file}|${expiry}|${user_ip}`);
    const mac = url.searchParams.get('mac');
    integrity_result = await checkintegrity(mac, integrity);
  } else {
    const integrity = await genIntegrity(`${file}|${expiry}`);
    const mac = url.searchParams.get('mac');
    integrity_result = await checkintegrity(mac, integrity);
  }
  if (integrity_result) {
    let range = request.headers.get('Range');
    const inline = 'true' === url.searchParams.get('inline');
    log(file, range)
    return download(file, range, inline);
  } else {
    return new Response('Invalid Request!', { status: 401, headers: { "content-type": "text/html;charset=UTF-8" } })
  }
}

// ADD THE GDFLIX ENDPOINT HERE (NEW CODE STARTS)
if (path == '/generate-gdflix' && request.method === 'POST') {
  const requestData = await request.json();
  const fileId = requestData.file_id;

  if (!fileId) {
    return new Response(JSON.stringify({ success: false, error: 'No file ID provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    // GDFlix API configuration
    const apiUrl = 'https://gdflix.com/v2/share';
    const apiKey = '44eed126fc5b907ed6214a4c457b2d2c';
    // Make request to GDFlix API
    const gdflixResponse = await fetch(`${apiUrl}?id=${encodeURIComponent(fileId)}&key=${encodeURIComponent(apiKey)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!gdflixResponse.ok) { throw new Error(`GDFlix API error: ${gdflixResponse.status}`); }

    const data = await gdflixResponse.json();
    let gdflixLink = '';

    if (data && data.status === "success" && data.gdflix_link) {
      gdflixLink = data.gdflix_link;
    } else if (data && data.key) {
      gdflixLink = `https://gdlink.dev/file/${data.key}`;
    } else if (data && data.id) {
      gdflixLink = `https://gdlink.dev/file/${data.id}`;
    } else if (data && data.message === "File already Shared") {
      const fileResponse = await fetch(`https://gdlink.dev/v2/file/${fileId}?key=${apiKey}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      const fileData = await fileResponse.json();

      if (fileData && fileData.key) {
        gdflixLink = `https://gdlink.dev/file/${fileData.key}`;
      } else if (fileData && fileData.id) {
        gdflixLink = `https://gdlink.dev/file/${fileData.id}`;
      } else {
        throw new Error('Could not get file key from GDFlix API');
      }
    } else {
      throw new Error('Invalid response from GDFlix API');
    }

    return new Response(JSON.stringify({ success: true, gdflix_link: gdflixLink }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    logError('GDFlix generation error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

const command_reg = /^\/(?<num>\d+):(?<command>[a-zA-Z0-9]+)(\/.*)?$/g;
const match = command_reg.exec(path);
if (match) {
  const num = match.groups.num;
  const order = Number(num);
  if (order >= 0 && order < gds.length) { gd = gds[order]; } else { return redirectToIndexPage() }

  const command = match.groups.command;
  if (command === 'search') {
    if (request.method === 'POST') {
      return handleSearch(request, gd, user_ip);
    } else {
      const params = url.searchParams;
      return new Response(html(gd.order, {
        q: params.get("q")?.replace(/'/g, "").replace(/"/g, "") || '',
        is_search_page: true,
        root_type: gd.root_type
      }), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store, no-cache, must-revalidate' } });
    }
  } else if (command === 'id2path' && request.method === 'POST') {
    return handleId2Path(request, gd)
  } else if (command === 'fallback' && request.method === 'POST') {
    const formdata = await request.json();
    const id = await decryptString(formdata.id);
    const type = formdata.type;
    if (type && type == 'folder') {
      const page_token = formdata.page_token || null;
      const page_index = formdata.page_index || 0;
      const folder = await gd.findItemById(id);
      const details = await gd._list_gdrive_files(id, page_token, page_index);
      details.fid = id;
      details.name = folder.name;
      for (const file of details.data.files) {
        if (file.mimeType != 'application/vnd.google-apps.folder') {
          file.link = await generateLink(file.id, user_ip);
        }
        file.fid = file.id;
        file.driveId = await encryptString(file.driveId);
        file.id = await encryptString(file.id);
      }
      const encryptedDetails = details;
      return new Response(JSON.stringify(encryptedDetails), {});
    }
    const details = await gd.findItemById(id)
    details.link = await generateLink(details.id, user_ip);
    details.fid = id;
    details.id = formdata.id;
    details.parents[0] = null;
    return new Response(JSON.stringify(details), {});
  } else if (command === 'findpath' && request.method === 'GET') {
    return findId2Path(gd, url)
  }
}

const common_reg = /^\/\d+:\/.*$/g;
try {
  if (!path.match(common_reg)) { return redirectToIndexPage(); }
  let split = path.split("/");
  let order = Number(split[1].slice(0, -1));
  if (order >= 0 && order < gds.length) { gd = gds[order]; } else { return redirectToIndexPage() }
} catch (e) { return redirectToIndexPage() }

if (request.method == 'POST') { return apiRequest(request, gd, user_ip); }

let action = url.searchParams.get('a');
if (path.slice(-1) == '/' || action != null) {
  return new Response(html(gd.order, { root_type: gd.root_type }), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store, no-cache, must-revalidate' }
  });
} else {
  log(path)
  const file = await gd.get_single_file(path.slice(3));
  log(file)
  let range = request.headers.get('Range');
  const inline = 'true' === url.searchParams.get('inline');
  if (gd.root.protect_file_link && enable_login) return login();
  return download(file?.id, range, inline);
}
}

function enQuery(data) {
const ret = [];
for (let d in data) { ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d])); }
return ret.join('&');
}

async function getAccessToken() {
if (authConfig.expires == undefined || authConfig.expires < Date.now()) {
  const obj = await fetchAccessToken();
  if (obj.access_token != undefined) {
    authConfig.accessToken = obj.access_token;
    authConfig.expires = Date.now() + 3500 * 1000;
  }
}
return authConfig.accessToken;
}

async function fetchAccessToken() {
log("fetchAccessToken");
const url = "https://www.googleapis.com/oauth2/v4/token";
const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
var post_data;
if (authConfig.service_account && typeof authConfig.service_account_json != "undefined") {
  const jwttoken = await JSONWebToken.generateGCPToken(authConfig.service_account_json);
  post_data = { grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwttoken };
} else {
  post_data = {
    client_id: authConfig.client_id,
    client_secret: authConfig.client_secret,
    refresh_token: authConfig.refresh_token,
    grant_type: "refresh_token",
  };
}

let requestOption = { 'method': 'POST', 'headers': headers, 'body': enQuery(post_data) };

let response;
for (let i = 0; i < 3; i++) {
  response = await fetch(url, requestOption);
  if (response.ok) { break; }
  await sleep(800 * (i + 1));
}
return await response.json();
}

async function copyItemById(id, resourcekey, user_folder_id, headers = {}) {
let url = `https://www.googleapis.com/drive/v3/files/${id}/copy?fields=id,name,mimeType&supportsAllDrives=true`;
const accessToken = await getAccessToken();
headers["authorization"] = "Bearer " + accessToken;
headers["Accept"] = "application/json";
headers["Content-Type"] = "application/json";
headers["X-Goog-Drive-Resource-Keys"] = id + "/" + resourcekey;
let json = { parents: [user_folder_id] }
let res
for (let i = 0; i < 3; i++) {
  res = await fetch(url, { "method": "POST", "headers": headers, "body": JSON.stringify(json) });
  if (res.ok) { break; }
  await sleep(100 * (i + 1));
}
const data = await res.json();
log(data);
return data;
}

async function sleep(ms) {
return new Promise(function(resolve, reject) {
  let i = 0;
  setTimeout(function() {
    log('sleep' + ms);
    i++;
    if (i >= 2) reject(new Error('i>=2'));
    else resolve(i);
  }, ms);
})
}

async function apiRequest(request, gd, user_ip) {
let url = new URL(request.url);
let path = url.pathname;
path = path.replace(gd.url_path_prefix, '') || '/';
log("handling apirequest: " + path);
let option = { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }

if (path.slice(-1) == '/') {
  let requestData = await request.json();
  let list_result = await gd.request_list_of_files( path, requestData.page_token || null, Number(requestData.page_index) || 0 );

  if (authConfig['enable_password_file_verify']) {
    let password = await gd.password(path);
    if (password && password.trim() !== (requestData.password || '').trim()) {
      let html = `Y29kZWlzcHJvdGVjdGVk=0Xfi4icvJnclBCZy92dzNXYwJCI6ISZnF2czVWbiwSMwQDI6ISZk92YisHI6IicvJnclJyeYmFzZTY0aXNleGNsdWRlZA==`;
      return new Response(html, option);
    }
  }

  list_result.data.files = await Promise.all(list_result.data.files.map(async (file) => {
    const { driveId, id, mimeType, ...fileWithoutId } = file;

    const encryptedId = await encryptString(id);
    const encryptedDriveId = await encryptString(driveId);

    let link = null;
    if (mimeType !== 'application/vnd.google-apps.folder') { link = await generateLink(id, user_ip); }

    return { ...fileWithoutId, fid: id, id: encryptedId, driveId: encryptedDriveId, mimeType: mimeType, link: link };
  }));

  const encryptedFiles = list_result;
const data = JSON.stringify(encryptedFiles)
  return new Response(data, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;charset=UTF-8' } });
} else {
  let file_json = await gd.get_single_file(path);
  const { driveId, id, ...fileWithoutId } = file_json;

  const encryptedId = await encryptString(id);
  const encryptedDriveId = await encryptString(driveId);
  const link = await generateLink(id, user_ip);
  const encryptedFile = { ...fileWithoutId, fid: id, id: encryptedId, driveId: encryptedDriveId, link: link };

  const encryptedFiles = encryptedFile;

const data = JSON.stringify(encryptedFiles)
  return new Response(data, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;charset=UTF-8' } });
}
}

async function handleSearch(request, gd, user_ip = '') {
const option = { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } };
const requestData = await request.json();
const q = requestData.q || '';
const pageToken = requestData.page_token || null;
const pageIndex = Number(requestData.page_index) || 0;
if (q == '') return new Response(JSON.stringify({ "nextPageToken": null, "curPageIndex": 0, "data": { "files": [] } }), option);
const searchResult = await gd.searchFilesinDrive(q, pageToken, pageIndex);
searchResult.data.files = await Promise.all(searchResult.data.files.map(async (file) => {
  const { driveId, id, ...fileWithoutId } = file;

  const encryptedId = await encryptString(id);
  const encryptedDriveId = await encryptString(driveId);
  const link = await generateLink(id, user_ip);
  return { ...fileWithoutId, fid: id, id: encryptedId, driveId: encryptedDriveId, link: link };
}));
return new Response(JSON.stringify(searchResult), option);
}

async function handleId2Path(request, gd) {
let url = new URL(request.url);
const option = {
  status: 200,
  headers: { "content-type": "application/json", "Access-Control-Allow-Origin": authConfig.cors_domain, "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS" }
};
try {
  const data = await request.json();
  const id = await decryptString(data.id);
  let [path, prefix] = await gd.findPathById(id);
  let jsonpath = '{"path": "/' + prefix + ':' + path + '"}'
  log(jsonpath)
  return new Response(jsonpath || '', option);
} catch (error) {
  log(error)
  return new Response('{"message":"Request Failed or Path Not Found","error":"' + error + '"}', {
    status: 500,
    headers: { "content-type": "application/json", "Access-Control-Allow-Origin": authConfig.cors_domain, "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS" }
  });
}
}

async function findId2Path(gd, url) {
try {
  let [path, prefix] = await gd.findPathById(url.searchParams.get('id'));
  log(path, prefix)
  if (!path) {
    return new Response("Invalid URL");
  } else if (url.searchParams.get('view') && url.searchParams.get('view') == 'true') {
    return Response.redirect("https://" + url.hostname + "/" + prefix + ":" + path + "?a=view" || '', 302);
  } else {
    return Response.redirect("https://" + url.hostname + "/" + prefix + ":" + path || '', 302);
  }
} catch (error) {
  const encrypted_id = await encryptString(url.searchParams.get('id'), encrypt_iv)
  if (url.searchParams.get('view') && url.searchParams.get('view') == 'true') {
    return Response.redirect("https://" + url.hostname + "/fallback?id=" + encrypted_id + "&a=view" || '', 302);
  } else {
    return Response.redirect("https://" + url.hostname + "/fallback?id=" + encrypted_id || '', 302);
  }
}
}

/*async function findItemById(gd, id) {
  log(id)
  const is_user_drive = this.root_type === DriveFixedTerms.gd_root_type.user_drive;
  let url = `https://www.googleapis.com/drive/v3/files/${id}?fields=${DriveFixedTerms.default_file_fields}${is_user_drive ? '' : '&supportsAllDrives=true'}`;
  let requestOption = await gd.requestOptions();
  let res = await fetch(url, requestOption);
  return await res.json();
}*/

// start of class googleDrive
class googleDrive {
  constructor(authConfig, order) {
    this.order = order;
    this.root = authConfig.roots[order];
    this.root.protect_file_link = this.root.protect_file_link || false;
    this.url_path_prefix = `/${order}:`;
    this.authConfig = authConfig;
    this.paths = [];
    this.files = [];
    this.passwords = [];
    this.paths["/"] = this.root['id'];
  }
  async init() {
    await getAccessToken();
    if (authConfig.user_drive_real_root_id) return;
    const root_obj = await (gds[0] || this).findItemById('root');
    if (root_obj && root_obj.id) {
      authConfig.user_drive_real_root_id = root_obj.id
    }
  }

  async initRootType() {
    const root_id = this.root['id'];
    const types = DriveFixedTerms.gd_root_type;
    if (root_id === 'root' || root_id === authConfig.user_drive_real_root_id) {
      this.root_type = types.user_drive;
    } else {
      this.root_type = types.share_drive;
    }
  }


  async get_single_file(path) {
    if (typeof this.files[path] == 'undefined') {
      this.files[path] = await this.get_single_file_api(path);
    }
    return this.files[path];
  }

  async get_single_file_api(path) {
    let arr = path.split('/');
    let name = arr.pop();
    name = decodeURIComponent(name).replace(/\'/g, "\\'");
    let dir = arr.join('/') + '/';
    log("try " + name, dir);
    let parent = await this.findPathId(dir);
    log("try " + parent)
    let url = 'https://www.googleapis.com/drive/v3/files';
    let params = {
      'includeItemsFromAllDrives': true,
      'supportsAllDrives': true
    };
    params.q = `'${parent}' in parents and name = '${name}' and trashed = false and mimeType != 'application/vnd.google-apps.shortcut'`;
    params.fields = "files(id, name, mimeType, size, createdTime, iconLink, thumbnailLink, driveId, fileExtension, md5Checksum)";
    url += '?' + enQuery(params);
    let requestOption = await this.requestOptions();
    let response;
    for (let i = 0; i < 3; i++) {
      response = await fetch(url, requestOption);
      if (response.ok) {
        break;
      }
      await sleep(800 * (i + 1));
    }
    let obj = await response.json();
    // log(obj);
    return obj.files[0];
  }

  async request_list_of_files(path, page_token = null, page_index = 0) {
    if (this.path_children_cache == undefined) {
      // { <path> :[ {nextPageToken:'',data:{}}, {nextPageToken:'',data:{}} ...], ...}
      this.path_children_cache = {};
    }

    if (this.path_children_cache[path] &&
      this.path_children_cache[path][page_index] &&
      this.path_children_cache[path][page_index].data
    ) {
      let child_obj = this.path_children_cache[path][page_index];
      return {
        nextPageToken: child_obj.nextPageToken || null,
        curPageIndex: page_index,
        data: child_obj.data
      };
    }

    let id = await this.findPathId(path);
    let result = await this._list_gdrive_files(id, page_token, page_index);
    let data = result.data;
    result.fid = id;
    if (result.nextPageToken && data.files) {
      if (!Array.isArray(this.path_children_cache[path])) {
        this.path_children_cache[path] = []
      }
      this.path_children_cache[path][Number(result.curPageIndex)] = {
        nextPageToken: result.nextPageToken,
        data: data
      };
    }

    return result
  }

  // listing files usign google drive api
  async _list_gdrive_files(parent, page_token = null, page_index = 0) {

    if (parent == undefined) {
      return null;
    }
    let obj;
    let params = {
      'includeItemsFromAllDrives': true,
      'supportsAllDrives': true
    };
    params.q = `'${parent}' in parents and trashed = false AND name !='.password' and mimeType != 'application/vnd.google-apps.shortcut' and mimeType != 'application/vnd.google-apps.form' and mimeType != 'application/vnd.google-apps.site'`;
    params.orderBy = 'folder, name, createdTime desc';
    params.fields = "nextPageToken, files(id, name, mimeType, size, createdTime, driveId, kind, fileExtension, md5Checksum, iconLink)";
    params.pageSize = this.authConfig.files_list_page_size;

    if (page_token) {
      params.pageToken = page_token;
    }
    let url = 'https://www.googleapis.com/drive/v3/files';
    url += '?' + enQuery(params);
    let requestOption = await this.requestOptions();
    let response;
    for (let i = 0; i < 3; i++) {
      response = await fetch(url, requestOption);
      if (response.ok) {
        break;
      }
      await sleep(800 * (i + 1));
    }
    obj = await response.json();

    return {
      nextPageToken: obj.nextPageToken || null,
      curPageIndex: page_index,
      data: obj
    };
  }

  async password(path) {
    if (this.passwords[path] !== undefined) {
      return this.passwords[path];
    }

    let file = await this.get_single_file(path + '.password');
    if (file == undefined) {
      this.passwords[path] = null;
    } else {
      let url = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
      let requestOption = await this.requestOptions();
      let response = await this.fetch200(url, requestOption);
      this.passwords[path] = await response.text();
    }

    return this.passwords[path];
  }

  async searchFilesinDrive(origin_keyword, page_token = null, page_index = 0) {
    const types = DriveFixedTerms.gd_root_type;
    const is_user_drive = this.root_type === types.user_drive;
    const is_share_drive = this.root_type === types.share_drive;
    const empty_result = {
      nextPageToken: null,
      curPageIndex: page_index,
      data: null
    };

    if (!is_user_drive && !is_share_drive) {
      return empty_result;
    }
    let keyword = SearchFunction.formatSearchKeyword(origin_keyword);
    if (!keyword) {
      return empty_result;
    }
    let drvId = this.root.id;
    let words = keyword.split(/\s+/);
    let name_search_str = `name contains '${words.join("' AND name contains '")}'`;
    let params = {};
    if (is_user_drive) {
      if (authConfig.search_all_drives) {
        params.corpora = 'allDrives';
        params.includeItemsFromAllDrives = true;
        params.supportsAllDrives = true;
      } else {
        params.corpora = 'user';
      }
    }
    if (is_share_drive) {
      if (authConfig.search_all_drives) {
        params.corpora = 'allDrives';
      } else {
        if (drvId.length > 25) {
          drvId = (await this.findItemById(drvId)).driveId;
        }
        params.driveId = drvId;
        params.corpora = 'drive';
      }
      params.includeItemsFromAllDrives = true;
      params.supportsAllDrives = true;
    }
    if (page_token) {
      params.pageToken = page_token;
    }
    params.q = `trashed = false AND mimeType != 'application/vnd.google-apps.shortcut' and mimeType != 'application/vnd.google-apps.form' and mimeType != 'application/vnd.google-apps.site' AND name !='.password' AND (${name_search_str})`;
    params.fields = "nextPageToken, files(id, driveId, name, mimeType, size, createdTime, md5Checksum, iconLink, fileExtension)";
    params.pageSize = this.authConfig.search_result_list_page_size;
    params.orderBy = 'folder, name, createdTime desc';

    let url = 'https://www.googleapis.com/drive/v3/files';
    url += '?' + enQuery(params);
    let requestOption = await this.requestOptions();
    let response;
    for (let i = 0; i < 3; i++) {
      response = await fetch(url, requestOption);
      if (response.ok) {
        break;
      }
      await sleep(800 * (i + 1));
    }
    let res_obj = await response.json();

    return {
      nextPageToken: res_obj.nextPageToken || null,
      curPageIndex: page_index,
      data: res_obj
    };
  }

  async findParentFilesRecursion(child_id, drive_index_no, contain_myself = true) {
    const gd = this;
    const gd_root_id = gd.root.id;
    const user_drive_real_root_id = authConfig.user_drive_real_root_id;
    const is_user_drive = gd.root_type === DriveFixedTerms.gd_root_type.user_drive;
    const target_top_id = is_user_drive ? user_drive_real_root_id : gd_root_id;
    const fields = DriveFixedTerms.default_file_fields;
    const parent_files = [];
    let meet_top = false;
    async function addItsFirstParent(file_obj) {
      if (!file_obj) return;
      if (!file_obj.parents) return null;
      if (file_obj.parents.length < 1) return;
      let p_ids = file_obj.parents;
      if (p_ids && p_ids.length > 0) {
        const first_p_id = p_ids[0];
        log(first_p_id)
        if (drive_list.includes(first_p_id)) {
          meet_top = true;
          drive_index_no = drive_list.indexOf(first_p_id);
          return drive_index_no;
        }
        const p_file_obj = await gd.findItemById(first_p_id);
        if (p_file_obj && p_file_obj.id) {
          parent_files.push(p_file_obj);
          await addItsFirstParent(p_file_obj);
        }
      }
      return drive_index_no;
    }

    const child_obj = await gd.findItemById(child_id);
    if (contain_myself) {
      parent_files.push(child_obj);
    }
    const drive_id = await addItsFirstParent(child_obj);
    log("parents -- " + JSON.stringify(parent_files))
    return meet_top ? [parent_files, drive_index_no] : null;
  }

  async findPathById(child_id) {
    let p_files
    let drive_index_no = 0;
    try {
      [p_files, drive_index_no] = await this.findParentFilesRecursion(child_id);
    } catch (error) {
      return null;
    }

    if (!p_files || p_files.length < 1) return '';

    let cache = [];
    // Cache the path and id of each level found
    p_files.forEach((value, idx) => {
      const is_folder = idx === 0 ? (p_files[idx].mimeType === DriveFixedTerms.folder_mime_type) : true;
      let path = '/' + p_files.slice(idx).map(it => encodeURIComponent(it.name)).reverse().join('/');
      if (is_folder) path += '/';
      cache.push({
        id: p_files[idx].id,
        path: path
      })
    });
    return [cache[0].path, drive_index_no];
  }

  async findItemById(id) {
    const is_user_drive = this.root_type === DriveFixedTerms.gd_root_type.user_drive;
    let url = `https://www.googleapis.com/drive/v3/files/${id}?fields=${DriveFixedTerms.default_file_fields}${is_user_drive ? '' : '&supportsAllDrives=true'}`;
    let requestOption = await this.requestOptions();
    let res = await fetch(url, requestOption);
    if (res.ok) {
      return await res.json()
    } else {
      return res;
    }
  }

  async findPathId(path) {
    let c_path = '/';
    let c_id = this.paths[c_path];

    let arr = trimChar(path, '/').split('/');
    for (let name of arr) {
      c_path += name + '/';

      if (typeof this.paths[c_path] == 'undefined') {
        let id = await this._findDirId(c_id, name);
        this.paths[c_path] = id;
      }

      c_id = this.paths[c_path];
      if (c_id == undefined || c_id == null) {
        break;
      }
    }
    log('findPathId: ', path, c_id)
    return this.paths[path];
  }

  async _findDirId(parent, name) {
    name = decodeURIComponent(name).replace(/\'/g, "\\'");
    if (parent == undefined) {
      return null;
    }

    let url = 'https://www.googleapis.com/drive/v3/files';
    let params = {
      'includeItemsFromAllDrives': true,
      'supportsAllDrives': true
    };
    params.q = `'${parent}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '${name}'  and trashed = false`;
    params.fields = "nextPageToken, files(id, name, mimeType)";
    url += '?' + enQuery(params);
    let requestOption = await this.requestOptions();
    let response;
    for (let i = 0; i < 3; i++) {
      response = await fetch(url, requestOption);
      if (response.ok) {
        break;
      }
      await sleep(800 * (i + 1));
    }
    let obj = await response.json();
    if (obj.files[0] == undefined) {
      return null;
    }
    return obj.files[0].id;
  }

  /*async getAccessToken() {
    log("accessToken");
    if (this.authConfig.expires == undefined || this.authConfig.expires < Date.now()) {
      const obj = await fetchAccessToken();
      if (obj.access_token != undefined) {
        this.authConfig.accessToken = obj.access_token;
        this.authConfig.expires = Date.now() + 3500 * 1000;
      }
    }
    return this.authConfig.accessToken;
  }*/

  /*async fetchAccessToken() {
    log("fetchAccessToken");
    const url = "https://www.googleapis.com/oauth2/v4/token";
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    var post_data;
    if (this.authConfig.service_account && typeof this.authConfig.service_account_json != "undefined") {
      const jwttoken = await JSONWebToken.generateGCPToken(this.authConfig.service_account_json);
      post_data = {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwttoken,
      };
    } else {
      post_data = {
        client_id: this.authConfig.client_id,
        client_secret: this.authConfig.client_secret,
        refresh_token: this.authConfig.refresh_token,
        grant_type: "refresh_token",
      };
    }

    let requestOption = {
      'method': 'POST',
      'headers': headers,
      'body': enQuery(post_data)
    };

    let response;
    for (let i = 0; i < 3; i++) {
      response = await fetch(url, requestOption);
      if (response.ok) {
        break;
      }
      await sleep(800 * (i + 1));
    }
    return await response.json();
  }*/

  async fetch200(url, requestOption) {
    let response;
    for (let i = 0; i < 3; i++) {
      response = await fetch(url, requestOption);
      if (response.ok) {
        break;
      }
      await sleep(800 * (i + 1));
    }
    return response;
  }

  async requestOptions(headers = {}, method = 'GET') {
    const Token = await getAccessToken();
    headers['authorization'] = 'Bearer ' + Token;
    return {
      'method': method,
      'headers': headers
    };
  }


  /*sleep(ms) {
    return new Promise(function(resolve, reject) {
      let i = 0;
      setTimeout(function() {
        log('sleep' + ms);
        i++;
        if (i >= 2) reject(new Error('i>=2'));
        else resolve(i);
      }, ms);
    })
  }*/
}
// end of class googleDrive
const drive = new googleDrive(authConfig, 0);
async function download(id, range = '', inline) {
  // ── Step 1: validate file ID ──────────────────────────────────────────────
  if (!id || typeof id !== 'string' || id.trim() === '') {
    logError('download(): invalid or empty file ID:', id);
    return new Response(JSON.stringify({ error: 'Download failed', message: 'Invalid file ID' }), {
      status: 400,
      headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
  id = id.trim();

  // ── Step 2: ensure we have a valid access token before hitting Drive API ──
  // Force-refresh if the stored token is missing or expired
  if (!authConfig.accessToken || !authConfig.expires || authConfig.expires < Date.now()) {
    log('download(): access token missing/expired — refreshing…');
    const tokenObj = await fetchAccessToken();
    if (tokenObj && tokenObj.access_token) {
      authConfig.accessToken = tokenObj.access_token;
      authConfig.expires = Date.now() + 3500 * 1000;
      log('download(): access token refreshed OK');
    } else {
      logError('download(): failed to fetch access token:', JSON.stringify(tokenObj));
      return new Response(JSON.stringify({ error: 'Download failed', message: 'Could not obtain Google API access token' }), {
        status: 502,
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  }

  // ── Step 3: fetch file metadata ───────────────────────────────────────────
  let file;
  try {
    file = await drive.findItemById(id);
  } catch (metaErr) {
    logError('download(): findItemById threw:', metaErr.message);
    return new Response(JSON.stringify({ error: 'Download failed', message: 'Metadata fetch error: ' + metaErr.message }), {
      status: 500,
      headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  // findItemById returns the raw Response object on non-OK
  if (!file || typeof file.json === 'function') {
    const httpStatus = file && file.status ? file.status : 500;
    logError('download(): findItemById returned HTTP', httpStatus, 'for id:', id);

    // If it was a 401/403 the token may have been revoked — surface clearly
    if (httpStatus === 401 || httpStatus === 403) {
      return new Response(JSON.stringify({ error: 'Download failed', message: 'Google Drive access denied (' + httpStatus + '). Check service account permissions.' }), {
        status: 403,
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    // 400 usually means a bad/garbled file ID
    if (httpStatus === 400) {
      return new Response(JSON.stringify({ error: 'Download failed', message: 'Google Drive rejected the file ID (400). The download link may be corrupted.' }), {
        status: 400,
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    return new Response(JSON.stringify({ error: 'Download failed', message: 'Metadata fetch failed: ' + httpStatus }), {
      status: httpStatus,
      headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  const random_domain_for_dl = `${uiConfig.random_domain_for_dl}`;
  if (file.status == 404 || random_domain_for_dl == 'true') {
    const res = await fetch(`${uiConfig.jsdelivr_cdn_src}@${uiConfig.version}/assets/disable_download.html`);
    return new Response(await res.text(), {
      headers: { 'content-type': 'text/html;charset=UTF-8' }
    });
  }

  if (!file.name) {
    logError('download(): file object has no name for id:', id, JSON.stringify(file));
    return new Response(JSON.stringify({ error: 'Unable to find this file. Please try again.' }), {
      status: 404,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': authConfig.cors_domain || '*',
        'Cache-Control': 'no-store'
      }
    });
  }

  // ── Step 4: build the media URL ───────────────────────────────────────────
  let filename = file.name;
  let mediaUrl = `https://www.googleapis.com/drive/v3/files/${id}?alt=media`;
  const isGoogleDocument = file.mimeType && file.mimeType.startsWith('application/vnd.google-apps.');
  if (isGoogleDocument) {
    mediaUrl = `https://www.googleapis.com/drive/v3/files/${id}/export?mimeType=application%2Fpdf`;
    filename = `${file.name}.pdf`;
    if (file.mimeType === 'application/vnd.google-apps.script') {
      mediaUrl = `https://www.googleapis.com/drive/v3/files/${id}/export?mimeType=application%2Fvnd.google-apps.script%2Bjson`;
      filename = `${file.name}.json`;
    }
  }

  // ── Step 5: stream the file ───────────────────────────────────────────────
  const requestOption = await drive.requestOptions();
  if (range) requestOption.headers['Range'] = range;

  let res;
  for (let i = 0; i < 3; i++) {
    res = await fetch(mediaUrl, requestOption);
    if (res.ok || res.status === 206) break;
    log('download(): stream attempt', i + 1, 'got HTTP', res.status);
    // On 401 force token refresh before retry
    if (res.status === 401 && i < 2) {
      const tokenObj = await fetchAccessToken();
      if (tokenObj && tokenObj.access_token) {
        authConfig.accessToken = tokenObj.access_token;
        authConfig.expires = Date.now() + 3500 * 1000;
        const refreshed = await drive.requestOptions();
        if (range) refreshed.headers['Range'] = range;
        Object.assign(requestOption, refreshed);
      }
    }
    await sleep(800 * (i + 1));
  }

  if (res.ok || res.status === 206) {
    const { headers } = res = new Response(res.body, res);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    if (file.size) headers.set('Content-Length', file.size);
    authConfig.enable_cors_file_down && headers.append('Access-Control-Allow-Origin', '*');
    if (inline === true) headers.set('Content-Disposition', 'inline');
    return res;
  } else if (res.status === 403) {
    const details = await res.text();
    return new Response(details, {
      status: 403,
      headers: { 'content-type': 'text/html;charset=UTF-8' }
    });
  } else {
    const details = await res.text();
    logError('download(): stream failed HTTP', res.status, details.substring(0, 200));
    return new Response(details, { status: res.status });
  }
}


// ✅ FIX: Use a standalone utility instead of overriding String.prototype.trim
// Overriding native prototypes can break Cloudflare internals and third-party code.
function trimChar(str, char) {
  if (char) {
    return str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
  }
  return str.replace(/^\s+|\s+$/g, '');
}


function decodeJwtToken(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

async function fetchImageWithCache(imageUrl, event) {
  try {
    const cacheKey = new Request(imageUrl);
    const cache = caches.default;

    let response = await cache.match(cacheKey);

    if (!response) {
      response = await fetch(imageUrl, {
        cf: {
          cacheTtl: 86400,
          cacheEverything: true,
        }
      });

      if (response.ok) {
        event.waitUntil(cache.put(cacheKey, response.clone()));
      }
    }

    const imageResponse = new Response(response.body, response);
    imageResponse.headers.set('Cache-Control', 'public, max-age=86400');
    imageResponse.headers.set('Access-Control-Allow-Origin', '*');

    return imageResponse;
  } catch (error) {
    logError('Error fetching image:', error);
    return new Response('Image not found', { status: 404 });
  }
}

// =============================================================================
// OPTIMIZATION: Response Caching via Cloudflare Cache API
// Replaces the unreliable in-memory Map which was reset on every
// Worker cold-start/isolate spawn. The CF Cache API is shared
// across all isolates on the same edge node and survives restarts.
// =============================================================================
const CACHE_TTL = 3600; // 1 hour in seconds

function getCacheKey(request) {
  const url = new URL(request.url);
  // Don't cache POST requests, login-related paths, or user-specific content
  if (request.method === "POST" ||
      url.pathname === "/" ||            // FIX: Never cache home page
      url.pathname.includes("login") ||
      url.pathname.includes("auth") ||
      url.pathname.includes("logout") ||
      url.pathname === "/app.min.js" ||  // User-specific JS file
      request.headers.get('cookie')) {    // Any request with cookies
    return null;
  }
  // Return a Request object keyed by URL (CF Cache API requires a Request or URL string)
  return new Request(request.url);
}

async function getCachedResponse(request) {
  const key = getCacheKey(request);
  if (!key) return null;
  try {
    const cache = caches.default;
    const cached = await cache.match(key);
    if (cached) {
      log("CF Cache hit for:", request.url);
      return cached;
    }
  } catch (e) {
    log("CF Cache match error:", e.message);
  }
  return null;
}

async function setCachedResponse(request, response) {
  const key = getCacheKey(request);
  if (!key) return;
  try {
    const cache = caches.default;
    // Clone and add Cache-Control header so CF respects the TTL
    const responseToCache = new Response(response.clone().body, response);
    responseToCache.headers.set('Cache-Control', `public, max-age=${CACHE_TTL}`);
    await cache.put(key, responseToCache);
  } catch (e) {
    log("CF Cache put error:", e.message);
  }
}

addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      const request = event.request;

      // Check cache first (now async — uses CF Cache API)
      const cached = await getCachedResponse(request);
      if (cached) {
        return cached;
      }

      // Process request
      const response = await handleRequest(request, event);

      // Cache successful responses (don't await - fire and forget)
      if (response && response.status === 200) {
        event.waitUntil(setCachedResponse(request, response));
      }

      return response;
    })().catch(
      (err) => {
        logError('Unhandled Worker error:', err.stack);
        return new Response("Something went wrong. Please try again later.", { status: 500 });
      }
    )
  );
});
