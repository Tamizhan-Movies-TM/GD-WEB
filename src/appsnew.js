

// Redesigned by telegram.dog/TheFirstSpeedster at https://www.npmjs.com/package/@googledrive/index which was written by someone else, credits are given on Source Page.More actions
// v2.3.6
// Initialize the page
function init() {
	document.siteName = $('title').html();
	
	// Check if user is logged in
	const isLoggedIn = checkLoginStatus();
	
	var html = `<header>
   <div id="nav">
   </div>
</header>
<style>
/* Login Modal Styles */
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
    animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
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

.donate .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 13rem;
    overflow: hidden;
    height: 3rem;
    background-size: 300% 300%;
    cursor: pointer;
    backdrop-filter: blur(1rem);
    border-radius: 5rem;
    transition: 0.5s;
    animation: gradient_301 5s ease infinite;
    border: double 4px transparent;
    background-image: linear-gradient(#212121, #212121),
        linear-gradient(
            137.48deg,
            #ffdb3b 10%,
            #fe53bb 45%,
            #8f51ea 67%,
            #0044ff 87%
        );
    background-origin: border-box;
    background-clip: content-box, border-box;
    text-decoration: none;
    position: relative;
}

#container-stars {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: 0.5s;
    backdrop-filter: blur(1rem);
    border-radius: 5rem;
}

strong {
    z-index: 2;
    font-family: "Avalors Personal Use", sans-serif;
    font-size: 12px;
    letter-spacing: 5px;
    color: #ffffff;
    text-shadow: 0 0 4px white;
}

#glow {
    position: absolute;
    display: flex;
    width: 12rem;
}

.circle {
    width: 100%;
    height: 30px;
    filter: blur(2rem);
    animation: pulse_3011 4s infinite;
    z-index: -1;
}

.circle:nth-of-type(1) {
    background: rgba(254, 83, 186, 0.636);
}

.circle:nth-of-type(2) {
    background: rgba(142, 81, 234, 0.704);
}

.donate .btn:hover #container-stars {
    z-index: 1;
    background-color: #212121;
}

.donate .btn:hover {
    transform: scale(1.1);
}

.donate .btn:active {
    border: double 4px #fe53bb;
    background-origin: border-box;
    background-clip: content-box, border-box;
    animation: none;
}

.donate .btn:active .circle {
    background: #fe53bb;
}

#stars {
    position: relative;
    background: transparent;
    width: 200rem;
    height: 200rem;
}

#stars::after {
    content: "";
    position: absolute;
    top: -10rem;
    left: -100rem;
    width: 100%;
    height: 100%;
    animation: animStarRotate 90s linear infinite;
}

#stars::after {
    background-image: radial-gradient(#ffffff 1px, transparent 1%);
    background-size: 50px 50px;
}

#stars::before {
    content: "";
    position: absolute;
    top: 0;
    left: -50%;
    width: 170%;
    height: 500%;
    animation: animStar 60s linear infinite;
}

#stars::before {
    background-image: radial-gradient(#ffffff 1px, transparent 1%);
    background-size: 50px 50px;
    opacity: 0.5;
}

@keyframes animStar {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(-135rem);
    }
}

@keyframes animStarRotate {
    from {
        transform: rotate(360deg);
    }
    to {
        transform: rotate(0);
    }
}

@keyframes gradient_301 {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

@keyframes pulse_3011 {
    0% {
        transform: scale(0.75);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
    }
    70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
    }
    100% {
        transform: scale(0.75);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
}

.donate:hover .qrcode {
    display: block;
}

.qrcode {
    display: none;
    margin-top: 1rem;
}
</style>

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
                    <i class="fas fa-user"></i> Username
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
                    <i class="fas fa-lock"></i> Password
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

<div class="loading" id="spinner" style="display:none;">Loading&#8230;</div>
<div class="container" style="margin-top: ${UI.header_padding}px; margin-bottom: 60px;">
	<div class="row align-items-start g-3">
		`+TamizhanWidget;
		html += ` 
    <div id="content" style="${UI.fixed_footer ? 'padding-bottom: clamp(170px, 100%, 300px);' : ''}"></div>
  </div>
  <div class="row g-3 mt-0">
     <div class="col-lg-6 col-md-12">
        <div class="card text-white mb-3 h-100">
	      <div class="card-header">
        <i class="fa-solid fa-circle-question"></i> How&nbsp; To&nbsp; Download&nbsp; Movies&nbsp; 🤔 
        </div>
        <div class="card-body d-flex align-items-center justify-content-center">
        <div class="donate btn p-0">
	       <a class="btn" href="https://t.me/tamizhan_updates/266" title="Watch Video Clearly" target="_blank">
         <strong>
             <i class="fa-solid fa-eye"></i>WATCH VIDEO
         </strong>
         <div id="container-stars">
             <div id="stars"></div>
         </div>
         <div id="glow">
             <div class="circle"></div>
             <div class="circle"></div>
         </div>
       </a>
       <div class="qrcode card" style="padding: 1rem 1rem 0 1rem;">
         <div style="padding-bottom: 1rem;">3 Step-by-step guide 🎬</div> 
	     </div>
		</div>
      </div>
    </div>
  </div>
  <div class="col-lg-6 col-md-12">
    <div class="card text-white mb-3 h-100">
      <div class="card-header">
        ${telegram_icon}&nbsp;&nbsp;Join &nbsp;Our &nbsp;Telegram &nbsp;Channels
      </div>
      <div class="card-body d-flex flex-wrap gap-2 justify-content-evenly align-items-center">
		<a href="https://cutt.ly/zrMe2JpH" target="_blank" title="𝕋𝖆𝗆𝗂𝗓𝖍𝖆𝗇 𝕄𝖔𝗏𝗂𝖾𝗌">
			<img class="image" alt="tamizhan" style="height: 45px;" src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/tm-icon.png">
		</a>
		<a href="https://cutt.ly/ZrBTy6LJ" target="_blank" title="Hollywood Tamizhan Movies">
			<img class="image" alt="Movies" style="height: 45px;" src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/htm-icon.png">
		</a>
		<a href="https://cutt.ly/irMe1nkm" target="_blank" title="Tamizhan Web Series">
			<img class="image" alt="Series" style="height: 45px;" src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/tws-icon.png">
		</a>
		<a href="https://cutt.ly/ZrMe1emr" target="_blank" title="Tamizhan Movies Backup">
			<img class="image" alt="telegram" style="height: 50px;" src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/telegram.png">
		</a>
      </div> 
    </div>
  </div>
</div>	
</div>
<div class="modal fade" id="SearchModel" data-bs-keyboard="true" tabindex="-1" aria-labelledby="SearchModelLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
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
<button id="back-to-top" class="btn btn-secondary btn-lg back-to-top shadow border border-light" style="--bs-border-opacity: .4;" role="button"><i class="fas fa-chevron-up m-0"></i></button>
<footer class="footer text-center mt-auto container ${UI.footer_style_class}" style="${UI.fixed_footer ? 'position: fixed;' : ''} ${UI.hide_footer ? 'display:none;' : 'display:block;'}">
    <div class="container" style="padding-top: 15px;">
      <div class="row">
      <div class="col-lg-4 col-md-12 text-lg-start">
      <i class="fa-brands fa-pied-piper-alt"></i> ${new Date().getFullYear()} - <a href="${UI.company_link}" target="_blank">${UI.company_name}</a> with ❤️
	    </div>
      <div class="col-lg-4 col-md-12">
      <a href="https://cutt.ly/cr9jPsvc" title="Please allow us up to 48 hours to process DMCA requests.">DMCA</a> 
      ${UI.credit ? '<span>© All Copy Rights Reserved ®™</span>' : ''}
      </div>
       <div class="col-lg-4 col-md-12 text-lg-end">
        <p>
        <a href="#"><img src="https://hitscounter.dev/api/hit?url=https%3A%2F%2F` + window.location.host + `&label=hits&icon=bar-chart-fill&color=%23198754"/></a>
        </p>
      </div>
	  <script>
		let btt = document.getElementById("back-to-top");
		window.onscroll = function () {
			scrollFunction();
		};
		function scrollFunction() {
			if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
				btt.style.display = "block";
			} else {
				btt.style.display = "none";
			}
		}
		btt.addEventListener("click", backToTop);
		function backToTop() {
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
		}
	  </script>
      </div>
	</div>
</footer>`;
	$('body').html(html);
	
	// Initialize login modal functionality
	initLoginModal();
}

// Check if user is logged in by checking cookie
function checkLoginStatus() {
	const cookie = document.cookie;
	if (cookie && cookie.includes('session=')) {
		const session = cookie.split('session=').pop().split(';').shift().trim();
		return session && session !== 'null' && session !== '';
	}
	return false;
}

// Initialize login modal
function initLoginModal() {
	const loginModal = document.getElementById('loginModal');
	const closeModalBtn = document.getElementById('closeModal');
	const loginForm = document.getElementById('loginForm');
	const errorMessage = document.getElementById('errorMessage');
	const submitBtn = document.getElementById('submitBtn');
	
	// Function to open modal
	window.openLoginModal = function() {
		loginModal.classList.add('active');
		document.body.style.overflow = 'hidden';
	};
	
	// Function to close modal
	function closeLoginModal() {
		loginModal.classList.remove('active');
		document.body.style.overflow = 'auto';
	}
	
	// Close modal on X button click
	if (closeModalBtn) {
		closeModalBtn.addEventListener('click', closeLoginModal);
	}
	
	// Close modal on background click
	loginModal.addEventListener('click', (e) => {
		if (e.target === loginModal) {
			closeLoginModal();
		}
	});
	
	// Close modal on Escape key
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && loginModal.classList.contains('active')) {
			closeLoginModal();
		}
	});
	
	// Handle login form submission
	if (loginForm) {
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
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: formData.toString()
				});
				
				const data = await response.json();
				
				if (data.ok) {
					// Success - redirect to home
					window.location.href = '/';
				} else {
					showError('Invalid username or password');
				}
			} catch (error) {
				showError('Network error. Please try again.');
			} finally {
				// Reset button state
				submitBtn.disabled = false;
				submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
			}
		});
	}
	
	// Show error message
	function showError(message) {
		errorMessage.textContent = message;
		errorMessage.style.display = 'block';
		setTimeout(() => {
			errorMessage.style.display = 'none';
		}, 5000);
	}
}

// Rest of your existing code...

// Don't know new OS thing, so I just copied it from the original source code and edited something.
const Os = {
	isWindows: navigator.userAgent.toUpperCase().indexOf('WIN') > -1,
	isMac: navigator.userAgent.toUpperCase().indexOf('MAC') > -1,
	isMacLike: /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent),
	isIos: /(iPhone|iPod|iPad)/i.test(navigator.userAgent),
	isMobile: /Android|webOS|iPhone|iPad|iPod|iOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
};

function getDocumentHeight() {
	var D = document;
	return Math.max(
		D.body.scrollHeight, D.documentElement.scrollHeight,
		D.body.offsetHeight, D.documentElement.offsetHeight,
		D.body.clientHeight, D.documentElement.clientHeight
	);
}

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split('&');
	var pair;
	for (var i = 0; i < vars.length; i++) {
		pair = vars[i].split('=');
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return (false);
}

function render(path) {
	if (path.indexOf("?") > 0) {
		path = path.substr(0, path.indexOf("?"));
	}
	title(path);
	nav(path);
	var reg = /\/\d+:$/g;
	if (path.includes("/fallback")) {
		window.scroll_status = {
			event_bound: false,
			loading_lock: false
		};
		const can_preview = getQueryVariable('a');
		const id = getQueryVariable('id');
		if (can_preview) {
			return fallback(id, true)
		} else {
			return list(null, id, true);
		}
	} else if (window.MODEL.is_search_page) {
		window.scroll_status = {
			event_bound: false,
			loading_lock: false
		};
		render_search_result_list()
	} else if (path.match(reg) || path.slice(-1) == '/') {
		window.scroll_status = {
			event_bound: false,
			loading_lock: false
		};
		list(path);
	} else {
		file(path);
	}
}

// Render title
function title(path) {
	path = decodeURIComponent(path);
	var cur = window.current_drive_order || 0;
	var drive_name = window.drive_names[cur];
	path = path.replace(`/${cur}:`, '');
	var model = window.MODEL;
	if (model.is_search_page)
		$('title').html(`Search: ${model.q} - ${UI.siteName}`);
	else
		$('title').html(`${drive_name}: ${path} - ${UI.siteName}`);
}

// Render the navigation bar with login/logout
function nav(path) {
	var model = window.MODEL;
	var html = "";
	var cur = window.current_drive_order || 0;
	const isLoggedIn = checkLoginStatus();
	
	html += `<nav class="navbar navbar-expand-lg${UI.fixed_header ?' fixed-top': ''} ${UI.header_style_class} container">
    <div class="container-fluid mx-2">
  <a class="navbar-brand d-flex align-items-center gap-2" href="/">${UI.logo_image ? '<img border="0" alt="'+UI.company_name+'" src="'+UI.logo_link_name+'" height="'+UI.logo_height+'" width="'+UI.logo_width+'">'+UI.siteName : UI.logo_link_name}</a>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <li class="nav-item">
        <a class="nav-link" href="/${cur}:/"><i class="fas fa-home fa-fw"></i>${UI.nav_link_1}</a>
      </li>`;
	
	var names = window.drive_names;
	var drive_name = window.drive_names[cur];
	
	html += `<li class="nav-item">
    <a class="nav-link" href="${UI.contact_link}" target="_blank"><i class="fas fa-paper-plane fa-fw"></i>${UI.nav_link_4}</a>
    </li>`;
	
	// Add Login or Logout button based on login status
	if (isLoggedIn && UI.show_logout_button) {
		html += `<li class="nav-item"><a class="nav-link" href="/logout"><i class="fa-solid fa-arrow-right-from-bracket fa-fw"></i>Logout</a></li>`;
	} else {
		html += `<li class="nav-item"><a class="nav-link" href="#" onclick="openLoginModal(); return false;"><i class="fa-solid fa-user fa-fw"></i>Login</a></li>`;
	}
	
	var search_text = model.is_search_page ? (model.q || '') : '';
	var search_bar = `
</ul>
<form class="d-flex" method="get" action="/${cur}:search">
<div class="input-group">
	<input class="form-control" name="q" type="search" placeholder="Search" aria-label="Search" value="${search_text}" style="border-right:0;" required>
	<button class="btn ${UI.search_button_class}" onclick="if($('#search_bar_form>input').val()) $('#search_bar_form').submit();" type="submit" style="border-color: rgba(140, 130, 115, 0.13); border-left:0;"><i class="fas fa-search" style="margin: 0"></i></button>
</div>
</form>
</div>
</div>
</nav>
`;

	// Personal or team
	if (model.root_type < 2) {
		// Show search box
		html += search_bar;
	}

	$('#nav').html(html);
}

// Sleep Function to Retry API Calls
function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

/**
 * Initiate POST request for listing
 * @param path Path
 * @param params Form params
 * @param resultCallback Success Result Callback
 * @param authErrorCallback Pass Error Callback
 */
function requestListPath(path, params, resultCallback, authErrorCallback, retries = 3, fallback = false) {
	var requestData = {
		id: params['id'] || '',
		type: 'folder',
		password: params['password'] || '',
		page_token: params['page_token'] || '',
		page_index: params['page_index'] || 0
	};
	$('#update').show();
	document.getElementById('update').innerHTML = `<div class='alert alert-info' role='alert'> Connecting...</div></div></div>`;
	if (fallback) {
		path = "/0:fallback"
	}

	function performRequest() {
		fetch(fallback ? "/0:fallback" : path, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestData)
			})
			.then(function(response) {
				if (response.status === 500) {
					document.getElementById('list').innerHTML = `<div class="text-center">
					<div class="card-body text-center">
					  <div class="${UI.file_view_alert_class}" id="file_details" role="alert"><b>500.</b> That’s an error.</div>
					</div>
					<p>The requested URL was not found on this server. That’s all we know.</p>
					<div class="card-text text-center">
					  <div class="btn-group text-center">
						<a href="/" type="button" class="btn btn-success">Homepage</a>
					  </div>
					</div><br>
				  </div>`;
					$('#update').hide();
					return 500
				}
				if (!response.ok) {
					throw new Error('Request failed');
				}
				return response.json();
			})
			.then(function(res) {
				if (res && res.error && res.error.code === 401) {
					// Password verification failed
					askPassword(path);
				} else if (res && res.data === null) {
					document.getElementById('spinner').remove();
					document.getElementById('list').innerHTML = `<div class='alert alert-danger' role='alert'> Server didn't send any data.</div></div></div>`;
					$('#update').hide();
				} else if (res && res.data) {
					resultCallback(res, path, requestData);
					$('#update').hide();
				}
			})
			.catch(function(error) {
				if (retries > 0) {
					sleep(2000);
					document.getElementById('update').innerHTML = `<div class='alert alert-info' role='alert'> Retrying...</div></div></div>`;
					performRequest(path, requestData, resultCallback, authErrorCallback, retries - 1);
				} else {
					document.getElementById('update').innerHTML = `<div class='alert alert-danger' role='alert'> Unable to get data from the server. Something went wrong.</div></div></div>`;
					document.getElementById('list').innerHTML = `<div class='alert alert-danger' role='alert'> We were unable to get data from the server. ` + error + `</div></div></div>`;
					$('#update').hide();
				}
			});
	}
	console.log("Performing Request again")
	performRequest();
}




/**
 * Search POST request
 * @param params Form params
 * @param resultCallback Success callback
 */
function requestSearch(params, resultCallback, retries = 3) {
	var p = {
		q: params['q'] || null,
		page_token: params['page_token'] || null,
		page_index: params['page_index'] || 0
	};

	function performRequest(retries) {
		fetch(`/${window.current_drive_order}:search`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(p)
			})
			.then(function(response) {
				if (!response.ok) {
					throw new Error('Request failed');
				}
				return response.json();
			})
			.then(function(res) {
				if (res && res.data === null) {
					$('#spinner').remove();
					$('#list').html(`<div class='alert alert-danger' role='alert'> Server didn't send any data.</div></div></div>`);
					$('#update').remove();
				}
				if (res && res.data) {
					if (resultCallback) resultCallback(res, p);
					$('#update').remove();
				}
			})
			.catch(function(error) {
				if (retries > 0) {
					sleep(2000);
					$('#update').html(`<div class='alert alert-info' role='alert'> Retrying...</div></div></div>`);
					performRequest(retries - 1);
				} else {
					$('#update').html(`<div class='alert alert-danger' role='alert'> Unable to get data from the server. Something went wrong. 3 Failures</div></div></div>`);
					$('#list').html(`<div class='alert alert-danger' role='alert'> We were unable to get data from the server.</div></div></div>`);
					$('#spinner').remove();
				}
			});
	}

	$('#update').html(`<div class='alert alert-info' role='alert'> Connecting...</div></div></div>`);
	performRequest(retries);
}


// Render file list
function list(path, id = '', fallback = false) {
	console.log(id);
	var cur = window.current_drive_order || 0;
	var drive_name = window.drive_names[cur];
	var folder_name = !fallback ? decodeURIComponent(path.split('/').filter(Boolean).pop()) : 'Files';
	var folder_ico = folder_icon;
	if (folder_name === cur + ':') {
		folder_ico = gdrive_icon;
		folder_name = drive_name;
	}
	var containerContent = `
    <div id="update"></div>
    <div id="head_md" style="display:none; padding: 20px 20px;"></div>
    <div class="container" id="select_items" style="padding: 0px 50px 10px; display:none;">
      <div class="d-flex align-items-center justify-content-between">
        <div class="form-check mr-3">
          <input class="form-check-input" style="margin-top: 0.3em;margin-right: 0.5em;" type="checkbox" id="select-all-checkboxes">
          <label class="form-check-label" for="select-all-checkboxes">Select all</label>
        </div>
        <button id="handle-multiple-items-copy" style="padding: 5px 10px; font-size: 12px;" class="btn btn-success">Copy</button>
      </div>
    </div>
	<div class="card">
		<div class="card-header d-flex align-items-center gap-2">
			<span>${folder_ico}</span><span class="w-100 text-truncate" id="dirname">${folder_name}</span>
		</div>
		<div id="list" class="list-group list-group-flush text-break">
		</div>
		<div class="card-footer text-muted d-flex align-items-center gap-2" id="count">
			<span class="number badge text-bg-dark">0 item</span><span class="totalsize badge text-bg-dark"></span>
		</div>
	</div>
  <div id="readme_md" style="display:none; padding: 20px 20px;"></div>
</div>`;

	$('#content').html(containerContent);

	var password = localStorage.getItem('password' + path);

	$('#list').html(`<div class="d-flex justify-content-center"><div class="spinner-border ${UI.loading_spinner_class} m-5" role="status" id="spinner"><span class="sr-only"></span></div></div>`);
	$('#readme_md').hide().html('');
	$('#head_md').hide().html('');

	function handleSuccessResult(res, path, prevReqParams) {
		console.log(res, path, prevReqParams);
		if (fallback) {
			title(res['name']);
			$('#dirname').html(res['name']);
		}
		$('#sharer').attr('href', 'https://kaceku.onrender.com/f/' + res['fid']);
		$('#sharer').removeClass('d-none');
		$('#list')
			.data('nextPageToken', res['nextPageToken'])
			.data('curPageIndex', res['curPageIndex']);

		$('#spinner').remove();

		if (res['nextPageToken'] === null) {
			$(window).off('scroll');
			window.scroll_status.event_bound = false;
			window.scroll_status.loading_lock = false;
			if (fallback) {
				append_files_to_fallback_list(path, res['data']['files']);
			} else {
				append_files_to_list(path, res['data']['files']);
			}
		} else {
			console.log('doing something...')
			if (fallback) {
				append_files_to_fallback_list(path, res['data']['files']);
			} else {
				append_files_to_list(path, res['data']['files']);
			}
			if (window.scroll_status.event_bound !== true) {
				$(window).on('scroll', function() {
					var scrollTop = $(this).scrollTop();
					var scrollHeight = getDocumentHeight();
					var windowHeight = $(this).height();

					if (scrollTop + windowHeight > scrollHeight - (Os.isMobile ? 130 : 80)) {
						if (window.scroll_status.loading_lock === true) {
							return;
						}

						window.scroll_status.loading_lock = true;

						$(`<div id="spinner" class="d-flex justify-content-center"><div class="spinner-border ${UI.loading_spinner_class} m-5" role="status" id="spinner"><span class="sr-only"></span></div></div>`)
							.insertBefore('#readme_md');

						let $list = $('#list');
						if (fallback) {
							console.log('fallback inside handleSuccessResult');
							requestListPath(path, {
									id: id,
									password: prevReqParams['password'],
									page_token: $list.data('nextPageToken'),
									page_index: $list.data('curPageIndex') + 1
								},
								handleSuccessResult,
								null, 5, id, fallback = true);
						} else {
							requestListPath(path, {
									password: prevReqParams['password'],
									page_token: $list.data('nextPageToken'),
									page_index: $list.data('curPageIndex') + 1
								},
								handleSuccessResult,
								null);
						}
					}
				});

				window.scroll_status.event_bound = true;
			}
		}

		if (window.scroll_status.loading_lock === true) {
			window.scroll_status.loading_lock = false;
		}
	}

	if (fallback) {
		console.log('fallback inside list');
		requestListPath(path, {
				id: id,
				password: password
			},
			handleSuccessResult,
			null, null, fallback = true);
	} else {
		console.log("handling this")
		requestListPath(path, {
				password: password
			},
			handleSuccessResult,
			null);
	}


	const copyBtn = document.getElementById("handle-multiple-items-copy");

	// Add a click event listener to the copy button
	copyBtn.addEventListener("click", () => {
		// Get all the checked checkboxes
		const checkedItems = document.querySelectorAll('input[type="checkbox"]:checked');

		// Create an array to store the selected items' data
		const selectedItemsData = [];

		// Loop through each checked checkbox
    if (checkedItems.length === 0) {
      alert("No items selected!");
      return;
    }
		checkedItems.forEach((item) => {
			// Get the value of the checkbox (in this case, the URL)
			const itemData = item.value;
			// Push the value to the array
			selectedItemsData.push(itemData);
		});

		// Join the selected items' data with a newline character
		const dataToCopy = selectedItemsData.join("\n");

		// Create a temporary input element
		const tempInput = document.createElement("textarea");
		tempInput.value = dataToCopy;

		// Add the temporary input element to the document
		document.body.appendChild(tempInput);

		// Select the text inside the temporary input element
		tempInput.select();

		// Copy the selected text to the clipboard
		document.execCommand("copy");

		// Remove the temporary input element from the document
		document.body.removeChild(tempInput);

		// Alert the user that the data has been copied
		alert("Selected items copied to clipboard!");
	});
}

function askPassword(path) {
	$('#spinner').remove();
	var passwordInput = prompt("Directory encryption, please enter the password", "");
	localStorage.setItem('password' + path, passwordInput);

	if (passwordInput != null && passwordInput != "") {
		list(path);
	} else {
		history.go(-1);
	}
}

/**
 * Append the data of the requested new page to the list
 * @param path
 * @param files request result
 */
function append_files_to_fallback_list(path, files) {
	try {
		console.log('append_files_to_fallback_list');
		var $list = $('#list');
		// Is it the last page of data?
		var is_lastpage_loaded = null === $list.data('nextPageToken');
		var is_firstpage = '0' == $list.data('curPageIndex');

		html = "";
		let targetFiles = [];
		var totalsize = 0;
		var is_file = false
		if (files.length == 0) {
			html = `<div class="card-body"><div class="d-flex justify-content-center align-items-center flex-column gap-3 pt-4 pb-4">
						<span><i class="fa-solid fa-heart-crack fa-2xl me-0"></i></span>
						<span>This folder is empty</span>
					</div></div>`;
		}
		for (i in files) {
			var item = files[i];
			var p = "/fallback?id=" + item.id
			item['createdTime'] = utc2jakarta(item['createdTime']);
			// replace / with %2F
			if (item['mimeType'] == 'application/vnd.google-apps.folder') {
				html += `<div class="list-group-item list-group-item-action d-flex align-items-center flex-md-nowrap flex-wrap justify-sm-content-between column-gap-2"><a href="${p}" style="color: ${UI.folder_text_color};" class="countitems w-100 d-flex align-items-start align-items-xl-center gap-2"><span>${folder_icon}</span>${item.name}</a>${UI.display_time ? `<span class="badge bg-info" style="margin-left: 2rem;">` + item['createdTime'] + `</span>` : ``}${UI.display_size ? `<span class="badge bg-dark-info-transparent my-1 text-center" style="min-width: 85px;">—</span>` : ``}<span class="d-flex gap-2">
				${UI.display_download ? `<a class="d-flex align-items-center" href="${p}" title="via Index"><i class="far fa-folder-open fa-lg"></i></a>` : ``}</span></div>`;
			} else {
				var totalsize = totalsize + Number(item.size || 0);
				item['size'] = formatFileSize(item['size']) || '—';
				var is_file = true
				var epn = item.name;
				var link = UI.random_domain_for_dl ? UI.downloaddomain + item.link : window.location.origin + item.link;
				var pn = path + epn.replace(new RegExp('#', 'g'), '%23').replace(new RegExp('\\?', 'g'), '%3F');
				var c = "file";
				// README is displayed after the last page is loaded, otherwise it will affect the scroll event
				if (is_lastpage_loaded && item.name == "README.md" && UI.render_readme_md) {
					get_file(p, item, function(data) {
						markdown("#readme_md", data);
						$("img").addClass("img-fluid")
					});
				}
				if (item.name == "HEAD.md" && UI.render_head_md) {
					get_file(p, item, function(data) {
						markdown("#head_md", data);
						$("img").addClass("img-fluid")
					});
				}
				var ext = item.fileExtension
				//if ("|html|php|css|go|java|js|json|txt|sh|md|mp4|webm|avi|bmp|jpg|jpeg|png|gif|m4a|mp3|flac|wav|ogg|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|pdf|".indexOf(`|${ext}|`) >= 0) {
				//targetFiles.push(filepath);
				pn += "?a=view";
				c += " view";
				//}
				html += `<div class="list-group-item list-group-item-action d-flex align-items-center flex-md-nowrap flex-wrap justify-sm-content-between column-gap-2">${UI.allow_selecting_files ? '<input class="form-check-input" style="margin-top: 0.3em;margin-right: 0.5em;" type="checkbox" value="'+link+'" id="flexCheckDefault">' : ''}<a class="countitems size_items w-100 d-flex align-items-start align-items-xl-center gap-2" style="text-decoration: none; color: ${UI.css_a_tag_color};" href="${p}&a=view"><span>`

				if ("|mp4|webm|avi|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|".indexOf(`|${ext}|`) >= 0) {
					html += video_icon
				} else if ("|html|php|css|go|java|js|json|txt|sh|".indexOf(`|${ext}|`) >= 0) {
					html += code_icon
				} else if ("|zip|rar|tar|.7z|.gz|".indexOf(`|${ext}|`) >= 0) {
					html += zip_icon
				} else if ("|bmp|jpg|jpeg|png|gif|".indexOf(`|${ext}|`) >= 0) {
					html += image_icon
				} else if ("|m4a|mp3|flac|wav|ogg|".indexOf(`|${ext}|`) >= 0) {
					html += audio_icon
				} else if ("|md|".indexOf(`|${ext}|`) >= 0) {
					html += markdown_icon
				} else if ("|pdf|".indexOf(`|${ext}|`) >= 0) {
					html += pdf_icon
				} else if (item.mimeType.startsWith('application/vnd.google-apps.')) {
					html += `<img src="${item.iconLink}" class="d-flex" style="width: 1.24rem; margin-left: 0.12rem; margin-right: 0.12rem;">`
				} else {
					html += file_icon
				}

				html += `</span>${item.name}</a>${UI.display_time ? `<span class="badge bg-info" style="margin-left: 2rem;">` + item['createdTime'] + `</span>` : ``}${UI.display_size ? `<span class="badge bg-primary my-1 ${item['size'] == '—' ? 'text-center' : 'text-end'}" style="min-width: 85px;">` + item['size'] + `</span>` : ``}<span class="d-flex gap-2">
				${UI.display_download ? `<a class="d-flex align-items-center" href="${link}" title="via Index"><svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" fill="currentColor" viewBox="0 0 16 16"> <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path></svg></a>` : ``}</span></div>`;
			}
		}
		if (is_file && UI.allow_selecting_files) {
			document.getElementById('select_items').style.display = 'block';
		}


		/*let targetObj = {};
		targetFiles.forEach((myFilepath, myIndex) => {
		    if (!targetObj[myFilepath]) {
		        targetObj[myFilepath] = {
		            filepath: myFilepath,
		            prev: myIndex === 0 ? null : targetFiles[myIndex - 1],
		            next: myIndex === targetFiles.length - 1 ? null : targetFiles[myIndex + 1],
		        }
		    }
		})
		// console.log(targetObj)
		if (Object.keys(targetObj).length) {
		    localStorage.setItem(path, JSON.stringify(targetObj));
		    // console.log(path)
		}*/

		if (targetFiles.length > 0) {
			let old = localStorage.getItem(path);
			let new_children = targetFiles;
			// Reset on page 1; otherwise append
			if (!is_firstpage && old) {
				let old_children;
				try {
					old_children = JSON.parse(old);
					if (!Array.isArray(old_children)) {
						old_children = []
					}
				} catch (e) {
					old_children = [];
				}
				new_children = old_children.concat(targetFiles)
			}

			localStorage.setItem(path, JSON.stringify(new_children))
		}

		// When it is page 1, remove the horizontal loading bar
		$list.html(($list.data('curPageIndex') == '0' ? '' : $list.html()) + html);
		// When it is the last page, count and display the total number of items
		if (is_lastpage_loaded) {
			total_size = formatFileSize(totalsize) || '0 Bytes';
			total_items = $list.find('.countitems').length;
			total_files = $list.find('.size_items').length;
			if (total_items == 0) {
				$('#count').removeClass('d-none').find('.number').text("0 item");
			} else if (total_items == 1) {
				$('#count').removeClass('d-none').find('.number').text(total_items + " item");
			} else {
				$('#count').removeClass('d-none').find('.number').text(total_items + " items");
			}
			if (total_files == 0) {
				$('#count').removeClass('d-none').find('.totalsize').text("0 file");
			} else if (total_files == 1) {
				$('#count').removeClass('d-none').find('.totalsize').text(total_files + " file, total: " + total_size);
			} else {
				$('#count').removeClass('d-none').find('.totalsize').text(total_files + " files, total: " + total_size);
			}
		}
	} catch (e) {
		console.log(e);
	}
}

/**
 * Append the data of the requested new page to the list
 * @param path
 * @param files request result
 */
function append_files_to_list(path, files) {
	var $list = $('#list');
	// Is it the last page of data?
	var is_lastpage_loaded = null === $list.data('nextPageToken');
	var is_firstpage = '0' == $list.data('curPageIndex');

	html = "";
	let targetFiles = [];
	var totalsize = 0;
	var is_file = false
	if (files.length == 0) {
		html = `<div class="card-body"><div class="d-flex justify-content-center align-items-center flex-column gap-3 pt-4 pb-4">
					<span><i class="fa-solid fa-heart-crack fa-2xl me-0"></i></span>
					<span>This folder is empty</span>
				</div></div>`;
	}
	for (i in files) {
		var item = files[i];
		var ep = encodeURIComponent(item.name).replace(/\//g, '%2F') + '/';
		var p = path + ep.replace(new RegExp('#', 'g'), '%23').replace(new RegExp('\\?', 'g'), '%3F');
		item['createdTime'] = utc2jakarta(item['createdTime']);
		// replace / with %2F
		if (item['mimeType'] == 'application/vnd.google-apps.folder') {
			html += `<div class="list-group-item list-group-item-action d-flex align-items-center flex-md-nowrap flex-wrap justify-sm-content-between column-gap-2"><a href="${p}" style="color: ${UI.folder_text_color};" class="countitems w-100 d-flex align-items-start align-items-xl-center gap-2"><span>${folder_icon}</span>${item.name}</a>${UI.display_time ? `<span class="badge bg-info" style="margin-left: 2rem;">` + item['createdTime'] + `</span>` : ``}<span class="d-flex gap-2">
			${UI.display_download ? `<a class="d-flex align-items-center" href="${p}" title="via Index"><i class="far fa-folder-open fa-lg"></i></a>` : ``}</span></div>`;
		} else {
			var totalsize = totalsize + Number(item.size || 0);
			item['size'] = formatFileSize(item['size']) || '—';
			var is_file = true
			var epn = item.name;
			var link = UI.random_domain_for_dl ? UI.downloaddomain + item.link : window.location.origin + item.link;
			var pn = path + epn.replace(new RegExp('#', 'g'), '%23').replace(new RegExp('\\?', 'g'), '%3F');
			var c = "file";
			// README is displayed after the last page is loaded, otherwise it will affect the scroll event
			if (is_lastpage_loaded && item.name == "README.md" && UI.render_readme_md) {
				get_file(p, item, function(data) {
					markdown("#readme_md", data);
					$("img").addClass("img-fluid")
				});
			}
			if (item.name == "HEAD.md" && UI.render_head_md) {
				get_file(p, item, function(data) {
					markdown("#head_md", data);
					$("img").addClass("img-fluid")
				});
			}
			var ext = item.fileExtension
			//if ("|html|php|css|go|java|js|json|txt|sh|md|mp4|webm|avi|bmp|jpg|jpeg|png|gif|m4a|mp3|flac|wav|ogg|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|pdf|".indexOf(`|${ext}|`) >= 0) {
			//targetFiles.push(filepath);
			pn += "?a=view";
			c += " view";
			//}
			html += `<div class="list-group-item list-group-item-action d-flex align-items-center flex-md-nowrap flex-wrap justify-sm-content-between column-gap-2">${UI.allow_selecting_files ? '<input class="form-check-input" style="margin-top: 0.3em;margin-right: 0.5em;" type="checkbox" value="'+link+'" id="flexCheckDefault">' : ''}<a class="countitems size_items w-100 d-flex align-items-start align-items-xl-center gap-2" style="text-decoration: none; color: ${UI.css_a_tag_color};" href="${pn}"><span>`

			if ("|mp4|webm|avi|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|".indexOf(`|${ext}|`) >= 0) {
				html += video_icon
			} else if ("|html|php|css|go|java|js|json|txt|sh|".indexOf(`|${ext}|`) >= 0) {
				html += code_icon
			} else if ("|zip|rar|tar|.7z|.gz|".indexOf(`|${ext}|`) >= 0) {
				html += zip_icon
			} else if ("|bmp|jpg|jpeg|png|gif|".indexOf(`|${ext}|`) >= 0) {
				html += image_icon
			} else if ("|m4a|mp3|flac|wav|ogg|".indexOf(`|${ext}|`) >= 0) {
				html += audio_icon
			} else if ("|md|".indexOf(`|${ext}|`) >= 0) {
				html += markdown_icon
			} else if ("|pdf|".indexOf(`|${ext}|`) >= 0) {
				html += pdf_icon
			} else if (item.mimeType.startsWith('application/vnd.google-apps.')) {
				html += `<img src="${item.iconLink}" class="d-flex" style="width: 1.24rem; margin-left: 0.12rem; margin-right: 0.12rem;">`
			} else {
				html += file_icon
			}

			html += `</span>${item.name}</a>${UI.display_time ? `<span class="badge bg-info" style="margin-left: 2rem;">` + item['createdTime'] + `</span>` : ``}${UI.display_size ? `<span class="badge bg-primary my-1 ${item['size'] == '—' ? 'text-center' : 'text-end'}" style="min-width: 85px;">` + item['size'] + `</span>` : ``}<span class="d-flex gap-2">
	    ${UI.display_download ? `<a class="d-flex align-items-center" href="${link}" title="via Index"><svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" fill="currentColor" viewBox="0 0 16 16"> <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path></svg></a>` : ``}</span></div>`;
		}
	}
	if (is_file && UI.allow_selecting_files) {
		document.getElementById('select_items').style.display = 'block';
	}


	/*let targetObj = {};
	targetFiles.forEach((myFilepath, myIndex) => {
	    if (!targetObj[myFilepath]) {
	        targetObj[myFilepath] = {
	            filepath: myFilepath,
	            prev: myIndex === 0 ? null : targetFiles[myIndex - 1],
	            next: myIndex === targetFiles.length - 1 ? null : targetFiles[myIndex + 1],
	        }
	    }
	})
	// console.log(targetObj)
	if (Object.keys(targetObj).length) {
	    localStorage.setItem(path, JSON.stringify(targetObj));
	    // console.log(path)
	}*/

	if (targetFiles.length > 0) {
		let old = localStorage.getItem(path);
		let new_children = targetFiles;
		// Reset on page 1; otherwise append
		if (!is_firstpage && old) {
			let old_children;
			try {
				old_children = JSON.parse(old);
				if (!Array.isArray(old_children)) {
					old_children = []
				}
			} catch (e) {
				old_children = [];
			}
			new_children = old_children.concat(targetFiles)
		}

		localStorage.setItem(path, JSON.stringify(new_children))
	}

	// When it is page 1, remove the horizontal loading bar
	$list.html(($list.data('curPageIndex') == '0' ? '' : $list.html()) + html);
	// When it is the last page, count and display the total number of items
	if (is_lastpage_loaded) {
		total_size = formatFileSize(totalsize) || '0 Bytes';
		total_items = $list.find('.countitems').length;
		total_files = $list.find('.size_items').length;
		if (total_items == 0) {
			$('#count').removeClass('d-none').find('.number').text("0 item");
		} else if (total_items == 1) {
			$('#count').removeClass('d-none').find('.number').text(total_items + " item");
		} else {
			$('#count').removeClass('d-none').find('.number').text(total_items + " items");
		}
		if (total_files == 0) {
			$('#count').removeClass('d-none').find('.totalsize').text("0 file");
		} else if (total_files == 1) {
			$('#count').removeClass('d-none').find('.totalsize').text(total_files + " file, total: " + total_size);
		} else {
			$('#count').removeClass('d-none').find('.totalsize').text(total_files + " files, total: " + total_size);
		}
	}
}

/**
 * Render the search results list. There is a lot of repetitive code, but there are different logics in it.
 */
function render_search_result_list() {
	var model = window.MODEL;
	
	// Add search bar to the card header with white background
	var searchBar = `
	<form class="d-flex mt-2" method="get" action="/${window.current_drive_order}:search">
		<div class="input-group">
			<input class="form-control bg-white text-dark" name="q" type="search" placeholder="Search to Type Movies Name + Year" aria-label="Search" value="${model.q}" style="border-right:0;" required>
			  <button class="btn btn-success" type="submit" style="border-color: rgba(140, 130, 115, 0.13); border-left:0;">
				<i class="fas fa-search" style="margin: 0"></i>
			</button>
		</div>
	</form>`;
	
	var content = `
  	<div id="update"></div>
	<div class="container" id="select_items" style="padding: 0px 50px 10px; display:none;">
		<div class="d-flex align-items-center justify-content-between">
			<div class="form-check mr-3">
			<input class="form-check-input" style="margin-top: 0.3em;margin-right: 0.5em;" type="checkbox" id="select-all-checkboxes">
			<label class="form-check-label" for="select-all-checkboxes">Select all</label>
			</div>
			<button id="handle-multiple-items-copy" style="padding: 5px 10px; font-size: 12px;" class="btn btn-success">Copy</button>
		</div>
	</div>
	<div class="card">
		<div class="card-header">
			<div class="text-truncate"><i class="fas fa-search fa-fw"></i> Search: <code>${model.q}</code></div>
			${searchBar}
		</div>
		<div id="list" class="list-group list-group-flush text-break">
			<div class="d-flex justify-content-center"><div class="spinner-border ${UI.loading_spinner_class} m-5" role="status" id="spinner"><span class="sr-only"></span></div></div>
		</div>
		<div class="card-footer text-muted d-flex align-items-center gap-2" id="count"><span class="number badge text-bg-dark">0 item</span><span class="totalsize badge text-bg-dark"></span></div>
	</div>
	<div id="readme_md" style="display:none; padding: 20px 20px;"></div>`;
	
	$('#content').html(content);
	$('#readme_md').hide();
	$('#head_md').hide();

	// Fast scroll handler with passive event listener
	let ticking = false;
	function onScroll() {
		if (!ticking) {
			requestAnimationFrame(() => {
				const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
				const scrollHeight = document.documentElement.scrollHeight;
				const windowHeight = window.innerHeight;
				
				// Preload at 400px from bottom
				if (scrollTop + windowHeight > scrollHeight - 400) {
					if (window.scroll_status.loading_lock) return;
					
					window.scroll_status.loading_lock = true;
					const $list = $('#list');
					const nextToken = $list.data('nextPageToken');
					const curIndex = $list.data('curPageIndex');
					
					if (nextToken) {
						$(`<div id="spinner" class="d-flex justify-content-center"><div class="spinner-border ${UI.loading_spinner_class} m-5" role="status"><span class="sr-only"></span></div></div>`)
							.insertBefore('#readme_md');
						
						requestSearch({
							q: window.MODEL.q,
							page_token: nextToken,
							page_index: curIndex + 1
						}, searchSuccessCallback);
					}
				}
				ticking = false;
			});
			ticking = true;
		}
	}

	/**
	 * Fast callback for search results
	 */
	function searchSuccessCallback(res, prevReqParams) {
		const $list = $('#list');
		
		// Store pagination data
		$list.data('nextPageToken', res['nextPageToken'])
			 .data('curPageIndex', res['curPageIndex']);

		// Remove spinner instantly
		$('#spinner').remove();

		// Fast render with requestAnimationFrame
		requestAnimationFrame(() => {
			append_search_result_to_list(res['data']['files']);
		});

		// Setup scroll only once
		if (!window.scroll_status.event_bound && res['nextPageToken']) {
			window.addEventListener('scroll', onScroll, { passive: true });
			window.scroll_status.event_bound = true;
		} else if (!res['nextPageToken']) {
			window.removeEventListener('scroll', onScroll);
			window.scroll_status.event_bound = false;
		}

		window.scroll_status.loading_lock = false;
	}

	// Initialize scroll status
	window.scroll_status = window.scroll_status || { 
		event_bound: false, 
		loading_lock: false 
	};

	// Start first request immediately
	requestSearch({ q: window.MODEL.q }, searchSuccessCallback);

	// Fast copy handler with modern API
	document.getElementById("handle-multiple-items-copy").addEventListener("click", () => {
		const checked = document.querySelectorAll('input[type="checkbox"]:checked');
		
		if (checked.length === 0) {
			alert("No items selected!");
			return;
		}

		const data = Array.from(checked).map(cb => cb.value).join("\n");

		if (navigator.clipboard?.writeText) {
			navigator.clipboard.writeText(data).then(() => {
				alert("Selected items copied to clipboard!");
			}).catch(() => {
				const el = document.createElement("textarea");
				el.value = data;
				el.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
				document.body.appendChild(el);
				el.select();
				document.execCommand("copy");
				document.body.removeChild(el);
				alert("Selected items copied to clipboard!");
			});
		} else {
			const el = document.createElement("textarea");
			el.value = data;
			el.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
			document.body.appendChild(el);
			el.select();
			document.execCommand("copy");
			document.body.removeChild(el);
			alert("Selected items copied to clipboard!");
		}
	}, { passive: true });
}

/**
 * Append a new page of search results
 * @param files
 */
function append_search_result_to_list(files) {
	try {
		var cur = window.current_drive_order || 0;
		var $list = $('#list');
		// Is it the last page of data?
		var is_lastpage_loaded = null === $list.data('nextPageToken');
		// var is_firstpage = '0' == $list.data('curPageIndex');

		// Sort files by size in descending order (largest first)
		files.sort((a, b) => {
			const sizeA = parseInt(a.size || 0);
			const sizeB = parseInt(b.size || 0);
			return sizeB - sizeA;
		});

		html = "";
		var totalsize = 0;
		var is_file = false;
		for (i in files) {
			var item = files[i];
			
			// Skip folders in search results
			if (item['mimeType'] == 'application/vnd.google-apps.folder') {
				continue; // This will skip the rest of the loop for this item
			}
			
			if (item['size'] == undefined) {
				item['size'] = "";
			}
			item['createdTime'] = utc2jakarta(item['createdTime']);
			
			// Only process files (folders are skipped above)
			var is_file = true;
			var totalsize = totalsize + Number(item.size || 0);
			item['size'] = formatFileSize(item['size']) || '—';
			item['md5Checksum'] = item['md5Checksum'] || '—';
			var ext = item.fileExtension;
			var link = UI.random_domain_for_dl ? UI.downloaddomain + item.link : window.location.origin + item.link;
			html += `<div class="list-group-item list-group-item-action d-flex align-items-center flex-md-nowrap flex-wrap justify-sm-content-between column-gap-2" gd-type="$item['mimeType']}">${UI.allow_selecting_files ? '<input class="form-check-input" style="margin-top: 0.3em;margin-right: 0.5em;" type="checkbox" value="'+link+'" id="flexCheckDefault">' : ''}<a href="#" onclick="onSearchResultItemClick('${item['id']}', true, ${JSON.stringify(item).replace(/"/g, "&quot;")})" data-bs-toggle="modal" data-bs-target="#SearchModel" class="countitems size_items w-100 d-flex align-items-start align-items-xl-center gap-2" style="text-decoration: none; color: ${UI.css_a_tag_color};"><span>`

			if ("|mp4|webm|avi|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|".indexOf(`|${ext}|`) >= 0) {
				html += video_icon
			} else if ("|html|php|css|go|java|js|json|txt|sh|".indexOf(`|${ext}|`) >= 0) {
				html += code_icon
			} else if ("|zip|rar|tar|.7z|.gz|".indexOf(`|${ext}|`) >= 0) {
				html += zip_icon
			} else if ("|bmp|jpg|jpeg|png|gif|".indexOf(`|${ext}|`) >= 0) {
				html += image_icon
			} else if ("|m4a|mp3|flac|wav|ogg|".indexOf(`|${ext}|`) >= 0) {
				html += audio_icon
			} else if ("|md|".indexOf(`|${ext}|`) >= 0) {
				html += markdown_icon
			} else if ("|pdf|".indexOf(`|${ext}|`) >= 0) {
				html += pdf_icon
			} else if (item.mimeType.startsWith('application/vnd.google-apps.')) {
				html += `<img src="${item.iconLink}" class="d-flex" style="width: 1.24rem; margin-left: 0.12rem; margin-right: 0.12rem;">`
			} else {
				html += file_icon
			}

			html += `</span>${item.name}</a>${UI.display_time ? `<span class="badge bg-info" style="margin-left: 2rem;">` + item['createdTime'] + `</span>` : ``}${UI.display_size ? `<span class="badge bg-primary my-1 ${item['size'] == '—' ? 'text-center' : 'text-end'}" style="min-width: 85px;">` + item['size'] + `</span>` : ``}<span class="d-flex gap-2">
			${UI.display_download ? `<a class="d-flex align-items-center" href="${link}" title="via Index"><svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path> <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path></svg></a>` : ``}</span></div>`;
		}
		if (is_file && UI.allow_selecting_files) {
			document.getElementById('select_items').style.display = 'block';
		}
		// When it is page 1, remove the horizontal loading bar
		$list.html(($list.data('curPageIndex') == '0' ? '' : $list.html()) + html);
		// When it is the last page, count and display the total number of items
		if (is_lastpage_loaded) {
			total_size = formatFileSize(totalsize) || '0 Bytes';
			total_items = $list.find('.countitems').length;
			total_files = $list.find('.size_items').length;
			if (total_items == 0) {
				$('#count').removeClass('d-none').find('.number').text("0 item");
			} else if (total_items == 1) {
				$('#count').removeClass('d-none').find('.number').text(total_items + " item");
			} else {
				$('#count').removeClass('d-none').find('.number').text(total_items + " items");
			}
			if (total_files == 0) {
				$('#count').removeClass('d-none').find('.totalsize').text("0 file");
			} else if (total_files == 1) {
				$('#count').removeClass('d-none').find('.totalsize').text(total_files + " file, total: " + total_size);
			} else {
				$('#count').removeClass('d-none').find('.totalsize').text(total_files + " files, total: " + total_size);
			}
		}
	} catch (e) {
		console.log(e);
	}
}

// Modified onSearchResultItemClick function - Always generates GPLinks
async function onSearchResultItemClick(file_id, can_preview, file) {
    var cur = window.current_drive_order;
    
    // Set title immediately
    var title = `<i class="fas fa-file-alt fa-fw"></i> File Information`;
    $('#SearchModelLabel').html(title);
    
    // Create the direct URL
    const encodedFileId = encodeURIComponent(file_id);
    const directUrl = `${window.location.origin}/fallback?id=${encodedFileId}${can_preview ? '&a=view' : ''}`;
    
    // Function to get Chrome open URL
    function getChromeOpenUrl(url) {
        if (/Android/i.test(navigator.userAgent)) {
            return `intent://${url.replace(/https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
        } else {
            return url;
        }
    }
    
    // Generate file info content
    let content = `
    <table class="table table-dark" style="margin-bottom: 0 !important;">
        <tbody>
            <tr>
                <th>
                    <i class="fa-regular fa-folder-closed fa-fw"></i>
                    <span class="tth">Name</span>
                </th>
                <td>${file['name']}</td>
            </tr>
            <tr>
                <th>
                    <i class="fa-regular fa-clock fa-fw"></i>
                    <span class="tth">Datetime</span>
                </th>
                <td>${file['createdTime']}</td>
            </tr>
            <tr>
                <th>
                    <i class="fa-solid fa-tag fa-fw"></i>
                    <span class="tth">Type</span>
                </th>
                <td>${file['mimeType']}</td>
            </tr>`;
    
    if (file['mimeType'] !== 'application/vnd.google-apps.folder') {
        content += `
            <tr>
                <th>
                    <i class="fa-solid fa-box-archive fa-fw"></i>
                    <span class="tth">Size</span>
                </th>
                <td>${file['size']}</td>
            </tr>`;
    }
    content += `
        </tbody>
    </table>`;
    
    const close_btn = `<button type="button" class="btn btn-danger" data-bs-dismiss="modal">𝗖𝗹𝗼𝘀𝗲</button>`;
    
    // Show content with loading button immediately
    const loadingButton = `
        <button class="btn btn-info d-flex align-items-center gap-2" disabled>
            <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            Generating link...
        </button>`;
    
    $('#modal-body-space').html(content);
    $('#modal-body-space-buttons').html(loadingButton + close_btn);
    
    // Style adjustments
    $('#modal-body-space').attr('style', 'padding-bottom: 0 !important; margin-bottom: 0 !important; border-bottom: none !important;');
    $('#modal-body-space-buttons').attr('style', 'padding-top: 10px !important; margin-top: 0 !important; border-top: none !important; text-align: center !important; display: flex !important; justify-content: center !important; gap: 10px !important;');
    
    // Always generate GPLinks - no timeout, no fallback
    let finalUrl = null;
    let retries = 3;
    let buttonLabel = '𝗢𝗽𝗲𝗻 𝗶𝗻 𝗖𝗵𝗿𝗼𝗺𝗲 (GPLinks)';
    
    while (retries > 0 && !finalUrl) {
        try {
            console.log(`GPLinks - Attempt ${4 - retries}/3 - Requesting short URL from worker...`);
            
            const response = await fetch('/generate-gplinks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: directUrl })
            });
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.success && data.short_url) {
                    finalUrl = data.short_url;
                    console.log('GPLinks - Generated short URL:', finalUrl);
                    break;
                }
            }
            
            retries--;
            if (retries > 0) {
                console.log(`GPLinks - Retry ${4 - retries}/3 in 2 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } catch (error) {
            console.error('GPLinks attempt error:', error);
            retries--;
            if (retries > 0) {
                console.log(`GPLinks - Retry ${4 - retries}/3 in 2 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    
    // If we still don't have a link, show error
    if (!finalUrl) {
        console.error('GPLinks - Failed after 3 attempts');
        const errorButton = `<button class="btn btn-danger" disabled>Failed to generate GPLinks link</button>`;
        $('#modal-body-space-buttons').html(errorButton + close_btn);
        return;
    }
    
    // Create final button with the GPLinks URL
    const chromeButtonHtml = `
        <a href="${getChromeOpenUrl(finalUrl)}" 
           class="btn btn-info d-flex align-items-center gap-2" 
           target="_blank"
           title="Open in Chrome">
            <img src="https://www.google.com/chrome/static/images/chrome-logo.svg" alt="Chrome" style="height: 20px; width: 20px;">
            ${buttonLabel}
        </a>`;
    
    // Update button with final URL
    $('#modal-body-space-buttons').html(chromeButtonHtml + close_btn);
    
    // Optional: Fetch path in background if needed
    fetch(`/${cur}:id2path`, {
        method: 'POST',
        body: JSON.stringify({ id: file_id }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).catch(error => console.log('Path fetch error:', error));
}

function get_file(path, file, callback) {
	var key = "file_path_" + path + file['createdTime'];
	var data = localStorage.getItem(key);
	if (data != undefined) {
		return callback(data);
	} else {
		$.get(path, function(d) {
			localStorage.setItem(key, d);
			callback(d);
		});
	}
}

async function fallback(id, type) {
	if (type) { // is a file id
		var cookie_folder_id = await getCookie("root_id") || '';
		$('#content').html(`<div class="d-flex justify-content-center" style="height: 150px"><div class="spinner-border ${UI.loading_spinner_class} m-5" role="status" id="spinner"><span class="sr-only"></span></div></div>`);
		fetch("/0:fallback", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id
				}),
			})
			.then(function(response) {
				if (!response.ok) {
					throw new Error("Request failed");
				}
				return response.json();
			})
			.then(function(obj) {
				console.log(obj);
				title(obj.name);
				const mimeType = obj.mimeType;
				const fileExtension = obj.fileExtension ? obj.fileExtension.toLowerCase() : 'GoogleApps';
				const createdTime = utc2jakarta(obj.createdTime);
				const code = ["php", "css", "go", "java", "js", "json", "txt", "sh", "md", "html", "xml", "py", "rb", "c", "cpp", "h", "hpp"];
				const video = ["mp4", "webm", "avi", "mpg", "mpeg", "mkv", "rm", "rmvb", "mov", "wmv", "asf", "ts", "flv", "3gp", "m4v"];
				const audio = ["mp3", "flac", "wav", "ogg", "m4a", "aac", "wma", "alac"];
				if (mimeType === "application/vnd.google-apps.folder") {
					window.location.href = window.location.pathname + "/";
				} else if (fileExtension) {
					const name = obj.name;
					const bytes = obj.size || 0;
					const md5Checksum = obj.md5Checksum || '—';
					const size = formatFileSize(obj.size) || '—';
					const encoded_name = encodeURIComponent(name);
					const url = UI.random_domain_for_dl ? UI.downloaddomain + obj.link : window.location.origin + obj.link;
					const file_id = obj.fid;
					var poster = obj.thumbnailLink ? obj.thumbnailLink.replace("s220", "s0") : null;
					if (mimeType.includes("video") || video.includes(fileExtension)) {
						var poster = obj.thumbnailLink ? poster : UI.poster;
						file_video(name, encoded_name, size, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id);
					} else if (mimeType.includes("audio") || audio.includes(fileExtension)) {
						file_audio(name, encoded_name, size, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id);
					} else if (code.includes(fileExtension)) {
						file_code(name, encoded_name, size, bytes, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id);
					} else {
						file_others(name, encoded_name, size, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id);
					}
				}
			})
			.catch(function(error) {
				var content = `
				<div class="card">
					<div class="card-header ${UI.file_view_alert_class}">
						<i class="fas fa-file-alt fa-fw"></i>File Information
					</div>
					<div class="card-body text-center">
						<div class="${UI.file_view_alert_class}" id="file_details" role="alert"><b>404.</b> That’s an error. ` + error + `</div>
						<p>The requested URL was not found on this server. That’s all we know.</p>
						<a href="/" type="button" class="btn btn-success"><i class="fas fa-home fa-fw"></i>Home</a>
					</div>
				</div>`;
				$("#content").html(content);
			});
	} else { // is a folder id
		return list(id, true);
	}
}

// File display ?a=view
async function file(path) {
	var cookie_folder_id = await getCookie("root_id") || '';
	var name = path.split('/').pop();
	$('#content').html(`<div class="d-flex justify-content-center" style="height: 150px"><div class="spinner-border ${UI.loading_spinner_class} m-5" role="status" id="spinner"><span class="sr-only"></span></div></div>`);
	fetch("", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				path: path
			}),
		})
		.then(function(response) {
			if (!response.ok) {
				throw new Error("Request failed");
			}
			return response.json();
		})
		.then(function(obj) {
			console.log(obj);
			const mimeType = obj.mimeType;
			const createdTime = utc2jakarta(obj.createdTime);
			const fileExtension = obj.fileExtension ? obj.fileExtension.toLowerCase() : 'GoogleApps';
			const code = ["php", "css", "go", "java", "js", "json", "txt", "sh", "md", "html", "xml", "py", "rb", "c", "cpp", "h", "hpp"];
			const video = ["mp4", "webm", "avi", "mpg", "mpeg", "mkv", "rm", "rmvb", "mov", "wmv", "asf", "ts", "flv", "3gp", "m4v"];
			const audio = ["mp3", "flac", "wav", "ogg", "m4a", "aac", "wma", "alac"];
			if (mimeType === "application/vnd.google-apps.folder") {
				window.location.href = window.location.pathname + "/";
			} else if (fileExtension) {
				const name = obj.name;
				const bytes = obj.size || 0;
				const md5Checksum = obj.md5Checksum || '—';
				const size = formatFileSize(obj.size) || '—';
				const encoded_name = encodeURIComponent(name);
				const url = UI.random_domain_for_dl ? UI.downloaddomain + obj.link : window.location.origin + obj.link;
				const file_id = obj.fid;
				var poster = obj.thumbnailLink ? obj.thumbnailLink.replace("s220", "s0") : null;
				if (mimeType.includes("video") || video.includes(fileExtension)) {
					var poster = obj.thumbnailLink ? poster : UI.poster;
					file_video(name, encoded_name, size, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id);
				} else if (mimeType.includes("audio") || audio.includes(fileExtension)) {
					file_audio(name, encoded_name, size, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id);
				} else if (code.includes(fileExtension)) {
					file_code(name, encoded_name, size, bytes, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id);
				} else {
					file_others(name, encoded_name, size, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id);
				}
			}
		})
		.catch(function(error) {
			var content = `
			<div class="card">
				<div class="card-header ${UI.file_view_alert_class}">
					<i class="fas fa-file-alt fa-fw"></i>File Information
				</div>
				<div class="card-body text-center">
					<div class="${UI.file_view_alert_class}" id="file_details" role="alert"><b>404.</b> That’s an error. ` + error + `</div>
					<p>The requested URL was not found on this server. That’s all we know.</p>
					<a href="/" type="button" class="btn btn-success"><i class="fas fa-home fa-fw"></i>Home</a>
				</div>
			</div>`;
			$("#content").html(content);
		});
   }

const TamizhanWidget = `<div class="col-md-12">
<div class="card" style="padding: 0 0 0.3rem 0;border-radius:.5rem;width:100%;overflow:hidden;">
  <div style="display: flex; justify-content: center; align-items: center; height: 40px; overflow: hidden;">
    <marquee behavior="scroll" direction="left" scrollamount="6" style="color:white; font-weight:bold; font-size: 16px; text-shadow: 0 0 5px rgba(0,0,0,0.7); line-height: 40px; width: 100%;">
      ִֶָ 𓂃˖˳·˖ ִֶָ ⋆🌷͙⋆ ִֶָ˖·˳˖𓂃 ִֶָ&nbsp;&nbsp;&nbsp;வணக்கம்&nbsp;&nbsp;&nbsp;நண்பர்களே,&nbsp;&nbsp;&nbsp;⋆.˚🦋༘⋆&nbsp;&nbsp;&nbsp;தமிழன்&nbsp;&nbsp;&nbsp;திரைப்படங்களுக்கு&nbsp;&nbsp;&nbsp;˙✧˖°🍿 ༘ 🎬⋆｡°&nbsp;&nbsp;&nbsp;உங்களை&nbsp;&nbsp;&nbsp;அன்புடன்&nbsp;&nbsp;&nbsp;வரவேற்கிறோம்!&nbsp;&nbsp;&nbsp;⊱🪷⊰˚&nbsp;&nbsp;&nbsp;உங்கள்&nbsp;&nbsp;&nbsp;அன்பு&nbsp;&nbsp;&nbsp;மற்றும்&nbsp;&nbsp;&nbsp;ஆதரவுக்கு&nbsp;&nbsp;&nbsp;நன்றி.&nbsp;&nbsp;&nbsp;༄˖°.🍂.ೃ࿔*:･🙌
    </marquee>
  </div>
</div>
</div>`;

const copyButton = `<button onclick="copyFunction()" onmouseout="outFunc()" class="btn btn-primary"><span class="tooltiptext" id="myTooltip"><i class="fas fa-copy fa-fw"></i>Copy</span></button>`

function generateCopyFileBox(file_id, cookie_folder_id) {
	const copyFileBox = `<div class="row justify-content-center mt-3" id="copyresult">
  <div class="col-12 col-md-8" id="copystatus"><div class='alert alert-secondary' role='alert'> Send Request to Copy File </div></div>
  <div class="col-12 col-md-8"> <input id="user_folder_id" type="text" class="form-control" placeholder="Enter Your Folder ID to Copy this File" value="${cookie_folder_id}" required></div>
  <div class="col-12 col-md-8 mt-2"> <button id="copy_file" onclick="copyFile('${file_id}')" style="margin-top: 5px;" class="btn btn-danger btn-block">Copy File to Own Drive</button></div>
  </div>`;

	return copyFileBox;
}

// Document display |zip|.exe/others direct downloads
function file_others(name, encoded_name, size, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id) {
	const copyFileBox = UI.allow_file_copy ? generateCopyFileBox(file_id, cookie_folder_id) : '';

	// Add the container and card elements // wait until image is loaded and then hide spinner
	var content = `
	<div class="card">
		<div class="card-header ${UI.file_view_alert_class}">
			<i class="fas fa-file-alt fa-fw"></i>File Information
		</div>
		<div class="card-body row g-3">
			<div class="col-lg-4 col-md-12">${poster && !mimeType.startsWith('application/vnd.google-apps') ? `
				<div id="preview" class="h-100 border border-dark rounded d-flex justify-content-center align-items-center position-relative" style="--bs-border-opacity: .5; min-height: 200px;">
					<div id="preview_spinner" class="spinner-border m-5" role="status"><span class="sr-only"></span></div>
					<div id="overlay" class="overlay border border-dark rounded d-flex justify-content-center align-items-center flex-column gap-3 pt-4 pb-4" style="--bs-border-opacity: .5; opacity: 0;">
						<span><i class="fas fa-search-plus fa-2xl fa-fw"></i></span>
						<span>Preview</span>
						<a href="#" class="stretched-link" data-bs-toggle="modal" data-bs-target="#SearchModel" title="Thumbnail of ${name}"></a>
					</div>
				</div>` : `
				<div class="h-100 border border-dark rounded d-flex justify-content-center align-items-center flex-column gap-3 pt-4 pb-4" style="--bs-border-opacity: .5;">
					<span><img src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/zip-icon.png" alt="Zip Icon" style="max-width: 200px; height: auto; object-fit: contain;"></span>
					<span><a href="https://telegram.me/tamizhan_updates/51" target="_blank" style="text-decoration: none; color: #00d4ff;">👉🏻 How to Extract Zip file ✅</a></span>
				</div>`}
			</div>
			<div class="col-lg-8 col-md-12">
				<table class="table table-dark">
					<tbody>
						<tr>
							<th>
								<i class="fa-regular fa-folder-closed fa-fw"></i>
								<span class="tth">Name</span>
							</th>
							<td>${name}</td>
						</tr>
						<tr>
							<th>
								<i class="fa-regular fa-clock fa-fw"></i>
								<span class="tth">Datetime</span>
							</th>
							<td>${createdTime}</td>
						</tr>
						<tr>
							<th>
								<i class="fa-solid fa-tag fa-fw"></i>
								<span class="tth">Type</span>
							</th>
							<td>${formatMimeType(mimeType)}</td>
						</tr>
						<tr>
							<th>
								<i class="fa-solid fa-box-archive fa-fw"></i>
                <span class="tth">Size</span>
                </th>
                <td>${size}</td>
               </td>
						</tr>
					</tbody>
				</table>
       ${UI.disable_video_download ? `` : `
      <div class="col-md-12">
        <div class="text-center">
          <p class="mb-2">🚀&nbsp;𝔽𝕒𝕤𝕥&nbsp;&nbsp;𝔻𝕠𝕨𝕟𝕝𝕠𝕒𝕕&nbsp;&nbsp;𝔾𝔻𝔽𝕝𝕚𝕩&nbsp;&nbsp;𝕃𝕚𝕟𝕜&nbsp;&nbsp;<i class="fa-solid fa-cloud-arrow-down"></i></p>
          <div class="btn-group text-center"> 
            ${UI.display_drive_link ? ` 
           <button class="btn btn-secondary d-flex align-items-center gap-2 gdflix-btn" 
          data-file-id="${file_id}" type="button">${gdrive_icon}𝗚𝗗𝗙𝗹𝗶𝘅 𝗟𝗶𝗻𝗸</button>` : ``} 
          <a href="${url}" type="button" class="btn btn-success">
          <i class="fa-solid fa-circle-down"></i>𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 
           </a>
            <button type="button" class="btn btn-outline-success dropdown-toggle dropdown-toggle-split" 
                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="sr-only"></span>
            </button>
             <div class="dropdown-menu">
							<a class="dropdown-item" href="intent:${url}#Intent;component=idm.internet.download.manager/idm.internet.download.manager.Downloader;S.title=${encoded_name};end">1DM (Free)</a>
							<a class="dropdown-item" href="intent:${url}#Intent;component=idm.internet.download.manager.adm.lite/idm.internet.download.manager.Downloader;S.title=${encoded_name};end">1DM (Lite)</a>
							<a class="dropdown-item" href="intent:${url}#Intent;component=idm.internet.download.manager.plus/idm.internet.download.manager.Downloader;S.title=${encoded_name};end">1DM+ (Plus)</a>
						</div>
          </div>
        </div> 
      </div>`}
    </div>
  </div>`;
	$('#content').html(content);

	// Add GDFlix button click handler
  $(document).on('click', '.gdflix-btn', function() {
    const fileId = $(this).data('file-id');
    const button = $(this);
    
    console.log('Button clicked, fileId:', fileId); // Debug log
    
    if (!fileId) {
        alert('Error: No file ID found');
        return;
    }
    
    // Show loading state
    const originalHtml = button.html();
    button.prop('disabled', true).html('<i class="fas fa-spinner fa-spin fa-fw"></i> Processing...');
    
    // Call the GDFlix function with proper error handling
    generateGDFlixLink(fileId)
        .then(() => {
            // Reset button on success
            button.prop('disabled', false).html(originalHtml);
        })
        .catch((error) => {
            // Reset button on error
            button.prop('disabled', false).html(originalHtml);
            console.error('GDFlix error:', error);
        });
    });
	
	// Rest of the function remains the same...
	$('#SearchModelLabel').html('<i class="fa-regular fa-eye fa-fw"></i>Preview');
	var preview = `<img class="w-100 rounded" src="${poster}" alt="Preview of ${name}" title="Preview of ${name}">`;
	var btn = `<button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>`;
	$('#modal-body-space').html(preview);
	$('#modal-body-space-buttons').html(btn);
	if (poster && !mimeType.startsWith('application/vnd.google-apps')) {
		// Create a new image element
		var img = new Image();
		// Set up event handlers for image load and error
		$(img).on('load', function() {
			// Image loaded successfully
			$('#preview_spinner').hide(); // Hide the spinner
			$('#preview').css({'background': 'url("' + poster + '") 0 0 / 100% 100% no-repeat'});
			$('#preview').addClass('border-0');
			$('#overlay').css('opacity', '.9');
		}).on('error', function() {
			// Image failed to load
			$('#preview_spinner').hide(); // Hide the spinner
			// You might want to handle the error, for example, display a placeholder image or show an error message.
		});
		// Set the image source after setting up event handlers
		img.src = poster;
	}
}

// Also update the file_code function to include GDFlix button
// Replace the download section in file_code function with this:

function file_code(name, encoded_name, size, bytes, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id) {
	const copyFileBox = UI.allow_file_copy ? generateCopyFileBox(file_id, cookie_folder_id) : '';
	// Add the container and card elements
	var content = `
	<div class="card">
		<div class="card-header ${UI.file_view_alert_class}">
			<i class="fas fa-file-alt fa-fw"></i>File Information
		</div>
		<div class="card-body row g-3">
			<div class="col-lg-4 col-md-12">
				<div id="preview" class="h-100 border border-dark rounded d-flex justify-content-center align-items-center position-relative" style="--bs-border-opacity: .5;">
					<div id="code_spinner"></div>
					<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/monokai.min.css">
					<pre id="pre" class="rounded mb-0" style="height: 251px;"><code id="editor" class="h-100" style="white-space: pre-wrap; word-wrap: break-word;"></code></pre>
					${bytes >= 1024 * 1024 * 2 && poster ? `
					<div id="overlay" class="overlay border border-dark rounded d-flex justify-content-center align-items-center flex-column gap-3 pt-4 pb-4" style="--bs-border-opacity: .5; opacity: 0;">
						<span><i class="fas fa-search-plus fa-2xl fa-fw"></i></span>
						<span>Preview</span>
						<a href="#" class="stretched-link" data-bs-toggle="modal" data-bs-target="#SearchModel" title="Thumbnail of ${name}"></a>
					</div>` : ``}
				</div>
			</div>
			<div class="col-lg-8 col-md-12" id="file-info">
				<table class="table table-dark">
					<tbody>
						<tr>
							<th>
								<i class="fa-regular fa-folder-closed fa-fw"></i>
								<span class="tth">Name</span>
							</th>
							<td>${name}</td>
						</tr>
						<tr>
							<th>
								<i class="fa-regular fa-clock fa-fw"></i>
								<span class="tth">Datetime</span>
							</th>
							<td>${createdTime}</td>
						</tr>
						<tr>
							<th>
								<i class="fa-solid fa-tag fa-fw"></i>
								<span class="tth">Type</span>
							</th>
							<td>${formatMimeType(mimeType)}</td>
						</tr>
						<tr>
							<th>
								<i class="fa-solid fa-box-archive fa-fw"></i>
                 <span class="tth">Size</span>
                    </th>
                    <td>${size}</td>
                  </td>
						   </tr>
					 </tbody>
				 </table>
       ${UI.disable_video_download ? `` : `
      <div class="col-md-12">
        <div class="text-center">
          <p class="mb-2">🚀&nbsp;𝔽𝕒𝕤𝕥&nbsp;&nbsp;𝔻𝕠𝕨𝕟𝕝𝕠𝕒𝕕&nbsp;&nbsp;𝔾𝔻𝔽𝕝𝕚𝕩&nbsp;&nbsp;𝕃𝕚𝕟𝕜&nbsp;&nbsp;<i class="fa-solid fa-cloud-arrow-down"></i></p>
          <div class="btn-group text-center"> 
            ${UI.display_drive_link ? ` 
           <button class="btn btn-secondary d-flex align-items-center gap-2 gdflix-btn" 
          data-file-id="${file_id}" type="button">${gdrive_icon}𝗚𝗗𝗙𝗹𝗶𝘅 𝗟𝗶𝗻𝗸</button>` : ``} 
          <a href="${url}" type="button" class="btn btn-success">
          <i class="fa-solid fa-circle-down"></i>𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 
           </a>
            <button type="button" class="btn btn-outline-success dropdown-toggle dropdown-toggle-split" 
                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="sr-only"></span>
            </button>
            <div class="dropdown-menu">
							<a class="dropdown-item" href="intent:${url}#Intent;component=idm.internet.download.manager/idm.internet.download.manager.Downloader;S.title=${encoded_name};end">1DM (Free)</a>
							<a class="dropdown-item" href="intent:${url}#Intent;component=idm.internet.download.manager.adm.lite/idm.internet.download.manager.Downloader;S.title=${encoded_name};end">1DM (Lite)</a>
							<a class="dropdown-item" href="intent:${url}#Intent;component=idm.internet.download.manager.plus/idm.internet.download.manager.Downloader;S.title=${encoded_name};end">1DM+ (Plus)</a>
					 </div>
          </div>
        </div> 
      </div>`}
    </div>
  </div>`;
	$("#content").html(content);

	// Add GDFlix button click handler
  $(document).on('click', '.gdflix-btn', function() {
    const fileId = $(this).data('file-id');
    const button = $(this);
    
    console.log('Button clicked, fileId:', fileId); // Debug log
    
    if (!fileId) {
        alert('Error: No file ID found');
        return;
    }
    
    // Show loading state
    const originalHtml = button.html();
    button.prop('disabled', true).html('<i class="fas fa-spinner fa-spin fa-fw"></i> Processing...');
    
    // Call the GDFlix function with proper error handling
    generateGDFlixLink(fileId)
        .then(() => {
            // Reset button on success
            button.prop('disabled', false).html(originalHtml);
        })
        .catch((error) => {
            // Reset button on error
            button.prop('disabled', false).html(originalHtml);
            console.error('GDFlix error:', error);
        });
    });
	
	// Rest of the function remains the same...
	$('#SearchModelLabel').html('<i class="fa-regular fa-eye fa-fw"></i>Preview');
	var preview = `<img class="w-100 rounded" src="${poster}" alt="Preview of ${name}" title="Preview of ${name}">`;
	var btn = `<button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>`;
	$('#modal-body-space').html(preview);
	$('#modal-body-space-buttons').html(btn);
	var no_thumb = `<div class="d-flex align-items-center flex-column gap-3 pt-4 pb-4" style="--bs-border-opacity: .5;"><span><i class="fa-solid fa-photo-film fa-2xl fa-fw"></i></span><span>Thumbnail not available</span></div>`;
	var spinner = '<div class="d-flex justify-content-center"><div class="spinner-border m-5" role="status"><span class="sr-only"></span></div></div>';
	$("#code_spinner").html(spinner);
	if (bytes <= 1024 * 1024 * 2) {
		$.get(url, function(data) {
			$('#editor').html($('<div/>').text(data).html());
			$("#code_spinner").html("");
			$('#pre').addClass("flex-fill");
			var height = document.querySelector("#file-info").offsetHeight;
			$('#pre').css('height', height-2 + 'px');
			hljs.highlightAll();
		});
	} else {
		$('#pre').hide();
		$('#editor').html(`File size is too large to preview, max. 2 MB`);
		if (poster) {
			// Create a new image element
			var img = new Image();
			// Set up event handlers for image load and error
			$(img).on('load', function() {
				// Image loaded successfully
				$('#code_spinner').hide(); // Hide the spinner
				$('#preview').css({'background': 'url("' + poster + '") 0 0 / 100% 100% no-repeat', 'min-height': '200px'});
				$('#preview').addClass('border-0');
				$('#overlay').css('opacity', '.9');
			}).on('error', function() {
				// Image failed to load
				$('#code_spinner').hide(); // Hide the spinner
				// You might want to handle the error, for example, display a placeholder image or show an error message.
			});
			// Set the image source after setting up event handlers
			img.src = poster;
		} else {
			$('#code_spinner').html(no_thumb);
		}
	}
}


  // Document display video  mkv|mp4|webm|avi| 
   function file_video(name, encoded_name, size, poster, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id) {
	 // Define all player icons
    const vlc_icon = `<img src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/vlc.png" alt="VLC Player" style="height: 32px; width: 32px; margin-right: 5px;">`;
    const mxplayer_icon = `<img src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/Mxplayer-icon.png" alt="MX Player" style="height: 32px; width: 32px; margin-right: 5px;">`;
    const xplayer_icon = `<img src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/xplayer-icon.png" alt="XPlayer" style="height: 32px; width: 32px; margin-right: 5px;">`;
    const playit_icon = `<img src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/playit-icon.png" alt="Playit" style="height: 32px; width: 32px; margin-right: 5px;">`; 
    const new_download_icon = `<img src="https://cdn.jsdelivr.net/gh/Tamizhan-Movies-TM/GD-WEB@master/images/download-icon.png" alt="Download" style="height: 32px; width: 32px; margin-right: 5px;">`;
		 var url_base64 = btoa(url);
	  const copyFileBox = UI.allow_file_copy ? generateCopyFileBox(file_id, cookie_folder_id) : '';
	  let player
	  if (!UI.disable_player) {
		 if (player_config.player == "plyr") {
			player = `<video id="player" playsinline controls data-poster="${poster}">
      <source src="${url}" type="video/mp4" />
      <source src="${url}" type="video/webm" />
        </video>`
			player_js = 'https://cdn.plyr.io/' + player_config.plyr_io_version + '/plyr.polyfilled.js'
			player_css = 'https://cdn.plyr.io/' + player_config.plyr_io_version + '/plyr.css'
		} else if (player_config.player == "videojs") {
			player = `<video id="vplayer" poster="${poster}" class="video-js vjs-default-skin rounded" controls preload="none" width="100%" height="100%" data-setup='{"fill": true}' style="--plyr-captions-text-color: #ffffff;--plyr-captions-background: #000000; min-height: 200px;">
      <source src="${url}" type="video/mp4" />
      <source src="${url}" type="video/webm" />
      <source src="${url}" type="video/avi" />
    </video>`
			player_js = 'https://vjs.zencdn.net/' + player_config.videojs_version + '/video.js'
			player_css = 'https://vjs.zencdn.net/' + player_config.videojs_version + '/video-js.css'
		} else if (player_config.player == "dplayer") {
			player = `<div id="player-container"></div>`
			player_js = 'https://cdn.jsdelivr.net/npm/dplayer/dist/DPlayer.min.js'
			player_css = 'https://cdn.jsdelivr.net/npm/dplayer/dist/DPlayer.min.css'
		} else if (player_config.player == "jwplayer") {
			player = `<div id="player"></div>`
			player_js = 'https://content.jwplatform.com/libraries/IDzF9Zmk.js'
			player_css = ''
		}
	}

 // Add the container and card elements
  var content = `
  <div class="card">
    <div class="card-header ${UI.file_view_alert_class}">
      <i class="fas fa-file-alt fa-fw"></i>File Information
    </div>
    <div class="card-body row g-3">
      <div class="col-lg-4 col-md-12">
        <div class="h-100 border border-dark rounded" style="--bs-border-opacity: .5;">
          ${player}
        </div>
      </div>
      <div class="col-lg-8 col-md-12">
        <table class="table table-dark">
          <tbody>
            <tr>
              <th>
                <i class="fa-regular fa-folder-closed fa-fw"></i>
                <span class="tth">Name</span>
              </th>
              <td>${name}</td>
            </tr>
            <tr>
              <th>
                <i class="fa-regular fa-clock fa-fw"></i>
                <span class="tth">Datetime</span>
              </th>
              <td>${createdTime}</td>
            </tr>
            <tr>
              <th>
                <i class="fa-solid fa-tag fa-fw"></i>
                <span class="tth">Type</span>
              </th>
              <td>${formatMimeType(mimeType)}</td>
            </tr>
            <tr>
              <th>
                <i class="fa-solid fa-box-archive fa-fw"></i>
                  <span class="tth">Size</span>
                    </th>
                    <td>${size}</td>
                    </td>
						     </tr>
					     </tbody>
				    </table>
        ${UI.disable_video_download ? `` : `
      <div class="col-md-12">
        <div class="text-center">
          <p class="mb-2">🚀&nbsp;𝔽𝕒𝕤𝕥&nbsp;&nbsp;𝔻𝕠𝕨𝕟𝕝𝕠𝕒𝕕&nbsp;&nbsp;𝔾𝔻𝔽𝕝𝕚𝕩&nbsp;&nbsp;𝕃𝕚𝕟𝕜&nbsp;&nbsp;<i class="fa-solid fa-cloud-arrow-down"></i></p>
          <div class="btn-group text-center"> 
            ${UI.display_drive_link ? ` 
           <button class="btn btn-secondary d-flex align-items-center gap-2 gdflix-btn" 
          data-file-id="${file_id}" type="button">${gdrive_icon}𝗚𝗗𝗙𝗹𝗶𝘅 𝗟𝗶𝗻𝗸</button>` : ``} 
          <a href="${url}" type="button" class="btn btn-success">
          <i class="fa-solid fa-circle-down"></i>𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 
           </a>
            <button type="button" class="btn btn-outline-success dropdown-toggle dropdown-toggle-split" 
                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="sr-only"></span>
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="intent:${url}#Intent;package=com.playit.videoplayer;category=android.intent.category.DEFAULT;type=video/*;S.title=${encoded_name};end">${playit_icon} Playit</a>
              <a class="dropdown-item" href="intent:${url}#Intent;package=video.player.videoplayer;category=android.intent.category.DEFAULT;type=video/*;S.title=${encoded_name};end">${xplayer_icon} XPlayer</a>
              <a class="dropdown-item" href="intent:${url}#Intent;package=com.mxtech.videoplayer.ad;category=android.intent.category.DEFAULT;type=video/*;S.title=${encoded_name};end">${mxplayer_icon} MX Player</a>
              <a class="dropdown-item" href="intent:${url}#Intent;package=org.videolan.vlc;category=android.intent.category.DEFAULT;type=video/*;S.title=${encoded_name};end">${vlc_icon} VLC Player</a> 
             </div>
           </div> 
         </div>`}
       </div>
      </div>`; 
    $("#content").html(content);

// Add GDFlix button click handler
  $(document).on('click', '.gdflix-btn', function() {
    const fileId = $(this).data('file-id');
    const button = $(this);
    
    console.log('Button clicked, fileId:', fileId); // Debug log
    
    if (!fileId) {
        alert('Error: No file ID found');
        return;
    }
    
    // Show loading state
    const originalHtml = button.html();
    button.prop('disabled', true).html('<i class="fas fa-spinner fa-spin fa-fw"></i> Processing...');
    
    // Call the GDFlix function with proper error handling
    generateGDFlixLink(fileId)
        .then(() => {
            // Reset button on success
            button.prop('disabled', false).html(originalHtml);
        })
        .catch((error) => {
            // Reset button on error
            button.prop('disabled', false).html(originalHtml);
            console.error('GDFlix error:', error);
        });
    });

  // Load Video.js and initialize the player
	var videoJsScript = document.createElement('script');
	videoJsScript.src = player_js;
	videoJsScript.onload = function() {
		// Video.js is loaded, initialize the player
		if (player_config.player == "plyr") {
			const player = new Plyr('#player');
		} else if (player_config.player == "videojs") {
			const player = new videojs('vplayer');
		} else if (player_config.player == "dplayer") {
			const dp = new DPlayer({
				container: document.getElementById('player-container'),
				screenshot: true,
				video: {
					url: url,
					pic: poster,
					thumbnails: poster,
				},
			});
		} else if (player_config.player == "jwplayer") {
			jwplayer("player").setup({
				file: url,
				type: mimeType,
				autostart: false,
				image: poster,
				width: "100%",
				aspectratio: "16:9",
				title: name,
				description: "Powered by Google Drive Index",
				tracks: [{
					file: url,
					kind: "captions",
					label: "Default",
					"default": true,
				}],
				captions: {
					color: "#f3f378",
					fontSize: 14,
					backgroundOpacity: 50,
					edgeStyle: "raised",
				},
			});
		}
	};
	document.head.appendChild(videoJsScript);

	var videoJsStylesheet = document.createElement('link');
	videoJsStylesheet.href = player_css;
	videoJsStylesheet.rel = 'stylesheet';
	document.head.appendChild(videoJsStylesheet);
}

// File display Audio |mp3|flac|m4a|wav|ogg|
function file_audio(name, encoded_name, size, url, mimeType, md5Checksum, createdTime, file_id, cookie_folder_id) {
	var url_base64 = btoa(url);
	const copyFileBox = UI.allow_file_copy ? generateCopyFileBox(file_id, cookie_folder_id) : '';

	// Add the container and card elements
	var player = `<video id="aplayer" poster="${UI.audioposter}" class="video-js vjs-default-skin rounded" controls preload="none" width="100%" height="100%" data-setup='{"fill": true}' style="--plyr-captions-text-color: #ffffff;--plyr-captions-background: #000000; object-fit: cover; min-height: 200px;">
					<source src="${url}" type="audio/mpeg" />
					<source src="${url}" type="audio/ogg" />
					<source src="${url}" type="audio/wav" />
				</video>`;

	const content = `
    <div class="card">
        <div class="card-header ${UI.file_view_alert_class}">
            ${copyFileBox}
            <i class="fas fa-file-alt fa-fw"></i>File Information
        </div>
        <div class="card-body row g-3">
            ${!UI.disable_player ? `
            <div class="col-lg-4 col-md-12">
                <div class="h-100 border border-dark rounded" style="--bs-border-opacity: .5;">
                    ${player}
                </div>
            </div>
            ` : ''}
            <div class="${UI.disable_player ? 'col-12' : 'col-lg-8 col-md-12'}">
                <table class="table table-dark">
                    <tbody>
                        <tr>
                            <th><i class="fa-regular fa-folder-closed fa-fw"></i><span class="tth">Name</span></th>
                            <td>${name}</td>
                        </tr>
                        <tr>
                            <th><i class="fa-regular fa-clock fa-fw"></i><span class="tth">Datetime</span></th>
                            <td>${createdTime}</td>
                        </tr>
                        <tr>
                            <th><i class="fa-solid fa-tag fa-fw"></i><span class="tth">Type</span></th>
                            <td>${formatMimeType(mimeType)}</td>
                        </tr>
                        <tr>
                            <th><i class="fa-solid fa-box-archive fa-fw"></i><span class="tth">Size</span></th>
                            <td>${size}</td>
                        </tr>
                        <tr>
                            <th><i class="fa-solid fa-file-circle-check fa-fw"></i><span class="tth">Checksum</span></th>
                            <td>MD5: <code>${md5Checksum}</code></td>
                        </tr>
                    </tbody>
                </table>
                
                ${UI.disable_video_download ? '' : `
                <div class="col-md-12">
                    <div class="text-center">
                        <p class="mb-2">Download via</p>
                        <div class="btn-group text-center">
                            <a href="${url}" type="button" class="btn btn-success">
                                <i class="fa-solid fa-circle-down"></i>𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱
                            </a>
                            <button type="button" class="btn btn-success dropdown-toggle dropdown-toggle-split" 
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="sr-only"></span>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="intent:${encoded_url}#Intent;package=com.playit.videoplayer;category=android.intent.category.DEFAULT;type=video/*;S.title=${encoded_name_safe};end">Playit</a>
                                <a class="dropdown-item" href="intent:${encoded_url}#Intent;package=video.player.videoplayer;category=android.intent.category.DEFAULT;type=video/*;S.title=${encoded_name_safe};end">XPlayer</a>
                                <a class="dropdown-item" href="intent:${encoded_url}#Intent;package=com.mxtech.videoplayer.ad;category=android.intent.category.DEFAULT;type=video/*;S.title=${encoded_name_safe};end">MX Player</a>
                                <a class="dropdown-item" href="intent:${encoded_url}#Intent;package=org.videolan.vlc;category=android.intent.category.DEFAULT;type=video/*;S.title=${encoded_name_safe};end">VLC Player</a>
                            </div>
                        </div>
                    </div>
                </div>
                `}
            </div>
        </div>
    </div>`;
    $("#content").html(content);

    // Initialize player if enabled
    if (!UI.disable_player && player_js) {
        const script = document.createElement('script');
        script.src = player_js;
        script.onload = () => {
        switch(player_config.player) {
        case "plyr":
        new Plyr('#player');
        break;
        case "videojs":
        videojs('vplayer', {fill: true});
        break;
        case "dplayer":
        new DPlayer({
        container: document.getElementById('player-container'),
        screenshot: true,
        video: {
        url: url,
        pic: poster,
        thumbnails: poster
                        }
                    });
                    break;
                    case "jwplayer":
                    jwplayer("player").setup({
                        file: url,
                        type: mimeTypeFixed,
                        autostart: false,
                        image: poster,
                        width: "100%",
                        aspectratio: "16:9",
                        title: name
                    });
                    break;
            }
        };
        document.head.appendChild(script);

        if (player_css) {
            const css = document.createElement('link');
            css.href = player_css;
            css.rel = 'stylesheet';
            document.head.appendChild(css);
        }
    }
}

// Time conversion
function utc2jakarta(utc_datetime) {
	// Convert UTC datetime to local Jakarta time
	var utcDate = new Date(utc_datetime);
	var jakartaOptions = { timeZone: 'Asia/Jakarta' };
	var jakartaDate = new Date(utcDate.toLocaleString('en-US', jakartaOptions));

	// Format the Jakarta date and time
	var year = jakartaDate.getFullYear();
	var month = ('0' + (jakartaDate.getMonth() + 1)).slice(-2);
	var date = ('0' + jakartaDate.getDate()).slice(-2);
	var hour = ('0' + jakartaDate.getHours()).slice(-2);
	var minute = ('0' + jakartaDate.getMinutes()).slice(-2);
	var second = ('0' + jakartaDate.getSeconds()).slice(-2);

	return `${date}-${month}-${year} ${hour}:${minute}`;
}

// MIME type formatting
function formatMimeType(mime) {
  if (!mime) return '';

  // Video type mapping
  const videoFormats = {
    'mp4': 'MP4',
    'x-matroska': 'MKV', 
    'quicktime': 'MOV',
    'avi': 'AVI',
    'mpeg': 'MPEG',
    'webm': 'WEBM',
    'ogg': 'OGG',
    'x-ms-wmv': 'WMV',
    'flv': 'FLV'
  };

  // Check if video type
  if (mime.startsWith('video/')) {
    const subtype = mime.split('/')[1];
    const format = videoFormats[subtype] || subtype.toUpperCase();
    return `${format} - ${mime}`;
  }

  return mime;
}

// bytes adaptive conversion to KB, MB, GB
function formatFileSize(bytes) {
	if (bytes >= 1099511627776) {
		bytes = (bytes / 1099511627776).toFixed(2) + ' TB';
	} else if (bytes >= 1073741824) {
		bytes = (bytes / 1073741824).toFixed(2) + ' GB';
	} else if (bytes >= 1048576) {
		bytes = (bytes / 1048576).toFixed(2) + ' MB';
	} else if (bytes >= 1024) {
		bytes = (bytes / 1024).toFixed(2) + ' KB';
	} else if (bytes > 1) {
		bytes = bytes + ' bytes';
	} else if (bytes === 1) {
		bytes = bytes + ' byte';
	} else {
		bytes = '';
	}
	return bytes;
}


String.prototype.trim = function(char) {
	if (char) {
		return this.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
	}
	return this.replace(/^\s+|\s+$/g, '');
};


// README.md HEAD.md support
function markdown(el, data) {
	var html = marked.parse(data);
	$(el).show().html(html);
}

// Listen for fallback events
window.onpopstate = function() {
	var path = window.location.pathname;
	render(path);
}

$(function() {
	init();
	var path = window.location.pathname;
	/*$("body").on("click", '.folder', function () {
	    var url = $(this).attr('href');
	    history.pushState(null, null, url);
	    render(url);
	    return false;
	});
	$("body").on("click", '.view', function () {
	    var url = $(this).attr('href');
	    history.pushState(null, null, url);
	    render(url);
	    return false;
	});*/

	render(path);
});

// Copy to Clipboard for Direct Links, This will be modified soon with other UI
function copyFunction() {
	var copyText = document.getElementById("dlurl");
	copyText.select();
	copyText.setSelectionRange(0, 99999);

	navigator.clipboard.writeText(copyText.value)
		.then(function() {
			var tooltip = document.getElementById("myTooltip");
			tooltip.innerHTML = `<i class="fas fa-check fa-fw"></i>Copied`;
		})
		.catch(function(error) {
			console.error("Failed to copy text: ", error);
		});
}

function outFunc() {
	var tooltip = document.getElementById("myTooltip");
	tooltip.innerHTML = `<i class="fas fa-copy fa-fw"></i>Copy`;
}

// function to update the list of checkboxes
function updateCheckboxes() {
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');
	const selectAllCheckbox = document.getElementById('select-all-checkboxes');

	if (checkboxes.length > 0 && selectAllCheckbox) { // Check if checkboxes and selectAllCheckbox exist
		selectAllCheckbox.addEventListener('click', () => {
			checkboxes.forEach((checkbox) => {
				checkbox.checked = selectAllCheckbox.checked;
			});
		});
	}
}

async function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

// Copy File to User Drive
async function copyFile(driveid) {
	try {
		const copystatus = document.getElementById('copystatus');
		copystatus.innerHTML = `<div class='alert alert-danger' role='alert'> Processing... </div>`;

		const user_folder_id = document.getElementById('user_folder_id').value;
		if (user_folder_id === '') {
			copystatus.innerHTML = `<div class='alert alert-danger' role='alert'> Empty ID </div>`;
			return null;
		}

		document.getElementById('spinner').style.display = 'block';
		document.cookie = `root_id=${user_folder_id}; expires=Thu, 18 Dec 2050 12:00:00 UTC`;
		const time = Math.floor(Date.now() / 1000);
		const response = await fetch('/copy', {
			method: 'POST',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `id=${encodeURIComponent(driveid)}&root_id=${user_folder_id}&resourcekey=null&time=${time}`
		});

		if (response.status === 500) {
			copystatus.innerHTML = `<div class='alert alert-danger' role='alert'> Unable to Copy File, Make Sure you've added system@zindex.eu.org to your Destination Folder </div>`;
		} else if (response.status === 401) {
			copystatus.innerHTML = `<div class='alert alert-danger' role='alert'> Unauthorized </div>`;
		} else if (response.ok) {
			const data = await response.json();
			if (data && data.name) {
				const link = `https://drive.google.com/file/d/${data.id}/view?usp=share_link`;
				const copyresult = document.getElementById('copyresult');
				copyresult.innerHTML = `<div class="col-12 col-md-12"> <input type="text" id="usercopiedfile" class="form-control" placeholder="Enter Your Folder ID to Copy this File" value="${link}" readonly></div> <div class="col-12 col-md-12"> <a href="${link}" target="_blank" style="margin-top: 5px;" class="btn btn-danger btn-block">Open Copied File</a></div>`;
			} else if (data && data.error && data.error.message) {
				copystatus.innerHTML = `<div class='alert alert-danger' role='alert'> ` + data.error.message + ` </div>`;
			} else {
				copystatus.innerHTML = `<div class='alert alert-danger' role='alert'> Unable to Copy File </div>`;
			}
		} else {
			copystatus.innerHTML = `<div class='alert alert-danger' role='alert'> Unable to Copy File </div>`;
		}

		document.getElementById('spinner').style.display = 'none';
	} catch (error) {
		const copystatus = document.getElementById('copystatus');
		copystatus.innerHTML = `<div class='alert alert-danger' role='alert'> An error occurred ` + error + `</div>`;
		document.getElementById('spinner').style.display = 'none';
	}
}

// Update the generateGDFlixLink function to call the worker endpoint
function generateGDFlixLink(fileId) {
    return new Promise((resolve, reject) => {
        // Debug logging
        console.log('GDFlix - Received fileId:', fileId);
        
        // Basic validation
        if (!fileId) {
            console.error('GDFlix - No file ID provided');
            reject(new Error('No file ID provided'));
            return;
        }
        
        // Convert to string if it's not already
        fileId = String(fileId).trim();
        
        if (fileId === '') {
            console.error('GDFlix - Empty file ID');
            reject(new Error('Empty file ID'));
            return;
        }
        
        console.log('GDFlix - Requesting link generation from worker...');
        
        // Make request to worker endpoint
        fetch('/generate-gdflix', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                file_id: fileId
            })
        })
        .then(response => {
            console.log('GDFlix - Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('GDFlix - Worker response:', data);
            
            if (data.success && data.gdflix_link) {
                console.log('GDFlix - Generated link:', data.gdflix_link);
                // Open the GDFlix link directly in a new tab
                window.open(data.gdflix_link, '_blank');
                resolve(data.gdflix_link);
            } else {
                reject(new Error(data.error || 'Failed to generate GDFlix link'));
            }
        })
        .catch(error => {
            console.error('GDFlix Error:', error);
            alert('Failed to generate GDFlix link: ' + error.message);
            reject(error);
        });
    });
}


// create a MutationObserver to listen for changes to the DOM
const observer = new MutationObserver(() => {
	updateCheckboxes();
});

// define the options for the observer (listen for changes to child elements)
const options = {
	childList: true,
	subtree: true
};

// observe changes to the body element
observer.observe(document.documentElement, options);
